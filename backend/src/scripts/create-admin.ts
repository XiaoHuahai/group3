/**
 * 创建超级管理员脚本
 * 使用方法: npm run create-admin -- <email> <password> [name]
 * 或者: npx tsx src/scripts/create-admin.ts <email> <password> [name]
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module.js';
import { UsersService } from '../modules/users/users.service.js';

async function createAdmin() {
  try {
    // 获取命令行参数（跳过 node 和脚本路径）
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.error('Usage: npm run create-admin -- <email> <password> [name]');
      console.error('Example: npm run create-admin -- admin@example.com admin123 "Admin Name"');
      process.exit(1);
    }

    const [email, password, ...nameParts] = args;
    const name = nameParts.length > 0 ? nameParts.join(' ') : undefined;

    console.log('正在创建超级管理员...');
    console.log(`Email: ${email}`);
    if (name) {
      console.log(`Name: ${name}`);
    }

    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    try {
      const admin = await usersService.createAdmin(email, password, name);
      console.log('\n✅ 超级管理员创建成功!');
      console.log(`Email: ${admin.email}`);
      console.log(`Name: ${admin.name || 'N/A'}`);
      console.log(`Roles: ${admin.roles.join(', ')}`);
      console.log('\n现在可以使用此账户登录并管理用户。');
    } catch (error: any) {
      console.error('\n❌ 创建失败:', error.message);
      if (error.message.includes('already exists')) {
        console.error('提示: 该邮箱已被使用，请使用其他邮箱或先删除现有用户。');
      }
      process.exit(1);
    } finally {
      await app.close();
    }
  } catch (error: any) {
    console.error('❌ 脚本执行失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createAdmin().catch((error) => {
  console.error('未捕获的错误:', error);
  process.exit(1);
});

