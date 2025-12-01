"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
describe('BooksController (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    let firstBookId;
    it('/api/books (GET)', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer()).get('/api/books').expect(200);
        expect(response.body).toHaveProperty('books');
        expect(response.body).toHaveProperty('total');
        expect(Array.isArray(response.body.books)).toBe(true);
        if (response.body.books.length > 0) {
            firstBookId = response.body.books[0].id;
        }
    });
    it('/api/books/genres (GET)', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer()).get('/api/books/genres').expect(200);
        expect(response.body).toHaveProperty('genres');
        expect(Array.isArray(response.body.genres)).toBe(true);
    });
    it('/api/books/:id (GET)', async () => {
        if (!firstBookId) {
            console.warn('No books found, skipping single book test');
            return;
        }
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get(`/api/books/${firstBookId}`)
            .expect(200);
        expect(response.body).toHaveProperty('id', firstBookId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('author');
    });
    it('/api/books/:id (GET) - Not Found', async () => {
        await (0, supertest_1.default)(app.getHttpServer()).get('/api/books/non-existent-id').expect(404);
    });
});
//# sourceMappingURL=books.e2e-spec.js.map