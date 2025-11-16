import { CartResponseDto } from '../common/dto/cart.dto';
import { PrismaService } from '../common/services/prisma.service';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<CartResponseDto>;
    addToCart(userId: string, bookId: string, quantity: number): Promise<CartResponseDto>;
    updateCartItem(userId: string, bookId: string, quantity: number): Promise<CartResponseDto>;
    removeFromCart(userId: string, bookId: string): Promise<CartResponseDto>;
    clearCart(userId: string): Promise<void>;
    private ensureCart;
    private getCartItemsDetailed;
    private calculateTotal;
}
