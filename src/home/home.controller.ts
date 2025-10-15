import { Controller, Get } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  getHome() {
    return {
      message: 'Ласкаво просимо до книжкового магазину!',
      description: 'Наш магазин пропонує широкий вибір книжок різних жанрів. Переглядайте каталог, додавайте улюблені книги до кошика та оформлюйте замовлення. Створюйте профіль, зберігайте улюблені книги та ділитесь відгуками.',
      version: '1.0.0',
    };
  }
}
