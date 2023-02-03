import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app/app.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { User } from './user.entity';
import { Site } from './site.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'olayiwola',
      password: '',
      database: 'livechat',
      entities: [Chat, User, Site],
      synchronize: true,
      port: 5432,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    TypeOrmModule.forFeature([Chat, User, Site]),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
