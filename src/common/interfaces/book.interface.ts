export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  price: number;
  genre: string;
  description: string;
  isbn?: string;
}

export interface BookFilters {
  genre?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}
