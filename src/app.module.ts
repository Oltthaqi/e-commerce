import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from '../db/data-source';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { OrderLinesModule } from './order-lines/order-lines.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ShippingMethodModule } from './shipping_method/shipping_method.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(dataSourceOptions),
    UserModule,
    AuthModule,
    OrdersModule,
    OrderLinesModule,
    ProductsModule,
    CategoriesModule,
    RolesModule,
    PermissionsModule,
    ShippingMethodModule,
    AddressesModule,
  ],
})
export class AppModule {}