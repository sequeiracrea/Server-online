// server-online.js
const express = require('express');
const app = express();
const PORT = 3003;

let sensorData = [];

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

// Mise à jour toutes les 5 secondes
setInterval(() => {
    const newData = generateRandomData();
    sensorData.push(newData);
    if (sensorData.length > 50) sensorData.shift();
    console.clear();
    console.log('Dernière mesure :', newData);
}, 5000);

// Page d’accueil
app.get('/', (req, res) => {
    res.send('Server Online: Accède aux données sur /sensor');
});

// Route pour JSON indenté
app.get('/sensor', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(sensorData, null, 2));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Online server running at http://localhost:${PORT}/sensor`);
    console.log(`🌐 Pour partager via ngrok : ngrok http ${PORT}`);
});
