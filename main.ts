// File: ftu-backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston'; // <-- IMPORT MỚI
import { winstonConfig } from './core/config/winston.config'; // <-- IMPORT MỚI

async function bootstrap() {
  // Sử dụng WinstonLogger làm logger mặc định cho toàn bộ ứng dụng
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig), // <-- THAY ĐỔI Ở ĐÂY
  });

  // Cấu hình CORS để frontend có thể gọi API
  app.enableCors({
    origin: '*', // Tạm thời cho phép tất cả, sẽ cấu hình lại sau
  });

  // Kích hoạt ValidationPipe toàn cục
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
    transform: true, // Tự động chuyển đổi kiểu dữ liệu
  }));

  // Thêm tiền tố /api cho tất cả các route
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 FTU Backend is running on: ${await app.getUrl()}`);
}
bootstrap();