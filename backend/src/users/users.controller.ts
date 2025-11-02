import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { BookResponseDto } from '../common/dto/book.dto';
import { CreateReviewDto, ReviewResponseDto } from '../common/dto/review.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId/saved-books')
  async getSavedBooks(@Param('userId') userId: string): Promise<{ books: BookResponseDto[] }> {
    try {
      const books = await this.usersService.getSavedBooks(userId);
      return { books };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'User not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post(':userId/saved-books/:bookId')
  @HttpCode(HttpStatus.CREATED)
  async addSavedBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<{ message: string; books: BookResponseDto[] }> {
    try {
      await this.usersService.addSavedBook(userId, bookId);
      const books = await this.usersService.getSavedBooks(userId);
      return { message: 'Book added to saved', books };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to add saved book',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':userId/saved-books/:bookId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSavedBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<void> {
    try {
      await this.usersService.removeSavedBook(userId, bookId);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to remove saved book',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':userId/reviews')
  async getReviews(@Param('userId') userId: string): Promise<{ reviews: ReviewResponseDto[] }> {
    try {
      const reviews = await this.usersService.getReviews(userId);
      return { reviews };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'User not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post(':userId/reviews')
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Param('userId') userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    try {
      return await this.usersService.createReview(userId, createReviewDto);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to create review',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
