import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BooksController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    let firstBookId: string;

    it('/api/books (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/books')
            .expect(200);

        expect(response.body).toHaveProperty('books');
        expect(response.body).toHaveProperty('total');
        expect(Array.isArray(response.body.books)).toBe(true);

        if (response.body.books.length > 0) {
            firstBookId = response.body.books[0].id;
        }
    });

    it('/api/books/genres (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/books/genres')
            .expect(200);

        expect(response.body).toHaveProperty('genres');
        expect(Array.isArray(response.body.genres)).toBe(true);
    });

    it('/api/books/:id (GET)', async () => {
        if (!firstBookId) {
            console.warn('No books found, skipping single book test');
            return;
        }

        const response = await request(app.getHttpServer())
            .get(`/api/books/${firstBookId}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', firstBookId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('author');
    });

    it('/api/books/:id (GET) - Not Found', async () => {
        await request(app.getHttpServer())
            .get('/api/books/non-existent-id')
            .expect(404);
    });
});
