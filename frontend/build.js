import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

build({
  root: path.resolve(__dirname),
  build: {
    outDir: 'dist',
  },
}).catch((err) => {
  console.error(err);
  process.exit(1);
});