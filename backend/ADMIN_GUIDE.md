# 管理员使用指南

## 创建超级管理员

### 方法 1: 使用命令行脚本（推荐）

首先确保已安装 `tsx`：
```bash
npm install -g tsx
# 或者
npm install --save-dev tsx
```

然后运行创建管理员脚本：
```bash
cd backend
npm run create-admin -- <email> <password> [name]
```

示例：
```bash
npm run create-admin -- admin@example.com admin123 超级管理员
```

### 方法 2: 直接在数据库中创建

1. 连接到 MongoDB 数据库
2. 在 `users` 集合中插入以下文档：

```javascript
{
  "email": "admin@example.com",
  "passwordHash": "$2a$10$...", // 使用 bcrypt 加密的密码
  "roles": ["Admin"],
  "name": "超级管理员"
}
```

生成密码哈希可以使用 Node.js：
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 10);
console.log(hash);
```

### 方法 3: 通过代码创建

如果已经有管理员账户，可以通过用户管理界面创建新的管理员。

## 用户角色说明

- **Submitter (提交者)**: 默认角色，可以提交文章
- **Moderator (审核者)**: 可以审核待审核的文章
- **Analyst (分析员)**: 可以分析已审核的文章
- **Admin (管理员)**: 可以管理所有用户和系统设置

## 分配用户角色

### 通过用户管理界面

1. 使用管理员账户登录
2. 点击导航栏中的"用户管理"
3. 在用户列表中，点击角色按钮来添加或移除角色
4. 每个用户必须至少有一个角色

### 通过 API

管理员可以使用以下 API 端点：

- `GET /users` - 获取所有用户列表
- `GET /users/:id` - 获取单个用户信息
- `PATCH /users/:id/roles` - 更新用户角色

示例请求：
```bash
PATCH /users/507f1f77bcf86cd799439011/roles
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "roles": ["Submitter", "Moderator"]
}
```

## 权限说明

- 只有 **Admin** 角色的用户可以访问用户管理功能
- 管理员可以给用户分配任何角色组合
- 用户可以有多个角色（例如：既是 Moderator 又是 Analyst）

