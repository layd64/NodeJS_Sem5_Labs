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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/services/prisma.service");
let BooksService = class BooksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.genre) {
            where.genre = filters.genre;
        }
        if (filters?.search) {
            const search = filters.search.toLowerCase();
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined && filters.minPrice !== null) {
                where.price.gte = Math.floor(filters.minPrice);
            }
            if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
                where.price.lte = Math.floor(filters.maxPrice);
            }
        }
        const books = await this.prisma.book.findMany({
            where,
            orderBy: { title: 'asc' },
        });
        return books;
    }
    async findOne(id) {
        const book = await this.prisma.book.findUnique({ where: { id } });
        return book || undefined;
    }
    async getGenres() {
        const genres = await this.prisma.book.findMany({
            select: { genre: true },
            distinct: ['genre'],
            orderBy: { genre: 'asc' },
        });
        return genres.map((g) => g.genre);
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BooksService);
//# sourceMappingURL=books.service.js.map