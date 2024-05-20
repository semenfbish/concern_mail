import os
JWT_KEY = os.getenv("JWT_KEY", "some_secret_key")

APP_DEBUG = os.getenv("APP_DEBUG", "False")
APP_PORT = int(os.getenv("APP_PORT", "8000"))
APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
ROOT_PATH = os.getenv("ROOT_PATH", "")

DB_TYPE = os.getenv("DB_TYPE", "sqlite")
DB_NAME = os.getenv("DB_NAME", "if-else-task2.db")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
