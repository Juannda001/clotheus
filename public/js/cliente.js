// Cliente JavaScript - Funcionalidades Avanzadas
document.addEventListener('DOMContentLoaded', function() {
    initializeCliente();
});

// Variables globales
let cart = JSON.parse(localStorage.getItem('clotheusCart')) || [];
let allProducts = [];
let currentFilters = {
    categoria: 'todos',
    estilo: 'todos',
    orden: 'nombre'
};

// Función para mostrar secciones - CORREGIDA
function showSection(section) {
    console.log('Mostrando sección:', section);
    
    // Ocultar todas las secciones principales
    const sections = document.querySelectorAll('.main-content, .store-section, .styles-section, .sustainable-section');
    sections.forEach(sec => {
        if (sec) sec.style.display = 'none';
    });
    
    // Mostrar la sección correspondiente
    switch(section) {
        case 'inicio':
            const mainContent = document.querySelector('.main-content');
            if (mainContent) mainContent.style.display = 'block';
            break;
        case 'tienda':
            const storeSection = document.querySelector('.store-section');
            if (storeSection) storeSection.style.display = 'block';
            break;
        case 'estilos':
            const stylesSection = document.querySelector('.styles-section');
            if (stylesSection) {
                stylesSection.style.display = 'block';
                // Recargar productos para esta sección si es necesario
                loadProducts();
            } else {
                console.error('No se encontró la sección styles-section');
            }
            break;
        case 'sostenible':
            const sustainableSection = document.querySelector('.sustainable-section');
            if (sustainableSection) sustainableSection.style.display = 'block';
            break;
    }
    
    // Actualizar navegación activa
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Marcar como activo el item clickeado
    event.target.classList.add('active');
    
    // Hacer scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para debug
function debugNavigation() {
    console.log('Secciones disponibles:');
    console.log('- Main content:', document.querySelector('.main-content'));
    console.log('- Store section:', document.querySelector('.store-section'));
    console.log('- Styles section:', document.querySelector('.styles-section'));
    console.log('- Sustainable section:', document.querySelector('.sustainable-section'));
}

function initializeCliente() {
    // Cargar productos
    loadProducts();
    
    // Configurar filtros
    setupFilters();
    
    // Configurar ordenamiento
    setupSorting();
    
    // Configurar carrito
    setupCart();
    
    // Configurar animaciones
    setupAnimations();
    
    // Actualizar UI del carrito
    updateCartUI();
}

// Cargar productos desde la API con filtros
async function loadProducts() {
    try {
        showLoadingState(true);
        
        const params = new URLSearchParams();
        if (currentFilters.categoria !== 'todos') params.append('categoria', currentFilters.categoria);
        if (currentFilters.estilo !== 'todos') params.append('estilo', currentFilters.estilo);
        if (currentFilters.orden !== 'nombre') params.append('orden', currentFilters.orden);
        
        const response = await fetch(`/api/productos?${params}`);
        allProducts = await response.json();
        displayProducts(allProducts);
        
    } catch (error) {
        console.error('Error cargando productos:', error);
        showNotification('Error al cargar productos', 'error');
        // Productos de ejemplo si falla la API
        loadSampleProducts();
    } finally {
        showLoadingState(false);
    }
}

function loadSampleProducts() {
    allProducts = [
        {
            id: 1,
            nombre: "Camiseta Vintage Algodón Orgánico",
            precio: 22.99,
            estilo: "vintage",
            categoria: "camisas",
            imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            descripcion: "Camiseta 100% algodón orgánico en perfecto estado vintage",
            estado: "Excelente",
            talla: "M",
            marca: "Sustainable Wear",
            color: "Azul",
            material: "Algodón Orgánico"
        },
        {
            id: 2,
            nombre: "Jeans Slim Fit Reciclados",
            precio: 35.50,
            estilo: "urbano",
            categoria: "pantalones", 
            imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
            descripcion: "Jeans de mezclilla reciclada, corte moderno y sostenible",
            estado: "Como nuevo",
            talla: "32",
            marca: "Eco Denim",
            color: "Azul Oscuro",
            material: "Mezclilla Reciclada"
        }
    ];
    displayProducts(allProducts);
}

// Mostrar productos en el grid - CORREGIDO PRECIOS
function displayProducts(productos) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (productos.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros filtros o categorías</p>
                <button class="btn btn-secondary" onclick="resetFilters()">
                    <i class="fas fa-refresh"></i>
                    Reiniciar Filtros
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = productos.map(producto => `
        <div class="product-card" onclick="viewProduct(${producto.id})" data-category="${producto.categoria}" data-style="${producto.estilo}">
            <div class="product-image-container">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                <span class="product-badge estado-${producto.estado.toLowerCase().replace(' ', '-')}">
                    ${producto.estado}
                </span>
            </div>
            <div class="product-info">
                <h3 class="product-title">${producto.nombre}</h3>
                <div class="product-meta">
                    <span class="product-style">${producto.estilo}</span>
                    <span class="product-size">Talla: ${producto.talla}</span>
                </div>
                <div class="product-details">
                    <div class="product-detail">
                        <i class="fas fa-tag"></i>
                        <span>${producto.marca}</span>
                    </div>
                    <div class="product-detail">
                        <i class="fas fa-palette"></i>
                        <span>${producto.color}</span>
                    </div>
                </div>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-footer">
                    <!-- PRECIO MEJORADO - Más grande y destacado -->
                    <div class="product-price-container">
                        <span class="product-price">$${producto.precio.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart(${producto.id})">
                        <i class="fas fa-shopping-bag"></i>
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateProductCount(productos.length);
}

// Configurar sistema de filtros
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const styleButtons = document.querySelectorAll('.filter-btn[data-style]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterGroup = this.closest('.filter-options');
            filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            currentFilters.categoria = this.dataset.filter;
            loadProducts();
        });
    });
    
    styleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterGroup = this.closest('.filter-options');
            filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            currentFilters.estilo = this.dataset.style;
            loadProducts();
        });
    });
}

// Configurar sistema de ordenamiento
function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentFilters.orden = this.value;
            sortProductsLocally(this.value);
        });
    }
}

// Función de ordenamiento local
function sortProductsLocally(sortBy) {
    let sortedProducts = [...allProducts];
    
    switch(sortBy) {
        case 'precio-asc':
            sortedProducts.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            sortedProducts.sort((a, b) => b.precio - a.precio);
            break;
        case 'nombre':
            sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        default:
            sortedProducts.sort((a, b) => a.id - b.id);
    }
    
    displayProducts(sortedProducts);
    showNotification(`Productos ordenados por ${getSortingLabel(sortBy)}`, 'success');
}

function getSortingLabel(sortBy) {
    const labels = {
        'nombre': 'Nombre A-Z',
        'precio-asc': 'Precio: Menor a Mayor', 
        'precio-desc': 'Precio: Mayor a Menor'
    };
    return labels[sortBy] || 'Orden predeterminado';
}

// Sistema de carrito avanzado
function setupCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const closeCart = document.querySelector('.close-cart');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartSidebar.classList.add('active');
            renderCartItems();
        });
        
        closeCart.addEventListener('click', (e) => {
            e.stopPropagation();
            cartSidebar.classList.remove('active');
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            proceedToCheckout();
        });
    }
    
    if (cartSidebar) {
        cartSidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    document.addEventListener('click', (e) => {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (cartSidebar && cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && 
            !e.target.closest('.cart-btn')) {
            cartSidebar.classList.remove('active');
        }
    });
}

// Agregar producto al carrito
function addToCart(productId, openCart = false) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        cart.push({
            ...product,
            cantidad: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    updateCartUI();
    
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        renderCartItems();
    }
    
    showAddToCartNotification(product.nombre);
}

// Remover producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCartItems();
    showNotification('Producto removido del carrito', 'warning');
}

// Actualizar cantidad en el carrito
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.cantidad += change;
    
    if (item.cantidad <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (item.cantidad > 10) {
        item.cantidad = 10;
        showNotification('Máximo 10 unidades por producto', 'warning');
    }
    
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Renderizar items del carrito
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Tu carrito está vacío</p>
                <span>Agrega algunos productos sostenibles</span>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-details">
                    Talla: ${item.talla} | Color: ${item.color}
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" ${item.cantidad <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.cantidad}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" ${item.cantidad >= 10 ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">$${(item.precio * item.cantidad).toFixed(2)}</div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remover producto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) {
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const envio = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + envio;
        
        cartFooter.innerHTML = `
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Envío:</span>
                    <span>${envio === 0 ? 'GRATIS' : `$${envio.toFixed(2)}`}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span class="amount">$${total.toFixed(2)}</span>
                </div>
            </div>
            <button class="btn btn-primary btn-checkout" onclick="proceedToCheckout()">
                <i class="fas fa-credit-card"></i>
                Proceder al Pago
            </button>
        `;
    }
}

// Ver detalles del producto (modal)
async function viewProduct(productId) {
    try {
        const response = await fetch(`/api/productos/${productId}`);
        const product = await response.json();
        showProductModal(product);
    } catch (error) {
        console.error('Error cargando producto:', error);
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            showProductModal(product);
        }
    }
}

function showProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'product-modal active';
    modal.innerHTML = `
        <div class="modal-product-content">
            <div class="modal-product-header">
                <h2>${product.nombre}</h2>
                <button class="close-modal" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-product-body">
                <img src="${product.imagen}" alt="${product.nombre}" class="modal-product-image">
                <div class="modal-product-info">
                    <div class="modal-product-price">$${product.precio.toFixed(2)}</div>
                    <p class="modal-product-description">${product.descripcion}</p>
                    
                    <div class="modal-product-details">
                        <div class="modal-detail">
                            <span class="modal-detail-label">Marca</span>
                            <span class="modal-detail-value">${product.marca}</span>
                        </div>
                        <div class="modal-detail">
                            <span class="modal-detail-label">Estado</span>
                            <span class="modal-detail-value">${product.estado}</span>
                        </div>
                        <div class="modal-detail">
                            <span class="modal-detail-label">Talla</span>
                            <span class="modal-detail-value">${product.talla}</span>
                        </div>
                        <div class="modal-detail">
                            <span class="modal-detail-label">Color</span>
                            <span class="modal-detail-value">${product.color}</span>
                        </div>
                        <div class="modal-detail">
                            <span class="modal-detail-label">Material</span>
                            <span class="modal-detail-value">${product.material}</span>
                        </div>
                        <div class="modal-detail">
                            <span class="modal-detail-label">Estilo</span>
                            <span class="modal-detail-value">${product.estilo}</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-primary btn-modal-primary" onclick="addToCart(${product.id}); closeModal();">
                            <i class="fas fa-shopping-bag"></i>
                            Agregar al Carrito
                        </button>
                        <button class="btn btn-secondary btn-modal-secondary" onclick="closeModal()">
                            <i class="fas fa-times"></i>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.remove();
    }
}

// Funciones de utilidad
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = totalItems;
    }
}

