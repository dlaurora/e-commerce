// Initialize cart from localStorage or create an empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProducts = [];
let visibleProducts = [];
let departmentFilter = '';

// Fetch products from Fake Store API with Loader
const productGrid = document.getElementById('product-grid');
const loader = document.createElement('div');
loader.classList.add('loader');
document.body.appendChild(loader);

// Show loader before fetching products
loader.style.display = "block";

// Fetch data from the Fake Store API
fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
        loader.style.display = "none"; // Hide loader after fetching
        currentProducts = data; // Save all fetched products
        visibleProducts = currentProducts.slice(0, 100); // Initially load 100 products
        renderProducts(visibleProducts);
    });

// Render products dynamically with Add to Cart button
function renderProducts(products) {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img loading="lazy" src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Add to Cart</button>
        </div>
    `).join('');

    // Add event listeners for each button after rendering
    document.querySelectorAll('.product-card button').forEach((button, index) => {
        button.onclick = () => {
            const product = products[index];
            addToCart(product.id, product.title, product.price, product.image);
        };
    });

    // Add event listener for the load more button after rendering
    if (visibleProducts.length < currentProducts.length) {
        document.getElementById('load-more-btn').addEventListener('click', loadMoreProducts);
    }
}

// Load more products when the button is clicked
function loadMoreProducts() {
    const start = visibleProducts.length;
    const end = start + 100;
    const moreProducts = currentProducts.slice(start, end);

    visibleProducts = visibleProducts.concat(moreProducts);
    renderProducts(visibleProducts);

    if (visibleProducts.length >= currentProducts.length) {
        document.getElementById('load-more-btn').style.display = 'none'; // Hide button when all products are loaded
    }
}

// Function to add products to the cart
function addToCart(productId, productName, productPrice, productImage) {
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} has been added to your cart!`);
    updateCartSummary();
}

// Update cart summary (for number of items) across pages
function updateCartSummary() {
    const cartSummary = document.querySelector('.cart-summary-items');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (cartSummary) {
        cartSummary.textContent = `${totalItems} items`;
    }
}

// Filter products by department
function filterProducts(department) {
    departmentFilter = department;
    const filteredProducts = currentProducts.filter(product => product.category === department);
    visibleProducts = filteredProducts.slice(0, 100); // Display first 100 products of the selected category
    renderProducts(visibleProducts);
    document.getElementById('load-more-btn').style.display = filteredProducts.length > 100 ? 'block' : 'none'; // Only show load more button if there are more than 100 products
}

// Toggle category visibility (show more/see less)
function toggleCategories() {
    const moreCategories = document.getElementById('more-categories');
    const toggleButton = document.getElementById('toggle-categories-btn');

    if (moreCategories.classList.contains('hidden-categories')) {
        moreCategories.classList.remove('hidden-categories');
        toggleButton.textContent = "See Less";
    } else {
        moreCategories.classList.add('hidden-categories');
        toggleButton.textContent = "Show More";
    }
}

// Toggle the visibility of the left panel
function togglePanel() {
    const filtersPanel = document.getElementById('filters-panel');
    if (filtersPanel.classList.contains('hidden-panel')) {
        filtersPanel.classList.remove('hidden-panel');
        document.querySelector('.toggle-panel-btn').textContent = 'Hide Filters';
    } else {
        filtersPanel.classList.add('hidden-panel');
        document.querySelector('.toggle-panel-btn').textContent = 'Show Filters';
    }
}

// Load cart data when viewing the cart page
function loadCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    const cartSummaryTotal = document.querySelector('.cart-summary-total');
    let totalItems = 0;
    let totalPrice = 0;

    cartContainer.innerHTML = '';

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        cartContainer.innerHTML += `
            <div class="row main align-items-center">
                <div class="col-2"><img class="img-fluid" src="${item.image}" alt="${item.name}"></div>
                <div class="col">
                    <div class="row text-muted">${item.name}</div>
                    <div class="row">$${item.price}</div>
                </div>
                <div class="col">
                    <a href="#" onclick="decreaseQuantity(${item.id})">-</a>
                    <a href="#" class="border">${item.quantity}</a>
                    <a href="#" onclick="increaseQuantity(${item.id})">+</a>
                </div>
                <div class="col">$${(item.price * item.quantity).toFixed(2)} <span class="close" onclick="removeFromCart(${item.id})">&#10005;</span></div>
            </div>
        `;
    });

    cartSummaryTotal.textContent = `$${totalPrice.toFixed(2)}`;
    document.querySelector('.cart-summary-items').textContent = `${totalItems} items`;
}

// Increase product quantity in cart
function increaseQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    product.quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

// Decrease product quantity in cart
function decreaseQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    if (product.quantity > 1) {
        product.quantity -= 1;
    } else {
        removeFromCart(productId);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

// Close modal on 'X' click
const closeModal = document.getElementsByClassName('close')[0];
const modal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');

closeModal.onclick = function () {
    modal.style.display = "none";
}

// Close modal if user clicks outside the modal content
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Update cart summary on page load
window.onload = function () {
    updateCartSummary();
    if (document.querySelector('.cart-items')) {
        loadCartItems();
    }
};

// Smooth Scroll to Client Reviews
$('a[href^="#client-reviews"]').on('click', function(event) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top
        }, 1000);
    }
});


