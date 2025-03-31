import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default new DataSource({
  type: 'postgres',
  database: process.env['ORDER_DB_NAME'],
  host: process.env['ORDER_DB_HOST'],
  port: Number(process.env['ORDER_DB_PORT']),
  username: process.env['ORDER_DB_USER_NAME'],
  password: process.env['ORDER_DB_USER_PASSWORD'],
  entities: [path.join(__dirname, 'entities', '*.{ts, js}')],
  migrations: [path.join(__dirname, 'migrations', '*.{ts, js}')],
});
