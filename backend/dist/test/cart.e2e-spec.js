"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/common/services/prisma.service");
describe('CartController (e2e)', () => {
    let app;
    let prismaService;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        prismaService = app.get(prisma_service_1.PrismaService);
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
    let userId;
    beforeAll(async () => {
        const user = await prismaService.user.create({
            data: testUser,
        });
        userId = user.id;
        await prismaService.book.create({
            data: testBook,
        });
    });
    afterAll(async () => {
        await prismaService.cart.deleteMany({ where: { userId } });
        await prismaService.user.delete({ where: { id: userId } });
        await prismaService.book.delete({ where: { id: testBook.id } });
    });
    it('/api/cart/:userId/items (POST)', async () => {
        const addToCartDto = {
            bookId: testBook.id,
            quantity: 1,
        };
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post(`/api/cart/${userId}/items`)
            .send(addToCartDto)
            .expect(200);
        expect(response.body).toHaveProperty('items');
        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].bookId).toBe(testBook.id);
        expect(response.body.items[0].quantity).toBe(1);
    });
    it('/api/cart/:userId (GET)', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get(`/api/cart/${userId}`)
            .expect(200);
        expect(response.body).toHaveProperty('items');
        expect(response.body.items).toHaveLength(1);
        expect(response.body.total).toBeGreaterThan(0);
    });
    it('/api/cart/:userId/items/:bookId (PUT)', async () => {
        const updateCartItemDto = {
            quantity: 2,
        };
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .put(`/api/cart/${userId}/items/${testBook.id}`)
            .send(updateCartItemDto)
            .expect(200);
        expect(response.body.items[0].quantity).toBe(2);
    });
    it('/api/cart/:userId/items/:bookId (DELETE)', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .delete(`/api/cart/${userId}/items/${testBook.id}`)
            .expect(200);
        expect(response.body.items).toHaveLength(0);
    });
    it('/api/cart/:userId (DELETE) - Clear Cart', async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .post(`/api/cart/${userId}/items`)
            .send({ bookId: testBook.id, quantity: 1 });
        await (0, supertest_1.default)(app.getHttpServer())
            .delete(`/api/cart/${userId}`)
            .expect(204);
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get(`/api/cart/${userId}`)
            .expect(200);
        expect(response.body.items).toHaveLength(0);
    });
});
//# sourceMappingURL=cart.e2e-spec.js.map