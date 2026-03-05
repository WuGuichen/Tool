from fastapi import APIRouter, Depends, Request
from typing import List
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "is_superuser": current_user.is_superuser,
        "role": current_user.role.name if current_user.role else None
    }

@router.get("/me/plugins")
async def read_my_plugins(request: Request, current_user: User = Depends(get_current_user)):
    # 获取系统所有加载的插件
    all_plugins = getattr(request.app.state, "loaded_plugins", [])
    
    # 如果是超级用户，返回所有插件
    if current_user.is_superuser:
        return all_plugins
    
    # 如果是普通用户，后续可以在这里加入根据 models.plugin.PluginConfig 的过滤逻辑
    # 暂时默认向所有登录用户暴露所有基础插件（用于测试），后续可连接 DB 过滤
    return all_plugins
