from fastapi import APIRouter
from app.api import auth, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
# 我们也将原先放在 /users/me/plugins 的接口直接映射一个 /plugins/me 方便前端调用
api_router.add_api_route("/plugins/me", users.read_my_plugins, methods=["GET"], tags=["plugins"])
