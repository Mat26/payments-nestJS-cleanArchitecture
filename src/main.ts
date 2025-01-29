import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT', '3000');

  const logger = new Logger('Bootstrap');
  await app.listen(port, '0.0.0.0');
  logger.log(
    JSON.stringify({
      message: 'App is ready',
      port,
      timestamp: new Date().toISOString(),
    }),
  );
}
bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error('Error during bootstrap:', error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
