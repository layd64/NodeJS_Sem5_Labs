import { HttpException, HttpStatus, Injectable, Inject, forwardRef, OnModuleInit } from '@nestjs/common';

import { BookResponseDto } from '../common/dto/book.dto';
import { CreateReviewDto, ReviewResponseDto } from '../common/dto/review.dto';
import { Review } from '../common/interfaces/review.interface';
import { User } from '../common/interfaces/user.interface';
import { FileStorageService } from '../common/services/file-storage.service';
import { BOOKS } from '../data/books.data';
import { REVIEWS } from '../data/reviews.data';
import { USERS } from '../data/users.data';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService implements OnModuleInit {
  private users: User[] = [];
  private reviews: Review[] = [];
  private readonly reviewsStorageFilename = 'reviews.json';

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly fileStorage: FileStorageService,
  ) {}

  async onModuleInit() {
    await this.loadReviews();
  }

  private async loadReviews(): Promise<void> {
    this.reviews = await this.fileStorage.readFile<Review[]>(this.reviewsStorageFilename, [...REVIEWS]);
  }

  private async saveReviews(): Promise<void> {
    await this.fileStorage.writeFile(this.reviewsStorageFilename, this.reviews);
  }

  async getSavedBooks(userId: string): Promise<BookResponseDto[]> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.savedBooks
      .map((bookId) => BOOKS.find((book) => book.id === bookId))
      .filter((book): book is (typeof BOOKS)[0] => book !== undefined)
      .map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        price: book.price,
        genre: book.genre,
        description: book.description,
        isbn: book.isbn,
      }));
  }

  async addSavedBook(userId: string, bookId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const book = BOOKS.find((b) => b.id === bookId);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    if (!user.savedBooks.includes(bookId)) {
      user.savedBooks.push(bookId);
      await this.authService.updateUser(userId, { savedBooks: user.savedBooks });
    }
  }

  async removeSavedBook(userId: string, bookId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const bookIndex = user.savedBooks.indexOf(bookId);
    if (bookIndex !== -1) {
      user.savedBooks.splice(bookIndex, 1);
      await this.authService.updateUser(userId, { savedBooks: user.savedBooks });
    }
  }

  async getReviews(userId: string): Promise<ReviewResponseDto[]> {
    await this.loadReviews();
    const userReviews = this.reviews.filter((review) => review.userId === userId);
    const user = await this.getUser(userId);

    return userReviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      bookId: review.bookId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: user
        ? {
            id: user.id,
            name: user.name,
          }
        : undefined,
    }));
  }

  async getBookReviews(bookId: string): Promise<ReviewResponseDto[]> {
    await this.loadReviews();
    const bookReviews = this.reviews.filter((review) => review.bookId === bookId);

    return Promise.all(
      bookReviews.map(async (review) => {
        const user = await this.getUser(review.userId);

        return {
          id: review.id,
          userId: review.userId,
          bookId: review.bookId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
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
    await this.loadReviews();
    
    const user = await this.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const book = BOOKS.find((b) => b.id === createReviewDto.bookId);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
      throw new HttpException('Rating must be between 1 and 5', HttpStatus.BAD_REQUEST);
    }

    const newReview: Review = {
      id: String(this.reviews.length + 1),
      userId,
      bookId: createReviewDto.bookId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      createdAt: new Date(),
    };

    this.reviews.push(newReview);
    await this.saveReviews();

    return {
      id: newReview.id,
      userId: newReview.userId,
      bookId: newReview.bookId,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.createdAt,
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
