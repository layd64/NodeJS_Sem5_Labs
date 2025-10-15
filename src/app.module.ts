import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CartModule } from './cart/cart.module';
import { FileStorageModule } from './common/services/file-storage.module';
import { HomeModule } from './home/home.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [FileStorageModule, HomeModule, BooksModule, CartModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
