import { useState, useEffect } from 'react';
import { booksApi } from '../services/api';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  price: number;
  description?: string;
}

export const useBookDetail = (bookId: string | undefined) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookId) {
      fetchBook(bookId);
    } else {
      setLoading(false);
    }
  }, [bookId]);

  const fetchBook = async (id: string) => {
    try {
      const response = await booksApi.getById(id);
      setBook(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch book');
    } finally {
      setLoading(false);
    }
  };

  return { book, loading, error, refetch: () => bookId && fetchBook(bookId) };
};
