import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductPaginationDto } from './dto/product-pagination.dto';
import { Like } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   * Cria um novo produto
   */
  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  /**
   * Lista todos os produtos
   */
  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  /**
   * Busca um produto pelo ID
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  /**
   * Atualiza um produto
   */
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  /**
   * Soft delete de um produto
   */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.softRemove(product);
  }

  /**
   * Busca de um produto
   */
  async findAll(query: ProductPaginationDto) {
  const {
    page = 1,
    limit = 10,
    search,
    minPrice,
    maxPrice,
    sortBy = 'created_at',
    sortOrder = 'ASC',
    onlyOutOfStock,
  } = query;

  const where: any = {};

  // 🔍 Busca textual
  if (search) {
    where.name = Like(`%${search}%`);
  }

  // 📦 Estoque zerado
  if (onlyOutOfStock === 'true') {
    where.stock = 0;
  }

  // 💰 Faixa de preço
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price['$gte'] = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price['$lte'] = maxPrice;
    }
  }

  const [data, total] = await this.productRepo.findAndCount({
    where,
    order: {
      [sortBy]: sortOrder.toUpperCase(),
    },
    take: limit,
    skip: (page - 1) * limit,
    withDeleted: false,
  });

  return {
    data,
    meta: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
}
