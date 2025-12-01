import { AuthService } from '../auth/auth.service';
import { BookResponseDto } from '../common/dto/book.dto';
import { CreateReviewDto, ReviewResponseDto } from '../common/dto/review.dto';
import { PrismaService } from '../common/services/prisma.service';
export declare class UsersService {
    private readonly authService;
    private readonly prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    getSavedBooks(userId: string): Promise<BookResponseDto[]>;
    addSavedBook(userId: string, bookId: string): Promise<void>;
    removeSavedBook(userId: string, bookId: string): Promise<void>;
    getReviews(userId: string): Promise<ReviewResponseDto[]>;
    getBookReviews(bookId: string): Promise<ReviewResponseDto[]>;
    createReview(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto>;
    private getUser;
}
