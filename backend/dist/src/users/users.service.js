"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const prisma_service_1 = require("../common/services/prisma.service");
let UsersService = class UsersService {
    authService;
    prisma;
    constructor(authService, prisma) {
        this.authService = authService;
        this.prisma = prisma;
    }
    async getSavedBooks(userId) {
        const user = await this.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const saved = await this.prisma.userSavedBook.findMany({
            where: { userId },
            include: { book: true },
        });
        return saved.map((s) => ({
            id: s.book.id,
            title: s.book.title,
            author: s.book.author,
            year: s.book.year,
            price: s.book.price,
            genre: s.book.genre,
            description: s.book.description,
            isbn: s.book.isbn ?? undefined,
        }));
    }
    async addSavedBook(userId, bookId) {
        const user = await this.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new common_1.HttpException('Book not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.userSavedBook.upsert({
            where: { userId_bookId: { userId, bookId } },
            update: {},
            create: { userId, bookId },
        });
    }
    async removeSavedBook(userId, bookId) {
        const user = await this.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.userSavedBook.deleteMany({
            where: { userId, bookId },
        });
    }
    async getReviews(userId) {
        const user = await this.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const reviews = await this.prisma.review.findMany({
            where: { userId },
            include: { book: true },
            orderBy: { createdAt: 'desc' },
        });
        return reviews.map((r) => ({
            id: r.id,
            userId: r.userId,
            bookId: r.bookId,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            user: {
                id: user.id,
                name: user.name,
            },
            book: {
                title: r.book.title,
            },
        }));
    }
    async getBookReviews(bookId) {
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new common_1.HttpException('Book not found', common_1.HttpStatus.NOT_FOUND);
        }
        const reviews = await this.prisma.review.findMany({
            where: { bookId },
            orderBy: { createdAt: 'desc' },
        });
        return Promise.all(reviews.map(async (r) => {
            const user = await this.getUser(r.userId);
            return {
                id: r.id,
                userId: r.userId,
                bookId: r.bookId,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
                user: user
                    ? {
                        id: user.id,
                        name: user.name,
                    }
                    : undefined,
            };
        }));
    }
    async createReview(userId, createReviewDto) {
        const user = await this.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const book = await this.prisma.book.findUnique({ where: { id: createReviewDto.bookId } });
        if (!book) {
            throw new common_1.HttpException('Book not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
            throw new common_1.HttpException('Rating must be between 1 and 5', common_1.HttpStatus.BAD_REQUEST);
        }
        const r = await this.prisma.review.create({
            data: {
                userId,
                bookId: createReviewDto.bookId,
                rating: Math.floor(createReviewDto.rating),
                comment: createReviewDto.comment,
            },
        });
        return {
            id: r.id,
            userId: r.userId,
            bookId: r.bookId,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            user: {
                id: user.id,
                name: user.name,
            },
        };
    }
    async getUser(userId) {
        return await this.authService.getUserProfile(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map