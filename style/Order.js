// Function to show or hide card details based on payment method
function toggleCardDetails() {
  const paymentMethod = document.getElementById("paymentMethod").value;
  const cardDetails = document.getElementById("cardDetails");

  if (paymentMethod === "CreditCard" || paymentMethod === "DebitCard") {
    cardDetails.style.display = "block";
  } else {
    cardDetails.style.display = "none";
  }
}

// Function to display the popup with order details
function showPopup(orderDetails) {
  // Fill the order details into the popup
  document.getElementById("popupCustomerName").textContent = orderDetails["Full Name"];
  document.getElementById("popupEmail").textContent = orderDetails.Email;
  document.getElementById("popupPhoneNumber").textContent = orderDetails["Phone Number"];
  document.getElementById("popupProductName").textContent = orderDetails["Product Name"];
  document.getElementById("popupDeliveryAddress").textContent = orderDetails["Delivery Address"];
  document.getElementById("popupPaymentMethod").textContent = orderDetails["Payment Method"];
  document.getElementById("popupEstimatedDeliveryDate").textContent = orderDetails["Estimated Delivery Date"];

  // Display the popup
  const popupOverlay = document.getElementById("orderPopup");
  if (popupOverlay) {
    popupOverlay.style.display = "block"; // Shows the popup
  }
}

// Function to validate the form and submit the order
function submitOrder() {
  // Get form values
  const customerName = document.getElementById("customerName").value.trim();
  const email = document.getElementById("email").value.trim();
  const countryCode = document.getElementById("countryCode").value;
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const productName = document.getElementById("productName").value.trim();
  const deliveryAddress = document.getElementById("deliveryAddress").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const cvv = document.getElementById("cvv").value.trim();
  const expiryDate = document.getElementById("expiryDate").value;

  // Validate required fields
  if (!customerName || !email || !phoneNumber || !productName || !deliveryAddress || !paymentMethod) {
    alert("Please fill out all required fields to place your order.");
    return;
  }

  // Validate card details if payment method is card-based
  if ((paymentMethod === "CreditCard" || paymentMethod === "DebitCard") && (!cardNumber || !cvv || !expiryDate)) {
    alert("Please fill out all card details.");
    return;
  }

  // Create the order details object
  const orderDetails = {
    "Full Name": customerName,
    Email: email,
    "Phone Number": `${countryCode} ${phoneNumber}`,
    "Product Name": productName,
    "Delivery Address": deliveryAddress,
    "Payment Method": paymentMethod,
    "Estimated Delivery Date": "2024-12-10"  // Example, replace with real calculation if needed
  };

  // Include card details if applicable
  if (paymentMethod === "CreditCard" || paymentMethod === "DebitCard") {
    orderDetails["Card Number"] = cardNumber.replace(/\d{12}/, "************");
    orderDetails["Expiry Date"] = expiryDate;
  }

  // Show the popup with order details
  showPopup(orderDetails);
}

// Function to close the popup when the close button is clicked
function closePopup() {
  const popupOverlay = document.getElementById("orderPopup");
  if (popupOverlay) {
    popupOverlay.style.display = "none"; // Hides the popup
  }
}



// Populate the cart table dynamically if it exists on the page
function populateCartTable(cartData) {
  const newCartTableBody = document.querySelector('#new-cart-table1 tbody');
  newCartTableBody.innerHTML = ''; // Clear existing table rows

  cartData.forEach(({ productName, price, quantity, category }, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${productName}</td>
          <td>LKR ${price.toFixed(2)}</td>
          <td>${quantity}</td>
          <td class="total-price">LKR ${(price * quantity).toFixed(2)}</td>
          <td><button class="remove-btn" data-index="${index}">Remove</button></td>
      `;
      newCartTableBody.appendChild(row);
  });

  // Attach event listeners to remove buttons
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          const productIndex = event.target.getAttribute('data-index');
          removeProductFromCart(productIndex);
      });
  });

  // Update total price for the cart
  updateCartTotal(cartData);
}

// Function to calculate and display total price for the cart
function updateCartTotal(cartData) {
  const totalPrice = cartData.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
  const totalElement = document.querySelector('#cart-total1');
  if (totalElement) {
      totalElement.textContent = `LKR ${totalPrice.toFixed(2)}`;
  }
}

// Function to remove a product from the cart
function removeProductFromCart(index) {
  const cartData = JSON.parse(sessionStorage.getItem('cart')) || [];
  cartData.splice(index, 1); // Remove the product at the specified index
  sessionStorage.setItem('cart', JSON.stringify(cartData)); // Update sessionStorage

  // Update the cart table and order form
  populateCartTable(cartData);
  updateOrderForm(cartData);
}

// Function to update the order form fields
function updateOrderForm(cartData) {
  const productNameField = document.getElementById("productName");
  const productCategoryField = document.getElementById("productCategory");
  const quantityField = document.getElementById("quantity");

  if (cartData.length > 0) {
      const productNames = cartData.map(item => item.productName).join(', ');
      const categories = cartData.map(item => item.category).join(', ');
      const totalQuantity = cartData.reduce((sum, item) => sum + item.quantity, 0);

      productNameField.value = productNames; // Comma-separated product names
      productCategoryField.value = categories; // Comma-separated categories
      quantityField.value = totalQuantity; // Total quantity
  } else {
      productNameField.value = '';
      productCategoryField.value = '';
      quantityField.value = '';
  }
}

// Ensure cart and form data are updated on page load
document.addEventListener('DOMContentLoaded', () => {
  const cartData = JSON.parse(sessionStorage.getItem('cart')) || [];
  if (cartData.length > 0) {
      populateCartTable(cartData);
      updateOrderForm(cartData);
  }
});

// Dynamically show or hide card details based on payment method
function toggleCardDetails() {
  const paymentMethod = document.getElementById('paymentMethod').value;
  const cardDetails = document.getElementById('cardDetails');
  if (paymentMethod === 'CreditCard' || paymentMethod === 'DebitCard') {
      cardDetails.style.display = 'block';
  } else {
      cardDetails.style.display = 'none';
  }
}

// Attach `onchange` event listener to payment method dropdown
if (document.getElementById('paymentMethod')) {
  document.getElementById('paymentMethod').addEventListener('change', toggleCardDetails);
}