import { BookResponseDto } from '../dto/book.dto';
import { Book } from '../interfaces/book.interface';
export declare class BookMapper {
    static toDto(book: Book): BookResponseDto;
    static toDtoList(books: Book[]): BookResponseDto[];
}
