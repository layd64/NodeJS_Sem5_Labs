import { cartApi, usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useCartActions = () => {
    const { user, isAuthenticated } = useAuth();

    const addToCart = async (bookId: string) => {
        if (!isAuthenticated || !user) {
            throw new Error('Будь ласка, увійдіть в систему');
        }
        try {
            await cartApi.addItem(user.id, bookId, 1);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || 'Failed to add to cart');
        }
    };

    const addToSaved = async (bookId: string) => {
        if (!isAuthenticated || !user) {
            throw new Error('Будь ласка, увійдіть в систему');
        }
        try {
            await usersApi.addSavedBook(user.id, bookId);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || 'Failed to add to saved');
        }
    };

    return { addToCart, addToSaved };
};

