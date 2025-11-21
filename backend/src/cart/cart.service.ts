import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CartItemResponseDto, CartResponseDto } from '../common/dto/cart.dto';
import { CartItem } from '../common/interfaces/cart.interface';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string): Promise<CartResponseDto> {
    await this.ensureCart(userId);
    const items = await this.getCartItemsDetailed(userId);

    return {
      items,
      total: this.calculateTotal(items),
    };
  }

  async addToCart(userId: string, bookId: string, quantity: number): Promise<CartResponseDto> {
    await this.ensureCart(userId);

    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.cartItem.upsert({
      where: { cartId_bookId: { cartId: userId, bookId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: userId, bookId, quantity },
    });

    const items = await this.getCartItemsDetailed(userId);

    return {
      items,
      total: this.calculateTotal(items),
    };
  }

  async updateCartItem(userId: string, bookId: string, quantity: number): Promise<CartResponseDto> {
    if (quantity <= 0) {
      throw new HttpException('Quantity must be greater than 0', HttpStatus.BAD_REQUEST);
    }

    await this.ensureCart(userId);

    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_bookId: { cartId: userId, bookId } },
    });
    if (!existing) {
      throw new HttpException('Item not found in cart', HttpStatus.NOT_FOUND);
    }

    await this.prisma.cartItem.update({
      where: { cartId_bookId: { cartId: userId, bookId } },
      data: { quantity },
    });

    const items = await this.getCartItemsDetailed(userId);

    return {
      items,
      total: this.calculateTotal(items),
    };
  }

  async removeFromCart(userId: string, bookId: string): Promise<CartResponseDto> {
    await this.ensureCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: userId, bookId },
    });

    const items = await this.getCartItemsDetailed(userId);

    return {
      items,
      total: this.calculateTotal(items),
    };
  }

  async clearCart(userId: string): Promise<void> {
    await this.ensureCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: userId } });
  }

  async checkout(userId: string): Promise<{ message: string; total: number }> {
    await this.ensureCart(userId);
    const items = await this.getCartItemsDetailed(userId);
    
    if (items.length === 0) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    const total = this.calculateTotal(items);
    
    // Clear the cart after checkout
    await this.prisma.cartItem.deleteMany({ where: { cartId: userId } });
    
    return {
      message: 'Order placed successfully',
      total,
    };
  }

  private async ensureCart(userId: string): Promise<void> {
    await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  private async getCartItemsDetailed(userId: string): Promise<CartItemResponseDto[]> {
    const rows = await this.prisma.cartItem.findMany({
      where: { cartId: userId },
      include: { book: true },
    });

    return rows.map((row: { bookId: string; quantity: number; book: { id: string; title: string; author: string; price: number } }) => ({
      bookId: row.bookId,
      quantity: row.quantity,
      book: {
        id: row.book.id,
        title: row.book.title,
        author: row.book.author,
        price: row.book.price,
      },
    }));
  }

  private calculateTotal(items: CartItemResponseDto[]): number {
    return items.reduce((total, item) => total + item.book.price * item.quantity, 0);
  }
}
