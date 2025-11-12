export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">注册账号</h2>
        <p className="mt-2 text-sm text-slate-600">
          新提交者默认获得 Submitter 角色，后续可由管理员升级为 Moderator 或 Analyst。
        </p>
        <form className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">姓名（可选）</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="张三"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">邮箱</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="email"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">密码</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="password"
              placeholder="至少 6 位字符"
            />
          </label>
          <button
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
            type="submit"
          >
            注册
          </button>
        </form>
      </div>
    </section>
  );
}

