import { BookFilters } from '../interfaces/book.interface';

export class BookResponseDto {
  id!: string;

  title!: string;

  author!: string;

  year!: number;

  price!: number;

  genre!: string;

  description!: string;

  isbn?: string;
}

export class BookListResponseDto {
  books!: BookResponseDto[];

  total!: number;
}

export class BookQueryDto implements BookFilters {
  genre?: string;

  search?: string;

  minPrice?: number;

  maxPrice?: number;
}
