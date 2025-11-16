import { Book, BookFilters } from '../common/interfaces/book.interface';
import { PrismaService } from '../common/services/prisma.service';
export declare class BooksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: BookFilters): Promise<Book[]>;
    findOne(id: string): Promise<Book | undefined>;
    getGenres(): Promise<string[]>;
}
