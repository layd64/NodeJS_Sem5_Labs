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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const review_dto_1 = require("../common/dto/review.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getSavedBooks(userId) {
        try {
            const books = await this.usersService.getSavedBooks(userId);
            return { books };
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error ? error.message : 'User not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async addSavedBook(userId, bookId) {
        try {
            await this.usersService.addSavedBook(userId, bookId);
            const books = await this.usersService.getSavedBooks(userId);
            return { message: 'Book added to saved', books };
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Failed to add saved book', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async removeSavedBook(userId, bookId) {
        try {
            await this.usersService.removeSavedBook(userId, bookId);
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Failed to remove saved book', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getReviews(userId) {
        try {
            const reviews = await this.usersService.getReviews(userId);
            return { reviews };
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error ? error.message : 'User not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async createReview(userId, createReviewDto) {
        try {
            return await this.usersService.createReview(userId, createReviewDto);
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error ? error.message : 'Failed to create review', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(':userId/saved-books'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getSavedBooks", null);
__decorate([
    (0, common_1.Post)(':userId/saved-books/:bookId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addSavedBook", null);
__decorate([
    (0, common_1.Delete)(':userId/saved-books/:bookId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeSavedBook", null);
__decorate([
    (0, common_1.Get)(':userId/reviews'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Post)(':userId/reviews'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createReview", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map