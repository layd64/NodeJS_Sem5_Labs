import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookDetail } from '../hooks/useBookDetail';
import { useReviews } from '../hooks/useReviews';
import { useCartActions } from '../hooks/useCartActions';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { book, loading, error } = useBookDetail(id);
  const { reviews, submitReview } = useReviews(id);
  const { addToCart, addToSaved } = useCartActions();
  const { isAuthenticated } = useAuth();

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleAddToCart = async () => {
    if (!book) return;
    try {
      await addToCart(book.id);
      alert('Книжку додано до кошика!');
    } catch (err: any) {
      alert('Помилка: ' + (err.message || 'Не вдалося додати до кошика'));
    }
  };

  const handleAddToSaved = async () => {
    if (!book) return;
    try {
      await addToSaved(book.id);
      alert('Книжку додано до збережених!');
    } catch (err: any) {
      alert('Помилка: ' + (err.message || 'Не вдалося додати до збережених'));
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !id) return;

    try {
      await submitReview(rating, comment);
      alert('Відгук додано!');
      setComment('');
    } catch (err: any) {
      alert('Помилка: ' + (err.message || 'Не вдалося додати відгук'));
    }
  };

  if (loading) return <div className="loading">Завантаження...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="error">Книжку не знайдено</div>;

  return (
    <section id="book-detail">
      <h2>{book.title}</h2>
      <p>
        <strong>Автор:</strong> {book.author}
      </p>
      <p>
        <strong>Жанр:</strong> {book.genre}
      </p>
      <p>
        <strong>Рік:</strong> {book.year}
      </p>
      <p className="book-price">{book.price} грн</p>
      {book.description && <p>{book.description}</p>}

      <div className="book-actions">
        {isAuthenticated ? (
          <>
            <button onClick={handleAddToCart}>До кошика</button>
            <button onClick={handleAddToSaved}>Зберегти</button>
          </>
        ) : (
          <p>
            <Link to="/login">Увійдіть</Link>, щоб купити або зберегти.
          </p>
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
            <form onSubmit={handleSubmitReview}>
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
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
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
