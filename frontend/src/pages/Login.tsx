import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser, error, loading } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginUser(email, password);
        } catch (err) {
            // Error is handled by the hook
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Завантаження...' : 'Увійти'}
                </button>
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
