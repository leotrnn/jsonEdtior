const fs = require('fs');

// Lire le fichier message.json (qui contient un tableau d'objets)
const rawData = fs.readFileSync('source/message.json');
const data = JSON.parse(rawData);

// Mélanger les éléments du tableau
const shuffled = data.sort(() => Math.random() - 0.5);

// Écrire le résultat dans un nouveau fichier
fs.writeFileSync('message_random.json', JSON.stringify(shuffled, null, 2));

console.log('message_random.json créé avec les objets mélangés.');
