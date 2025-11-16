import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/services/prisma.service';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');

        // Get PrismaService to verify connection
        prismaService = app.get<PrismaService>(PrismaService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should have PrismaService defined', () => {
        expect(prismaService).toBeDefined();
    });

    it('/api/books (GET) - should return 200 OK', () => {
        return request(app.getHttpServer())
            .get('/api/books')
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('books');
                expect(Array.isArray(res.body.books)).toBe(true);
            });
    });

    it('should be able to query database directly', async () => {
        // Simple query to verify active connection
        const result = await prismaService.$queryRaw`SELECT 1 as result` as any[];
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]['result']).toBe(1);
    });
});