function updateProductCount(count) {
    const productCount = document.querySelector('.sorting-info');
    if (productCount) {
        productCount.textContent = `${count} producto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
}

function saveCart() {
    localStorage.setItem('clotheusCart', JSON.stringify(cart));
}

function showAddToCartNotification(productName) {
    showNotification(`"${productName}" agregado al carrito`, 'success');
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function showLoadingState(show) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (show) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="loading-spinner"></div>
                <p>Cargando productos sostenibles...</p>
            </div>
        `;
    }
}

function resetFilters() {
    currentFilters = {
        categoria: 'todos',
        estilo: 'todos',
        orden: 'nombre'
    };
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === 'todos' || btn.dataset.style === 'todos') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = 'nombre';
    }
    
    loadProducts();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    showNotification('¡Gracias por tu compra sostenible! 🍃', 'success');
    
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        renderCartItems();
        document.querySelector('.cart-sidebar').classList.remove('active');
    }, 2000);
}

// Configurar tema y animaciones
function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-card, .impact-stat, .filter-category').forEach(el => {
        observer.observe(el);
    });
}

// Funciones de búsqueda mejoradas
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showNotification('Escribe algo para buscar', 'warning');
        return;
    }
    
    const filteredProducts = allProducts.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm) ||
        producto.descripcion.toLowerCase().includes(searchTerm) ||
        producto.estilo.toLowerCase().includes(searchTerm) ||
        producto.marca.toLowerCase().includes(searchTerm) ||
        producto.material.toLowerCase().includes(searchTerm) ||
        producto.color.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length === 0) {
        showNotification(`No se encontraron resultados para "${searchTerm}"`, 'warning');
        displayProducts([]);
    } else {
        displayProducts(filteredProducts);
        showNotification(`Encontrados ${filteredProducts.length} productos para "${searchTerm}"`, 'success');
    }
}

