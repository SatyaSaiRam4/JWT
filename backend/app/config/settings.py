from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "ecommerce_db"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"

    SECRET_KEY: str = "change-this-secret-key"
    ALGORITHM: str = "HS256"

    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    MAIL_FROM: str = "no-reply@example.com"
    OTP_EXPIRE_MINUTES: int = 10

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
