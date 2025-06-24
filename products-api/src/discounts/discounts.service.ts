import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ApplyPercentDiscountDto } from './dto/apply-percent-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   * Aplica um desconto percentual em um produto
   */
  async applyPercentDiscount(
    productId: number,
    dto: ApplyPercentDiscountDto,
  ) {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if ((product as any).discountPercent) {
      throw new ConflictException('Produto já possui desconto ativo');
    }

    (product as any).discountPercent = dto.percent;

    return {
      message: `Desconto de ${dto.percent}% aplicado no produto ${product.name}`,
    };
  }

  /**
   * Remove o desconto de um produto
   */
  async removeDiscount(productId: number) {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (!(product as any).discountPercent) {
      throw new BadRequestException('Produto não possui desconto ativo');
    }

    delete (product as any).discountPercent;

    return {
      message: `Desconto removido do produto ${product.name}`,
    };
  }
}
