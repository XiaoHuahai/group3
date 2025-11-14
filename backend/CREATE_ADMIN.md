# 创建超级管理员指南

## 方法 1: 使用 npm 脚本（推荐）

```bash
cd backend
npm run create-admin -- admin@example.com admin123 "Admin Name"
```

**注意**: 如果名称包含空格，请用引号括起来。

## 方法 2: 直接使用 tsx

```bash
cd backend
npx tsx src/scripts/create-admin.ts admin@example.com admin123 "Admin Name"
```

## 方法 3: 如果上述方法都失败，使用 Node.js

首先编译 TypeScript:
```bash
cd backend
npm run build
```

然后运行编译后的脚本:
```bash
node dist/scripts/create-admin.js admin@example.com admin123 "Admin Name"
```

## 参数说明

- `email`: 管理员邮箱（必填）
- `password`: 管理员密码（必填，至少6位）
- `name`: 管理员姓名（可选）

## 示例

```bash
# 基本用法
npm run create-admin -- admin@example.com admin123

# 带姓名
npm run create-admin -- admin@example.com admin123 "Super Admin"

# 如果遇到参数问题，直接使用 tsx
npx tsx src/scripts/create-admin.ts admin@example.com admin123 SuperAdmin
```

## 常见问题

### 1. 错误: "User with this email already exists"
- 该邮箱已被使用，请使用其他邮箱
- 或者先删除现有用户（通过数据库或用户管理界面）

### 2. 错误: "tsx: command not found"
- 运行 `npm install` 安装依赖
- 或者使用 `npx tsx` 代替

### 3. PowerShell 参数问题
- 在 PowerShell 中，如果参数包含空格，使用引号: `"Admin Name"`
- 或者直接使用 `npx tsx` 命令

## 验证

创建成功后，使用创建的邮箱和密码登录系统，应该能看到"用户管理"链接。

