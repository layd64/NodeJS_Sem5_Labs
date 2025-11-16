"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResponseDto = exports.CartItemResponseDto = exports.UpdateCartItemDto = exports.AddToCartDto = void 0;
class AddToCartDto {
    bookId;
    quantity;
}
exports.AddToCartDto = AddToCartDto;
class UpdateCartItemDto {
    quantity;
}
exports.UpdateCartItemDto = UpdateCartItemDto;
class CartItemResponseDto {
    bookId;
    quantity;
    book;
}
exports.CartItemResponseDto = CartItemResponseDto;
class CartResponseDto {
    items;
    total;
}
exports.CartResponseDto = CartResponseDto;
//# sourceMappingURL=cart.dto.js.map