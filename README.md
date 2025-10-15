# Онлайн магазин книг (Індивідуальний проєкт)

## Опис
Застосунок, який дозволяє користувачам переглядати каталог книжок, додавати їх до кошика та оформлювати замовлення.

## Мета та ідея
Основна мета - створити зручний та швидкий інструмент для купівлі книжок онлайн, який дає змогу користувачам знайти потрібну книгу, ознайомитися з описом і замовити її, не виходячи з дому.

## Функціональні вимоги
1. **Головна сторінка**
   - Короткий опис магазину.
   - Навігація по розділам.

2. **Каталог книжок**
   - Перегляд списку доступних книжок.
   - Пошук книжок за назвою або автором.
   - Фільтрація за жанрами.

3. **Сторінка книги**
   - Детальний опис книги (автор, рік, ціна, короткий зміст).
   - Додавання книги до кошика.

4. **Кошик**
   - Перегляд вибраних книжок.
   - Зміна кількості або видалення товару.
   - Підрахунок загальної вартості.

5. **Авторизація**
   - Регістрація нових аккаунтів та вхід у систему.
   - Перегляд профілю.
   - Список збережених книг та відгуків.

7. **Адміністративна панель**
   - Додавання нових книжок у каталог.
   - Редагування чи видалення існуючих книжок.

## Ролі користувачів

1. **Гість (неавторизований користувач)**  
   - Перегляд каталогу книжок.  
   - Пошук та фільтрація книжок.  
   - Перегляд детальної інформації про книгу.  

2. **Зареєстрований користувач (покупець)**  
   - Усі можливості гостя.  
   - Додавання товарів до кошика. 
   - Оформлення та відстеження замовлень.  
   - Перегляд історії покупок.  
   - Редагування профілю (ім’я, адреса, контактні дані).

3. **Адміністратор**  
   - Повний доступ до каталогу книжок:  
     - додавання нових книжок,  
     - редагування інформації,  
     - видалення книжок.  
   - Керування користувачами.

# Налаштування проекту
### Пакети: Node + TypeScript + Nest.js
Обгрунтування:
- **TypeScript**: Статична типізація, а отже і менше помилок у рантаймі ніж у JavaScript. Важливий для масштабованих застосунків, де багато моделей.
- **Nest.js**: Повністю структурований фреймворк для Node.js, який реалізує сучасну архітектуру (модулі, контролери, сервіси). Легко масштабувати та підтримувати проект, забезпечує зручну інтеграцію з TypeScript і популярними бібліотеками.
- **Аналог - Express**: відсутня строга структура, ручне налаштування middleware, валідації та DI (dependency injection).

### Стиль коду: Airbnb Style
Обгрунтування:
* Один із найпопулярніших і найстрогіших гайдлайнів, галузевий стандарт.
* Забезпечує читабельність та єдність стилю.
* Сумісний з ESLint та Prettier.
* **Аналоги - Google Style, StandardJS**: менш строгі. Airbnb - оптимальний вибір для навчання й реальних проєктів, бо задає чіткі правила.

### Форматтер: Prettier
Обгрунтування:
* Автоматичне вирівнювання стилю коду.
* Швидко інтегрується з Husky + lint-staged.
* **Аналог - Beautify**: менш популярний і має слабшу інтеграцію. Prettier - стандарт де-факто.

### Лінтер: ESLint (з плагіном eslint-plugin-prettier).
Обгрунтування:
* ESLint знаходить помилки у логіці (наприклад, не використані змінні).
* Плагін Prettier синхронізує форматування з правилами лінтера, щоб не було конфліктів.
* **Аналог - JSHint**: ESLint більш сучасний та підтримує TypeScript.


### Git-hook через Husky:
- pre-commit: форматування + eslint + тести, щоб перевіряти pipeline перед пушем.
- pre-push: тести.


## Архітектура

Застосунок розділено на дві частини:

### Backend (REST API)
- **Технології**: NestJS, TypeScript, Express
- **Порт**: 3000
- **API Prefix**: `/api`
- **Функціонал**: Чистий REST API, що повертає JSON відповіді

### Frontend (Клієнтська частина)
- **Технології**: HTML, CSS, Vanilla JavaScript
- **Порт**: 8080
- **Функціонал**: SPA-подібний застосунок з динамічним контентом

## Початок роботи

### Встановлення залежностей
```bash
npm install
```

### Запуск Backend (API)
```bash
npm run start:backend
# або
npm run start:dev
```
Backend API стартує на `http://localhost:3000/api`

### Запуск Frontend
```bash
npm run start:frontend
```
Frontend стартує на `http://localhost:8080`

**Альтернативні способи запуску frontend:**
- Python: `cd frontend && python3 -m http.server 8080`
- Node.js: `cd frontend && npx http-server -p 8080`
- Будь-який інший статичний сервер

### Збірка та продакшн-запуск
```bash
npm run build
npm run start:prod
```

### Лінтинг та форматування
```bash
npm run lint
npm run format
```

## Структура проекту

