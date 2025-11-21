import { Book } from '../interfaces/book.interface';
import { BookResponseDto } from '../dto/book.dto';
export declare class BookMapper {
    static toDto(book: Book): BookResponseDto;
    static toDtoList(books: Book[]): BookResponseDto[];
}
