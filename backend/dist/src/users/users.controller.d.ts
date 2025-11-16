import { BookResponseDto } from '../common/dto/book.dto';
import { CreateReviewDto, ReviewResponseDto } from '../common/dto/review.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getSavedBooks(userId: string): Promise<{
        books: BookResponseDto[];
    }>;
    addSavedBook(userId: string, bookId: string): Promise<{
        message: string;
        books: BookResponseDto[];
    }>;
    removeSavedBook(userId: string, bookId: string): Promise<void>;
    getReviews(userId: string): Promise<{
        reviews: ReviewResponseDto[];
    }>;
    createReview(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto>;
}
