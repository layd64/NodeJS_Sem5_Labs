import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Cart: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { items, loading, error, total, updateQuantity, removeItem, clearCart, checkout } =
    useCart();

  const handleUpdateQuantity = async (bookId: string, newQuantity: number) => {
    try {
      await updateQuantity(bookId, newQuantity);
    } catch (err: any) {
      alert('Помилка: ' + (err.message || 'Не вдалося оновити кількість'));
    }
  };

  const handleRemoveItem = async (bookId: string) => {
    try {
      await removeItem(bookId);
    } catch (err: any) {
      alert('Помилка: ' + (err.message || 'Не вдалося видалити товар'));
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Ви впевнені, що хочете очистити кошик?')) return;
    try {
      await clearCart();
    } catch (err: any) {
      alert('Помилка: ' + (err.message || 'Не вдалося очистити кошик'));
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Кошик порожній');
      return;
    }
    if (!window.confirm(`Оформити замовлення на суму ${total} грн?`)) return;
    try {
      const result = await checkout();
      alert(`Замовлення успішно оформлено! Сума: ${result.total} грн`);
    } catch (err: any) {
      alert('Помилка: ' + (err.message || 'Не вдалося оформити замовлення'));
    }
  };

  if (!isAuthenticated) {
    return (
      <section>
        <h2>Кошик</h2>
        <p>
          Будь ласка, <Link to="/login">увійдіть</Link>, щоб переглянути кошик.
        </p>
      </section>
    );
  }

  if (loading) return <div className="loading">Завантаження...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section>
      <h2>Кошик</h2>
      {items.length === 0 ? (
        <p>Кошик порожній</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Книга</th>
                <th>Ціна</th>
                <th>Кількість</th>
                <th>Сума</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.bookId}>
                  <td>{item.book.title}</td>
                  <td>{item.book.price} грн</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.bookId, parseInt(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>{item.book.price * item.quantity} грн</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleRemoveItem(item.bookId)}>
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">Загалом: {total} грн</div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button className="btn-danger" onClick={handleClearCart}>
              Очистити кошик
            </button>
            <button className="btn-success" style={{ marginLeft: '1rem' }} onClick={handleCheckout}>
              Оформити замовлення
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
