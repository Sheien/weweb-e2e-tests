// patch-fs.js
import fs from 'fs';
import path from 'path';

const resultsPath = path.resolve('./test-results');
if (fs.existsSync(resultsPath)) {
  fs.rmSync(resultsPath, { recursive: true, force: true });
}
