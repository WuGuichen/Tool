export default function NotFoundPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">页面不存在</h2>
      <p className="mt-2 text-sm text-slate-500">请检查访问路径是否正确。</p>
    </div>
  );
}
