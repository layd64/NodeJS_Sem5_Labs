let currentBookId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');
  
  if (!bookId) {
    document.getElementById('book-detail').innerHTML = 
      showError('ID книжки не вказано');
    return;
  }

  currentBookId = bookId;
  await loadBook(bookId);
  await loadReviews(bookId);
});

async function loadBook(id) {
  const container = document.getElementById('book-detail');
  
  try {
    const book = await booksApi.getById(id);
    displayBook(book);
  } catch (error) {
    container.innerHTML = '';
    container.appendChild(showError('Помилка завантаження книжки: ' + error.message));
  }
}

function displayBook(book) {
  const container = document.getElementById('book-detail');
  
  container.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>Автор:</strong> ${book.author}</p>
    <p><strong>Рік видання:</strong> ${book.year}</p>
    <p><strong>Жанр:</strong> <a href="books.html?genre=${encodeURIComponent(book.genre)}">${book.genre}</a></p>
    <p class="book-price">Ціна: ${formatPrice(book.price)}</p>
    ${book.isbn ? `<p><strong>ISBN:</strong> ${book.isbn}</p>` : ''}
    <p><strong>Опис:</strong> ${book.description}</p>
    ${authManager.isAuthenticated() ? `
      <div class="book-actions" style="margin-top: 1rem;">
        <button onclick="addToCart('${book.id}')">Додати до кошика</button>
        <button onclick="addToSaved('${book.id}')">Додати до збережених</button>
      </div>
    ` : ''}
  `;
}

async function loadReviews(bookId) {
  const container = document.getElementById('reviews-container');
  const section = document.getElementById('reviews-section');
  const addReviewForm = document.getElementById('add-review-form');
  
  try {
    const data = await booksApi.getReviews(bookId);
    displayReviews(data.reviews || []);
    section.classList.remove('hidden');
    
    if (authManager.isAuthenticated() && addReviewForm) {
      addReviewForm.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Failed to load reviews:', error);
  }
}

function displayReviews(reviews) {
  const container = document.getElementById('reviews-container');
  
  if (reviews.length === 0) {
    container.innerHTML = '<p>Поки що немає відгуків на цю книжку.</p>';
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
        ${review.user ? review.user.name : 'Анонімний користувач'} - 
        ${formatDate(review.createdAt)}
      </div>
    `;
    reviewsList.appendChild(reviewItem);
  });

  container.innerHTML = '';
  container.appendChild(reviewsList);
}

async function submitReview(event) {
  event.preventDefault();
  
  if (!authManager.isAuthenticated()) {
    alert('Будь ласка, увійдіть в систему');
    return;
  }

  const userId = authManager.getUserId();
  if (!userId || !currentBookId) return;

  const rating = parseInt(document.getElementById('review-rating').value);
  const comment = document.getElementById('review-comment').value;

  try {
    await usersApi.createReview(userId, {
      bookId: currentBookId,
      rating,
      comment,
    });
    
    alert('Відгук додано!');
    document.getElementById('review-rating').value = '';
    document.getElementById('review-comment').value = '';
    await loadReviews(currentBookId);
  } catch (error) {
    alert('Помилка: ' + error.message);
  }
}

async function addToCart(bookId) {
  if (!authManager.isAuthenticated()) {
    alert('Будь ласка, увійдіть в систему');
    window.location.href = 'login.html';
    return;
  }

  const userId = authManager.getUserId();
  if (!userId) return;

  try {
    await cartApi.addItem(userId, bookId, 1);
    alert('Книжку додано до кошика!');
  } catch (error) {
    alert('Помилка: ' + error.message);
  }
}

async function addToSaved(bookId) {
  if (!authManager.isAuthenticated()) {
    alert('Будь ласка, увійдіть в систему');
    window.location.href = 'login.html';
    return;
  }

  const userId = authManager.getUserId();
  if (!userId) return;

  try {
    await usersApi.addSavedBook(userId, bookId);
    alert('Книжку додано до збережених!');
  } catch (error) {
    alert('Помилка: ' + error.message);
  }
}

