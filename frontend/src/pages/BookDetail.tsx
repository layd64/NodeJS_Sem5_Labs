import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksApi, cartApi, usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    price: number;
    description?: string;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    user: { name: string };
    createdAt: string;
}

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, isAuthenticated } = useAuth();

    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (id) {
            fetchBook(id);
            fetchReviews(id);
        }
    }, [id]);

    const fetchBook = async (bookId: string) => {
        try {
            const response = await booksApi.getById(bookId);
            setBook(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch book');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (bookId: string) => {
        try {
            const response = await booksApi.getReviews(bookId);
            setReviews(response.data.reviews || []);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        }
    };

    const addToCart = async () => {
        if (!isAuthenticated || !user || !book) {
            alert('Будь ласка, увійдіть в систему');
            return;
        }
        try {
            await cartApi.addItem(user.id, book.id, 1);
            alert('Книжку додано до кошика!');
        } catch (err: any) {
            alert('Помилка: ' + (err.response?.data?.message || err.message));
        }
    };

    const addToSaved = async () => {
        if (!isAuthenticated || !user || !book) {
            alert('Будь ласка, увійдіть в систему');
            return;
        }
        try {
            await usersApi.addSavedBook(user.id, book.id);
            alert('Книжку додано до збережених!');
        } catch (err: any) {
            alert('Помилка: ' + (err.response?.data?.message || err.message));
        }
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !user || !id) return;

        try {
            await usersApi.createReview(user.id, { bookId: id, rating, comment });
            alert('Відгук додано!');
            setComment('');
            fetchReviews(id);
        } catch (err: any) {
            alert('Помилка: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="loading">Завантаження...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!book) return <div className="error">Книжку не знайдено</div>;

    return (
        <section id="book-detail">
            <h2>{book.title}</h2>
            <p><strong>Автор:</strong> {book.author}</p>
            <p><strong>Жанр:</strong> {book.genre}</p>
            <p><strong>Рік:</strong> {book.year}</p>
            <p className="book-price">{book.price} грн</p>
            {book.description && <p>{book.description}</p>}

            <div className="book-actions">
                {isAuthenticated ? (
                    <>
                        <button onClick={addToCart}>До кошика</button>
                        <button onClick={addToSaved}>Зберегти</button>
                    </>
                ) : (
                    <p><Link to="/login">Увійдіть</Link>, щоб купити або зберегти.</p>
                )}
            </div>

            <div id="reviews-section" style={{ marginTop: '2rem' }}>
                <h3>Відгуки</h3>
                <div id="reviews-container">
                    {reviews.length === 0 ? (
                        <p>Немає відгуків</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div className="review-rating">{'★'.repeat(review.rating)}</div>
                                <p>{review.comment}</p>
                                <div className="review-meta">
                                    {review.user.name} - {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isAuthenticated && (
                    <div id="add-review-form" style={{ marginTop: '2rem' }}>
                        <h3>Додати відгук</h3>
                        <form onSubmit={submitReview}>
                            <div className="form-group">
                                <label>Рейтинг (1-5):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Коментар:</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Додати відгук</button>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BookDetail;
