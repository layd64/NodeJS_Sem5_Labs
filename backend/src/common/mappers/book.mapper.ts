import { BookResponseDto } from '../dto/book.dto';
import { Book } from '../interfaces/book.interface';

export class BookMapper {
  static toDto(book: Book): BookResponseDto {
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

  static toDtoList(books: Book[]): BookResponseDto[] {
    return books.map((book) => this.toDto(book));
  }
}
