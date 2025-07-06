import json
import Summarizer
import re 
from os import environ as env
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for, request, jsonify
from flask_cors import CORS
from Summarizer import summarize, getTitle
from waitress import serve
from pymongo import MongoClient
from datetime import datetime

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

uri = env.get("CONNECTION_STRING")
client = MongoClient(uri)
database = client.get_default_database()
summaries_coll = database.user_summaries


app = Flask(__name__,template_folder='.')
cors = CORS(app,origins='*')
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
    return redirect("/")

@app.route("/logout")
def logout():
    session.clear()

    return redirect(
        "https://" + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("home", _external=True),
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )

@app.route('/')
def home():
    if session.get('user'):
        return redirect(url_for('/'))
    return redirect(url_for('login'))
#Route to summary.html/Takes link that was sent from index.html to summary route, and extracts the videoID
#The videoID is used as input for the summarize function from summarizer.py, and then render summary.html, and allows summary.html to have access to the summary
@app.route('/api/summary', methods=['POST'])
def summary():
    if not session.get('user'):
        return redirect(url_for('login'))
    data = request.get_json()
    link = data["link"]
    title = getTitle(link)
    linkArray = re.split(r'=', link)
    videoID = linkArray[len(linkArray)-1]
    summary = summarize(videoID)
    user_info = session["user"]["userinfo"]
    user_id = user_info["sub"]
    summaries_coll.update_one(
        {"user_id":user_id},
        {
            "$push":{
                "summaries": { 
                    "$each":[{
                        "Title": title,
                        "summary": summary,
                        "created_at": datetime.utcnow()
                    }],
                    "$slice": -10
                }
            }
        },
        upsert = True
    )
    data = summaries_coll.find_one({"user_id":user_id}) or {}
    recent = data.get("summaries",[])
    return jsonify(
        videoSummary = summary,
        history = recent,
        title = title
    )

if __name__ == "__main__":
    app.run(debug=True, port=8000)

