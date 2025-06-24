import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { CouponType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string; // Código do cupom (ex.: DESCONTO10)

  @IsEnum(CouponType)
  type: CouponType; // 'fixed' ou 'percent'

  @IsNumber()
  @Min(1)
  @Max(1000000)
  value: number; // Valor (em reais ou percentual)

  @IsBoolean()
  oneShot: boolean; // Se é uso único

  @IsDateString()
  validFrom: string; // Data início (ISO)

  @IsDateString()
  validUntil: string; // Data fim (ISO)
}
