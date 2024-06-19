document.addEventListener('DOMContentLoaded', function() {
    const addForm = document.getElementById('addProductForm');
    const productList = document.getElementById('productList');

    addForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(addForm);
        fetch('/api/products', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(product => {
            addProduct(product);
            fetchProducts(); // Ensure list updates
        })
        .catch(err => console.error('Error:', err));
    });

    function addProduct(product) {
        const row = document.createElement('tr');
        let imageDisplay = product.imageUrl ? `<img src="/${product.imageUrl}" alt="${product.name}" style="max-width: 100px;">` : 'No image';
        row.innerHTML = `
            <td>${product._id}</td>
            <td>${imageDisplay}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>${product.category}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
                <button class="btn btn-primary" onclick="updateProduct('${product._id}')">Update</button>
            </td>
        `;
        productList.appendChild(row);
    }

    function fetchProducts() {
        fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = '';
            data.products.forEach(addProduct);
        })
        .catch(err => console.error('Error loading products:', err));
    }

    window.deleteProduct = function(id) {
        fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(() => fetchProducts())
        .catch(err => console.error('Error:', err));
    };

    window.updateProduct = function(id) {
        fetch(`/api/products/${id}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('updateId').value = product._id;
            document.getElementById('updateName').value = product.name;
            document.getElementById('updatePrice').value = product.price;
            document.getElementById('updateDescription').value = product.description;
            document.getElementById('updateCategory').value = product.category;
            document.getElementById('updateProductData').style.display = 'block'; // Show the form
        })
        .catch(error => console.error('Error:', error));
    };

    window.showUpdateForm = function(product) {
        document.getElementById('updateId').value = product._id;
        document.getElementById('updateName').value = product.name;
        document.getElementById('updatePrice').value = product.price;
        document.getElementById('updateDescription').value = product.description;
        document.getElementById('updateCategory').value = product.category;
        document.getElementById('updateProductForm').style.display = 'block';
    };

    window.submitUpdate = function() {
        const form = document.getElementById('updateProductData');
        const formData = new FormData(form);
        const id = document.getElementById('updateId').value;
    
        fetch(`/api/products/${id}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Update successful:', data);
            fetchProducts(); // Refresh the product list
            document.getElementById('updateProductData').style.display = 'none'; // Hide the form again
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    fetchProducts(); // Initial fetch when the document is ready
});
