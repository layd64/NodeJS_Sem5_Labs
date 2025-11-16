"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewResponseDto = exports.CreateReviewDto = void 0;
class CreateReviewDto {
    bookId;
    rating;
    comment;
}
exports.CreateReviewDto = CreateReviewDto;
class ReviewResponseDto {
    id;
    userId;
    bookId;
    rating;
    comment;
    createdAt;
    user;
    book;
}
exports.ReviewResponseDto = ReviewResponseDto;
//# sourceMappingURL=review.dto.js.map