import {
  CONFIG_SERVICE_PROVIDER_TOKEN,
  getConfig,
  getHost,
} from './modules/config/config.provider';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { IConfig } from 'config';
import { initializeApp } from './helpers/shareConfigs/initializeApp';
import { initializeSwagger } from './helpers/shareConfigs/initializeSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await initializeApp(app);
  await initializeSwagger(app);

  const config: IConfig = app.get(CONFIG_SERVICE_PROVIDER_TOKEN);
  await app.listen(3111, () => {
    const config = getConfig();
    const hostname = getHost();
    console.info(
      `Started on http://${getHost()}${config.get('service.baseUrl')}`,
    );
    console.info(
      `Docs available on http://${hostname}${config.get(
        'service.docsBaseUrl',
      )}`,
    );
  });
}
bootstrap();
