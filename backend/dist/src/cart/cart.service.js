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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/services/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        await this.ensureCart(userId);
        const items = await this.getCartItemsDetailed(userId);
        return {
            items,
            total: this.calculateTotal(items),
        };
    }
    async addToCart(userId, bookId, quantity) {
        await this.ensureCart(userId);
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new common_1.HttpException('Book not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.cartItem.upsert({
            where: { cartId_bookId: { cartId: userId, bookId } },
            update: { quantity: { increment: quantity } },
            create: { cartId: userId, bookId, quantity },
        });
        const items = await this.getCartItemsDetailed(userId);
        return {
            items,
            total: this.calculateTotal(items),
        };
    }
    async updateCartItem(userId, bookId, quantity) {
        if (quantity <= 0) {
            throw new common_1.HttpException('Quantity must be greater than 0', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.ensureCart(userId);
        const existing = await this.prisma.cartItem.findUnique({
            where: { cartId_bookId: { cartId: userId, bookId } },
        });
        if (!existing) {
            throw new common_1.HttpException('Item not found in cart', common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.cartItem.update({
            where: { cartId_bookId: { cartId: userId, bookId } },
            data: { quantity },
        });
        const items = await this.getCartItemsDetailed(userId);
        return {
            items,
            total: this.calculateTotal(items),
        };
    }
    async removeFromCart(userId, bookId) {
        await this.ensureCart(userId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: userId, bookId },
        });
        const items = await this.getCartItemsDetailed(userId);
        return {
            items,
            total: this.calculateTotal(items),
        };
    }
    async clearCart(userId) {
        await this.ensureCart(userId);
        await this.prisma.cartItem.deleteMany({ where: { cartId: userId } });
    }
    async ensureCart(userId) {
        await this.prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });
    }
    async getCartItemsDetailed(userId) {
        const rows = await this.prisma.cartItem.findMany({
            where: { cartId: userId },
            include: { book: true },
        });
        return rows.map((row) => ({
            bookId: row.bookId,
            quantity: row.quantity,
            book: {
                id: row.book.id,
                title: row.book.title,
                author: row.book.author,
                price: row.book.price,
            },
        }));
    }
    calculateTotal(items) {
        return items.reduce((total, item) => total + item.book.price * item.quantity, 0);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map