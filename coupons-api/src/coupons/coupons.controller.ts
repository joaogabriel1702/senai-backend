import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  /**
   * Cria um cupom
   */
  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  /**
   * Lista todos os cupons
   */
  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  /**
   * Busca um cupom por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.findOne(id);
  }

  /**
   * Atualiza um cupom
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.couponsService.update(id, dto);
  }

  /**
   * Remove (soft delete) um cupom
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.remove(id);
  }

  /**
   * Valida se um cupom está ativo e disponível
   */
  @Get('validate/:code')
  validate(@Param('code') code: string) {
    return this.couponsService.validateCoupon(code);
  }
}
