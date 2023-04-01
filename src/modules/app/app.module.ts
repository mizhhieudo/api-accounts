import { CONFIG_SERVICE_PROVIDER_TOKEN } from './../config/config.provider';
import { ConfigModule } from './../config/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [CONFIG_SERVICE_PROVIDER_TOKEN],
      useFactory: (configService) => {
        return { uri: configService.get('mongodb.uri') };
      },
    }),
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
