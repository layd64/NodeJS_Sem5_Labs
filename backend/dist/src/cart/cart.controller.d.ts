import { AddToCartDto, CartResponseDto, UpdateCartItemDto } from '../common/dto/cart.dto';
import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<CartResponseDto>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartResponseDto>;
    updateCartItem(userId: string, bookId: string, updateCartItemDto: UpdateCartItemDto): Promise<CartResponseDto>;
    removeFromCart(userId: string, bookId: string): Promise<CartResponseDto>;
    clearCart(userId: string): Promise<void>;
    checkout(userId: string): Promise<{
        message: string;
        total: number;
    }>;
}
