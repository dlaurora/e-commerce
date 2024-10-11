// DOM Elements
const loader = document.getElementById('loader');
const productGrid = document.getElementById('product-grid');
const paginationContainer = document.getElementById('pagination-controls');
const moreDepartments = document.getElementById('more-departments');
const seeMoreBtn = document.getElementById('see-more-btn');
const departmentsFullHeight = moreDepartments ? moreDepartments.scrollHeight : 0;

let currentProducts = [];
let visibleProducts = [];
let currentPage = 1;
const productsPerPage = 20;

// Fetch products from FakeStoreAPI
function fetchProducts(category = '', page = 1) {
    let url = `https://fakestoreapi.com/products?limit=100`;
    if (category) {
        url = `https://fakestoreapi.com/products/category/${category}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (loader) loader.style.display = "none"; // Hide loader
            currentProducts = data;
            displayProducts(page); // Display products by page
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Initially fetch all products
fetchProducts();

// Display products for the current page
function displayProducts(page) {
    if (!productGrid) return;
    productGrid.innerHTML = ""; // Clear the product grid
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    visibleProducts = currentProducts.slice(start, end);

    renderProducts(visibleProducts);
    renderPagination(); // Render pagination controls
}

// Render products in the grid
function renderProducts(products) {
    if (!productGrid) return;
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="150">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button>Add to Cart</button>
        `;
        productGrid.appendChild(productElement);
    });
}

// Render pagination controls
function renderPagination() {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = ""; // Clear existing buttons

    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('pagination-btn');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayProducts(currentPage); // Load products for the selected page
        });
        paginationContainer.appendChild(pageButton);
    }
}

// Toggle "See More/Less" for departments filter
if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', function() {
        if (moreDepartments.style.height === '0px' || moreDepartments.style.height === '') {
            moreDepartments.style.height = departmentsFullHeight + 'px';
            seeMoreBtn.innerText = 'See less';
        } else {
            moreDepartments.style.height = '0px';
            seeMoreBtn.innerText = 'See more';
        }
    });
}

// Apply filters based on category
document.querySelectorAll('.filter-option').forEach(filter => {
    filter.addEventListener('click', function() {
        const category = filter.dataset.category; // Get the selected category
        fetchProducts(category, 1); // Fetch and display products for the selected category
    });
});