```
├── src/                    # Backend (NestJS API)
│   ├── auth/               # Модуль авторизації
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── books/              # Модуль книжок
│   │   ├── books.controller.ts
│   │   ├── books.service.ts
│   │   └── books.module.ts
│   ├── cart/               # Модуль кошика
│   │   ├── cart.controller.ts
│   │   ├── cart.service.ts
│   │   └── cart.module.ts
│   ├── common/             # Спільні DTO та інтерфейси
│   │   ├── dto/
│   │   │   ├── auth.dto.ts
│   │   │   ├── book.dto.ts
│   │   │   ├── cart.dto.ts
│   │   │   └── review.dto.ts
│   │   └── interfaces/
│   │       ├── book.interface.ts
│   │       ├── cart.interface.ts
│   │       ├── review.interface.ts
│   │       └── user.interface.ts
│   ├── data/               # Статичні дані
│   │   ├── books.data.ts
│   │   ├── carts.data.ts
│   │   ├── reviews.data.ts
│   │   └── users.data.ts
│   ├── home/               # Головна сторінка API
│   │   ├── home.controller.ts
│   │   └── home.module.ts
│   ├── users/              # Модуль користувачів
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── app.module.ts       # Головний модуль
│   └── main.ts             # Точка входу
│
└── frontend/               # Frontend (HTML/CSS/JS)
    ├── index.html          # Головна сторінка
    ├── books.html          # Каталог книжок
    ├── book-detail.html    # Деталі книжки
    ├── genres.html         # Жанри
    ├── login.html          # Вхід
    ├── register.html       # Реєстрація
    ├── cart.html           # Кошик
    ├── profile.html        # Профіль користувача
    ├── styles/
    │   └── main.css        # Основні стилі
    └── js/
        ├── api.js          # API клієнт
        ├── auth.js         # Управління авторизацією
        ├── main.js         # Утиліти
        ├── books.js        # Логіка каталогу
        ├── book-detail.js  # Логіка деталей книжки
        ├── cart.js         # Логіка кошика
        └── profile.js      # Логіка профілю
```

## API Ендпоінти

Всі ендпоінти мають префікс `/api` та повертають JSON відповіді.

### Головна сторінка
- `GET /api` - Інформація про магазин та версію API

### Книги
- `GET /api/books` - Отримати список книжок (з підтримкою фільтрів)
  - Query параметри: `?search=...`, `?genre=...`, `?minPrice=...`, `?maxPrice=...`
  - Response: `{ "books": [...], "total": number }`
- `GET /api/books/genres` - Отримати список жанрів
  - Response: `{ "genres": [...] }`
- `GET /api/books/:id` - Отримати детальну інформацію про книжку
  - Response: `BookResponseDto`
- `GET /api/books/:id/reviews` - Отримати відгуки на книжку
  - Response: `{ "reviews": [...], "book": BookResponseDto }`

### Кошик
- `GET /api/cart/:userId` - Отримати кошик користувача
  - Response: `CartResponseDto`
- `POST /api/cart/:userId/items` - Додати книжку до кошика
  - Body: `{ "bookId": "1", "quantity": 2 }`
  - Response: `CartResponseDto`
- `PUT /api/cart/:userId/items/:bookId` - Оновити кількість книжки в кошику
  - Body: `{ "quantity": 3 }`
  - Response: `CartResponseDto`
- `DELETE /api/cart/:userId/items/:bookId` - Видалити книжку з кошика
  - Response: `CartResponseDto`
- `DELETE /api/cart/:userId` - Очистити кошик
  - Response: `204 No Content`

### Авторизація
- `POST /api/auth/register` - Реєстрація нового користувача
  - Body: `{ "email": "user@example.com", "password": "password", "name": "Іван Іванов" }`
  - Response: `{ "token": "...", "user": { "id": "...", "email": "...", "name": "..." } }`
- `POST /api/auth/login` - Вхід у систему
  - Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "token": "...", "user": { "id": "...", "email": "...", "name": "..." } }`
- `GET /api/auth/profile/:userId` - Отримати профіль користувача
  - Response: `UserProfile` (без пароля)

### Користувачі
- `GET /api/users/:userId/saved-books` - Отримати збережені книги користувача
  - Response: `{ "books": [...] }`
- `POST /api/users/:userId/saved-books/:bookId` - Додати книжку до збережених
  - Response: `{ "message": "...", "books": [...] }`
- `DELETE /api/users/:userId/saved-books/:bookId` - Видалити книжку зі збережених
  - Response: `204 No Content`
- `GET /api/users/:userId/reviews` - Отримати відгуки користувача
  - Response: `{ "reviews": [...] }`
- `POST /api/users/:userId/reviews` - Створити відгук на книжку
  - Body: `{ "bookId": "1", "rating": 5, "comment": "Чудова книга!" }`
  - Response: `ReviewResponseDto`

## Технічні деталі

### Статичні дані
Проєкт використовує статичні дані, збережені в пам'яті (без підключення до бази даних):
- Книжки зберігаються в `src/data/books.data.ts`
- Користувачі зберігаються в `src/data/users.data.ts`
- Кошики зберігаються в `src/data/carts.data.ts`
- Відгуки зберігаються в `src/data/reviews.data.ts`

### Обробка помилок
Всі помилки обробляються через `HttpException` з відповідними HTTP статус-кодами:
- `400` - Помилка валідації
- `401` - Неавторизований доступ
- `404` - Ресурс не знайдено
- `409` - Конфлікт (наприклад, користувач вже існує)

Всі помилки повертаються у форматі:
```json
{
  "statusCode": 404,
  "message": "Book not found"
}
```

### CORS
Backend налаштований для роботи з frontend через CORS. За замовчуванням дозволено запити з `http://localhost:8080`. Можна змінити через змінну оточення `FRONTEND_URL`.

### Frontend
Frontend застосунок використовує:
- **API Client** (`js/api.js`) - централізований клієнт для всіх API запитів
- **Auth Manager** (`js/auth.js`) - управління станом авторизації через localStorage
- **Модульна структура** - кожна сторінка має свій JS файл з логікою

### Стиль коду
Проєкт дотримується правил Airbnb Style Guide, налаштованих через ESLint:
- Використання `const` та `let` замість `var`
- Обов'язкове використання строгих рівностей (`===`, `!==`)
- Використання шаблонних рядків
- Заборона невикористаних змінних
- Правильне впорядкування імпортів