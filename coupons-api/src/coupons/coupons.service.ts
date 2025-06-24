import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Coupon, CouponType } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  /**
   * Cria um novo cupom
   */
  async create(dto: CreateCouponDto): Promise<Coupon> {
    const exists = await this.couponRepo.findOne({ where: { code: dto.code } });
    if (exists) {
      throw new ConflictException('Código de cupom já existente');
    }

    const coupon = this.couponRepo.create(dto);
    return this.couponRepo.save(coupon);
  }

  /**
   * Lista todos os cupons
   */
  async findAll(): Promise<Coupon[]> {
    return this.couponRepo.find();
  }

  /**
   * Busca um cupom por ID
   */
  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Cupom com ID ${id} não encontrado`);
    }
    return coupon;
  }

  /**
   * Busca um cupom pelo código
   */
  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({ where: { code } });
    if (!coupon) {
      throw new NotFoundException(`Cupom ${code} não encontrado`);
    }
    return coupon;
  }

  /**
   * Atualiza cupom
   */
  async update(id: number, dto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);
    Object.assign(coupon, dto);
    return this.couponRepo.save(coupon);
  }

  /**
   * Soft delete
   */
  async remove(id: number): Promise<void> {
    const coupon = await this.findOne(id);
    await this.couponRepo.softRemove(coupon);
  }

  /**
   * Valida se o cupom está disponível e dentro da validade
   */
  async validateCoupon(code: string): Promise<Coupon> {
    const coupon = await this.findByCode(code);

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new BadRequestException('Cupom fora do período de validade');
    }

    if (coupon.oneShot && coupon.usageCount > 0) {
      throw new BadRequestException('Cupom de uso único já foi utilizado');
    }

    return coupon;
  }

  /**
   * Incrementa contador de uso
   */
  async incrementUsage(id: number): Promise<void> {
    await this.couponRepo.increment({ id }, 'usageCount', 1);
  }
}
