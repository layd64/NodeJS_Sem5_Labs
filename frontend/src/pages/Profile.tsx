import React, { useEffect, useState } from 'react';
import { usersApi, authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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

const Profile: React.FC = () => {
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
                usersApi.getReviews(user.id)
            ]);
            setProfile(profileRes.data);
            // API returns { books: [...] }
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
            fetchData(); // Refresh list
        } catch (err) {
            alert('Failed to remove book');
        }
    };

    if (!isAuthenticated) {
        return (
            <section>
                <h2>Профіль</h2>
                <p>Будь ласка, <Link to="/login">увійдіть</Link>, щоб переглянути профіль.</p>
            </section>
        );
    }

    if (loading) return <div className="loading">Завантаження...</div>;

    return (
        <>
            <section id="profile-section">
                <h2>Профіль користувача</h2>
                {profile && (
                    <div>
                        <p><strong>Ім'я:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                    </div>
                )}
            </section>

            <section id="saved-books-section">
                <h2>Збережені книги</h2>
                {savedBooks.length === 0 ? (
                    <p>Немає збережених книг</p>
                ) : (
                    <div className="books-grid">
                        {savedBooks.map((book) => (
                            <div key={book.id} className="book-card">
                                <h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
                                <p><strong>Автор:</strong> {book.author}</p>
                                <p className="book-price">{book.price} грн</p>
                                <button className="btn-danger" onClick={() => removeSavedBook(book.id)}>Видалити</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section id="reviews-section">
                <h2>Мої відгуки</h2>
                {reviews.length === 0 ? (
                    <p>Немає відгуків</p>
                ) : (
                    <div id="reviews-container">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <h4>Книга: {review.book.title}</h4>
                                <div className="review-rating">{'★'.repeat(review.rating)}</div>
                                <p>{review.comment}</p>
                                <div className="review-meta">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};

export default Profile;
