import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { booksApi } from '../services/api';

const Genres: React.FC = () => {
    const [genres, setGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await booksApi.getGenres();
                setGenres(response.data.genres || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch genres');
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    return (
        <section>
            <h2>Жанри книжок</h2>
            {loading ? (
                <div className="loading">Завантаження...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : genres.length === 0 ? (
                <p>Жанрів не знайдено</p>
            ) : (
                <ul>
                    {genres.map((genre) => (
                        <li key={genre}>
                            <Link to={`/books?genre=${encodeURIComponent(genre)}`}>{genre}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default Genres;
