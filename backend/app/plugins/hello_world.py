from fastapi import APIRouter

router = APIRouter()

PLUGIN_META = {
    "name": "hello_world",
    "display_name": "测试工具",
    "description": "这是一个用于测试动态加载和权限的基础插件。",
    "route_path": "/hello",
    "frontend_component": "HelloWorld",  # 对应前端的组件文件名
    "icon": "🚀"
}

@router.get("/ping")
async def ping():
    return {"status": "ok", "message": "Hello from Hello World Plugin!"}
