const express = require('express');
const jwt = require('jsonwebtoken'); // 1. Importar JWT
const app = express();
const PORT = 3000;

app.use(express.json()); //Necesario para leer el body en POST

// Definir una clave secreta para firmar los tokens. ¡Debe ser la misma en ambos servicios!
const JWT_SECRET = 'mi_super_secreto_seguro_y_largo_debe_estar_en_env';

// 2. Ruta de Login de ejemplo (simulando éxito)
app.post('/login', (req, res) => {
    // Aquí iría la lógica real de DB para verificar usuario/contraseña
    // Asumimos éxito para el ejemplo:
    const user = { 
        id: 123, 
        role: 'doctor', 
        username: 'juanp' 
    };
// Crear el token: payload, secreto, opciones (expiración)
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: token });
});

app.get('/health', (req, res) => {
  res.status(200).send('Auth Service is running!');
});

app.listen(PORT, () => {
  console.log(`Auth Service listening on port ${PORT}`);
});