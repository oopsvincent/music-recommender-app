# spotify.py

from flask import Blueprint, redirect, request, session, jsonify
import requests
import time
import os
import base64 
from dotenv import load_dotenv

load_dotenv()

spotify = Blueprint("spotify", __name__)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")



access_token_cache = {"access_token": None, "expires_at": 0}


def refresh_token():
    auth_response = requests.post(
        "https://accounts.spotify.com/api/token",
        data={"grant_type": "client_credentials"},
        auth=(CLIENT_ID, CLIENT_SECRET),
    )

    if auth_response.status_code != 200:
        raise Exception("Failed to get token: " + auth_response.text)

    token_data = auth_response.json()
    access_token_cache["access_token"] = token_data["access_token"]
    access_token_cache["expires_at"] = time.time() + token_data["expires_in"] - 60


@spotify.route("/token")
def get_token():
    if (
        not access_token_cache["access_token"]
        or time.time() > access_token_cache["expires_at"]
    ):
        refresh_token()
    return jsonify({"access_token": access_token_cache["access_token"]})



@spotify.route("/callback")
def callback():

    code = request.args.get('code')
    if not code:
        return jsonify({"error": "Missing code param"}), 400


    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI
    }

    # Spotify expects basic auth header
    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:

        res = requests.post(token_url, data=payload, headers=headers)
        res.raise_for_status()  # will throw if 401

        tokens = res.json()

        # Save access_token + refresh_token into Flask session
        session["access_token"] = tokens["access_token"]
        session["refresh_token"] = tokens["refresh_token"]
        return jsonify(tokens)
        # return redirect("/")  # Redirect user to frontend

    except requests.exceptions.RequestException as e:
        # Log everything for debugging
        print(f"Spotify token exchange failed: {e}")
        print(f"Response content: {res.text}")
        return jsonify({"error": "Token exchange failed", "details": res.text}), 500



@spotify.route("/me")
def get_profile():
    token = session.get("access_token")
    if not token:
        return jsonify({"error": "No access token in session"}), 401

    headers = {"Authorization": f"Bearer {token}"}

    profile_response = requests.get("https://api.spotify.com/v1/me", headers=headers)
    if profile_response.status_code != 200:
        return (
            jsonify(
                {"error": "Failed to fetch profile", "details": profile_response.text}
            ),
            400,
        )

    playlists_response = requests.get(
        "https://api.spotify.com/v1/me/playlists", headers=headers
    )
    if playlists_response.status_code != 200:
        return (
            jsonify(
                {
                    "error": "Failed to fetch playlists",
                    "details": playlists_response.text,
                }
            ),
            400,
        )

    profile = profile_response.json()
    playlists = playlists_response.json()

    return jsonify(
        {
            "profile": {
                "display_name": profile.get("display_name"),
                "email": profile.get("email"),
                "image": profile["images"][0]["url"] if profile.get("images") else None,
            },
            "playlists": playlists,
        }
    )


@spotify.route("/create_playlist", methods=["POST"])
def create_playlist():
    token = session.get("access_token")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    profile = requests.get("https://api.spotify.com/v1/me", headers=headers).json()
    user_id = profile["id"]

    data = {
        "name": "OopsVincent’s Fire Playlist 🔥",
        "description": "Curated with chaotic love by Vincent",
        "public": False,
    }

    response = requests.post(
        f"https://api.spotify.com/v1/users/{user_id}/playlists",
        headers=headers,
        json=data,
    )

    return jsonify(response.json())


@spotify.route("/login")
def login():
    scopes = "user-read-private user-read-email playlist-read-private playlist-modify-private streaming user-read-playback-state user-modify-playback-state"
    auth_url = "https://accounts.spotify.com/authorize"
    query_params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "scope": scopes,
        "redirect_uri": REDIRECT_URI,
    }

    query_string = "&".join(
        f"{k}={requests.utils.quote(v)}" for k, v in query_params.items()
    )
    return redirect(f"{auth_url}?{query_string}")
