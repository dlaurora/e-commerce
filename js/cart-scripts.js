// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// Function to render cart items
function renderCart() {
    cartItemsContainer.innerHTML = ''; // Clear the cart display
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(product => {
            // Calculate total price for the product
            const productTotal = product.price * product.quantity;
            total += productTotal;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}" width="80">
                <div>
                    <h4>${product.title}</h4>
                    <p>$${product.price}</p>
                    <p>Quantity: <input type="number" value="${product.quantity}" min="1" data-id="${product.id}" class="cart-quantity"></p>
                    <button class="remove-item" data-id="${product.id}">Remove</button>
                </div>
                <p>Total: $${productTotal.toFixed(2)}</p>
            `;

            cartItemsContainer.appendChild(cartItem);
        });
    }

    cartTotalElement.innerText = total.toFixed(2);
}

// Function to update cart in localStorage and re-render
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Function to handle quantity change
cartItemsContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('cart-quantity')) {
        const productId = e.target.getAttribute('data-id');
        const newQuantity = parseInt(e.target.value);

        // Find the product and update the quantity
        const product = cart.find(item => item.id === parseInt(productId));
        product.quantity = newQuantity;

        updateCart();
    }
});

// Function to remove a product from the cart
cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const productId = e.target.getAttribute('data-id');

        // Filter out the product from the cart
        cart = cart.filter(item => item.id !== parseInt(productId));

        updateCart();
    }
});

// Checkout button handler
document.getElementById('checkout-button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty.");
    } else {
        // Proceed to checkout (you can redirect or integrate a payment gateway here)
        alert("Proceeding to checkout...");
        // Reset the cart after checkout for now
        cart = [];
        updateCart();
    }
});

// Initial render
renderCart();
