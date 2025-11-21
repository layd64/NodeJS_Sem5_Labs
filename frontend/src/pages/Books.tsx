import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../hooks/useBooks';
import { useGenres } from '../hooks/useGenres';
import { useCartActions } from '../hooks/useCartActions';

const Books: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();
    const { books, loading, error } = useBooks();
    const { genres } = useGenres();
    const { addToCart, addToSaved } = useCartActions();

    // Filters state
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [genre, setGenre] = useState(searchParams.get('genre') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const handleFilter = () => {
        const params: any = {};
        if (search) params.search = search;
        if (genre) params.genre = genre;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        setSearchParams(params);
    };

    const handleAddToCart = async (bookId: string) => {
        try {
            await addToCart(bookId);
            alert('Книжку додано до кошика!');
        } catch (err: any) {
            alert('Помилка: ' + (err.message || 'Не вдалося додати до кошика'));
        }
    };

    const handleAddToSaved = async (bookId: string) => {
        try {
            await addToSaved(bookId);
            alert('Книжку додано до збережених!');
        } catch (err: any) {
            alert('Помилка: ' + (err.message || 'Не вдалося додати до збережених'));
        }
    };

    return (
        <section>
            <h2>Каталог книжок</h2>
            <div className="filter-form">
                <div className="form-group">
                    <label>Пошук:</label>
                    <input
                        type="text"
                        placeholder="Назва або автор"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Жанр:</label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                        <option value="">Всі жанри</option>
                        {genres.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Мін. ціна:</label>
                    <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Макс. ціна:</label>
                    <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <button type="button" onClick={handleFilter}>Фільтрувати</button>
            </div>

            {loading ? (
                <div className="loading">Завантаження...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : books.length === 0 ? (
                <p>Книжок не знайдено</p>
            ) : (
                <div className="books-grid">
                    {books.map((book) => (
                        <div key={book.id} className="book-card">
                            <h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
                            <p><strong>Автор:</strong> {book.author}</p>
                            <p><strong>Жанр:</strong> {book.genre}</p>
                            <p><strong>Рік:</strong> {book.year}</p>
                            <p className="book-price">{book.price} грн</p>
                            <div className="book-actions">
                                <Link to={`/books/${book.id}`}><button>Деталі</button></Link>
                                {isAuthenticated && (
                                    <>
                                        <button onClick={() => handleAddToCart(book.id)}>До кошика</button>
                                        <button onClick={() => handleAddToSaved(book.id)}>Зберегти</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Books;
