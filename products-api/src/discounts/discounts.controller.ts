import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { ApplyPercentDiscountDto } from './dto/apply-percent-discount.dto';

@Controller('products/:id/discount')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  /**
   * Aplica desconto percentual
   */
  @Post('percent')
  applyPercentDiscount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApplyPercentDiscountDto,
  ) {
    return this.discountsService.applyPercentDiscount(id, dto);
  }

  /**
   * Remove desconto
   */
  @Delete()
  removeDiscount(@Param('id', ParseIntPipe) id: number) {
    return this.discountsService.removeDiscount(id);
  }
}
