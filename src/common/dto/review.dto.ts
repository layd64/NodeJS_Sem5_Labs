export class CreateReviewDto {
  bookId!: string;

  rating!: number;

  comment!: string;
}

export class ReviewResponseDto {
  id!: string;

  userId!: string;

  bookId!: string;

  rating!: number;

  comment!: string;

  createdAt!: Date;

  user?: {
    id: string;
    name: string;
  };
}
