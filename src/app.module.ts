import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AdminSeeder } from './database/seeds/admin.seed';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { OdooModule } from './odoo/odoo.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AddressModule } from './addresses/addresses.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ColorsModule } from './colors/colors.module';
import { SizesModule } from './sizes/sizes.module';
import { UploadModule } from './upload/upload.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    MailModule,
    UsersModule,
    OdooModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    WishlistModule,
    AddressModule,
    OrdersModule,
    ReviewsModule,
    ColorsModule,
    SizesModule,
    UploadModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [AdminSeeder],
})
export class AppModule { }
