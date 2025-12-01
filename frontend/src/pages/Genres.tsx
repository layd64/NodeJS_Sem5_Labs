import React from 'react';
import { Link } from 'react-router-dom';
import { useGenres } from '../hooks/useGenres';

const Genres: React.FC = () => {
  const { genres, loading, error } = useGenres();

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
