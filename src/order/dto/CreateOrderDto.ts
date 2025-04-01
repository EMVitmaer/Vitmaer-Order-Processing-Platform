import { Transform } from 'class-transformer';
import { 
  IsEnum, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString,  
} from 'class-validator';

import { PaymentType } from '../../entities/Order';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
    name: string;

  @IsNumber()
  @IsNotEmpty()
    price: number;
  
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => value ?? PaymentType.CARD)
  @IsOptional()
    paymentType: PaymentType;
}
