const fs = require('fs');
const path = require('path');
const { version } = require('./package.json');

const environmentFilePath = path.join(__dirname, 'src/environments/environment.ts');

// Leer el contenido del archivo de entorno
let environmentFileContent = fs.readFileSync(environmentFilePath, 'utf8');

// Reemplazar la versión usando una expresión regular
environmentFileContent = environmentFileContent.replace(
  /version: '.*'/,
  `version: '${version}'`
);

// Escribir el nuevo contenido de vuelta al archivo
fs.writeFileSync(environmentFilePath, environmentFileContent);

console.log(`✅ Version  set in `);
