import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';

import { CartItemResponseDto, CartResponseDto } from '../common/dto/cart.dto';
import { Cart, CartItem } from '../common/interfaces/cart.interface';
import { FileStorageService } from '../common/services/file-storage.service';
import { BOOKS } from '../data/books.data';
import { CARTS } from '../data/carts.data';

@Injectable()
export class CartService implements OnModuleInit {
  private carts: Cart[] = [];
  private readonly storageFilename = 'carts.json';

  constructor(private readonly fileStorage: FileStorageService) {}

  async onModuleInit() {
    await this.loadCarts();
  }

  private async loadCarts(): Promise<void> {
    this.carts = await this.fileStorage.readFile<Cart[]>(this.storageFilename, [...CARTS]);
  }

  private async saveCarts(): Promise<void> {
    await this.fileStorage.writeFile(this.storageFilename, this.carts);
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    await this.loadCarts();
    const cart = this.findOrCreateCart(userId);
    const items = this.mapCartItemsToDetails(cart.items);

    return {
      items,
      total: this.calculateTotal(items),
    };
  }

  async addToCart(userId: string, bookId: string, quantity: number): Promise<CartResponseDto> {
    await this.loadCarts();
    
    const book = BOOKS.find((b) => b.id === bookId);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const cart = this.findOrCreateCart(userId);
    const existingItem = cart.items.find((item) => item.bookId === bookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ bookId, quantity });
    }

    await this.saveCarts();
    const items = this.mapCartItemsToDetails(cart.items);

    return {
      items,
      total: this.calculateTotal(items),
    };
  }

  async updateCartItem(userId: string, bookId: string, quantity: number): Promise<CartResponseDto> {
    await this.loadCarts();
    
    if (quantity <= 0) {
      throw new HttpException('Quantity must be greater than 0', HttpStatus.BAD_REQUEST);
    }

    const cart = this.findOrCreateCart(userId);
    const item = cart.items.find((i) => i.bookId === bookId);

    if (!item) {
      throw new HttpException('Item not found in cart', HttpStatus.NOT_FOUND);
    }

    item.quantity = quantity;
    await this.saveCarts();
    const items = this.mapCartItemsToDetails(cart.items);

    return {
      items,
      total: this.calculateTotal(items),
    };
  }

  async removeFromCart(userId: string, bookId: string): Promise<CartResponseDto> {
    await this.loadCarts();
    
    const cart = this.findOrCreateCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.bookId === bookId);

    if (itemIndex === -1) {
      throw new HttpException('Item not found in cart', HttpStatus.NOT_FOUND);
    }

    cart.items.splice(itemIndex, 1);
    await this.saveCarts();
    const items = this.mapCartItemsToDetails(cart.items);

    return {
      items,
      total: this.calculateTotal(items),
    };
  }

  async clearCart(userId: string): Promise<void> {
    await this.loadCarts();
    const cart = this.findOrCreateCart(userId);
    cart.items = [];
    await this.saveCarts();
  }

  private findOrCreateCart(userId: string): Cart {
    let cart = this.carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = { userId, items: [] };
      this.carts.push(cart);
    }
    return cart;
  }

  private mapCartItemsToDetails(items: CartItem[]): CartItemResponseDto[] {
    return items.map((item) => {
      const book = BOOKS.find((b) => b.id === item.bookId);
      if (!book) {
        throw new HttpException(`Book with id ${item.bookId} not found`, HttpStatus.NOT_FOUND);
      }

      return {
        bookId: item.bookId,
        quantity: item.quantity,
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
        },
      };
    });
  }

  private calculateTotal(items: CartItemResponseDto[]): number {
    return items.reduce((total, item) => total + item.book.price * item.quantity, 0);
  }
}
