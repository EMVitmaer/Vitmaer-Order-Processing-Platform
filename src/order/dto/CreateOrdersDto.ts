import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { CreateOrderDto } from './CreateOrderDto';

export class CreateOrdersDto {
  @ApiProperty({ type: CreateOrderDto, description: 'Order list', isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDto)
  @IsArray()
  @IsNotEmpty()
    orders: CreateOrderDto[];
}
