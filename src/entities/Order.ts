import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PaymentType = 'cash' | 'card' | 'transfer'

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
    enum: ['cash', 'card', 'transfer'],
    default: 'card',
  })
    paymentType: PaymentType;
  
  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
