import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';

import { BookResponseDto } from '../common/dto/book.dto';
import { CreateReviewDto, ReviewResponseDto } from '../common/dto/review.dto';
import { Review } from '../common/interfaces/review.interface';
import { User } from '../common/interfaces/user.interface';
import { PrismaService } from '../common/services/prisma.service';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) { }

  async getSavedBooks(userId: string): Promise<BookResponseDto[]> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const saved = await this.prisma.userSavedBook.findMany({
      where: { userId },
      include: { book: true },
    });

    return saved.map((s) => ({
      id: s.book.id,
      title: s.book.title,
      author: s.book.author,
      year: s.book.year,
      price: s.book.price,
      genre: s.book.genre,
      description: s.book.description,
      isbn: s.book.isbn ?? undefined,
    }));
  }

  async addSavedBook(userId: string, bookId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.userSavedBook.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: {},
      create: { userId, bookId },
    });
  }

  async removeSavedBook(userId: string, bookId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.userSavedBook.deleteMany({
      where: { userId, bookId },
    });
  }

  async getReviews(userId: string): Promise<ReviewResponseDto[]> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => ({
      id: r.id,
      userId: r.userId,
      bookId: r.bookId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      user: {
        id: user.id,
        name: user.name,
      },
      book: {
        title: r.book.title,
      },
    }));
  }

  async getBookReviews(bookId: string): Promise<ReviewResponseDto[]> {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const reviews = await this.prisma.review.findMany({
      where: { bookId },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      reviews.map(async (r) => {
        const user = await this.getUser(r.userId);
        return {
          id: r.id,
          userId: r.userId,
          bookId: r.bookId,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          user: user
            ? {
              id: user.id,
              name: user.name,
            }
            : undefined,
        };
      }),
    );
  }

  async createReview(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const book = await this.prisma.book.findUnique({ where: { id: createReviewDto.bookId } });
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
      throw new HttpException('Rating must be between 1 and 5', HttpStatus.BAD_REQUEST);
    }

    const r = await this.prisma.review.create({
      data: {
        userId,
        bookId: createReviewDto.bookId,
        rating: Math.floor(createReviewDto.rating),
        comment: createReviewDto.comment,
      },
    });

    return {
      id: r.id,
      userId: r.userId,
      bookId: r.bookId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  private async getUser(userId: string): Promise<User | undefined> {
    return await this.authService.getUserProfile(userId);
  }
}
