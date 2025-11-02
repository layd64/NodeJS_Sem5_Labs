import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <>
            <section className="welcome-section">
                <h2>Ласкаво просимо до книжкового магазину!</h2>
                <p>Наш магазин пропонує широкий вибір книжок різних жанрів. Переглядайте каталог, додавайте улюблені книги до кошика та оформлюйте замовлення. Створюйте профіль, зберігайте улюблені книги та ділитесь відгуками.</p>
            </section>
            <section className="quick-nav">
                <h2>Швидка навігація</h2>
                <ul>
                    <li><Link to="/books">Переглянути каталог книжок</Link></li>
                    <li><Link to="/genres">Переглянути жанри</Link></li>
                    <li><Link to="/login">Увійти в систему</Link></li>
                    <li><Link to="/register">Зареєструватися</Link></li>
                </ul>
            </section>
        </>
    );
};

export default Home;
