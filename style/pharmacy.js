// Save favourites to localStorage
function saveFavouritesToLocalStorage(productName, price, quantity) {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  favourites.push({ productName, price, quantity });
  localStorage.setItem('favourites', JSON.stringify(favourites));
  alert(`${productName} has been added to favourites.`);
}

// Load favourites from localStorage and populate the cart table
function loadFavouritesToTable() {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  const cartTableBody = document.querySelector('#cart-table tbody');
  cartTableBody.innerHTML = ''; // Clear existing cart items
  favourites.forEach(({ productName, price, quantity }) => addToCart(productName, price, quantity));
  updateCartTotal(); // Update the total
}

// Save the cart to localStorage
function saveCartToLocalStorage() {
  const cart = [];
  document.querySelectorAll('#cart-table tbody tr').forEach(row => {
    const productName = row.querySelector('td:first-child').textContent.trim();
    const price = parseFloat(row.querySelector('td:nth-child(2)').textContent.replace('LKR ', '').trim());
    const quantity = parseInt(row.querySelector('.quantity-input').value);
    cart.push({ productName, price, quantity });
  });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartTotal(); // Update the total after saving
}

// Add product to cart
function addToCart(productName, price, quantity) {
  const cartTableBody = document.querySelector('#cart-table tbody');
  console.log(`Adding ${productName} to cart with price LKR ${price} and quantity ${quantity}`);

  let row = Array.from(cartTableBody.children).find(r =>
    r.querySelector('td:first-child').textContent.trim() === productName
  );

  if (row) {
    const quantityInput = row.querySelector('.quantity-input');
    quantityInput.value = parseInt(quantityInput.value) + quantity;
    row.querySelector('.total-price').textContent = `LKR ${(price * quantityInput.value).toFixed(2)}`;
  } else {
    row = document.createElement('tr');
    row.innerHTML = `
      <td>${productName}</td>
      <td>LKR ${price.toFixed(2)}</td>
      <td><input class="quantity-input" type="number" value="${quantity}" min="1" onchange="updateCartRow(this, ${price})"></td>
      <td class="total-price">LKR ${(price * quantity).toFixed(2)}</td>
      <td><button class="clear-btn" onclick="clearProduct(this)">Clear</button></td>
    `;
    cartTableBody.appendChild(row);
  }
  saveCartToLocalStorage();
  updateCartTotal(); // Update the total whenever an item is added
}

// Clear product from cart and update favourites in localStorage
function clearProduct(button) {
  const row = button.closest('tr');
  const productName = row.querySelector('td:first-child').textContent.trim();

  // Remove the product from the cart table
  row.remove();

  // Update favourites in localStorage
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  const updatedFavourites = favourites.filter(product => product.productName !== productName);
  localStorage.setItem('favourites', JSON.stringify(updatedFavourites));

  // Update the cart total
  saveCartToLocalStorage();
  updateCartTotal();
}

// Update cart row when quantity changes
function updateCartRow(input, price) {
  const totalCell = input.closest('tr').querySelector('.total-price');
  totalCell.textContent = `LKR ${(price * input.value).toFixed(2)}`;
  saveCartToLocalStorage();
  updateCartTotal();
}

// Update the cart total
function updateCartTotal() {
  let total = 0;
  document.querySelectorAll('#cart-table tbody tr').forEach(row => {
    const rowTotal = parseFloat(row.querySelector('.total-price').textContent.replace('LKR ', '').trim());
    total += rowTotal;
  });

  const totalElement = document.querySelector('#cart-total');
  totalElement.textContent = `LKR ${total.toFixed(2)}`; // Assuming you have an element with id "cart-total"
}

// Handle Add to Cart and Add to Favourites buttons
document.querySelectorAll('.product-btn').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const productElement = button.closest('.product');
    const productName = productElement.querySelector('.product-title').textContent.trim();
    const price = parseFloat(productElement.querySelector('.product-price').textContent.replace('LKR ', '').replace('/=', ''));
    const quantity = parseInt(productElement.querySelector('input[type="number"]').value);

    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (button.textContent === 'To Favourite') {
      saveFavouritesToLocalStorage(productName, price, quantity);
    } else {
      addToCart(productName, price, quantity);
    }
  });
});

// Load favourites into the cart
document.querySelector('.buy-now-btn1').addEventListener('click', loadFavouritesToTable);

// Buy now button
document.querySelector('.buy-now-btn').addEventListener('click', (e) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart.length) {
    alert('Cart is empty. Please enter a Product to the Table.');
    e.preventDefault(); // Prevent the default action
    return;
  }
  sessionStorage.setItem('cart', JSON.stringify(cart));
  localStorage.removeItem('cart');
  document.querySelector('#cart-table tbody').innerHTML = '';
  window.location.href = 'new-page.html';
});