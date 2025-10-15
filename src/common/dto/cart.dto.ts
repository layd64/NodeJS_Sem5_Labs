export class AddToCartDto {
  bookId!: string;

  quantity!: number;
}

export class UpdateCartItemDto {
  quantity!: number;
}

export class CartItemResponseDto {
  bookId!: string;

  quantity!: number;

  book!: {
    id: string;
    title: string;
    author: string;
    price: number;
  };
}

export class CartResponseDto {
  items!: CartItemResponseDto[];

  total!: number;
}
