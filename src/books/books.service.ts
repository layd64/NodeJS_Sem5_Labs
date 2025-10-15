import { Injectable, OnModuleInit } from '@nestjs/common';

import { Book, BookFilters } from '../common/interfaces/book.interface';
import { FileStorageService } from '../common/services/file-storage.service';
import { BOOKS, GENRES } from '../data/books.data';

@Injectable()
export class BooksService implements OnModuleInit {
  private books: Book[] = [];
  private readonly storageFilename = 'books.json';

  constructor(private readonly fileStorage: FileStorageService) {}

  async onModuleInit() {
    await this.loadBooks();
  }

  private async loadBooks(): Promise<void> {
    this.books = await this.fileStorage.readFile<Book[]>(this.storageFilename, [...BOOKS]);
  }

  private async saveBooks(): Promise<void> {
    await this.fileStorage.writeFile(this.storageFilename, this.books);
  }

  findAll(filters?: BookFilters): Book[] {
    let filteredBooks = [...this.books];

    if (filters?.genre) {
      filteredBooks = filteredBooks.filter((book) => book.genre === filters.genre);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower),
      );
    }

    if (filters?.minPrice !== undefined && filters.minPrice !== null) {
      const minPrice = filters.minPrice;
      filteredBooks = filteredBooks.filter((book) => book.price >= minPrice);
    }

    if (filters?.maxPrice !== undefined && filters.maxPrice !== null) {
      const maxPrice = filters.maxPrice;
      filteredBooks = filteredBooks.filter((book) => book.price <= maxPrice);
    }

    return filteredBooks;
  }

  findOne(id: string): Book | undefined {
    return this.books.find((book) => book.id === id);
  }

  getGenres(): string[] {
    const genres = Array.from(new Set(this.books.map((book) => book.genre)));
    return genres.length > 0 ? genres : GENRES;
  }
}
