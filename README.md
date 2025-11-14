## SPEED（Software Practice Empirical Evidence Database）

SPEED 是一个面向软件工程实践证据的可搜索数据库，目标是帮助学生、研究者与业界人员快速获取经过实证研究支持的实践信息。本仓库按照前后端分离的方式组织：`backend` 目录包含 Nest.js + MongoDB 的 API 服务，`frontend` 目录包含 Next.js + TypeScript 的 Web 前端。

### 当前状态
- ✅ 初始化项目结构与公共配置
- ✅ 搭建 Nest.js 后端骨架（Mongo 连接、JWT、角色守卫）
- ✅ 后端文章工作流 API（提交 → 审核 → 分析 → 搜索）
- ⏳ 搭建 Next.js 前端骨架（Tailwind、核心页面占位）

### 目录结构（持续更新）
```
.
├── backend/    # Nest.js 服务端代码（待完善）
├── frontend/   # Next.js 前端代码（骨架已建立）
├── README.md
└── .gitignore
```

### 开发迭代计划概览
1. **迭代 1：MVP 核心流程**
   - 用户注册 / 登录（初始角色手动分配）
   - 基础文章提交、公共搜索列表
2. **迭代 2：工作流完善**
   - 角色守卫、审核 / 分析仪表盘
   - 搜索过滤增强、文章评分
3. **迭代 3：生产准备**
   - Admin 管理、查询保存、错误处理与测试

后续步骤将按迭代逐步补全功能与文档。

### 快速开始
```bash
# 安装全部依赖（根目录）
npm install

# 启动后端（需要本地 MongoDB 或自定义 MONGO_URI）
npm run dev:backend

# 启动前端
npm run dev:frontend

# 创建超级管理员（首次使用）
cd backend
npm run create-admin -- <email> <password> [name]
# 示例: npm run create-admin -- admin@example.com admin123 超级管理员
```

后端默认监听 `http://localhost:3001`，提供 `/health`、`/auth/register`、`/auth/login` 以及文章提交/审核/搜索等接口；前端默认运行在 `http://localhost:3000`，当前页面为静态占位，后续会接入实际 API 与状态管理。

### 后端文章工作流 API 摘要

- `POST /articles/submit`（需 Bearer Token，角色：Submitter/Moderator/Analyst/Admin）  
  提交文献信息，字段包含标题、作者、期刊/会议、年份、DOI 等。
- `GET /articles/mine`（需 Bearer Token）  
  查看当前用户提交的所有文章及其状态。
- `GET /articles/moderation/pending` / `PATCH /articles/:id/moderate`（角色：Moderator/Admin）  
  审核待处理文章，支持通过或拒绝并填写备注。
- `GET /articles/analysis/pending` / `PATCH /articles/:id/analysis`（角色：Analyst/Admin）  
  分析通过审核的文章，录入实践、claim、证据结论等信息并发布。
- `GET /articles/search`（公开）  
  支持按 practice、claim、证据结论、研究方法、参与者类型、年份区间、关键字等筛选已发布文章。
- `GET /articles/:id`（公开）  
  查看指定已发布文章的详细信息。

文章状态枚举：`Submitted` → `ApprovedForAnalysis` → `Published`，若被拒绝则为 `Rejected`。

