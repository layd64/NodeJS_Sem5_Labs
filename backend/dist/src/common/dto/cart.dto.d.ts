export declare class AddToCartDto {
    bookId: string;
    quantity: number;
}
export declare class UpdateCartItemDto {
    quantity: number;
}
export declare class CartItemResponseDto {
    bookId: string;
    quantity: number;
    book: {
        id: string;
        title: string;
        author: string;
        price: number;
    };
}
export declare class CartResponseDto {
    items: CartItemResponseDto[];
    total: number;
}
