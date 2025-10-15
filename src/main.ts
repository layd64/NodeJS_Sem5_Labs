import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const expressApp = express();
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:8080',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        console.log('Allowed origins:', allowedOrigins);
        if (process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type'],
  });

  app.setGlobalPrefix('api');

  expressApp.get('/', (req, res) => {
    res.json({
      message: 'Book Store API',
      version: '1.0.0',
      endpoints: {
        home: '/api',
        books: '/api/books',
        genres: '/api/books/genres',
        auth: '/api/auth',
        cart: '/api/cart',
        users: '/api/users',
      },
    });
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend API is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`API endpoints available at: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
