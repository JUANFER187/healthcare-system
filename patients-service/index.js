const express = require('express');
const jwt = require('jsonwebtoken'); // 1. Importar JWT
const app = express();
const PORT = 3001;

app.use(express.json());

// MISMA CLAVE SECRETA que en Auth-Service
const JWT_SECRET = 'mi_super_secreto_seguro_y_largo_debe_estar_en_env'; 

// 2. Middleware para validar el Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // El token viene en formato: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // 401: No autorizado (sin token)

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // 403: Prohibido (token inválido o expirado)
        
        req.user = user; // Adjuntamos la información del usuario al request
        next(); // Continuar a la ruta
    });
}

app.get('/health', (req, res) => {
  res.status(200).send('Patients Service is running!');
});

// 3. Aplicar el middleware a la ruta protegida
// Ahora (Escuchando en la ruta raíz, que es lo que el Ingress le envía):
app.get('/', authenticateToken, (req, res) => {
    // La lista de pacientes que esperamos
    res.json([{id: 1, name: "Juan Pérez"}]);
});

app.listen(PORT, () => {
  console.log(`Patients Service listening on port ${PORT}`);
});