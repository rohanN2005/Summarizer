from flask import Flask, render_template, request, jsonify, session, redirect, url_for, abort, send_from_directory
import os, re
from summarize import summarize, getTitle
from flask_cors import CORS
from os import environ as env
from authlib.integrations.flask_client import OAuth
from urllib.parse import urlencode, quote_plus
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
from datetime import datetime
from bson import ObjectId
from werkzeug.utils import secure_filename

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

uri = env.get("CONNECTION_STRING")
client = MongoClient(uri)
database = client.get_default_database()
summaries_coll = database.user_summaries
def serialize(summaries):
    return [{**s, "_id": str(s["_id"])} for s in summaries]



BASE = os.path.dirname(os.path.dirname(__file__))  # project-root
DIST_DIR = os.path.join(BASE, "youtube_summarizer", "dist")

app = Flask(
    __name__,
    static_folder=DIST_DIR,
    static_url_path="",
    template_folder='youtube_summarizer/dist'
)
CORS(app,origins=['http://localhost:5173'])

app.secret_key = env.get("APP_SECRET_KEY")

oauth = OAuth(app)
oauth.register(
     "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)
@app.route("/login")
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )

@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect(url_for('serve_react', path=''))

@app.route("/logout")
def logout():
    session.clear()
    params = {
        'returnTo': url_for('serve_react', path='', _external=True),
        'client_id': os.environ['AUTH0_CLIENT_ID']
    }
    return redirect(f'https://{os.environ["AUTH0_DOMAIN"]}/v2/logout?{urlencode(params, quote_via=quote_plus)}')




@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if not session.get("user"):
        return redirect(url_for("login"))

    # full filesystem path for the requested file
    full_path = os.path.join(DIST_DIR, path)

    # if they requested a real file (e.g. /assets/main.abc123.js or /vite.svg)
    full = os.path.join(DIST_DIR, path)
    if path and os.path.isfile(full):
        return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, "index.html")


@app.route('/api/summary', methods=['POST'])
def summary_endpoint():
    if not session.get('user'):
        abort(401)
    data = request.get_json()
    link = data.get('link', '')
    title = getTitle(link)
    video_id = re.split(r'=', link)[-1]
    summary_text = summarize(video_id)
    user_info = session["user"]["userinfo"]
    user_id = user_info["sub"]
    summaries_coll.update_one(
        {"user_id": user_id},
        {
            "$push": {
                "summaries": {
                    "$each": [{
                        "_id": ObjectId(),  
                        "Title": title,
                        "summary": summary_text,
                        "created_at": datetime.utcnow()
                    }],
                    # keep only the last 10 entries
                    "$slice": -10
                }
            }
        },
        upsert=True
    )
    data = summaries_coll.find_one({"user_id": user_id}) or {}
    recent = data.get("summaries", [])
    return jsonify(
        videoSummary=summary_text,
        title=title,
        history = serialize(recent)
    )
@app.route('/api/summary/<summary_id>', methods=['DELETE'])
def delete_summary(summary_id):
    if not session.get("user"):
        abort(401)
    user_id = session["user"]["userinfo"]["sub"]

    result = summaries_coll.update_one(
        {"user_id": user_id},
        {"$pull": {"summaries": {"_id": ObjectId(summary_id)}}}
    )

    user_doc = summaries_coll.find_one({"user_id": user_id}) or {}
    recent = user_doc.get("summaries", [])
    return jsonify(history=serialize(recent))

@app.route('/api/summary/history', methods=['GET'])
def get_history():
    if not session.get("user"):
        abort(401)
    user_id = session["user"]["userinfo"]["sub"]
    user_doc = summaries_coll.find_one({"user_id": user_id}) or {}
    recent = user_doc.get("summaries", [])
    return jsonify(history=serialize(recent))

#@app.route('/api/summary/upload', methods = ['POST'])
#def upload_summary():
    #if not session.get("user"):
        #abort(401)
    #uploaded_file = request.files.get('file')
    #if not uploaded_file:
        #return jsonify({"error": "no file part"}), 400
    #original_fileName = uploaded_file.filename
    #safe_filename = secure_filename(original_fileName)
    #ext = os.path.splitext(secure_filename)[1].lower()
    #if ext in ".mp4":
        #return ;






if __name__ == "__main__":
    app.run(debug=True, port=8000)