import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { registerUser, error, loading } = useRegister();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(email, password, name);
        } catch (err) {
            // Error is handled by the hook
        }
    };

    return (
        <section>
            <h2>Реєстрація</h2>
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
                <div className="form-group">
                    <label>Ім'я:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Завантаження...' : 'Зареєструватися'}
                </button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                Вже маєте акаунт? <Link to="/login">Увійти</Link>
            </p>
            {error && (
                <div className="error">
                    Помилка реєстрації: {error}
                </div>
            )}
        </section>
    );
};

export default Register;
