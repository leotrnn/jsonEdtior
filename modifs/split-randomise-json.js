const fs = require('fs');
const path = require('path');

// Lire message.json
const rawData = fs.readFileSync('source/message.json');
const data = JSON.parse(rawData);

// Mélanger les objets du tableau
const shuffled = data.sort(() => Math.random() - 0.5);

// Créer le dossier json/ s’il n’existe pas
const outputDir = path.join(__dirname, 'json');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Écrire le tableau complet mélangé
fs.writeFileSync(path.join(outputDir, 'message_random.json'), JSON.stringify(shuffled, null, 2));

// Trouver dynamiquement les clés et créer un fichier par clé
const allKeys = Object.keys(shuffled[0]);
for (const key of allKeys) {
  const values = shuffled.map(item => item[key]);
  const filePath = path.join(outputDir, `message_${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(values, null, 2));
}

console.log(`${allKeys.length + 1} fichiers générés dans le dossier json/`);
