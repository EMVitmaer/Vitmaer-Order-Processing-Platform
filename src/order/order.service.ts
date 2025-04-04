import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/Order';

import { CreateOrderDto } from './dto/CreateOrderDto';
import { CreateOrdersDto } from './dto/CreateOrdersDto';
import { DeleteOrdersDto } from './dto/DeleteOrdersDto';
import { UpdateOrderDto } from './dto/UpdateOrderDto';
import { UpdateOrdersDto } from './dto/UpdateOrdersDto';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly repoOrder: Repository<Order>) {}

  async getOrderById(id: number) {
    const order = await this.repoOrder.findOne({ where: { id }});
    
    if (!order) throw new HttpException('Fail find of order by id', HttpStatus.BAD_REQUEST);

    return order;
  }

  async getAllOrders() {
    return this.repoOrder.find();
  }

  async createOrder(dto: CreateOrderDto) {
    const newOrder = this.repoOrder.create(dto);
    const createdOrder = await this.repoOrder.save(newOrder);
    
    if (!createdOrder) throw new HttpException('Fail create of order', HttpStatus.INTERNAL_SERVER_ERROR);

    return createdOrder;
  }

  async createManyOrders(dto: CreateOrdersDto) {
    const savedOrders: Order[] = [];

    for (const order of dto.orders) {
      try {
        const createdOrder = await this.createOrder(order);
        savedOrders.push(createdOrder);
      } catch (error) {
        console.log(error);
      }
    }

    return savedOrders;
  }

  async updateOrder(dto: UpdateOrderDto) {
    const { id, ...data } = dto;

    await this.getOrderById(id);

    const updateInfo = await this.repoOrder.update(id, data);

    if (updateInfo.affected === 0) throw new HttpException('Fail update of order', HttpStatus.INTERNAL_SERVER_ERROR);

    return await this.getOrderById(id);
  }

  async updateManyOrders(dto: UpdateOrdersDto) {
    const updatedOrders: (Order | {id: number, error: string})[] = [];
  
    for (const order of dto.orders) {
      try {
        const updateOrder = await this.updateOrder(order);
        updatedOrders.push(updateOrder);
      } catch (error) {
        updatedOrders.push({ 
          id: order.id,
          error: String(error),
        });
      }
    }

    return updatedOrders;
  }

  async deleteOrder(id: number) {
    await this.getOrderById(id);

    const deleteInfo = await this.repoOrder.delete(id);
    
    if (deleteInfo.affected === 0) throw new HttpException('Fail delete of order', HttpStatus.INTERNAL_SERVER_ERROR);

    return true;
  }

  async deleteManyOrders(dto: DeleteOrdersDto) {
    let someDeleted = false;
    
    for (const id of dto.ids) {
      try {
        await this.deleteOrder(id);
        someDeleted = true;
      } catch (error) {
        console.log(error);
      }
    }

    return someDeleted;
  }
}
