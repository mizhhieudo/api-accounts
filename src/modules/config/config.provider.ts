import * as dotenv from 'dotenv';
dotenv.config();
import * as config from 'config';
import { Provider } from '@nestjs/common';

export const CONFIG_SERVICE_PROVIDER_TOKEN = 'ConfigProviderToken';

export const isLocal = () => {
  const host = config.get('server.host');
  return host === 'localhost' || host === '127.0.0.1';
};

export const getHost = () => {
  const hostname = config.get('server.hostname');
  if (hostname) {
    return `${hostname}`;
  } else {
    return `${config.get('server.host')}:${config.get('server.port')}`;
  }
};

export const getPort = (): string => {
  return `${config.get('server.port')}`;
};

export const getConfig = () => {
  return config;
};

export const configProvider: Provider = {
  provide: CONFIG_SERVICE_PROVIDER_TOKEN,
  useFactory: () => {
    dotenv.config();
    return import('config');
  },
};
