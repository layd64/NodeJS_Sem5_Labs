import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const booksApi = {
    getAll: (filters: any = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.genre) params.append('genre', filters.genre);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        return api.get(`/books?${params.toString()}`);
    },
    getById: (id: string) => api.get(`/books/${id}`),
    getGenres: () => api.get('/books/genres'),
    getReviews: (bookId: string) => api.get(`/books/${bookId}/reviews`),
};

export const cartApi = {
    getCart: (userId: string) => api.get(`/cart/${userId}`),
    addItem: (userId: string, bookId: string, quantity: number) => api.post(`/cart/${userId}/items`, { bookId, quantity }),
    updateItem: (userId: string, bookId: string, quantity: number) => api.put(`/cart/${userId}/items/${bookId}`, { quantity }),
    removeItem: (userId: string, bookId: string) => api.delete(`/cart/${userId}/items/${bookId}`),
    clearCart: (userId: string) => api.delete(`/cart/${userId}`),
};

export const authApi = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    getProfile: (userId: string) => api.get(`/auth/profile/${userId}`),
};

export const usersApi = {
    addSavedBook: (userId: string, bookId: string) => api.post(`/users/${userId}/saved-books/${bookId}`),
    getSavedBooks: (userId: string) => api.get(`/users/${userId}/saved-books`),
    removeSavedBook: (userId: string, bookId: string) => api.delete(`/users/${userId}/saved-books/${bookId}`),
    getReviews: (userId: string) => api.get(`/users/${userId}/reviews`),
    createReview: (userId: string, data: any) => api.post(`/users/${userId}/reviews`, data),
};

export default api;
