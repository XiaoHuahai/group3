export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">角色仪表盘</h2>
        <p className="mt-2 text-sm text-slate-600">
          根据登录角色展示不同功能入口。当前为静态占位，后续将接入后端 API 与权限控制。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "提交者 Submitter", items: ["提交新文章", "查看提交状态"] },
          { title: "审核员 Moderator", items: ["待审核队列", "文章详情审查"] },
          { title: "分析员 Analyst", items: ["分析任务列表", "证据录入表单"] }
        ].map((block) => (
          <div key={block.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {block.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

