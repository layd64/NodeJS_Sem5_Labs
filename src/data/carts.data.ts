import { Cart } from '../common/interfaces/cart.interface';

export const CARTS: Cart[] = [
  {
    userId: '1',
    items: [
      { bookId: '1', quantity: 2 },
      { bookId: '3', quantity: 1 },
    ],
  },
  {
    userId: '2',
    items: [{ bookId: '4', quantity: 1 }],
  },
];
