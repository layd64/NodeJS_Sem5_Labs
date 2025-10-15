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
  await loadCart(userId);
});

async function loadCart(userId) {
  const container = document.getElementById('cart-container');
  
  try {
    const cart = await cartApi.getCart(userId);
    displayCart(cart);
  } catch (error) {
    container.innerHTML = '';
    container.appendChild(showError('Помилка завантаження кошика: ' + error.message));
  }
}

function displayCart(cart) {
  const container = document.getElementById('cart-container');
  
  if (!cart.items || cart.items.length === 0) {
    container.innerHTML = `
      <p>Кошик порожній</p>
      <p><a href="books.html">Перейти до каталогу</a></p>
    `;
    return;
  }

  const table = document.createElement('table');
  table.className = 'cart-table';
  
  table.innerHTML = `
    <thead>
      <tr>
        <th>Книга</th>
        <th>Автор</th>
        <th>Ціна</th>
        <th>Кількість</th>
        <th>Сума</th>
        <th>Дії</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tbody = table.querySelector('tbody');
  
  cart.items.forEach(item => {
    const itemTotal = item.book.price * item.quantity;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href="book-detail.html?id=${item.bookId}">${item.book.title}</a></td>
      <td>${item.book.author}</td>
      <td>${formatPrice(item.book.price)}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" 
               onchange="updateQuantity('${item.bookId}', this.value)" 
               style="width: 60px;">
      </td>
      <td>${formatPrice(itemTotal)}</td>
      <td>
        <button class="btn-danger" onclick="removeItem('${item.bookId}')">Видалити</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-total';
  totalDiv.innerHTML = `<strong>Загальна сума: ${formatPrice(cart.total)}</strong>`;

  const clearButton = document.createElement('button');
  clearButton.className = 'btn-danger';
  clearButton.textContent = 'Очистити кошик';
  clearButton.onclick = clearCart;
  clearButton.style.marginTop = '1rem';

  container.innerHTML = '';
  container.appendChild(table);
  container.appendChild(totalDiv);
  container.appendChild(clearButton);
}

async function updateQuantity(bookId, quantity) {
  if (!currentUserId) return;
  
  const qty = parseInt(quantity);
  if (isNaN(qty) || qty < 1) {
    alert('Кількість повинна бути більше 0');
    await loadCart(currentUserId);
    return;
  }

  try {
    await cartApi.updateItem(currentUserId, bookId, qty);
    await loadCart(currentUserId);
  } catch (error) {
    alert('Помилка: ' + error.message);
    await loadCart(currentUserId);
  }
}

async function removeItem(bookId) {
  if (!currentUserId) return;
  
  if (!confirm('Видалити цю книжку з кошика?')) return;

  try {
    await cartApi.removeItem(currentUserId, bookId);
    await loadCart(currentUserId);
  } catch (error) {
    alert('Помилка: ' + error.message);
  }
}

async function clearCart() {
  if (!currentUserId) return;
  
  if (!confirm('Очистити весь кошик?')) return;

  try {
    await cartApi.clearCart(currentUserId);
    await loadCart(currentUserId);
  } catch (error) {
    alert('Помилка: ' + error.message);
  }
}

