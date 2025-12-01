import { useState, useEffect } from 'react';
import { usersApi, authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  name: string;
}

interface SavedBook {
  id: string;
  title: string;
  author: string;
  price: number;
}

interface UserReview {
  id: string;
  rating: number;
  comment: string;
  book: {
    title: string;
  };
  createdAt: string;
}

export const useProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profileRes, savedRes, reviewsRes] = await Promise.all([
        authApi.getProfile(user.id),
        usersApi.getSavedBooks(user.id),
        usersApi.getReviews(user.id),
      ]);
      setProfile(profileRes.data);
      setSavedBooks((savedRes.data as any).books || []);
      setReviews(reviewsRes.data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch profile data', err);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedBook = async (bookId: string) => {
    if (!user) return;
    try {
      await usersApi.removeSavedBook(user.id, bookId);
      await fetchData();
    } catch (err) {
      throw new Error('Failed to remove book');
    }
  };

  return {
    profile,
    savedBooks,
    reviews,
    loading,
    removeSavedBook,
    refetch: fetchData,
  };
};
