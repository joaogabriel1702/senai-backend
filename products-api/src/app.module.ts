import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { DiscountsModule } from './discounts/discounts.module';
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    DiscountsModule,
  ],
})
export class AppModule {}
