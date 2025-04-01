import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { PaymentType } from '../../entities/Order';

export class UpdateOrderDto {
  @IsNumber()
  @IsNotEmpty()
    id: number;
  
  @IsString()
  @IsOptional()
    name: string;

  @IsNumber()
  @IsOptional()
    price: number;
  
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  @IsOptional()
    paymentType: PaymentType;
}
