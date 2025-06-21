import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/products/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: Repository<Product>;

  const mockProduct = {
    id: 1,
    name: 'Café Premium',
    description: 'Café especial',
    price: 29.9,
    stock: 100,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };
  
  const mockRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockProduct),
    find: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    softRemove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Service deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create() deve criar um produto', async () => {
    const dto = {
      name: 'Café Premium',
      description: 'Café especial',
      price: 29.9,
      stock: 100,
    };
    const result = await service.create(dto);
    expect(result).toEqual(mockProduct);
    expect(repo.save).toHaveBeenCalledWith(dto);
  });

  it('findAll() deve retornar lista de produtos', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockProduct]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('findOne() deve retornar um produto existente', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockProduct);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('findOne() deve lançar NotFoundException se não encontrar', async () => {
    repo.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('update() deve atualizar e retornar o produto', async () => {
    const dto = { price: 35.9 };
    const result = await service.update(1, dto);
    expect(result).toEqual(mockProduct);
    expect(repo.save).toHaveBeenCalled();
  });

  it('remove() deve soft delete do produto', async () => {
    const result = await service.remove(1);
    expect(result).toBeUndefined();
    expect(repo.softRemove).toHaveBeenCalled();
  });
});
