import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { UsersService } from '../users/users.service';
import { BookQueryDto } from '../common/dto/book.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BooksController', () => {
    let controller: BooksController;
    let booksService: BooksService;
    let usersService: UsersService;

    const mockBooksService = {
        findAll: jest.fn(),
        getGenres: jest.fn(),
        findOne: jest.fn(),
    };

    const mockUsersService = {
        getBookReviews: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [
                {
                    provide: BooksService,
                    useValue: mockBooksService,
                },
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<BooksController>(BooksController);
        booksService = module.get<BooksService>(BooksService);
        usersService = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a list of books', async () => {
            const query: BookQueryDto = { page: 1, limit: 10 };
            const result = [{ id: '1', title: 'Test Book', author: 'Author', year: 2021, price: 10, genre: 'Fiction', description: 'Desc', isbn: '123' }];
            mockBooksService.findAll.mockResolvedValue(result);

            const response = await controller.findAll(query);
            expect(response).toEqual({
                books: result,
                total: 1,
            });
            expect(mockBooksService.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('getGenres', () => {
        it('should return a list of genres', async () => {
            const genres = ['Fiction', 'Non-Fiction'];
            mockBooksService.getGenres.mockResolvedValue(genres);

            const response = await controller.getGenres();
            expect(response).toEqual({ genres });
            expect(mockBooksService.getGenres).toHaveBeenCalled();
        });
    });

    describe('getBookReviews', () => {
        it('should return reviews and book details', async () => {
            const bookId = '1';
            const reviews = [{ id: '1', content: 'Great book' }];
            const book = { id: '1', title: 'Test Book', author: 'Author', year: 2021, price: 10, genre: 'Fiction', description: 'Desc', isbn: '123' };

            mockUsersService.getBookReviews.mockResolvedValue(reviews);
            mockBooksService.findOne.mockResolvedValue(book);

            const response = await controller.getBookReviews(bookId);
            expect(response).toEqual({
                reviews,
                book,
            });
            expect(mockUsersService.getBookReviews).toHaveBeenCalledWith(bookId);
            expect(mockBooksService.findOne).toHaveBeenCalledWith(bookId);
        });

        it('should return reviews and undefined book if book not found', async () => {
            const bookId = '1';
            const reviews = [{ id: '1', content: 'Great book' }];

            mockUsersService.getBookReviews.mockResolvedValue(reviews);
            mockBooksService.findOne.mockResolvedValue(null);

            const response = await controller.getBookReviews(bookId);
            expect(response).toEqual({
                reviews,
                book: undefined,
            });
            expect(mockUsersService.getBookReviews).toHaveBeenCalledWith(bookId);
            expect(mockBooksService.findOne).toHaveBeenCalledWith(bookId);
        });
    });

    describe('findOne', () => {
        it('should return a book if found', async () => {
            const id = '1';
            const book = { id: '1', title: 'Test Book', author: 'Author', year: 2021, price: 10, genre: 'Fiction', description: 'Desc', isbn: '123' };
            mockBooksService.findOne.mockResolvedValue(book);

            const response = await controller.findOne(id);
            expect(response).toEqual(book);
            expect(mockBooksService.findOne).toHaveBeenCalledWith(id);
        });

        it('should throw HttpException if book not found', async () => {
            const id = '1';
            mockBooksService.findOne.mockResolvedValue(null);

            await expect(controller.findOne(id)).rejects.toThrow(
                new HttpException('Book not found', HttpStatus.NOT_FOUND),
            );
            expect(mockBooksService.findOne).toHaveBeenCalledWith(id);
        });
    });
});
