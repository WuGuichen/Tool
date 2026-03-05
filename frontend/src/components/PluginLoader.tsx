import { lazy, Suspense, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { PluginMeta } from "@/types";

export default function PluginLoader() {
  const { "*": splat } = useParams();
  const plugins = useAuthStore((state: any) => state.plugins) as PluginMeta[];

  // 根据当前 URL 路径查找对应的插件信息
  const currentPlugin = plugins.find((p: PluginMeta) => {
    // splat 就是路由中的 /plugins/ 之后的部分
    return splat && `/${splat}`.startsWith(p.route_path);
  });

  // 使用 useMemo 缓存动态加载的组件，防止重新渲染时重复懒加载
  const PluginComponent = useMemo(() => {
    if (!currentPlugin) return null;
    
    return lazy(() => 
      import(`../plugins/${currentPlugin.frontend_component}.tsx`)
        .catch(() => ({ 
          default: () => (
            <div className="p-4 text-red-600 bg-red-50 rounded border border-red-200">
              插件 UI 加载失败：未找到组件 {currentPlugin.frontend_component}.tsx
            </div>
          )
        }))
    );
  }, [currentPlugin]);

  if (!currentPlugin || !PluginComponent) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={
      <div className="flex h-32 items-center justify-center text-slate-400 text-sm">
        正在加载插件界面...
      </div>
    }>
      <PluginComponent />
    </Suspense>
  );
}
