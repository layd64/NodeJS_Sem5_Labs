"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node/register");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
    {
        id: '6',
        title: 'Гобіт, або Туди і звідти',
        author: 'Дж. Р. Р. Толкін',
        year: 1937,
        price: 320,
        genre: 'Фантастика',
        description: 'Казкова повість про подорож гобіта Більбо Беггінса.',
        isbn: '978-966-7047-49-1',
    },
    {
        id: '7',
        title: 'Дюна',
        author: 'Френк Герберт',
        year: 1965,
        price: 550,
        genre: 'Наукова фантастика',
        description: 'Культовий науково-фантастичний роман про пустельну планету Арракіс.',
        isbn: '978-966-7047-50-7',
    },
    {
        id: '8',
        title: 'Пригоди Шерлока Холмса',
        author: 'Артур Конан Дойл',
        year: 1892,
        price: 300,
        genre: 'Детектив',
        description: 'Збірка оповідань про знаменитого детектива.',
        isbn: '978-966-7047-51-4',
    },
    {
        id: '9',
        title: 'Маленький принц',
        author: 'Антуан де Сент-Екзюпері',
        year: 1943,
        price: 200,
        genre: 'Дитяча література',
        description: 'Філософська казка про маленького хлопчика з іншої планети.',
        isbn: '978-966-7047-52-1',
    },
    {
        id: '10',
        title: 'Кобзар',
        author: 'Тарас Шевченко',
        year: 1840,
        price: 400,
        genre: 'Поезія',
        description: 'Збірка поетичних творів великого українського поета.',
        isbn: '978-966-7047-53-8',
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
    await prisma.userSavedBook.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.review.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
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
    for (const u of USERS) {
        await prisma.user.create({
            data: {
                id: u.id,
                email: u.email,
                password: u.password,
                name: u.name,
            },
        });
        for (const savedBookId of u.savedBooks) {
            await prisma.userSavedBook.create({
                data: {
                    userId: u.id,
                    bookId: savedBookId,
                },
            });
        }
    }
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
//# sourceMappingURL=seed.js.map