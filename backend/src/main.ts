import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 1. Avisamos ao NestJS que ele está usando o Express por baixo dos panos
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. O CORS que já arrumamos antes
  app.enableCors();

  // 3. A MÁGICA: Dizemos para o NestJS liberar o acesso de leitura à pasta 'uploads'
  // Qualquer arquivo lá dentro poderá ser visto pela URL /uploads/nome-do-arquivo.png
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
}
bootstrap(); 