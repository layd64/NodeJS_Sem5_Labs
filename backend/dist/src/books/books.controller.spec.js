"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const books_controller_1 = require("./books.controller");
const books_service_1 = require("./books.service");
const users_service_1 = require("../users/users.service");
const common_1 = require("@nestjs/common");
describe('BooksController', () => {
    let controller;
    let booksService;
    let usersService;
    const mockBooksService = {
        findAll: jest.fn(),
        getGenres: jest.fn(),
        findOne: jest.fn(),
    };
    const mockUsersService = {
        getBookReviews: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [books_controller_1.BooksController],
            providers: [
                {
                    provide: books_service_1.BooksService,
                    useValue: mockBooksService,
                },
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();
        controller = module.get(books_controller_1.BooksController);
        booksService = module.get(books_service_1.BooksService);
        usersService = module.get(users_service_1.UsersService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('findAll', () => {
        it('should return a list of books', async () => {
            const query = { page: 1, limit: 10 };
            const result = [
                {
                    id: '1',
                    title: 'Test Book',
                    author: 'Author',
                    year: 2021,
                    price: 10,
                    genre: 'Fiction',
                    description: 'Desc',
                    isbn: '123',
                },
            ];
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
            const book = {
                id: '1',
                title: 'Test Book',
                author: 'Author',
                year: 2021,
                price: 10,
                genre: 'Fiction',
                description: 'Desc',
                isbn: '123',
            };
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
            const book = {
                id: '1',
                title: 'Test Book',
                author: 'Author',
                year: 2021,
                price: 10,
                genre: 'Fiction',
                description: 'Desc',
                isbn: '123',
            };
            mockBooksService.findOne.mockResolvedValue(book);
            const response = await controller.findOne(id);
            expect(response).toEqual(book);
            expect(mockBooksService.findOne).toHaveBeenCalledWith(id);
        });
        it('should throw HttpException if book not found', async () => {
            const id = '1';
            mockBooksService.findOne.mockResolvedValue(null);
            await expect(controller.findOne(id)).rejects.toThrow(new common_1.HttpException('Book not found', common_1.HttpStatus.NOT_FOUND));
            expect(mockBooksService.findOne).toHaveBeenCalledWith(id);
        });
    });
});
//# sourceMappingURL=books.controller.spec.js.map