"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/common/services/prisma.service");
describe('AppController (e2e)', () => {
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
    it('should have PrismaService defined', () => {
        expect(prismaService).toBeDefined();
    });
    it('/api/books (GET) - should return 200 OK', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/api/books')
            .expect(200)
            .expect((res) => {
            expect(res.body).toHaveProperty('books');
            expect(Array.isArray(res.body.books)).toBe(true);
        });
    });
    it('should be able to query database directly', async () => {
        const result = await prismaService.$queryRaw `SELECT 1 as result`;
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]['result']).toBe(1);
    });
});
//# sourceMappingURL=app.e2e-spec.js.map