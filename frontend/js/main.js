function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  return errorDiv;
}

function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success';
  successDiv.textContent = message;
  return successDiv;
}

function showLoading(message = 'Завантаження...') {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  loadingDiv.textContent = message;
  return loadingDiv;
}

function formatPrice(price) {
  return `${price} грн`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA');
}

