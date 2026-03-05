import { LogOut, Wrench } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/useAuthStore";

export default function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const plugins = useAuthStore((state) => state.plugins);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-72 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-lg font-semibold text-slate-900">Web Toolbox</h1>
          <p className="mt-1 text-xs text-slate-500">{user?.username ?? "Guest"}</p>
        </div>
        <nav className="space-y-1 p-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            <Wrench size={16} />
            仪表盘
          </NavLink>
          {plugins.map((plugin) => (
            <NavLink
              key={plugin.name}
              to={plugin.route_path}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {plugin.display_name}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
