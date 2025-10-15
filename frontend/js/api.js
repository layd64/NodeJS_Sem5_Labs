const API_BASE_URL = 'http://localhost:3000/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, {
        ...config,
        mode: 'cors',
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL:', url);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      
      if (error instanceof TypeError) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          throw new Error('Не вдалося підключитися до сервера. Переконайтеся, що:\n1. Backend запущений на http://localhost:3000\n2. Frontend відкритий через HTTP сервер (не file://)\n3. Обидва сервери працюють одночасно');
        }
        if (error.message.includes('CORS')) {
          throw new Error('Помилка CORS. Переконайтеся, що backend налаштований для роботи з frontend');
        }
      }
      
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient(API_BASE_URL);

const booksApi = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.genre) queryParams.append('genre', filters.genre);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    
    const query = queryParams.toString();
    return api.get(`/books${query ? `?${query}` : ''}`);
  },
  
  getById: (id) => api.get(`/books/${id}`),
  
  getGenres: () => api.get('/books/genres'),
  
  getReviews: (bookId) => api.get(`/books/${bookId}/reviews`),
};

const authApi = {
  register: (data) => api.post('/auth/register', data),
  
  login: (data) => api.post('/auth/login', data),
  
  getProfile: (userId) => api.get(`/auth/profile/${userId}`),
};

const cartApi = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  
  addItem: (userId, bookId, quantity) => 
    api.post(`/cart/${userId}/items`, { bookId, quantity }),
  
  updateItem: (userId, bookId, quantity) => 
    api.put(`/cart/${userId}/items/${bookId}`, { quantity }),
  
  removeItem: (userId, bookId) => 
    api.delete(`/cart/${userId}/items/${bookId}`),
  
  clearCart: (userId) => api.delete(`/cart/${userId}`),
};

const usersApi = {
  getSavedBooks: (userId) => api.get(`/users/${userId}/saved-books`),
  
  addSavedBook: (userId, bookId) => 
    api.post(`/users/${userId}/saved-books/${bookId}`),
  
  removeSavedBook: (userId, bookId) => 
    api.delete(`/users/${userId}/saved-books/${bookId}`),
  
  getReviews: (userId) => api.get(`/users/${userId}/reviews`),
  
  createReview: (userId, data) => 
    api.post(`/users/${userId}/reviews`, data),
};

