"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/common/services/prisma.service");
describe('AuthController (e2e)', () => {
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
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
    };
    let authToken;
    let userId;
    it('/api/auth/register (POST)', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/api/auth/register')
            .send(testUser)
            .expect(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(testUser.email);
        expect(response.body.user.name).toBe(testUser.name);
        authToken = response.body.token;
        userId = response.body.user.id;
    });
    it('/api/auth/login (POST)', async () => {
        const loginDto = {
            email: testUser.email,
            password: testUser.password,
        };
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/api/auth/login')
            .send(loginDto)
            .expect(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe(testUser.email);
    });
    it('/api/auth/profile/:userId (GET)', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get(`/api/auth/profile/${userId}`)
            .expect(200);
        expect(response.body).toHaveProperty('id', userId);
        expect(response.body).toHaveProperty('email', testUser.email);
        expect(response.body).not.toHaveProperty('password');
    });
    afterAll(async () => {
        if (userId) {
            await prismaService.user.delete({
                where: { id: userId },
            });
        }
        await app.close();
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map