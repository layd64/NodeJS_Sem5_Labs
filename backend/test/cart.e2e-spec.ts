import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { AddToCartDto, UpdateCartItemDto } from '../src/common/dto/cart.dto';
import { PrismaService } from '../src/common/services/prisma.service';

describe('CartController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    prismaService = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    email: `cart_test_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Cart Test User',
  };

  const testBook = {
    id: `book_${Date.now()}`,
    title: 'Test Book',
    author: 'Test Author',
    year: 2023,
    price: 100,
    genre: 'Test Genre',
    description: 'Test Description',
    isbn: `ISBN-${Date.now()}`,
  };

  let userId: string;

  beforeAll(async () => {
    // Create User
    const user = await prismaService.user.create({
      data: testUser,
    });
    userId = user.id;

    // Create Book
    await prismaService.book.create({
      data: testBook,
    });
  });

  afterAll(async () => {
    // Cleanup
    await prismaService.cart.deleteMany({ where: { userId } });
    await prismaService.user.delete({ where: { id: userId } });
    await prismaService.book.delete({ where: { id: testBook.id } });
  });

  it('/api/cart/:userId/items (POST)', async () => {
    const addToCartDto: AddToCartDto = {
      bookId: testBook.id,
      quantity: 1,
    };

    const response = await request(app.getHttpServer())
      .post(`/api/cart/${userId}/items`)
      .send(addToCartDto)
      .expect(200);

    expect(response.body).toHaveProperty('items');
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].bookId).toBe(testBook.id);
    expect(response.body.items[0].quantity).toBe(1);
  });

  it('/api/cart/:userId (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/api/cart/${userId}`).expect(200);

    expect(response.body).toHaveProperty('items');
    expect(response.body.items).toHaveLength(1);
    expect(response.body.total).toBeGreaterThan(0);
  });

  it('/api/cart/:userId/items/:bookId (PUT)', async () => {
    const updateCartItemDto: UpdateCartItemDto = {
      quantity: 2,
    };

    const response = await request(app.getHttpServer())
      .put(`/api/cart/${userId}/items/${testBook.id}`)
      .send(updateCartItemDto)
      .expect(200);

    expect(response.body.items[0].quantity).toBe(2);
  });

  it('/api/cart/:userId/items/:bookId (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/cart/${userId}/items/${testBook.id}`)
      .expect(200);

    expect(response.body.items).toHaveLength(0);
  });

  it('/api/cart/:userId (DELETE) - Clear Cart', async () => {
    // Add item first
    await request(app.getHttpServer())
      .post(`/api/cart/${userId}/items`)
      .send({ bookId: testBook.id, quantity: 1 });

    await request(app.getHttpServer()).delete(`/api/cart/${userId}`).expect(204);

    const response = await request(app.getHttpServer()).get(`/api/cart/${userId}`).expect(200);

    expect(response.body.items).toHaveLength(0);
  });
});
