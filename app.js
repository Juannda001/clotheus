const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cliente.html'));
});

app.get('/vendedor', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'vendedor.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// API simulada para productos

// API simulada para productos - CATÁLOGO AMPLIADO
app.get('/api/productos', (req, res) => {
    const productos = [
        // ROPA SUPERIOR (8 productos)
        {
            id: 1,
            nombre: "Camiseta Vintage Algodón Orgánico",
            precio: 22.99,
            estilo: "vintage",
            categoria: "camisas",
            imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            descripcion: "Camiseta 100% algodón orgánico en perfecto estado vintage, diseño único",
            estado: "Excelente",
            talla: "M",
            marca: "Sustainable Wear",
            color: "Azul",
            material: "Algodón Orgánico"
        },
        {
            id: 2,
            nombre: "Blusa Elegante de Seda Natural",
            precio: 45.50,
            estilo: "formal",
            categoria: "blusas",
            imagen: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400",
            descripcion: "Blusa de seda natural, perfecta para ocasiones especiales",
            estado: "Como nuevo",
            talla: "S",
            marca: "Eco Luxury",
            color: "Blanco",
            material: "Seda Natural"
        },
        {
            id: 3,
            nombre: "Sudadera Eco-Friendly con Capucha",
            precio: 35.00,
            estilo: "casual",
            categoria: "sudaderas",
            imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
            descripcion: "Sudadera cómoda hecha con materiales reciclados, ideal para días frescos",
            estado: "Excelente",
            talla: "L",
            marca: "Eco Comfort",
            color: "Gris",
            material: "Algodón Reciclado"
        },
        {
            id: 4,
            nombre: "Camisa Formal Lino Reciclado",
            precio: 38.75,
            estilo: "formal",
            categoria: "camisas",
            imagen: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
            descripcion: "Camisa formal de lino reciclado, elegante y sostenible",
            estado: "Buen estado",
            talla: "M",
            marca: "Professional Green",
            color: "Beige",
            material: "Lino Reciclado"
        },

        // ROPA INFERIOR (6 productos)
        {
            id: 5,
            nombre: "Jeans Slim Fit Reciclados",
            precio: 42.00,
            estilo: "urbano",
            categoria: "pantalones", 
            imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
            descripcion: "Jeans de mezclilla reciclada, corte moderno y sostenible",
            estado: "Como nuevo",
            talla: "32",
            marca: "Eco Denim",
            color: "Azul Oscuro",
            material: "Mezclilla Reciclada"
        },
        {
            id: 6,
            nombre: "Shorts Deportivos Reciclados",
            precio: 25.99,
            estilo: "deportivo",
            categoria: "pantalones",
            imagen: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=400",
            descripcion: "Shorts cómodos para deporte, materiales ecológicos y transpirables",
            estado: "Buen estado",
            talla: "M",
            marca: "Eco Active",
            color: "Negro",
            material: "Polyster Reciclado"
        },
        {
            id: 7,
            nombre: "Falda Midi Elegante Sostenible",
            precio: 36.50,
            estilo: "formal",
            categoria: "faldas",
            imagen: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
            descripcion: "Falda midi perfecta para ocasiones especiales, confección ética",
            estado: "Excelente",
            talla: "S",
            marca: "Ethical Style",
            color: "Negro",
            material: "Tencel"
        },
        {
            id: 8,
            nombre: "Pantalón Cargo Verde Militar",
            precio: 39.99,
            estilo: "urbano",
            categoria: "pantalones",
            imagen: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
            descripcion: "Pantalón cargo estilo militar, práctico y con múltiples bolsillos",
            estado: "Poco uso",
            talla: "L",
            marca: "Urban Eco",
            color: "Verde Militar",
            material: "Algodón Reciclado"
        },

        // VESTIDOS (3 productos)
        {
            id: 9,
            nombre: "Vestido Floral Verano Sostenible",
            precio: 55.00,
            estilo: "casual",
            categoria: "vestidos",
            imagen: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
            descripcion: "Vestido floral perfecto para días soleados, confección ética y fresca",
            estado: "Poco uso",
            talla: "S",
            marca: "Green Fashion",
            color: "Floral",
            material: "Lino Orgánico"
        },
        {
            id: 10,
            nombre: "Vestido Negro Elegante de Segunda Mano",
            precio: 48.75,
            estilo: "formal",
            categoria: "vestidos",
            imagen: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400",
            descripcion: "Vestido negro timeless, perfecto para eventos formales",
            estado: "Excelente",
            talla: "M",
            marca: "Classic Renew",
            color: "Negro",
            material: "Poliéster Reciclado"
        },

        // CHAQUETAS Y ABRIGOS (4 productos)
        {
            id: 11,
            nombre: "Chaqueta Denim Clásica Reutilizada",
            precio: 52.00,
            estilo: "casual", 
            categoria: "chaquetas",
            imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
            descripcion: "Chaqueta denim timeless, nunca pasa de moda, segunda vida garantizada",
            estado: "Buen estado",
            talla: "L",
            marca: "Vintage Co.",
            color: "Denim",
            material: "Mezclilla"
        },
        {
            id: 12,
            nombre: "Blazer Formal de Segunda Mano",
            precio: 65.00,
            estilo: "formal",
            categoria: "chaquetas",
            imagen: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
            descripcion: "Blazer elegante para look profesional sostenible, calidad premium",
            estado: "Excelente",
            talla: "M",
            marca: "Professional Green",
            color: "Azul Marino",
            material: "Lana Reciclada"
        },
        {
            id: 13,
            nombre: "Chaqueta Cortavientos Ecológica",
            precio: 47.50,
            estilo: "deportivo",
            categoria: "chaquetas",
            imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
            descripcion: "Chaqueta ligera impermeable, ideal para actividades al aire libre",
            estado: "Como nuevo",
            talla: "XL",
            marca: "Outdoor Eco",
            color: "Azul",
            material: "Nylon Reciclado"
        },

        // ACCESORIOS (8 productos)
        {
            id: 14,
            nombre: "Bufanda de Lana Orgánica Invierno",
            precio: 18.99,
            estilo: "casual",
            categoria: "accesorios",
            imagen: "https://plus.unsplash.com/premium_photo-1695603438043-1b9ab6ebe1a8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
            descripcion: "Bufanda suave de lana orgánica, abrigo natural y sostenible",
            estado: "Excelente",
            talla: "Única",
            marca: "Winter Eco",
            color: "Gris Carbón",
            material: "Lana Orgánica"
        },
        {
            id: 15,
            nombre: "Gafas de Sol Vintage Madera",
            precio: 29.50,
            estilo: "vintage",
            categoria: "accesorios",
            imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
            descripcion: "Gafas de sol con montura de madera recuperada, estilo único retro",
            estado: "Como nuevo",
            talla: "Única",
            marca: "Eco Vision",
            color: "Marrón",
            material: "Madera Recuperada"
        },
        {
            id: 16,
            nombre: "Bolso Tote Algodón Reciclado",
            precio: 34.00,
            estilo: "casual",
            categoria: "accesorios",
            imagen: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
            descripcion: "Bolso tote espacioso, perfecto para el día a día, materiales ecológicos",
            estado: "Buen estado",
            talla: "Única",
            marca: "Eco Bags",
            color: "Natural",
            material: "Algodón Reciclado"
        },
        {
            id: 17,
            nombre: "Gorra Deportiva Reciclada",
            precio: 15.75,
            estilo: "deportivo",
            categoria: "accesorios",
            imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
            descripcion: "Gorra deportiva cómoda, ideal para actividades al aire libre",
            estado: "Poco uso",
            talla: "Ajustable",
            marca: "Sport Eco",
            color: "Negro",
            material: "Poliéster Reciclado"
        },
        {
            id: 18,
            nombre: "Cinturón de Cuero Vegano",
            precio: 22.50,
            estilo: "formal",
            categoria: "accesorios",
            imagen: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
            descripcion: "Cinturón elegante de cuero vegano, alternativa cruelty-free",
            estado: "Excelente",
            talla: "M",
            marca: "Vegan Style",
            color: "Marrón",
            material: "Cuero Vegano"
        },
        {
            id: 19,
            nombre: "Pañuelo Seda Estampado Vintage",
            precio: 19.99,
            estilo: "vintage",
            categoria: "accesorios",
            imagen: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
            descripcion: "Pañuelo de seda con estampado vintage, accesorio versátil y elegante",
            estado: "Como nuevo",
            talla: "Única",
            marca: "Vintage Silk",
            color: "Estampado",
            material: "Seda"
        },
        {
            id: 20,
            nombre: "Mochila Laptop Sostenible",
            precio: 58.00,
            estilo: "urbano",
            categoria: "accesorios",
            imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
            descripcion: "Mochila profesional con compartimento para laptop, diseño ergonómico",
            estado: "Buen estado",
            talla: "Única",
            marca: "Eco Work",
            color: "Gris Oscuro",
            material: "Poliéster Reciclado"
        },
        {
            id: 21,
            nombre: "Sombrero Panamá Orgánico Verano",
            precio: 27.50,
            estilo: "casual",
            categoria: "accesorios",
            imagen: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400",
            descripcion: "Sombrero panamá de fibras naturales, protección solar elegante",
            estado: "Poco uso",
            talla: "M",
            marca: "Summer Eco",
            color: "Natural",
            material: "Fibras Naturales"
        }
    ];
    
    // (Mantener el código de filtrado y ordenamiento que ya tienes)
    const { categoria, estilo, orden } = req.query;
    let filteredProducts = [...productos];
    
    if (categoria && categoria !== 'todos') {
        filteredProducts = filteredProducts.filter(p => p.categoria === categoria);
    }
    
    if (estilo && estilo !== 'todos') {
        filteredProducts = filteredProducts.filter(p => p.estilo === estilo);
    }
    
    // Ordenamiento
    if (orden === 'precio-asc') {
        filteredProducts.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio-desc') {
        filteredProducts.sort((a, b) => b.precio - a.precio);
    } else if (orden === 'nombre') {
        filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    
    res.json(filteredProducts);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🛍️ ClotheUs servidor corriendo en http://localhost:${PORT}`);
    console.log(`📂 Directorio estático: ${path.join(__dirname, 'public')}`);
});