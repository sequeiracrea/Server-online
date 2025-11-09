// server-online.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003; // Render définit le port automatiquement

// Permettre les requêtes depuis n'importe quelle origine (CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  next();
});

// --- Génération de données aléatoires ---
function generateRandomData() {
  const now = new Date().toISOString();
  return {
    timestamp: now,
    co: +(Math.random() * 1).toFixed(3),
    co2: Math.floor(350 + Math.random() * 100),
    nh3: +(Math.random() * 1).toFixed(3),
    no2: +(Math.random() * 1).toFixed(3),
    humidity: +(40 + Math.random() * 20).toFixed(2),
    bmp_temp: +(18 + Math.random() * 5).toFixed(2),
    scd_temp: +(18 + Math.random() * 5).toFixed(2),
    pressure: +(1000 + Math.random() * 20).toFixed(2)
  };
}

// --- Simulation de capteurs différents pour chaque proto ---
let dataProto1 = [];
let dataProto2 = [];

// Mise à jour toutes les 5 secondes pour chaque proto
setInterval(() => {
  const newData1 = generateRandomData();
  const newData2 = generateRandomData();
  dataProto1.push(newData1);
  dataProto2.push(newData2);
  if (dataProto1.length > 50) dataProto1.shift();
  if (dataProto2.length > 50) dataProto2.shift();

  console.clear();
  console.log('Dernière mesure Proto1 :', newData1);
  console.log('Dernière mesure Proto2 :', newData2);
}, 5000);

// --- Routes d'API ---
app.get('/', (req, res) => {
  res.send(JSON.stringify({
    message: '✅ Server Online',
    endpoints: {
      proto1: '/api/proto1/data',
      proto2: '/api/proto2/data',
      global: '/sensor'
    }
  }, null, 2));
});

// Route commune (ancienne version)
app.get('/sensor', (req, res) => {
  res.send(JSON.stringify({
    proto1: dataProto1.slice(-1)[0],
    proto2: dataProto2.slice(-1)[0]
  }, null, 2));
});

// Données spécifiques Proto1
app.get('/api/proto1/data', (req, res) => {
  res.send(JSON.stringify(dataProto1, null, 2));
});

// Données spécifiques Proto2
app.get('/api/proto2/data', (req, res) => {
  res.send(JSON.stringify(dataProto2, null, 2));
});

// --- Démarrage du serveur ---
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Access: http://localhost:${PORT}/`);
});
