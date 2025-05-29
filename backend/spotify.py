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
AUTH_URL = "https://accounts.spotify.com/authorize"

# Caching for client credentials flow
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

@spotify.route("/login")
def login():
    scopes = (
        "user-read-private user-read-email "
        "playlist-read-private playlist-modify-private playlist-modify-public playlist-read-collaborative "
        "streaming user-read-playback-state user-modify-playback-state user-read-currently-playing "
        "user-library-read user-library-modify user-read-recently-played"
    )
    query_params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "scope": scopes,
        "redirect_uri": REDIRECT_URI,
    }
    query_string = "&".join(
        f"{k}={requests.utils.quote(v)}" for k, v in query_params.items()
    )
    return redirect(f"{AUTH_URL}?{query_string}")

@spotify.route("/callback")
def callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing code param"}), 400

    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    try:
        res = requests.post(token_url, data=payload, headers=headers)
        res.raise_for_status()
        tokens = res.json()

        session["access_token"] = tokens.get("access_token")
        session["refresh_token"] = tokens.get("refresh_token")
        return jsonify(tokens)
    except requests.exceptions.RequestException as e:
        print(f"Spotify token exchange failed: {e}")
        return jsonify({"error": "Token exchange failed", "details": str(e)}), 500

@spotify.route("/refresh_access_token")
def refresh_access_token():
    refresh_token = session.get("refresh_token")
    if not refresh_token:
        return jsonify({"error": "No refresh token found"}), 400

    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }

    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    try:
        res = requests.post(token_url, data=payload, headers=headers)
        res.raise_for_status()
        tokens = res.json()
        session["access_token"] = tokens["access_token"]
        return jsonify({"access_token": tokens["access_token"]})
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Failed to refresh token: {e}")
        return jsonify({"error": "Failed to refresh token", "details": str(e)}), 500

def refresh_access_token_if_expired():
    if not session.get("refresh_token"):
        return False
    try:
        response = refresh_access_token()
        return response.status_code == 200
    except Exception as e:
        print("[ERROR] Auto-refresh failed:", e)
        return False

@spotify.route("/me")
def get_profile():
    if not session.get("access_token"):
        return jsonify({"error": "No access token in session"}), 401

    refresh_access_token_if_expired()
    token = session.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}

    try:
        profile_response = requests.get("https://api.spotify.com/v1/me", headers=headers)
        playlists_response = requests.get("https://api.spotify.com/v1/me/playlists", headers=headers)

        if profile_response.status_code != 200:
            return jsonify({"error": "Failed to fetch profile", "details": profile_response.text}), 400
        if playlists_response.status_code != 200:
            return jsonify({"error": "Failed to fetch playlists", "details": playlists_response.text}), 400

        profile = profile_response.json()
        playlists = playlists_response.json()

        return jsonify({
            "profile": {
                "display_name": profile.get("display_name"),
                "email": profile.get("email"),
                "image": profile["images"][0]["url"] if profile.get("images") else None,
                "country": profile.get("country"),
                "product": profile.get("product"),
                "id": profile.get("id")
            },
            "playlists": playlists
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch user data", "details": str(e)}), 400

@spotify.route("/create_playlist", methods=["POST"])
def create_playlist():
    token = session.get("access_token")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # FIX: Add error handling
    profile_response = requests.get("https://api.spotify.com/v1/me", headers=headers)
    if profile_response.status_code != 200:
        return jsonify({"error": "Failed to fetch profile"}), 400
        
    profile = profile_response.json()
    user_id = profile.get("id")
    
    if not user_id:
        return jsonify({"error": "Could not get user ID"}), 400
@spotify.route("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@spotify.route("/player/devices")
def get_player_devices():
    if not refresh_access_token_if_expired():
        return jsonify({"error": "Failed to refresh token"}), 401

    token = session.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get("https://api.spotify.com/v1/me/player/devices", headers=headers)

    if res.status_code != 200:
        return jsonify({"error": "Failed to fetch devices", "details": res.text}), 400

    return jsonify(res.json())

@spotify.route("/player/play", methods=["PUT"])
def play_track():
    token = session.get("access_token")
    if not token:
        return jsonify({"error": "No access token in session"}), 401

    data = request.json
    device_id = data.get("device_id")
    uris = data.get("uris")

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {"uris": uris} if uris else {}

    res = requests.put(
        f"https://api.spotify.com/v1/me/player/play?device_id={device_id}",
        headers=headers,
        json=payload,
    )

    if res.status_code != 204:
        return jsonify({"error": "Failed to play track", "details": res.text}), 400

    return jsonify({"status": "playing"})

@spotify.route("/player/state")
def get_current_playback():
    if not refresh_access_token_if_expired():
        return jsonify({"error": "Unauthorized"}), 401

    token = session.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get("https://api.spotify.com/v1/me/player", headers=headers)

    if res.status_code != 200:
        return jsonify({"error": "Failed to fetch playback state", "details": res.text}), 400

    return jsonify(res.json())
