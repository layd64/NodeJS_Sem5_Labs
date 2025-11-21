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
import { BookMapper } from '../common/mappers/book.mapper';
import { UsersService } from '../users/users.service';

import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll(@Query() query: BookQueryDto): Promise<BookListResponseDto> {
    const books = await this.booksService.findAll(query);
    const booksDto = BookMapper.toDtoList(books);
    
    return {
      books: booksDto,
      total: booksDto.length,
    };
  }

  @Get('genres')
  async getGenres(): Promise<{ genres: string[] }> {
    const genres = await this.booksService.getGenres();
    return { genres };
  }

  @Get(':id/reviews')
  async getBookReviews(@Param('id') bookId: string): Promise<{ reviews: ReviewResponseDto[]; book?: BookResponseDto }> {
    const reviews = await this.usersService.getBookReviews(bookId);
    const book = await this.booksService.findOne(bookId);

    return {
      reviews,
      book: book ? BookMapper.toDto(book) : undefined,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookResponseDto> {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    return BookMapper.toDto(book);
  }
}