function searchByTag(tag) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = tag;
    performSearch();
}

// Permitir búsqueda con Enter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Función para scroll a productos
function scrollToProducts() {
    const productsSection = document.getElementById('tienda');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        setTimeout(() => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }, 800);
    }
}

// Función para mostrar todos los productos
function showAllProducts() {
    resetFilters();
    
    setTimeout(() => {
        scrollToProducts();
    }, 100);
    
    showNotification('Mostrando todos los productos disponibles', 'success');
}

// Función para activar la búsqueda
function activateSearch() {
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    
    searchContainer.style.display = 'block';
    
    setTimeout(() => {
        if (searchInput) {
            searchInput.focus();
        }
    }, 300);
    
    setTimeout(() => {
        searchContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 400);
}

// Funciones de búsqueda
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showNotification('Escribe algo para buscar', 'warning');
        return;
    }
    
    const filteredProducts = allProducts.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm) ||
        producto.descripcion.toLowerCase().includes(searchTerm) ||
        producto.estilo.toLowerCase().includes(searchTerm) ||
        producto.marca.toLowerCase().includes(searchTerm) ||
        producto.material.toLowerCase().includes(searchTerm) ||
        producto.color.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length === 0) {
        showNotification(`No se encontraron resultados para "${searchTerm}"`, 'warning');
        displayProducts([]);
    } else {
        const productsSection = document.getElementById('tienda');
        if (productsSection) {
            productsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        displayProducts(filteredProducts);
        showNotification(`Encontrados ${filteredProducts.length} productos para "${searchTerm}"`, 'success');
    }
}

function searchByTag(tag) {
    const searchInput = document.getElementById('searchInput');
    const searchContainer = document.getElementById('searchContainer');
    
    searchContainer.style.display = 'block';
    searchInput.value = tag;
    performSearch();
}