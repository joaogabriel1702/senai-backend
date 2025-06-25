import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsModule } from './coupons/coupons.module';
import { Coupon } from './coupons/entities/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Coupon],
      synchronize: true,
    }),
    CouponsModule,
  ],
})
export class AppModule {}
