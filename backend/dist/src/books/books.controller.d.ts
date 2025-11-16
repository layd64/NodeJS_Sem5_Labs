import { BookListResponseDto, BookQueryDto, BookResponseDto } from '../common/dto/book.dto';
import { ReviewResponseDto } from '../common/dto/review.dto';
import { UsersService } from '../users/users.service';
import { BooksService } from './books.service';
export declare class BooksController {
    private readonly booksService;
    private readonly usersService;
    constructor(booksService: BooksService, usersService: UsersService);
    findAll(query: BookQueryDto): Promise<BookListResponseDto>;
    getGenres(): Promise<{
        genres: string[];
    }>;
    getBookReviews(bookId: string): Promise<{
        reviews: ReviewResponseDto[];
        book?: BookResponseDto;
    }>;
    findOne(id: string): Promise<BookResponseDto>;
    private mapToDto;
}
