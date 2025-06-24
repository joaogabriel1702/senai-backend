import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThanOrEqual, LessThanOrEqual, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductPaginationDto } from './dto/product-pagination.dto';

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
   * Lista produtos com filtros e paginação
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
      hasDiscount,
    } = query;

    const where: any = {};

    // Busca textual por nome
    if (search) {
      where.name = Like(`%${search}%`);
    }

    // Estoque zerado
    if (onlyOutOfStock === 'true') {
      where.stock = 0;
    }

    // Faixa de preço
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price = MoreThanOrEqual(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price = LessThanOrEqual(maxPrice);
      }
    }

    // Filtro por desconto ativo
    if (hasDiscount === 'true') {
      where.discountPercent = MoreThanOrEqual(1);
    }
    if (hasDiscount === 'false') {
      where.discountPercent = null;
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

    // Adicionar campo calculado priceWithDiscount
    const dataWithDiscount = data.map((product) => {
      const discount = (product as any).discountPercent;
      const priceWithDiscount = discount
        ? Number((product.price * (1 - discount / 100)).toFixed(2))
        : product.price;

      return {
        ...product,
        priceWithDiscount,
        discountPercent: discount || null,
      };
    });

    return {
      data: dataWithDiscount,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
}
