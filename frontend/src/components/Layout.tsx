import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <>
      <header>
        <nav>
          <Link to="/" className="nav-link">
            Головна
          </Link>
          <Link to="/books" className="nav-link">
            Каталог
          </Link>
          <Link to="/genres" className="nav-link">
            Жанри
          </Link>
          <div className="auth-links">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="nav-link" id="login-link">
                  Вхід
                </Link>
                <Link to="/register" className="nav-link" id="register-link">
                  Реєстрація
                </Link>
              </>
            ) : (
              <>
                <span id="user-info">
                  <span style={{ marginRight: '0.5rem' }}>{user?.name || user?.email}</span>
                  <Link to="/profile" className="nav-link">
                    Профіль
                  </Link>
                  <Link to="/cart" className="nav-link">
                    Кошик
                  </Link>
                </span>
                <a href="#" onClick={handleLogout} className="nav-link" id="logout-link">
                  Вихід
                </a>
              </>
            )}
          </div>
        </nav>
        <h1>Книжковий магазин</h1>
      </header>
      <main id="main-content">{children}</main>
      <footer>
        <p>Книжковий магазин</p>
      </footer>
    </>
  );
};

export default Layout;
