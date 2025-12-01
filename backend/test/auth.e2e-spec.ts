import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { RegisterDto, LoginDto } from '../src/common/dto/auth.dto';
import { PrismaService } from '../src/common/services/prisma.service';

describe('AuthController (e2e)', () => {
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

  const testUser: RegisterDto = {
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User',
  };

  let authToken: string;
  let userId: string;

  it('/api/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
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
    const loginDto: LoginDto = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('/api/auth/profile/:userId (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/auth/profile/${userId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email', testUser.email);
    expect(response.body).not.toHaveProperty('password');
  });

  // Cleanup
  afterAll(async () => {
    if (userId) {
      await prismaService.user.delete({
        where: { id: userId },
      });
    }
    await app.close();
  });
});
