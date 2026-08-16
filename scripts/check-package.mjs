import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cache = mkdtempSync(join(tmpdir(), 'git-mailmap-pack-'));
let output;

try {
  output = execFileSync(
    'npm',
    ['pack', '--dry-run', '--json', '--ignore-scripts', '--cache', cache],
    { encoding: 'utf8' },
  );
} finally {
  rmSync(cache, { recursive: true, force: true });
}

const [manifest] = JSON.parse(output);
const actual = manifest.files.map(({ path }) => path).sort();
const expected = [
  'CHANGELOG.md',
  'LICENSE',
  'README.md',
  'ROADMAP.md',
  'dist/index.cjs',
  'dist/index.d.cts',
  'dist/index.d.ts',
  'dist/index.js',
  'package.json',
].sort();

if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  throw new Error(
    `Unexpected package contents.\nExpected: ${expected.join(', ')}\nActual: ${actual.join(', ')}`,
  );
}

if (readFileSync('README.md', 'utf8').includes('THIRD_PARTY_NOTICES.md')) {
  throw new Error('README.md references a file excluded from the package.');
}

for (const path of ['dist/index.cjs', 'dist/index.js']) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const longestLine = Math.max(...lines.map((line) => line.length));

  if (longestLine > 500) {
    throw new Error(
      `${path} appears to be minified (longest line: ${longestLine} characters).`,
    );
  }
}

console.log(`Package contents verified (${actual.length} files).`);
