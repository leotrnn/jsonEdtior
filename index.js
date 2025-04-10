const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Dossier source et output
const sourceDir = path.join(__dirname, 'source');
const outputDir = path.join(__dirname, 'json');

// Créer le dossier json/ s’il n’existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Lister les fichiers JSON disponibles dans /source
const jsonFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));

// Configurer l'interface readline pour la saisie utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour poser une question avec promesse
const askQuestion = (question) => new Promise(resolve => rl.question(question, resolve));

async function run() {
  try {
    // Afficher les fichiers disponibles
    console.log("Voici les fichiers disponibles :");
    jsonFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    // Demander quel fichier l'utilisateur veut modifier
    const fileChoice = await askQuestion('Choisissez le fichier à modifier (1, 2, ...): ');

    const selectedFile = jsonFiles[parseInt(fileChoice) - 1];
    if (!selectedFile) {
      console.log('Fichier non valide.');
      rl.close();
      return;
    }

    // Demander l'action à effectuer
    console.log('1. Randomiser uniquement');
    console.log('2. Split + Random');
    const actionChoice = await askQuestion('Choisissez l\'action à effectuer (1 ou 2): ');

    const filePath = path.join(sourceDir, selectedFile);
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);

    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const baseName = path.parse(selectedFile).name;

    // 1. Randomiser uniquement
    if (actionChoice === '1') {
      fs.writeFileSync(
        path.join(outputDir, `${baseName}_random.json`),
        JSON.stringify(shuffled, null, 2)
      );
      console.log(`✅ Fichier généré : ${baseName}_random.json`);
    }

    // 2. Split + Random
    if (actionChoice === '2') {
      fs.writeFileSync(
        path.join(outputDir, `${baseName}_random.json`),
        JSON.stringify(shuffled, null, 2)
      );

      const keys = Object.keys(shuffled[0]);
      keys.forEach((key) => {
        const values = shuffled.map((item) => item[key]);
        fs.writeFileSync(
          path.join(outputDir, `${baseName}_${key}.json`),
          JSON.stringify(values, null, 2)
        );
      });

      console.log(`✅ Fichiers générés : ${baseName}_random.json + 1 par clé`);
    }

    rl.close();
  } catch (err) {
    console.error('Erreur:', err);
    rl.close();
  }
}

run();
