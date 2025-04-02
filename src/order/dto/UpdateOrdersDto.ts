import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { UpdateOrderDto } from './UpdateOrderDto';

export class UpdateOrdersDto {
  @ApiProperty({ type: UpdateOrderDto, description: 'Array of orders to be updated', isArray: true })
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderDto)
  @IsArray()
  @IsNotEmpty()
    orders: UpdateOrderDto[];
}
