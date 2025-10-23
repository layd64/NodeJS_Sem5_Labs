/* eslint-disable */
import 'ts-node/register';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seed data
const BOOKS = [
  {
    id: '1',
    title: 'Гаррі Поттер і філософський камінь',
    author: 'Дж. К. Роулінг',
    year: 1997,
    price: 350,
    genre: 'Фантастика',
    description: 'Перша книга про юного чарівника Гаррі Поттера.',
    isbn: '978-966-7047-44-6',
  },
  {
    id: '2',
    title: 'Володар перснів: Братство персня',
    author: 'Дж. Р. Р. Толкін',
    year: 1954,
    price: 450,
    genre: 'Фантастика',
    description: 'Епічна фентезі-сага про подорож до Мордору.',
    isbn: '978-966-7047-45-3',
  },
  {
    id: '3',
    title: '1984',
    author: 'Джордж Орвелл',
    year: 1949,
    price: 280,
    genre: 'Антиутопія',
    description: 'Класичний роман про тоталітарне суспільство.',
    isbn: '978-966-7047-46-0',
  },
  {
    id: '4',
    title: 'Війна і мир',
    author: 'Лев Толстой',
    year: 1869,
    price: 520,
    genre: 'Класика',
    description: 'Великий роман про Росію епохи Наполеонівських воєн.',
    isbn: '978-966-7047-47-7',
  },
  {
    id: '5',
    title: 'Преступление и наказание',
    author: 'Федір Достоєвський',
    year: 1866,
    price: 380,
    genre: 'Класика',
    description: 'Психологічний роман про моральні дилеми.',
    isbn: '978-966-7047-48-4',
  },
];

const USERS = [
  {
    id: 'user1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Адміністратор',
    savedBooks: ['1', '2'],
  },
  {
    id: 'user2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Тестовий Користувач',
    savedBooks: ['3'],
  },
];

const REVIEWS = [
  {
    id: 'review1',
    userId: 'user1',
    bookId: '1',
    rating: 5,
    comment: 'Чудова книга! Дуже рекомендую.',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'review2',
    userId: 'user2',
    bookId: '3',
    rating: 4,
    comment: 'Цікава антиутопія, але дещо похмура.',
    createdAt: new Date('2024-01-20'),
  },
];

const CARTS = [
  {
    userId: 'user1',
    items: [
      { bookId: '1', quantity: 2 },
      { bookId: '2', quantity: 1 },
    ],
  },
];

async function main() {
  // Clear existing data
  await prisma.userSavedBook.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Seed Books
  for (const b of BOOKS) {
    await prisma.book.create({
      data: {
        id: b.id,
        title: b.title,
        author: b.author,
        year: Math.floor(b.year),
        price: Math.floor(b.price),
        genre: b.genre,
        description: b.description,
        isbn: b.isbn ?? null,
      },
    });
  }

  // Seed Users
  for (const u of USERS) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        password: u.password,
        name: u.name,
      },
    });

    // Seed saved books
    for (const savedBookId of u.savedBooks) {
      await prisma.userSavedBook.create({
        data: {
          userId: u.id,
          bookId: savedBookId,
        },
      });
    }
  }

  // Seed Reviews
  for (const r of REVIEWS) {
    await prisma.review.create({
      data: {
        id: r.id,
        userId: r.userId,
        bookId: r.bookId,
        rating: Math.floor(r.rating),
        comment: r.comment,
        createdAt: r.createdAt,
      },
    });
  }

  // Seed Carts
  for (const c of CARTS) {
    await prisma.cart.create({
      data: {
        userId: c.userId,
      },
    });
    for (const item of c.items) {
      await prisma.cartItem.create({
        data: {
          cartId: c.userId,
          bookId: item.bookId,
          quantity: Math.floor(item.quantity),
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   - ${BOOKS.length} books`);
  console.log(`   - ${USERS.length} users`);
  console.log(`   - ${REVIEWS.length} reviews`);
  console.log(`   - ${CARTS.length} carts`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
