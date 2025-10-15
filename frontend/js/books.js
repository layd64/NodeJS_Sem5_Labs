let allGenres = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const genresData = await booksApi.getGenres();
    allGenres = genresData.genres;
    populateGenres();
    
    const urlParams = new URLSearchParams(window.location.search);
    const filters = {};
    if (urlParams.get('genre')) filters.genre = urlParams.get('genre');
    if (urlParams.get('search')) filters.search = urlParams.get('search');
    if (urlParams.get('minPrice')) filters.minPrice = urlParams.get('minPrice');
    if (urlParams.get('maxPrice')) filters.maxPrice = urlParams.get('maxPrice');
    
    if (filters.genre) {
      const genreSelect = document.getElementById('genre-select');
      if (genreSelect) genreSelect.value = filters.genre;
    }
    if (filters.search) {
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = filters.search;
    }
    if (filters.minPrice) {
      const minPriceInput = document.getElementById('min-price-input');
      if (minPriceInput) minPriceInput.value = filters.minPrice;
    }
    if (filters.maxPrice) {
      const maxPriceInput = document.getElementById('max-price-input');
      if (maxPriceInput) maxPriceInput.value = filters.maxPrice;
    }
    
    loadBooks(filters);
  } catch (error) {
    console.error('Failed to load genres:', error);
    const container = document.getElementById('books-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(showError('Помилка завантаження: ' + error.message));
    }
  }
});

function populateGenres() {
  const genreSelect = document.getElementById('genre-select');
  if (!genreSelect) return;

  allGenres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });
}

async function loadBooks(filters = {}) {
  const container = document.getElementById('books-container');
  if (!container) return;

  container.innerHTML = '<div class="loading">Завантаження...</div>';

  try {
    const data = await booksApi.getAll(filters);
    displayBooks(data.books || []);
  } catch (error) {
    container.innerHTML = '';
    container.appendChild(showError('Помилка завантаження книжок: ' + error.message));
  }
}

function displayBooks(books) {
  const container = document.getElementById('books-container');
  if (!container) return;

  if (books.length === 0) {
    container.innerHTML = '<p>Книжок не знайдено</p>';
    return;
  }

  const booksGrid = document.createElement('div');
  booksGrid.className = 'books-grid';

  books.forEach(book => {
    const bookCard = createBookCard(book);
    booksGrid.appendChild(bookCard);
  });

  container.innerHTML = '';
  container.appendChild(booksGrid);
}

function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';

  card.innerHTML = `
    <h3><a href="book-detail.html?id=${book.id}">${book.title}</a></h3>
    <p><strong>Автор:</strong> ${book.author}</p>
    <p><strong>Жанр:</strong> ${book.genre}</p>
    <p><strong>Рік:</strong> ${book.year}</p>
    <p class="book-price">${formatPrice(book.price)}</p>
    <div class="book-actions">
      <button onclick="viewBook('${book.id}')">Деталі</button>
      ${authManager.isAuthenticated() ? `
        <button onclick="addToCart('${book.id}')">До кошика</button>
        <button onclick="addToSaved('${book.id}')">Зберегти</button>
      ` : ''}
    </div>
  `;

  return card;
}

function viewBook(id) {
  window.location.href = `book-detail.html?id=${id}`;
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

function applyFilters() {
  const filters = {
    search: document.getElementById('search-input')?.value || '',
    genre: document.getElementById('genre-select')?.value || '',
    minPrice: document.getElementById('min-price-input')?.value || '',
    maxPrice: document.getElementById('max-price-input')?.value || '',
  };

  Object.keys(filters).forEach(key => {
    if (!filters[key]) delete filters[key];
  });

  loadBooks(filters);
}

