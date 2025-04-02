import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class DeleteOrdersDto {
  @ApiProperty({
    type: Number,
    example: [2, 45, 23], 
    description: 'Deletion order id list', 
    isArray: true,
  })
  @IsInt({ each: true })
  @Type(() => Number)
  @IsArray()
  @IsNotEmpty()
    ids: number[];
}
