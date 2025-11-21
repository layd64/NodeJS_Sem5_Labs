import { Injectable } from '@nestjs/common';

import { Book, BookFilters } from '../common/interfaces/book.interface';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(filters?: BookFilters): Promise<Book[]> {
    const where: any = {};

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

  async findOne(id: string): Promise<Book | undefined> {
    const book = await this.prisma.book.findUnique({ where: { id } });
    return book || undefined;
  }

  async getGenres(): Promise<string[]> {
    const genres = await this.prisma.book.findMany({
      select: { genre: true },
      distinct: ['genre'],
      orderBy: { genre: 'asc' },
    });
    return genres.map((g: { genre: string }) => g.genre);
  }
}
