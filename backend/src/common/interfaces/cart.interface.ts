export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}
