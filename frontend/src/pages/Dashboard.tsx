import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const plugins = useAuthStore((state) => state.plugins);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">欢迎回来，{user?.username}</h2>
        <p className="mt-2 text-sm text-slate-600">
          你当前可以使用 {plugins.length} 个插件。侧边栏只会显示你有权限访问的工具。
        </p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">可用插件</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {plugins.length === 0 ? <li>暂无可用插件</li> : null}
          {plugins.map((plugin) => (
            <li key={plugin.name} className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="font-medium">{plugin.display_name}</p>
              <p className="text-xs text-slate-500">{plugin.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
