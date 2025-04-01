import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { CreateOrderDto } from './CreateOrderDto';

export class CreateOrdersDto {
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDto)
  @IsArray()
  @IsNotEmpty()
    orders: CreateOrderDto[];
}
