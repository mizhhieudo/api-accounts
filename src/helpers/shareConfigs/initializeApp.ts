import { CONFIG_SERVICE_PROVIDER_TOKEN } from './../../modules/config/config.provider';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { IConfig } from 'config';
import * as bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';
import * as responseTime from 'response-time';
import * as express from 'express';
import { v4 as uuidV4 } from 'uuid';

interface CustomRequest extends express.Request {
  id?: string;
}

export async function initializeApp(app: INestApplication): Promise<any> {
  const config = app.get<IConfig>(CONFIG_SERVICE_PROVIDER_TOKEN);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(httpContext.middleware);
  app.use(responseTime({ header: 'x-response-time' }));
  app.use((req: CustomRequest, res: express.Response, next: () => void) => {
    const correlationId = uuidV4();
    httpContext.set('timestamp', Date.now());
    httpContext.set('correlationId', correlationId);
    req.id = correlationId;
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: any) => {
        return new BadRequestException(validationErrors);
      },
      validationError: {
        target: false,
        value: false,
      },
    }),
  );
  app.setGlobalPrefix(config.get('service.baseUrl'));
}
