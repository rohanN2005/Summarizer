from flask import Flask, render_template, request, jsonify, session, redirect, url_for, abort, send_from_directory
import os, re
from summarize import summarize, getTitle
from flask_cors import CORS
from os import environ as env
from authlib.integrations.flask_client import OAuth
from urllib.parse import urlencode, quote_plus

BASE = os.path.dirname(os.path.dirname(__file__))  # project-root
DIST_DIR = os.path.join(BASE, "youtube_summarizer", "dist")

app = Flask(
    __name__,
    static_folder=DIST_DIR,
    static_url_path="",
    template_folder='youtube_summarizer/dist'
)
CORS(app)

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
    # full filesystem path for the requested file
    full_path = os.path.join(DIST_DIR, path)

    # if they requested a real file (e.g. /assets/main.abc123.js or /vite.svg)
    if path and os.path.exists(full_path):
        return send_from_directory(DIST_DIR, path)

    # otherwise (including “/”) always return index.html
    return send_from_directory(DIST_DIR, "index.html")


@app.route('/api/summary', methods=['POST'])
def summary_endpoint():
    #if not session.get('user'):
        #abort(401)
    data = request.get_json()
    link = data.get('link', '')
    title = getTitle(link)
    video_id = re.split(r'=', link)[-1]
    summary_text = summarize(video_id)
    return jsonify(
        videoSummary=summary_text,
        title=title
    )

if __name__ == "__main__":
    app.run(debug=True, port=8000)