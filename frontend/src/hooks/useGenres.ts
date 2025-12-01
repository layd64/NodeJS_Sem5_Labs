import { useState, useEffect } from 'react';
import { booksApi } from '../services/api';

export const useGenres = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await booksApi.getGenres();
      setGenres(response.data.genres);
    } catch (err) {
      console.error('Failed to fetch genres', err);
      setError('Failed to fetch genres');
    } finally {
      setLoading(false);
    }
  };

  return { genres, loading, error, refetch: fetchGenres };
};
