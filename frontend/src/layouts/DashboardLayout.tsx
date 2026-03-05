import React, { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, Box, Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { PluginMeta } from "@/types";

export default function DashboardLayout() {
  const { user, plugins, logout } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white shadow-sm flex flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
          <Box className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-slate-800">Web Toolbox</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Menu className="h-4 w-4" />
            仪表盘首页
          </Link>
          
          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              我的插件
            </p>
          </div>
          {plugins.map((plugin: PluginMeta) => (
            <Link
              key={plugin.name}
              to={`/plugins${plugin.route_path}`}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith(`/plugins${plugin.route_path}`)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="h-4 w-4 rounded-sm bg-slate-200 flex items-center justify-center text-[10px]">
                {plugin.icon ? plugin.icon : plugin.display_name.charAt(0)}
              </div>
              {plugin.display_name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-medium text-slate-700">{user.username}</p>
                <p className="text-xs text-slate-500">{user.is_superuser ? "管理员" : "普通用户"}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="退出登录"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            {location.pathname === "/" ? "仪表盘" : plugins.find((p: PluginMeta) => `/plugins${p.route_path}` === location.pathname)?.display_name || "应用"}
          </h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
