import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter());
    // 配置 CORS，允许前端访问
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`SPEED backend is running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map