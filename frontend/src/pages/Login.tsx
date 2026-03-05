import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const setToken = useAuthStore((state) => state.setToken);
  const initialize = useAuthStore((state) => state.initialize);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    if (!username.trim() || !password.trim()) {
      setError("用户名或密码不能为空");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // 登录请求，FastAPI的 OAuth2PasswordRequestForm 默认需要 x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        const response = await api.post<LoginResponse>("/auth/login", formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        setToken(response.data.access_token);
        await initialize();
        navigate("/");
      } else {
        // 注册请求
        await api.post("/auth/register", {
          username,
          password
        });
        setSuccessMsg("注册成功！请登录。");
        setIsLogin(true); // 注册成功后切换回登录界面
        setPassword("");  // 清空密码让用户重新输入确认
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(isLogin ? "用户名或密码错误" : "注册失败，请稍后重试");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-slate-900">Web Toolbox</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          {isLogin ? "登录后访问你的专属工具插件" : "注册一个新的工具箱账号"}
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-700">用户名</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          {successMsg && <p className="text-sm text-emerald-600">{successMsg}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? "处理中..." : isLogin ? "登录" : "注册"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "还没有账号？" : "已有账号？"}{" "}
          <button
            onClick={toggleMode}
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline"
            type="button"
          >
            {isLogin ? "立即注册" : "返回登录"}
          </button>
        </div>
      </div>
    </div>
  );
}
