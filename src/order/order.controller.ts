import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  ParseIntPipe, 
  Patch, 
  Post, 
} from '@nestjs/common';

import { CreateOrderDto } from './dto/CreateOrderDto';
import { CreateOrdersDto } from './dto/CreateOrdersDto';
import { DeleteOrdersDto } from './dto/DeleteOrdersDto';
import { UpdateOrderDto } from './dto/UpdateOrderDto';
import { UpdateOrdersDto } from './dto/UpdateOrdersDto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly serviceOrder: OrderService) {}

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOrder.getOrderById(id);
  }
  
  @Get()
  getAll() {
    return this.serviceOrder.getAllOrders();
  }

  @Post()
  createOne(@Body() dto: CreateOrderDto) {
    return this.serviceOrder.createOrder(dto);
  }

  @Post('bulk')
  createMany(@Body() dto: CreateOrdersDto) {
    return this.serviceOrder.createManyOrders(dto);
  }

  @Patch()
  updateOne(@Body() dto: UpdateOrderDto) {
    return this.serviceOrder.updateOrder(dto);
  }

  @Patch('bulk')
  updateMany(@Body() dto: UpdateOrdersDto) {
    return this.serviceOrder.updateManyOrders(dto);
  }

  @Delete('bulk')
  deleteMany(@Body() dto: DeleteOrdersDto) {
    return this.serviceOrder.deleteManyOrders(dto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOrder.deleteOrder(id);
  }
}
