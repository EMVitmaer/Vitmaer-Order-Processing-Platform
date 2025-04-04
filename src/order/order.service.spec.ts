/* eslint-disable @typescript-eslint/unbound-method */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, PaymentType } from '../entities/Order';

import { CreateOrderDto } from './dto/CreateOrderDto';
import { CreateOrdersDto } from './dto/CreateOrdersDto';
import { DeleteOrdersDto } from './dto/DeleteOrdersDto';
import { UpdateOrderDto } from './dto/UpdateOrderDto';
import { UpdateOrdersDto } from './dto/UpdateOrdersDto';
import { OrderService } from './order.service';

describe('OrderService: ', () => {
  const mockOrder = {
    id: 5,
    name: 'MacBook 15',
    price: 999,
    paymentType: PaymentType.CARD,
    createdAt: new Date('2025-04-01T08:58:17.123Z'),
    updatedAt: new Date('2025-04-02T12:45:14.049Z'),
  };
  const mockOrderCreateDto: CreateOrderDto = {
    name: 'MacBook 15',
    price: 999,
    paymentType: PaymentType.CARD,
  };
  const mockOrderUpdateDto: UpdateOrderDto = { 
    id: 5,
    price: 342,
  };
  let repoMethods;
  let service: OrderService;
  let repo: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    repoMethods = {
      findOne: jest.fn().mockResolvedValue(mockOrder),
      find: jest.fn().mockResolvedValue([mockOrder]),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      create: jest.fn().mockImplementation((dto) => ({ ...dto, id:42 })),
      save: jest.fn().mockResolvedValue(mockOrder),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          useValue: repoMethods,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repo = module.get(getRepositoryToken(Order));
  });

  it('should be defined module', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  describe('test getOrderById: ', () => {
    it('should return data by id', async () => {
      const result = await service.getOrderById(5);
      
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 5 }});
      expect(result).toEqual(mockOrder);
    });

    it('should return error for uncorrect id', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.getOrderById(234123))
        .rejects
        .toMatchObject({
          message: 'Fail find of order by id',
          status: HttpStatus.BAD_REQUEST,
        });
    });
  });

  describe('test getAllOrders: ', () => {
    it('should return data', async () => {
      const result = await service.getAllOrders();
    
      expect(repo.find).toHaveBeenCalledWith();
      expect(repo.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('test createOrder: ', () => {
    it('should create order', async () => {
      const createdOrder = {      
        ...mockOrderCreateDto,
        id: 5,
        createdAt: new Date('2025-04-01T08:58:17.123Z'),
        updatedAt: new Date('2025-04-01T08:58:17.123Z'), 
      } as Order;

      repo.create.mockImplementation((mockOrderCreateDto) => ({ 
        ...mockOrderCreateDto,
        id: 5,
        createdAt: new Date('2025-04-01T08:58:17.123Z'),
        updatedAt: new Date('2025-04-01T08:58:17.123Z'),
      } as Order));
      repo.save.mockResolvedValue(createdOrder);
      
      const result = await service.createOrder(mockOrderCreateDto);
      
      expect(repo.create).toHaveBeenCalledWith(mockOrderCreateDto);
      expect(repo.save).toHaveBeenCalledWith(createdOrder);
      expect(result).toEqual(createdOrder);
    });

    it('should return error if error by save', async () => {
      repo.save.mockRejectedValue(new HttpException('Fail create of order', HttpStatus.INTERNAL_SERVER_ERROR));
      await expect(service.createOrder(mockOrderCreateDto)).rejects.toThrow(HttpException);
    });

  });

  describe('test createManyOrders: ', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create many orders', async () => {
      const dto: CreateOrdersDto = {
        orders: [mockOrderCreateDto],
      };
      const createdOrder = {
        ...dto.orders[0],
        id: 5,
        createdAt: new Date('2025-04-01T08:58:17.123Z'),
        updatedAt: new Date('2025-04-02T12:45:14.049Z'),
      } as Order;
      const createOrderSpy = jest.spyOn(service, 'createOrder').mockResolvedValue(createdOrder);
      const result = await service.createManyOrders(dto);
      
      expect(createOrderSpy).toHaveBeenCalledTimes(dto.orders.length);
      expect(result).toEqual([createdOrder]);
    });

    it('should correct work if error by save new order', async () => {
      const dto: CreateOrdersDto = {
        orders: [mockOrderCreateDto],
      };
      const createOrderSpy = jest
        .spyOn(service, 'createOrder')
        .mockRejectedValue(new HttpException('Fail create of order', HttpStatus.INTERNAL_SERVER_ERROR));
      const consoleSpyOn = jest.spyOn(console, 'log').mockImplementation(() => {});
      const result = await service.createManyOrders(dto);
        
      expect(createOrderSpy).toHaveBeenCalledTimes(dto.orders.length);
      expect(consoleSpyOn).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  
  describe('test updateOrder: ', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    
    it('should update data', async () => {
      const { id, ...data } = mockOrderUpdateDto;
      const getOrderByIdSpy = jest.spyOn(service, 'getOrderById').mockResolvedValue(mockOrder);
      const result = await service.updateOrder(mockOrderUpdateDto);

      expect(getOrderByIdSpy).toHaveBeenCalledWith(id);
      expect(repo.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(mockOrder);
    });

    it('should return error when uncorrect id', async () => {
      const getOrderByIdSpy = jest
        .spyOn(service, 'getOrderById')
        .mockRejectedValue(new HttpException('Fail find of order by id', HttpStatus.BAD_REQUEST));

      await expect(service.updateOrder(mockOrderUpdateDto))
        .rejects
        .toThrow(HttpException);
      expect(getOrderByIdSpy).toHaveBeenCalled();
    });

    it('should return error if update fail', async () => {
      const { id, ...data } = mockOrderUpdateDto;
      const getOrderByIdSpy = jest.spyOn(service, 'getOrderById').mockResolvedValue(mockOrder);
      
      repo.update.mockResolvedValue({ raw: '', affected: 0, generatedMaps: [] });

      await expect(service.updateOrder(mockOrderUpdateDto))
        .rejects
        .toThrow(HttpException);
      expect(getOrderByIdSpy).toHaveBeenCalledWith(id);
      expect(repo.update).toHaveBeenCalledWith(id, data);
    });
  });

  describe('test updateManyOrders: ', () => {
    let dto: UpdateOrdersDto;

    beforeEach(() => {
      dto = {
        orders: [mockOrderUpdateDto],
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should update many order', async () => {
      const updateOrderSpy = jest.spyOn(service, 'updateOrder').mockResolvedValue(mockOrder);
      const result = await service.updateManyOrders(dto);

      expect(updateOrderSpy).toHaveBeenCalledTimes(dto.orders.length);
      expect(result).toEqual([mockOrder]);
    });

    it('should correct hanble error when update order', async () => {
      const updateOrderSpy = jest
        .spyOn(service, 'updateOrder')
        .mockRejectedValue(new HttpException('Fail update of order', HttpStatus.INTERNAL_SERVER_ERROR));
      const result = await service.updateManyOrders(dto);

      expect(updateOrderSpy).toHaveBeenCalledTimes(dto.orders.length);
      expect(result).toEqual([{
        id: 5,
        error: 'HttpException: Fail update of order',
      }]);
    });
  });

  describe('test deleteOrder: ', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should delete order by id', async () => {
      const getOrderByIdSpy = jest.spyOn(service, 'getOrderById').mockResolvedValue(mockOrder);
      const result = await service.deleteOrder(5);

      expect(getOrderByIdSpy).toHaveBeenCalledWith(5);
      expect(repo.delete).toHaveBeenCalledWith(5);
      expect(result).toBe(true);
    });

    it('should return error if uncorrect id', async () => {
      const getOrderByIdSpy = jest
        .spyOn(service, 'getOrderById')
        .mockRejectedValue(new HttpException('Fail find of order by id', HttpStatus.BAD_REQUEST));

      await expect(service.deleteOrder(5)).rejects.toThrow(HttpException);
      expect(getOrderByIdSpy).toHaveBeenCalledWith(5);
    });

    it('should return error when delete fail', async () => {
      const getOrderByIdSpy = jest.spyOn(service, 'getOrderById').mockResolvedValue(mockOrder);
      
      repo.delete.mockResolvedValue({ raw: '', affected: 0 });

      await expect(service.deleteOrder(5)).rejects.toThrow(HttpException);
      expect(getOrderByIdSpy).toHaveBeenCalledWith(5);
    });
  });

  describe('test deleteManyOrders: ', () => {
    let dto: DeleteOrdersDto;
    
    beforeEach(() => {
      dto = { ids: [5] };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should delete many orders', async () => {
      const deleteOrderSpy = jest.spyOn(service, 'deleteOrder').mockResolvedValue(true);
      const result = await service.deleteManyOrders(dto);
      
      expect(deleteOrderSpy).toHaveBeenCalledTimes(dto.ids.length);
      expect(result).toBe(true);
    });

    it('should correct handle when some orders not delete', async () => {
      const deleteOrderSpy = jest
        .spyOn(service, 'deleteOrder')
        .mockRejectedValue(new HttpException('Fail delete of order', HttpStatus.INTERNAL_SERVER_ERROR));
      const result = await service.deleteManyOrders(dto);
      
      expect(deleteOrderSpy).toHaveBeenCalledTimes(dto.ids.length);
      expect(result).toBe(false);
    });

    it('should handle multiple orders with mixed success and failure', async () => {
      const deleteOrderSpy = jest
        .spyOn(service, 'deleteOrder')
        .mockResolvedValueOnce(true)
        .mockRejectedValueOnce(new HttpException('Fail delete of order', HttpStatus.INTERNAL_SERVER_ERROR));
      const result = await service.deleteManyOrders({ ids: [2,5] });

      expect(deleteOrderSpy).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });
  });
});
