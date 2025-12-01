import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export const useRegister = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const registerUser = async (email: string, password: string, name: string) => {
    setError('');
    setLoading(true);
    try {
      const response = await authApi.register({ email, password, name });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Помилка реєстрації';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, error, loading };
};
