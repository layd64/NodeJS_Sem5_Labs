import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export const useLogin = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const loginUser = async (email: string, password: string) => {
        setError('');
        setLoading(true);
        try {
            const response = await authApi.login({ email, password });
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка входу';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, error, loading };
};

