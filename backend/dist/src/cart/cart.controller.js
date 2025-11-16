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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_dto_1 = require("../common/dto/cart.dto");
const cart_service_1 = require("./cart.service");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(userId) {
        return await this.cartService.getCart(userId);
    }
    async addToCart(userId, addToCartDto) {
        try {
            return await this.cartService.addToCart(userId, addToCartDto.bookId, addToCartDto.quantity);
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Failed to add item to cart', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async updateCartItem(userId, bookId, updateCartItemDto) {
        try {
            await this.cartService.updateCartItem(userId, bookId, updateCartItemDto.quantity);
            return await this.cartService.getCart(userId);
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Failed to update cart item', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeFromCart(userId, bookId) {
        try {
            await this.cartService.removeFromCart(userId, bookId);
            return await this.cartService.getCart(userId);
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Failed to remove item from cart', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async clearCart(userId) {
        await this.cartService.clearCart(userId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(':userId/items'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cart_dto_1.AddToCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Put)(':userId/items/:bookId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('bookId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, cart_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)(':userId/items/:bookId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeFromCart", null);
__decorate([
    (0, common_1.Delete)(':userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map