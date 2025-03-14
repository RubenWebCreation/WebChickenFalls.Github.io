const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener los productos desde el JSON
app.get('/productos', (req, res) => {
    const productosPath = path.join(__dirname, 'productos.json');
    fs.readFile(productosPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo los productos' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});