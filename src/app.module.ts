import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get('ORDER_DB_NAME'),
        host: configService.get('ORDER_DB_HOST'),
        post: Number(configService.get('ORDER_DB_PORT')),
        username: configService.get('ORDER_DB_USER_NAME'),
        password: configService.get('ORDER_DB_USER_PASSWORD'),
        entities: [],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
