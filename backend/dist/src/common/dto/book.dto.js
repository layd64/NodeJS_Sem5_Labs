"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookQueryDto = exports.BookListResponseDto = exports.BookResponseDto = void 0;
class BookResponseDto {
    id;
    title;
    author;
    year;
    price;
    genre;
    description;
    isbn;
}
exports.BookResponseDto = BookResponseDto;
class BookListResponseDto {
    books;
    total;
}
exports.BookListResponseDto = BookListResponseDto;
class BookQueryDto {
    genre;
    search;
    minPrice;
    maxPrice;
    page;
    limit;
}
exports.BookQueryDto = BookQueryDto;
//# sourceMappingURL=book.dto.js.map