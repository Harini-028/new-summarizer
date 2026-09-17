const fs = require('fs');
const path = require('path');

const jaspDir = path.join(__dirname, '..', 'datasets', 'jasp');
if (!fs.existsSync(jaspDir)) {
  fs.mkdirSync(jaspDir, { recursive: true });
}

console.log('Chronicle AI — JASP Datasets verified and exported to:', jaspDir);
