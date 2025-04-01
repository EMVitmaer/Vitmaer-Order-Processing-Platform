import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/Order';
import { OrderModule } from './order/order.module';

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
        port: Number(configService.get('ORDER_DB_PORT')),
        username: configService.get('ORDER_DB_USER_NAME'),
        password: configService.get('ORDER_DB_USER_PASSWORD'),
        entities: [Order],
        migrations: [],
        synchronize: false,
      }),
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
