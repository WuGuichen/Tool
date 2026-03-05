import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.router import api_router
from app.core.database import engine, Base
from app.models.user import User, Role
from app.models.plugin import PluginConfig
from app.core.plugin_loader import load_plugins

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    load_plugins(app)
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

# Docker 部署时挂载的前端静态文件
public_dir = os.path.join(os.path.dirname(__file__), "public")
if os.path.exists(public_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(public_dir, "assets")), name="assets")
    
    # 捕获所有前端路由，返回 index.html 以支持 React Router 浏览器历史路由
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            return {"error": "API route not found"}
        return FileResponse(os.path.join(public_dir, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to Web Toolbox API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
