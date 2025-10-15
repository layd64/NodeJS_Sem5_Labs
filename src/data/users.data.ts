import { User } from '../common/interfaces/user.interface';

export const USERS: User[] = [
  {
    id: '1',
    email: 'user1@example.com',
    password: 'password123',
    name: 'Іван Іванов',
    savedBooks: ['1', '2'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'user2@example.com',
    password: 'password456',
    name: 'Марія Петрова',
    savedBooks: ['3', '4', '5'],
    createdAt: new Date('2024-02-20'),
  },
];
