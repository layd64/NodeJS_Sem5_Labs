import { BookFilters } from '../interfaces/book.interface';
export declare class BookResponseDto {
    id: string;
    title: string;
    author: string;
    year: number;
    price: number;
    genre: string;
    description: string;
    isbn?: string | null;
}
export declare class BookListResponseDto {
    books: BookResponseDto[];
    total: number;
}
export declare class BookQueryDto implements BookFilters {
    genre?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}
