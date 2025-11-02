import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            // Assuming the backend returns { token, user } or similar. 
            // Adjust based on actual backend response structure from legacy code inspection if needed.
            // Based on legacy `authApi.login` usage: `result.user`, `result.token`
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Помилка входу');
        }
    };

    return (
        <section>
            <h2>Вхід</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Увійти</button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                Немає акаунту? <Link to="/register">Зареєструватися</Link>
            </p>
            {error && (
                <div className="error">
                    Помилка входу: {error}
                </div>
            )}
        </section>
    );
};

export default Login;
