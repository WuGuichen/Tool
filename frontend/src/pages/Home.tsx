import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const { plugins } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-slate-800">欢迎回来，探索你的工具箱</h3>
        <p className="mt-2 text-sm text-slate-500">
          你当前有 {plugins.length} 个可用的工具插件。点击左侧菜单开始使用。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin) => (
          <div
            key={plugin.name}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                {plugin.icon ? plugin.icon : plugin.display_name.charAt(0)}
              </div>
              <h4 className="font-semibold text-slate-800">{plugin.display_name}</h4>
            </div>
            <p className="mt-4 text-sm text-slate-600 flex-1">{plugin.description}</p>
          </div>
        ))}
        {plugins.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-sm text-slate-500">暂无授权的插件可用，请联系管理员分配权限。</p>
          </div>
        )}
      </div>
    </div>
  );
}
