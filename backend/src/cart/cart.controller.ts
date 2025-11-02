import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { AddToCartDto, CartResponseDto, UpdateCartItemDto } from '../common/dto/cart.dto';

import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string): Promise<CartResponseDto> {
    return await this.cartService.getCart(userId);
  }

  @Post(':userId/items')
  @HttpCode(HttpStatus.OK)
  async addToCart(
    @Param('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    try {
      return await this.cartService.addToCart(userId, addToCartDto.bookId, addToCartDto.quantity);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to add item to cart',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':userId/items/:bookId')
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    try {
      await this.cartService.updateCartItem(userId, bookId, updateCartItemDto.quantity);
      return await this.cartService.getCart(userId);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to update cart item',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':userId/items/:bookId')
  @HttpCode(HttpStatus.OK)
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<CartResponseDto> {
    try {
      await this.cartService.removeFromCart(userId, bookId);
      return await this.cartService.getCart(userId);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to remove item from cart',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Param('userId') userId: string): Promise<void> {
    await this.cartService.clearCart(userId);
  }
}
