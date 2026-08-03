import os
import secrets
from urllib.parse import urlencode

from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv

# Загружаем переменные из .env файла
load_dotenv()

app = FastAPI(title="KAIROS Google OAuth2 API")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000").rstrip("/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", f"{BACKEND_URL}/callback")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/login")
async def login():
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Отсутствует GOOGLE_CLIENT_ID")

    query = urlencode(
        {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "select_account",
            "state": secrets.token_urlsafe(24),
        }
    )

    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{query}")


@app.get("/callback")
async def auth_callback(code: str | None = None, error: str | None = None):
    if error:
        return RedirectResponse(f"{FRONTEND_URL}/?auth=error&message={error}")

    if not code:
        return RedirectResponse(f"{FRONTEND_URL}/?auth=error&message=missing_code")

    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google OAuth credentials are not configured")

    token_url = "https://oauth2.googleapis.com/token"

    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=data, timeout=12)
        token_json = token_response.json()

        if not token_response.is_success or "error" in token_json:
            message = token_json.get("error_description") or token_json.get("error") or "token_error"
            return RedirectResponse(f"{FRONTEND_URL}/?auth=error&message={message}")

        access_token = token_json.get("access_token")
        userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = await client.get(userinfo_url, headers=headers, timeout=12)
        user_data = user_response.json()

        if not user_response.is_success:
            return RedirectResponse(f"{FRONTEND_URL}/?auth=error&message=userinfo_error")

        params = urlencode(
            {
                "auth": "success",
                "name": user_data.get("name", ""),
                "email": user_data.get("email", ""),
                "picture": user_data.get("picture", ""),
            }
        )
        return RedirectResponse(f"{FRONTEND_URL}/?{params}")
