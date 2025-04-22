from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import re
import os

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)

"""
Maps the repolink URL to the GitHub URL.
DB: Creates a new entry in the links table.
Format: /create_link?rl=<repolink>&gh=<github>
Example: /create_link?rl=abc&gh="https://github.com/javud/spottersense/"
"""
@app.route("/create_link")
def create_link():
    # URL validation
    # check missing URL parameters
    rl_url = request.args.get('rl_url')
    gh_url = request.args.get('gh_url')
    if rl_url == None or gh_url == None:
        return "Missing URL parameters"
    
    # check empty URLs
    rl_url = rl_url.lower().strip()
    gh_url = gh_url.lower().strip()
    if len(rl_url) == 0:
        return "Invalid repolink URL"
    
    # check invalid GitHub URL
    if gh_url.startswith("github.com/"):
        gh_url = "https://" + gh_url
    GITHUB_URL_PATTERN = r"^https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/?$"
    if len(gh_url) == 0 or not re.match(GITHUB_URL_PATTERN, gh_url):
        return "Invalid GitHub URL format"
    
    # check invalid repolink URL
    REPOLINK_URL_PATTERN = r"^[a-zA-Z0-9_-]+$"
    if not re.match(REPOLINK_URL_PATTERN, rl_url):
        return "repolink must be alphanumeric with optional dashes or underscores"

    # check duplicate repolink URL
    existing = supabase.table("links").select("*").eq("rl_url", rl_url).execute()
    if existing.data:
        return "This repolink is taken"
    
    # passed all checks, add entry to table
    response = (
        supabase.table("links")
        .insert({"rl_url": rl_url, "gh_url": gh_url})
        .execute()
    )
    print(response)
    return "Successful"
    

"""
Returns the GitHub URL mapped to repolink URL.
DB: Pulls the entry from the links table.
Format: /get_link?rl=<repolink>
Example: /get_link?rl=shf --> https://github.com/javud/sweethomefinder/
"""
@app.route("/get_link")
def get_link():
    rl_url = request.args.get('rl_url')
    if rl_url == None or len(rl_url) == 0:
        return jsonify("Missing repolink URL")
    response = (
        supabase.table("links")
        .select("gh_url", count="exact")
        .eq("rl_url", rl_url)
        .execute()
    )
    if response.count > 0:
        return jsonify(response.data[0]["gh_url"])
    else:
        return jsonify("No GitHub URL was found for the provided repolink URL")

@app.route("/")
def hello_world():
    return "<p>Welcome to the repol.ink API</p>"

if __name__ == "__main__":
    app.run(debug=True)