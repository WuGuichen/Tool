import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function HelloWorld() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    api
      .get("/plugins/hello/ping")
      .then((res: any) => setMessage(res.data.message))
      .catch((err: any) => setMessage("Failed to load message: " + err.message));
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-slate-800">测试工具加载成功 🚀</h3>
        <p className="mt-2 text-sm text-slate-500">
          这是一个用于测试插件系统的前端组件。如果你看到了下面的来自后端的响应，说明端到端通讯完全正常。
        </p>
      </div>

      <div className="rounded-xl bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">后端 API 响应:</span>
          <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
            200 OK
          </span>
        </div>
        <p className="mt-4 font-mono text-sm text-emerald-400">
          {message}
        </p>
      </div>
    </div>
  );
}
