document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('productList');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    const limit = 6; // Adjust this to change the number of items per page

    let cart = JSON.parse(sessionStorage.getItem('cart')) || {};

    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const searchText = e.target.elements.search.value;
        fetchProducts(searchText);
        saveSearchHistory(searchText);
    });

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        let imageDisplay = product.imageUrl ? `<img src="/${product.imageUrl}" alt="${product.name}" class="card-img-top">` : 'No image';
        
        card.innerHTML = `
            <div class="card mb-4 shadow-sm">
                ${imageDisplay}
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <h6 class="card-subtitle mb-2 text-muted">$${product.price}</h6>
                    <button class="btn btn-primary add-to-cart" onclick="addToCart('${product._id}')">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(card);
    }

    function createPagination(totalPages) {
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.className = 'btn btn-outline-primary mx-1';
            pageButton.onclick = () => {
                currentPage = i;
                fetchProducts();
            };
            pagination.appendChild(pageButton);
        }
    }

    function fetchProducts(search = '') {
        fetch(`/api/products?search=${search}&page=${currentPage}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = ''; // Clear existing product cards
            data.products.forEach(createProductCard);
            createPagination(data.totalPages);
        })
        .catch(error => console.error('Error fetching products:', error));
    }

    function saveSearchHistory(searchText) {
        let searches = JSON.parse(sessionStorage.getItem('searches')) || [];
        searches.push(searchText);
        sessionStorage.setItem('searches', JSON.stringify(searches));
        displaySearchHistory();
    }

    function displaySearchHistory() {
        const searches = JSON.parse(sessionStorage.getItem('searches')) || [];
        const historyElement = document.getElementById('searchHistory');
        historyElement.innerHTML = '<h3>Search History:</h3>' + searches.map(s => `<span>${s}</span>`).join(', ');
    }

    window.addToCart = function(productId) {
        if (cart[productId]) {
            cart[productId]++;
        } else {
            cart[productId] = 1;
        }
        sessionStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
    };

    fetchProducts(); // Initial call to load products
    displaySearchHistory();
});
