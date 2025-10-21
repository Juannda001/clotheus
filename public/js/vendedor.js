// Panel Vendedor - Funcionalidades Completas
document.addEventListener('DOMContentLoaded', function() {
    initializeVendedor();
});

// Variables globales
let sellerProducts = JSON.parse(localStorage.getItem('clotheusSellerProducts')) || [];
let currentEditId = null;

function initializeVendedor() {
    // Cargar productos del vendedor
    loadSellerProducts();
    
    // Configurar formulario
    setupProductForm();
    
    // Configurar búsqueda
    setupSearch();
    
    // Actualizar estadísticas
    updateSellerStats();
    
    // Mostrar sección por defecto
    showSection('dashboard');
}

// Navegación entre secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seller-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover active de todos los enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activar enlace correspondiente
    const targetLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // Acciones específicas por sección
    if (sectionId === 'productos') {
        renderSellerProducts();
    } else if (sectionId === 'dashboard') {
        updateSellerStats();
    }
}

// Cargar productos del vendedor
function loadSellerProducts() {
    // Los productos se cargan desde localStorage
    renderSellerProducts();
    updateSellerStats();
}

// Configurar formulario de producto
function setupProductForm() {
    const form = document.getElementById('productForm');
    const imageInput = document.getElementById('productImage');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }
    
    if (imageInput) {
        imageInput.addEventListener('input', updateImagePreview);
    }
}

// Configurar búsqueda
function setupSearch() {
    const searchInput = document.getElementById('searchSellerProducts');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSellerProducts();
            }
        });
    }
}

