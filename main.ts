import { cpSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const project = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const canonical = JSON.parse(readFileSync(join(project, 'app/data/trophies.json'), 'utf8'));
if (canonical.trophies.length !== 55 || canonical.trophies.some(t => !t.guide)) {
  throw new Error('The guide must contain all 55 trophies with original guidance.');
}
mkdirSync(destination, { recursive: true });
for (const folder of ['app', 'screenshots']) {
  cpSync(join(project, folder), join(destination, folder), { recursive: true });
}
writeFileSync(join(destination, 'dossier.json'), buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
}));
