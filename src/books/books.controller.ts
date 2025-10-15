import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';

import { BookListResponseDto, BookQueryDto, BookResponseDto } from '../common/dto/book.dto';
import { ReviewResponseDto } from '../common/dto/review.dto';
import { Book } from '../common/interfaces/book.interface';
import { UsersService } from '../users/users.service';

import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll(@Query() query: BookQueryDto): BookListResponseDto {
    const books = this.booksService.findAll(query);
    const booksDto = books.map((book) => this.mapToDto(book));
    
    return {
      books: booksDto,
      total: booksDto.length,
    };
  }

  @Get('genres')
  getGenres(): { genres: string[] } {
    const genres = this.booksService.getGenres();
    return { genres };
  }

  @Get(':id/reviews')
  async getBookReviews(@Param('id') bookId: string): Promise<{ reviews: ReviewResponseDto[]; book?: BookResponseDto }> {
    const reviews = await this.usersService.getBookReviews(bookId);
    const book = this.booksService.findOne(bookId);

    return {
      reviews,
      book: book ? this.mapToDto(book) : undefined,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): BookResponseDto {
    const book = this.booksService.findOne(id);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    return this.mapToDto(book);
  }

  private mapToDto(book: Book): BookResponseDto {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      price: book.price,
      genre: book.genre,
      description: book.description,
      isbn: book.isbn,
    };
  }
}
