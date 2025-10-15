let currentUserId = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!authManager.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId') || authManager.getUserId();
  
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  currentUserId = userId;
  await loadProfile(userId);
  await loadSavedBooks(userId);
  await loadReviews(userId);
});

async function loadProfile(userId) {
  const container = document.getElementById('profile-container');
  
  try {
    const profile = await authApi.getProfile(userId);
    displayProfile(profile);
  } catch (error) {
    container.innerHTML = '';
    container.appendChild(showError('Помилка завантаження профілю: ' + error.message));
  }
}

function displayProfile(profile) {
  const container = document.getElementById('profile-container');
  
  container.innerHTML = `
    <p><strong>ID:</strong> ${profile.id}</p>
    <p><strong>Ім'я:</strong> ${profile.name}</p>
    <p><strong>Email:</strong> ${profile.email}</p>
    <p><strong>Дата реєстрації:</strong> ${formatDate(profile.createdAt)}</p>
    <p><a href="cart.html?userId=${profile.id}">Переглянути кошик</a></p>
  `;
}

async function loadSavedBooks(userId) {
  const container = document.getElementById('saved-books-container');
  
  try {
    const data = await usersApi.getSavedBooks(userId);
    displaySavedBooks(data.books || []);
  } catch (error) {
    container.innerHTML = '';
    container.appendChild(showError('Помилка завантаження збережених книжок: ' + error.message));
  }
}

function displaySavedBooks(books) {
  const container = document.getElementById('saved-books-container');
  
  if (books.length === 0) {
    container.innerHTML = '<p>У вас немає збережених книг</p>';
    return;
  }

  const booksList = document.createElement('ul');
  books.forEach(book => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="book-detail.html?id=${book.id}">${book.title}</a> - 
      ${book.author} (${formatPrice(book.price)}) 
      <button class="btn-danger" style="margin-left: 1rem; padding: 0.25rem 0.5rem;" 
              onclick="removeSavedBook('${book.id}')">Видалити</button>
    `;
    booksList.appendChild(li);
  });

  container.innerHTML = '';
  container.appendChild(booksList);
}

async function removeSavedBook(bookId) {
  if (!currentUserId) return;
  
  if (!confirm('Видалити цю книжку зі збережених?')) return;

  try {
    await usersApi.removeSavedBook(currentUserId, bookId);
    await loadSavedBooks(currentUserId);
  } catch (error) {
    alert('Помилка: ' + error.message);
  }
}

async function loadReviews(userId) {
  const container = document.getElementById('reviews-container');
  
  try {
    const data = await usersApi.getReviews(userId);
    displayReviews(data.reviews || []);
  } catch (error) {
    container.innerHTML = '';
    container.appendChild(showError('Помилка завантаження відгуків: ' + error.message));
  }
}

function displayReviews(reviews) {
  const container = document.getElementById('reviews-container');
  
  if (reviews.length === 0) {
    container.innerHTML = '<p>У вас немає відгуків</p>';
    return;
  }

  const reviewsList = document.createElement('div');
  reviews.forEach(review => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
      <div class="review-rating">Рейтинг: ${review.rating}/5</div>
      <p>${review.comment}</p>
      <div class="review-meta">
        <a href="book-detail.html?id=${review.bookId}">Переглянути книжку</a> - 
        ${formatDate(review.createdAt)}
      </div>
    `;
    reviewsList.appendChild(reviewItem);
  });

  container.innerHTML = '';
  container.appendChild(reviewsList);
}

