from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Web Toolbox"
    SECRET_KEY: str = "change_this_secret_key_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    # 将数据库路径改为基于文件绝对位置的相对路径，确保在不同目录启动都能定位到 backend 下
    DATABASE_URL: str = "sqlite+aiosqlite:///toolbox.db"

settings = Settings()
