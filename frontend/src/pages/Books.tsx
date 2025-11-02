import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { booksApi, cartApi, usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    price: number;
}

const Books: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, isAuthenticated } = useAuth();

    // Filters state
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [genre, setGenre] = useState(searchParams.get('genre') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [searchParams]);

    const fetchGenres = async () => {
        try {
            const response = await booksApi.getGenres();
            setGenres(response.data.genres);
        } catch (err) {
            console.error('Failed to fetch genres', err);
        }
    };

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

    const handleFilter = () => {
        const params: any = {};
        if (search) params.search = search;
        if (genre) params.genre = genre;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        setSearchParams(params);
    };

    const addToCart = async (bookId: string) => {
        if (!isAuthenticated || !user) {
            alert('Будь ласка, увійдіть в систему');
            return;
        }
        try {
            await cartApi.addItem(user.id, bookId, 1);
            alert('Книжку додано до кошика!');
        } catch (err: any) {
            alert('Помилка: ' + (err.response?.data?.message || err.message));
        }
    };

    const addToSaved = async (bookId: string) => {
        if (!isAuthenticated || !user) {
            alert('Будь ласка, увійдіть в систему');
            return;
        }
        try {
            await usersApi.addSavedBook(user.id, bookId);
            alert('Книжку додано до збережених!');
        } catch (err: any) {
            alert('Помилка: ' + (err.response?.data?.message || err.message));
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
                                        <button onClick={() => addToCart(book.id)}>До кошика</button>
                                        <button onClick={() => addToSaved(book.id)}>Зберегти</button>
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
