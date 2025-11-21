import { useState, useEffect } from 'react';
import { booksApi, usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Review {
    id: string;
    rating: number;
    comment: string;
    user: { name: string };
    createdAt: string;
}

export const useReviews = (bookId: string | undefined) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (bookId) {
            fetchReviews(bookId);
        }
    }, [bookId]);

    const fetchReviews = async (id: string) => {
        try {
            const response = await booksApi.getReviews(id);
            setReviews(response.data.reviews || []);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        }
    };

    const submitReview = async (rating: number, comment: string) => {
        if (!isAuthenticated || !user || !bookId) {
            throw new Error('Будь ласка, увійдіть в систему');
        }
        try {
            await usersApi.createReview(user.id, { bookId, rating, comment });
            await fetchReviews(bookId);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || 'Failed to submit review');
        }
    };

    return { reviews, loading, submitReview, refetch: () => bookId && fetchReviews(bookId) };
};

