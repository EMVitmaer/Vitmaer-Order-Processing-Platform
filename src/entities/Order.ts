import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// export type PaymentType = 'cash' | 'card' | 'transfer'
export enum PaymentType {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;
  
  @Column()
    price: number;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.CARD,
  })
    paymentType: PaymentType;
  
  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