// Actualizar vista previa de imagen
function updateImagePreview() {
    const imageUrl = document.getElementById('productImage').value;
    const preview = document.getElementById('imagePreview');
    
    if (imageUrl && isValidUrl(imageUrl)) {
        preview.innerHTML = `
            <img src="${imageUrl}" alt="Vista previa" class="preview-image" 
                 onerror="this.style.display='none'; document.querySelector('.preview-placeholder').style.display='block';">
            <div class="preview-placeholder" style="display: none;">
                <i class="fas fa-image"></i>
                <p>Vista previa de la imagen aparecerá aquí</p>
            </div>
        `;
    } else {
        preview.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-image"></i>
                <p>Vista previa de la imagen aparecerá aquí</p>
            </div>
        `;
    }
}

// Validar URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Guardar producto
function saveProduct() {
    const formData = getFormData();
    
    if (!formData) return;
    
    if (currentEditId) {
        // Editar producto existente
        updateProduct(currentEditId, formData);
    } else {
        // Crear nuevo producto
        createProduct(formData);
    }
}

// Obtener datos del formulario
function getFormData() {
    const requiredFields = [
        'productName', 'productDescription', 'productPrice', 
        'productCategory', 'productStyle', 'productCondition',
        'productSize', 'productColor', 'productMaterial', 'productImage'
    ];
    
    // Validar campos requeridos
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            showSellerNotification(`El campo ${element.labels[0].textContent} es requerido`, 'error');
            element.focus();
            return null;
        }
    }
    
    return {
        id: currentEditId || Date.now(),
        nombre: document.getElementById('productName').value,
        descripcion: document.getElementById('productDescription').value,
        precio: parseFloat(document.getElementById('productPrice').value),
        categoria: document.getElementById('productCategory').value,
        estilo: document.getElementById('productStyle').value,
        estado: document.getElementById('productCondition').value,
        talla: document.getElementById('productSize').value,
        color: document.getElementById('productColor').value,
        marca: document.getElementById('productBrand').value || 'Marca Genérica',
        material: document.getElementById('productMaterial').value,
        imagen: document.getElementById('productImage').value,
        fechaPublicacion: new Date().toISOString(),
        vistas: 0,
        ventas: 0
    };
}

// Crear nuevo producto
function createProduct(productData) {
    sellerProducts.unshift(productData);
    saveSellerProducts();
    resetForm();
    showSellerNotification('Producto publicado exitosamente', 'success');
    showSection('productos');
}

// Actualizar producto existente
function updateProduct(productId, productData) {
    const index = sellerProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
        // Mantener vistas y ventas existentes
        productData.vistas = sellerProducts[index].vistas;
        productData.ventas = sellerProducts[index].ventas;
        
        sellerProducts[index] = { ...sellerProducts[index], ...productData };
        saveSellerProducts();
        resetForm();
        closeEditModal();
        showSellerNotification('Producto actualizado exitosamente', 'success');
        showSection('productos');
    }
}

// Renderizar productos del vendedor
function renderSellerProducts(filteredProducts = null) {
    const grid = document.getElementById('sellerProductsGrid');
    if (!grid) return;
    
    const productsToShow = filteredProducts || sellerProducts;
    
    if (productsToShow.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-tshirt"></i>
                <h3>${filteredProducts ? 'No se encontraron productos' : 'Aún no tienes productos publicados'}</h3>
                <p>${filteredProducts ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primera prenda sostenible'}</p>
                <button class="btn btn-primary" onclick="showSection('publicar')">
                    <i class="fas fa-plus-circle"></i>
                    Publicar Primer Producto
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="seller-product-card">
            <img src="${product.imagen}" alt="${product.nombre}" class="seller-product-image">
            <div class="seller-product-info">
                <div class="seller-product-header">
                    <div>
                        <h3 class="seller-product-title">${product.nombre}</h3>
                        <div class="seller-product-meta">
                            <span class="seller-product-badge">${product.estilo}</span>
                            <span class="seller-product-badge">${product.categoria}</span>
                            <span class="seller-product-badge">${product.estado}</span>
                        </div>
                    </div>
                    <div class="seller-product-price">$${product.precio.toFixed(2)}</div>
                </div>
                <p class="product-description">${product.descripcion}</p>
                <div class="product-details">
                    <div class="product-detail">
                        <i class="fas fa-ruler"></i>
                        <span>Talla: ${product.talla}</span>
                    </div>
                    <div class="product-detail">
                        <i class="fas fa-palette"></i>
                        <span>Color: ${product.color}</span>
                    </div>
                    <div class="product-detail">
                        <i class="fas fa-eye"></i>
                        <span>${product.vistas} vistas</span>
                    </div>
                </div>
                <div class="seller-product-actions">
                    <button class="btn btn-primary" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-secondary" onclick="viewProductStats(${product.id})">
                        <i class="fas fa-chart-bar"></i>
                        Stats
                    </button>
                    <button class="btn btn-danger" onclick="confirmDeleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Buscar productos del vendedor
function searchSellerProducts() {
    const searchTerm = document.getElementById('searchSellerProducts').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderSellerProducts();
        return;
    }
    
    const filteredProducts = sellerProducts.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm) ||
        product.descripcion.toLowerCase().includes(searchTerm) ||
        product.categoria.toLowerCase().includes(searchTerm) ||
        product.estilo.toLowerCase().includes(searchTerm) ||
        product.color.toLowerCase().includes(searchTerm) ||
        product.material.toLowerCase().includes(searchTerm)
    );
    
    renderSellerProducts(filteredProducts);
}

// Editar producto
function editProduct(productId) {
    const product = sellerProducts.find(p => p.id === productId);
    if (!product) return;
    
    currentEditId = productId;
    
    // Llenar formulario con datos del producto
    document.getElementById('productName').value = product.nombre;
    document.getElementById('productDescription').value = product.descripcion;
    document.getElementById('productPrice').value = product.precio;
    document.getElementById('productCategory').value = product.categoria;
    document.getElementById('productStyle').value = product.estilo;
    document.getElementById('productCondition').value = product.estado;
    document.getElementById('productSize').value = product.talla;
    document.getElementById('productColor').value = product.color;
    document.getElementById('productBrand').value = product.marca;
    document.getElementById('productMaterial').value = product.material;
    document.getElementById('productImage').value = product.imagen;
    
    // Actualizar vista previa
    updateImagePreview();
    
    // Mostrar sección de publicar
    showSection('publicar');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    showSellerNotification('Editando producto...', 'info');
}

// Confirmar eliminación de producto
function confirmDeleteProduct(productId) {
    const product = sellerProducts.find(p => p.id === productId);
    if (!product) return;
    
    showConfirmModal(
        `¿Estás seguro de que quieres eliminar "${product.nombre}"?`,
        () => deleteProduct(productId)
    );
}

// Eliminar producto
function deleteProduct(productId) {
    sellerProducts = sellerProducts.filter(p => p.id !== productId);
    saveSellerProducts();
    renderSellerProducts();
    updateSellerStats();
    showSellerNotification('Producto eliminado exitosamente', 'success');
}

// Ver estadísticas del producto
function viewProductStats(productId) {
    const product = sellerProducts.find(p => p.id === productId);
    if (!product) return;
    
    showSellerNotification(`Estadísticas de "${product.nombre}": ${product.vistas} vistas, ${product.ventas} ventas`, 'info');
}

// Resetear formulario
function resetForm() {
    document.getElementById('productForm').reset();
    currentEditId = null;
    updateImagePreview();
    
    // Cambiar texto del botón de submit
    const submitBtn = document.querySelector('#productForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Publicar Producto';
    }
}

// Actualizar estadísticas del vendedor
function updateSellerStats() {
    document.getElementById('totalProducts').textContent = sellerProducts.length;
    document.getElementById('salesCount').textContent = sellerProducts.reduce((sum, p) => sum + p.ventas, 0);
    
    // Simular algunas estadísticas
    const totalSales = sellerProducts.reduce((sum, p) => sum + p.ventas, 0);
    const totalViews = sellerProducts.reduce((sum, p) => sum + p.vistas, 0) || 1247;
    
    document.getElementById('totalSales').textContent = totalSales || 28;
    document.getElementById('totalViews').textContent = totalViews.toLocaleString();
}

// Guardar productos en localStorage
function saveSellerProducts() {
    localStorage.setItem('clotheusSellerProducts', JSON.stringify(sellerProducts));
    updateSellerStats();
}

// Funciones del modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

function showConfirmModal(message, confirmCallback) {
    const modal = document.getElementById('confirmModal');
    const messageElement = document.getElementById('confirmMessage');
    const confirmButton = document.getElementById('confirmAction');
    
    messageElement.textContent = message;
    confirmButton.onclick = confirmCallback;
    
    modal.style.display = 'flex';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

// Funciones de utilidad
function showSellerNotification(message, type = 'info') {
    // Reutilizar la función de notificación del cliente o crear una específica
    if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else {
        alert(message); // Fallback simple
    }
}

function viewSales() {
    showSellerNotification('Funcionalidad de ventas en desarrollo', 'info');
}

function showInventory() {
    showSection('productos');
}

// Cerrar modales al hacer click fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});