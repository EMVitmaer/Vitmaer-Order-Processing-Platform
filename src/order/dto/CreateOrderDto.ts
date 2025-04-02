import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ type: String, example: 'iPhone 13', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
    name: string;

  @ApiProperty({ type: Number, example: 100, description: 'Dollar price' })
  @IsNumber()
  @IsNotEmpty()
    price: number;
  
  @ApiProperty({
    example: PaymentType.CARD, 
    description: 'Payment method',
    enum: PaymentType, 
    required: false,
  })
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => value ?? PaymentType.CARD)
  @IsOptional()
    paymentType: PaymentType;
}
