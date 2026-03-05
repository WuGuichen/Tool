import importlib
import pkgutil
import inspect
from pathlib import Path
from fastapi import APIRouter, FastAPI
import sys

def load_plugins(app: FastAPI):
    plugins_dir = Path(__file__).parent.parent / "plugins"
    if not plugins_dir.exists():
        plugins_dir.mkdir(parents=True)
    
    # 确保 app/plugins 在 sys.path 中以便动态导入
    if str(plugins_dir.parent) not in sys.path:
        sys.path.insert(0, str(plugins_dir.parent))
    
    loaded_plugins = []

    for module_info in pkgutil.iter_modules([str(plugins_dir)]):
        module_name = f"app.plugins.{module_info.name}"
        try:
            module = importlib.import_module(module_name)
            
            # 查找模块中的 APIRouter 实例，通常命名为 router 或者 plugin_router
            router = None
            for name, obj in inspect.getmembers(module):
                if isinstance(obj, APIRouter):
                    router = obj
                    break
            
            # 查找插件的元数据，通常定义为字典 PLUGIN_META
            meta = getattr(module, "PLUGIN_META", {})
            
            if router and meta:
                route_prefix = meta.get("route_path", f"/{module_info.name}")
                app.include_router(router, prefix=f"/api/plugins{route_prefix}", tags=[meta.get("name", module_info.name)])
                loaded_plugins.append(meta)
                print(f"Loaded plugin: {module_info.name} at /api/plugins{route_prefix}")
            else:
                print(f"Skipped {module_info.name}: Missing APIRouter or PLUGIN_META")
                
        except Exception as e:
            print(f"Failed to load plugin {module_name}: {e}")
    
    # 将加载的插件列表挂载到 app.state 上方便其他地方调用
    app.state.loaded_plugins = loaded_plugins
