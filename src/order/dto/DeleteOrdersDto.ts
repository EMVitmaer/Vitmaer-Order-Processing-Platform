import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class DeleteOrdersDto {
  @IsInt({ each: true })
  @Type(() => Number)
  @IsArray()
  @IsNotEmpty()
    ids: number[];
}
