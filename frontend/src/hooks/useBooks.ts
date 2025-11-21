import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { booksApi } from '../services/api';

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    price: number;
}

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchBooks();
    }, [searchParams]);

    const fetchBooks = async () => {
        setLoading(true);
        setError('');
        try {
            const filters = {
                search: searchParams.get('search') || '',
                genre: searchParams.get('genre') || '',
                minPrice: searchParams.get('minPrice') || '',
                maxPrice: searchParams.get('maxPrice') || '',
            };
            const response = await booksApi.getAll(filters);
            setBooks(response.data.books || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    return { books, loading, error, refetch: fetchBooks };
};

