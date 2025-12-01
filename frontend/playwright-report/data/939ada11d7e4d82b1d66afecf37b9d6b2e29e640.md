# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - navigation [ref=e4]:
      - link "Головна" [ref=e5] [cursor=pointer]:
        - /url: /
      - link "Каталог" [ref=e6] [cursor=pointer]:
        - /url: /books
      - link "Жанри" [ref=e7] [cursor=pointer]:
        - /url: /genres
      - generic [ref=e8]:
        - link "Вхід" [ref=e9] [cursor=pointer]:
          - /url: /login
        - link "Реєстрація" [ref=e10] [cursor=pointer]:
          - /url: /register
    - heading "Книжковий магазин" [level=1] [ref=e11]
  - main [ref=e12]:
    - generic [ref=e13]:
      - heading "Реєстрація" [level=2] [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: "Email:"
          - textbox [ref=e18]: profileuser1765074001746@example.com
        - generic [ref=e19]:
          - generic [ref=e20]: "Пароль:"
          - textbox [ref=e21]: password123
        - generic [ref=e22]:
          - generic [ref=e23]: "Ім'я:"
          - textbox [ref=e24]: Profile User 1765074001746
        - button "Зареєструватися" [ref=e25] [cursor=pointer]
      - paragraph [ref=e26]:
        - text: Вже маєте акаунт?
        - link "Увійти" [ref=e27] [cursor=pointer]:
          - /url: /login
      - generic [ref=e28]: "Помилка реєстрації: Помилка реєстрації"
  - contentinfo [ref=e29]:
    - paragraph [ref=e30]: Книжковий магазин
```