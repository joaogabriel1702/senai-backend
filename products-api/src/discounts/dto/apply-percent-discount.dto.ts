import { IsNumber, Min, Max } from 'class-validator';

export class ApplyPercentDiscountDto {
  @IsNumber()
  @Min(1)
  @Max(80)
  percent: number;
}
