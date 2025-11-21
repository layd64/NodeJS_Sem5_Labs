"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/services/prisma.service");
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(registerDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.HttpException('User with this email already exists', common_1.HttpStatus.CONFLICT);
        }
        const newUser = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: registerDto.password,
                name: registerDto.name,
            },
        });
        return {
            token: this.generateToken(newUser.id),
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        };
    }
    async login(loginDto) {
        const user = await this.prisma.user.findFirst({
            where: { email: loginDto.email, password: loginDto.password },
        });
        if (!user) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        return {
            token: this.generateToken(user.id),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
    async getUserProfile(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return undefined;
        return {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            savedBooks: [],
            createdAt: user.createdAt,
        };
    }
    async getUserProfileWithoutPassword(userId) {
        const user = await this.getUserProfile(userId);
        if (!user)
            return undefined;
        const { password, ...profile } = user;
        return profile;
    }
    async updateUser(userId, updates) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                email: updates.email,
                password: updates.password,
                name: updates.name,
            },
        });
    }
    generateToken(userId) {
        return `token_${userId}_${Date.now()}`;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map