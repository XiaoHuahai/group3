export default function DocsPage() {
  return (
    <article className="prose prose-slate max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1>SPEED 项目路线图</h1>
      <p>
        本页概述迭代目标、技术栈与协作约定。后续将链接到更详细的 API 文档、数据库模型和前后端协作指南。
      </p>
      <h2>迭代里程碑</h2>
      <ol>
        <li>迭代 1：MVP 核心——注册登录、基础提交、公共搜索</li>
        <li>迭代 2：工作流完善——审核、分析、增强搜索与评分</li>
        <li>迭代 3：生产准备——Admin 管理、查询保存、监控测试</li>
      </ol>
      <h2>前后端协作约定</h2>
      <ul>
        <li>统一使用 TypeScript 与约定的 Lint/Format 规则</li>
        <li>API 通过 Swagger 文档与接口契约同步</li>
        <li>组件与模块应配套 Storybook/单元测试（后续迭代引入）</li>
      </ul>
    </article>
  );
}

