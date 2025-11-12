import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter());
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`SPEED backend is running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map