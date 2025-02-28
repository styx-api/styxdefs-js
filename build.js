const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

// Build for ESM
esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.esm.js',
  bundle: true,
  minify: true,
  platform: 'neutral',
  format: 'esm',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
  target: ['es2020']
}).catch(() => process.exit(1));

// Build for CommonJS
esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.cjs.js',
  bundle: true,
  minify: true,
  platform: 'node',
  format: 'cjs',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
  target: ['es2020']
}).catch(() => process.exit(1));

// Generate type definitions
require('child_process').execSync('tsc --emitDeclarationOnly --outDir dist/types');
