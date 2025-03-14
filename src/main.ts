import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS para permitir peticiones desde React
  app.enableCors({
    origin: '*', // Permite todas las solicitudes (⚠️ En producción, cambiar a tu dominio)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Generación de PDFs')
    .setDescription('Esta API permite generar PDFs y subirlos a Amazon S3.')
    .setVersion('1.0')
    .addTag('PDFs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 API corriendo en: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
