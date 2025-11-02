import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [UsersModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
