"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const books_service_1 = require("./books.service");
const prisma_service_1 = require("../common/services/prisma.service");
describe('BooksService', () => {
    let service;
    let prismaService;
    const mockPrismaService = {
        book: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                books_service_1.BooksService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(books_service_1.BooksService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll', () => {
        it('should return an array of books', async () => {
            const result = [{ id: '1', title: 'Test Book' }];
            mockPrismaService.book.findMany.mockResolvedValue(result);
            expect(await service.findAll()).toBe(result);
            expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: { title: 'asc' },
            });
        });
        it('should apply genre filter', async () => {
            const filters = { genre: 'Fiction' };
            const result = [{ id: '1', title: 'Test Book', genre: 'Fiction' }];
            mockPrismaService.book.findMany.mockResolvedValue(result);
            await service.findAll(filters);
            expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
                where: { genre: 'Fiction' },
                orderBy: { title: 'asc' },
            });
        });
        it('should apply search filter', async () => {
            const filters = { search: 'Test' };
            const result = [{ id: '1', title: 'Test Book' }];
            mockPrismaService.book.findMany.mockResolvedValue(result);
            await service.findAll(filters);
            expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { title: { contains: 'test', mode: 'insensitive' } },
                        { author: { contains: 'test', mode: 'insensitive' } },
                    ],
                },
                orderBy: { title: 'asc' },
            });
        });
        it('should apply price filter', async () => {
            const filters = { minPrice: 10, maxPrice: 20 };
            const result = [{ id: '1', title: 'Test Book', price: 15 }];
            mockPrismaService.book.findMany.mockResolvedValue(result);
            await service.findAll(filters);
            expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
                where: {
                    price: {
                        gte: 10,
                        lte: 20
                    }
                },
                orderBy: { title: 'asc' },
            });
        });
        it('should apply only minPrice filter', async () => {
            const filters = { minPrice: 10 };
            const result = [{ id: '1', title: 'Test Book', price: 15 }];
            mockPrismaService.book.findMany.mockResolvedValue(result);
            await service.findAll(filters);
            expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
                where: {
                    price: {
                        gte: 10,
                    }
                },
                orderBy: { title: 'asc' },
            });
        });
        it('should apply only maxPrice filter', async () => {
            const filters = { maxPrice: 20 };
            const result = [{ id: '1', title: 'Test Book', price: 15 }];
            mockPrismaService.book.findMany.mockResolvedValue(result);
            await service.findAll(filters);
            expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
                where: {
                    price: {
                        lte: 20,
                    }
                },
                orderBy: { title: 'asc' },
            });
        });
    });
    describe('findOne', () => {
        it('should return a book if found', async () => {
            const result = { id: '1', title: 'Test Book' };
            mockPrismaService.book.findUnique.mockResolvedValue(result);
            expect(await service.findOne('1')).toBe(result);
            expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
        });
        it('should return undefined if not found', async () => {
            mockPrismaService.book.findUnique.mockResolvedValue(null);
            expect(await service.findOne('1')).toBeUndefined();
        });
    });
    describe('getGenres', () => {
        it('should return an array of genres', async () => {
            const dbResult = [{ genre: 'Fiction' }, { genre: 'Non-Fiction' }];
            const expectedResult = ['Fiction', 'Non-Fiction'];
            mockPrismaService.book.findMany.mockResolvedValue(dbResult);
            expect(await service.getGenres()).toEqual(expectedResult);
            expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
                select: { genre: true },
                distinct: ['genre'],
                orderBy: { genre: 'asc' },
            });
        });
    });
});
//# sourceMappingURL=books.service.spec.js.map