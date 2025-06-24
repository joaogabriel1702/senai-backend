import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { DiscountsModule } from './discounts/discounts.module';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Product],
      synchronize: true,
    }),
    ProductsModule,
    DiscountsModule,
  ],
})
export class AppModule {}
