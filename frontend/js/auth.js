class AuthManager {
  constructor() {
    this.currentUser = this.loadUser();
    this.updateUI();
  }

  loadUser() {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      return JSON.parse(userStr);
    }
    return null;
  }

  saveUser(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.currentUser = user;
    this.updateUI();
  }

  clearUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser = null;
    this.updateUI();
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getUserId() {
    return this.currentUser?.id;
  }

  updateUI() {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');
    const userInfo = document.getElementById('user-info');

    if (this.isAuthenticated()) {
      if (loginLink) loginLink.classList.add('hidden');
      if (registerLink) registerLink.classList.add('hidden');
      if (logoutLink) logoutLink.classList.remove('hidden');
      if (userInfo) {
        userInfo.classList.remove('hidden');
        userInfo.innerHTML = `
          <span style="margin-right: 0.5rem;">${this.currentUser.name}</span>
          <a href="profile.html?userId=${this.currentUser.id}" class="nav-link">Профіль</a>
          <a href="cart.html?userId=${this.currentUser.id}" class="nav-link">Кошик</a>
        `;
      }
    } else {
      if (loginLink) loginLink.classList.remove('hidden');
      if (registerLink) registerLink.classList.remove('hidden');
      if (logoutLink) logoutLink.classList.add('hidden');
      if (userInfo) userInfo.classList.add('hidden');
    }
  }
}

const authManager = new AuthManager();

document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      authManager.clearUser();
      window.location.href = 'index.html';
    });
  }
});

