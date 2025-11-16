"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const expressApp = (0, express_1.default)();
    expressApp.use(express_1.default.urlencoded({ extended: true }));
    expressApp.use(express_1.default.json());
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:8080',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:3000',
        'http://localhost:5173',
    ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                console.log('CORS blocked origin:', origin);
                console.log('Allowed origins:', allowedOrigins);
                if (process.env.NODE_ENV !== 'production') {
                    callback(null, true);
                }
                else {
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
//# sourceMappingURL=main.js.map