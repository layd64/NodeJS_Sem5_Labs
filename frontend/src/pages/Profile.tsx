import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

const Profile: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { profile, savedBooks, reviews, loading, removeSavedBook } = useProfile();

    const handleRemoveSavedBook = async (bookId: string) => {
        try {
            await removeSavedBook(bookId);
        } catch (err: any) {
            alert('Помилка: ' + (err.message || 'Не вдалося видалити книгу'));
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
                                <button className="btn-danger" onClick={() => handleRemoveSavedBook(book.id)}>Видалити</button>
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
