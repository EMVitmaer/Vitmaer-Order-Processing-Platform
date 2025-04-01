import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { UpdateOrderDto } from './UpdateOrderDto';

export class UpdateOrdersDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderDto)
  @IsArray()
  @IsNotEmpty()
    orders: UpdateOrderDto[];
}
