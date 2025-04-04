import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { PaymentType } from '../../entities/Order';

export class UpdateOrderDto {
  @ApiProperty({ type: Number, example: 5, description: 'Order ID to be updated' })
  @IsNumber()
  @IsNotEmpty()
    id: number;
  
  @ApiProperty({ 
    type: String, 
    example: 'MacBook 15', 
    description: 'Product name',
    required: false,
  })
  @IsString()
  @IsOptional()
    name?: string;

  @ApiProperty({ 
    type: Number, 
    example: 999, 
    description: 'Dollar price', 
    required: false, 
  })
  @IsNumber()
  @IsOptional()
    price?: number;
  
  @ApiProperty({
    enum: PaymentType, 
    example: PaymentType.CARD, 
    description: 'Payment method',
    required: false,
  })
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  @IsOptional()
    paymentType?: PaymentType;
}
