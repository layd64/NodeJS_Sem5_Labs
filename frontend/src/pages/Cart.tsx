import React, { useEffect, useState } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface CartItem {
    bookId: string;
    book: {
        title: string;
        price: number;
    };
    quantity: number;
}

const Cart: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const fetchCart = async () => {
        if (!user) return;
        try {
            const response = await cartApi.getCart(user.id);
            setItems(response.data.items || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (bookId: string, newQuantity: number) => {
        if (!user) return;
        if (newQuantity < 1) return;
        try {
            await cartApi.updateItem(user.id, bookId, newQuantity);
            fetchCart();
        } catch (err) {
            alert('Failed to update quantity');
        }
    };

    const removeItem = async (bookId: string) => {
        if (!user) return;
        try {
            await cartApi.removeItem(user.id, bookId);
            fetchCart();
        } catch (err) {
            alert('Failed to remove item');
        }
    };

    const clearCart = async () => {
        if (!user) return;
        if (!window.confirm('Ви впевнені, що хочете очистити кошик?')) return;
        try {
            await cartApi.clearCart(user.id);
            setItems([]);
        } catch (err) {
            alert('Failed to clear cart');
        }
    };

    if (!isAuthenticated) {
        return (
            <section>
                <h2>Кошик</h2>
                <p>Будь ласка, <Link to="/login">увійдіть</Link>, щоб переглянути кошик.</p>
            </section>
        );
    }

    if (loading) return <div className="loading">Завантаження...</div>;
    if (error) return <div className="error">{error}</div>;

    const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

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
                                            onChange={(e) => updateQuantity(item.bookId, parseInt(e.target.value))}
                                            style={{ width: '60px' }}
                                        />
                                    </td>
                                    <td>{item.book.price * item.quantity} грн</td>
                                    <td>
                                        <button className="btn-danger" onClick={() => removeItem(item.bookId)}>Видалити</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cart-total">
                        Загалом: {total} грн
                    </div>
                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                        <button className="btn-danger" onClick={clearCart}>Очистити кошик</button>
                        <button className="btn-success" style={{ marginLeft: '1rem' }}>Оформити замовлення</button>
                    </div>
                </>
            )}
        </section>
    );
};

export default Cart;
