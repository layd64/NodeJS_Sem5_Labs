import { useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface CartItem {
  bookId: string;
  book: {
    title: string;
    price: number;
  };
  quantity: number;
}

export const useCart = () => {
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
      await fetchCart();
    } catch (err) {
      throw new Error('Failed to update quantity');
    }
  };

  const removeItem = async (bookId: string) => {
    if (!user) return;
    try {
      await cartApi.removeItem(user.id, bookId);
      await fetchCart();
    } catch (err) {
      throw new Error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartApi.clearCart(user.id);
      setItems([]);
    } catch (err) {
      throw new Error('Failed to clear cart');
    }
  };

  const checkout = async () => {
    if (!user) return;
    if (items.length === 0) {
      throw new Error('Кошик порожній');
    }
    try {
      const response = await cartApi.checkout(user.id);
      setItems([]);
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || err.message || 'Не вдалося оформити замовлення',
      );
    }
  };

  const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return {
    items,
    loading,
    error,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
    refetch: fetchCart,
  };
};
