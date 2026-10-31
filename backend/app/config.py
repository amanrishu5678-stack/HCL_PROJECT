from pathlib import Path
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_ROOT = (
    BACKEND_DIR.parent
    if BACKEND_DIR.name == "backend" and (BACKEND_DIR.parent / "backend").is_dir()
    else BACKEND_DIR
)
DATA_DIR = PROJECT_ROOT / "data"
MODEL_DIR = APP_DIR / "ml_models"
if os.getenv("VERCEL") != "1":
    DATA_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseSettings):
    database_url: str = f"sqlite:///{(DATA_DIR / 'indusense.db').as_posix()}"
    jwt_secret: str = "indusense-local-demo-secret-change-me"
    mqtt_host: str = "localhost"
    mqtt_port: int = 1883
    mqtt_enabled: bool = False
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    model_dir: str = str(MODEL_DIR)

    model_config = SettingsConfigDict(env_file=str(PROJECT_ROOT / ".env"), extra="ignore")

settings = Settings()

if os.getenv("VERCEL") == "1":
    if settings.database_url.startswith("sqlite:"):
        raise RuntimeError("Set DATABASE_URL to a persistent PostgreSQL database on Vercel.")
    if settings.jwt_secret in {
        "indusense-local-demo-secret-change-me",
        "replace-this-for-a-real-deployment",
    }:
        raise RuntimeError("Set JWT_SECRET to a unique, random value on Vercel.")
