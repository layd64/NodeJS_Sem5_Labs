import { Review } from '../common/interfaces/review.interface';

export const REVIEWS: Review[] = [
  {
    id: '1',
    userId: '1',
    bookId: '1',
    rating: 5,
    comment: 'Чудова книга! Дуже цікава історія.',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '2',
    userId: '1',
    bookId: '2',
    rating: 5,
    comment: 'Найкраща фентезі книга, яку я читав.',
    createdAt: new Date('2024-03-05'),
  },
  {
    id: '3',
    userId: '2',
    bookId: '3',
    rating: 4,
    comment: 'Дуже актуальна книга навіть сьогодні.',
    createdAt: new Date('2024-03-10'),
  },
];
