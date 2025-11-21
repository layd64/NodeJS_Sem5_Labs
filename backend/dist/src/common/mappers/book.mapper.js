"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMapper = void 0;
class BookMapper {
    static toDto(book) {
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            year: book.year,
            price: book.price,
            genre: book.genre,
            description: book.description,
            isbn: book.isbn,
        };
    }
    static toDtoList(books) {
        return books.map((book) => this.toDto(book));
    }
}
exports.BookMapper = BookMapper;
//# sourceMappingURL=book.mapper.js.map