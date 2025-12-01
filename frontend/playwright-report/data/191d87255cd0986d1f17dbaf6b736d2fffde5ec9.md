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
      - heading "Каталог книжок" [level=2] [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: "Пошук:"
          - textbox "Назва або автор" [ref=e18]
        - generic [ref=e19]:
          - generic [ref=e20]: "Жанр:"
          - combobox [ref=e21]:
            - option "Всі жанри" [selected]
        - generic [ref=e22]:
          - generic [ref=e23]: "Мін. ціна:"
          - spinbutton [ref=e24]
        - generic [ref=e25]:
          - generic [ref=e26]: "Макс. ціна:"
          - spinbutton [ref=e27]
        - button "Фільтрувати" [ref=e28] [cursor=pointer]
      - generic [ref=e29]: Network Error
  - contentinfo [ref=e30]:
    - paragraph [ref=e31]: Книжковий магазин
```