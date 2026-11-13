import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const baselinePath = resolve(root, 'tsc-baseline.json');
const args = process.argv.slice(2);
const update = args.includes('--update');
const showKnown = args.includes('--known');
const scopes = args
  .filter(arg => !arg.startsWith('--'))
  .map(arg => relative(root, resolve(process.cwd(), arg)).replace(/\/+$/, ''));
const errorLine = /^([^(]+)\(\d+,\d+\): error TS\d+:/;

if (update && scopes.length > 0) {
  console.error('--update rewrites the whole baseline: run it without paths');
  process.exit(1);
}

/** @param {string} file */
const inScope = file =>
  scopes.length === 0 ||
  scopes.some(
    scope => scope === '' || file === scope || file.startsWith(`${scope}/`),
  );

const result = spawnSync(
  'npx',
  ['tsc', '--noEmit', '-p', '.', '--pretty', 'false'],
  {cwd: root, encoding: 'utf8'},
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
/** @type {{file: string, text: string}[]} */
const diagnostics = [];
let current = null;

for (const line of output.split(/\r?\n/)) {
  const match = line.match(errorLine);
  if (match) {
    if (current) diagnostics.push(current);
    current = {file: match[1], text: line};
    continue;
  }
  if (current && line !== '') {
    current.text += `\n${line}`;
  }
}
if (current) diagnostics.push(current);

if ((result.status ?? 1) !== 0 && diagnostics.length === 0) {
  process.stderr.write(output);
  process.exit(result.status ?? 1);
}

/** @type {Record<string, number>} */
const counts = {};
for (const diagnostic of diagnostics) {
  counts[diagnostic.file] = (counts[diagnostic.file] ?? 0) + 1;
}

/** @type {Record<string, number>} */
const baseline = existsSync(baselinePath)
  ? JSON.parse(readFileSync(baselinePath, 'utf8'))
  : {};
const hadBaseline = existsSync(baselinePath);

let known = 0;
let added = 0;
let decreased = false;
/** @type {string[]} */
const worse = [];

for (const file of new Set([
  ...Object.keys(counts),
  ...Object.keys(baseline),
])) {
  if (!inScope(file)) continue;
  const currentCount = counts[file] ?? 0;
  const baseCount = baseline[file] ?? 0;
  known += Math.min(currentCount, baseCount);
  if (currentCount > baseCount) {
    added += currentCount - baseCount;
    worse.push(file);
  } else if (currentCount < baseCount) {
    decreased = true;
  }
}

const scopeNote = scopes.length > 0 ? ` (in ${scopes.join(', ') || '.'})` : '';
const summary = `tsc: ${known} known, ${added} new${scopeNote}`;
const refuseUpdate = update && hadBaseline && added > 0;

if (showKnown && scopes.length > 0) {
  for (const diagnostic of diagnostics) {
    if (inScope(diagnostic.file)) console.error(diagnostic.text);
  }
} else if (added > 0 && (!update || refuseUpdate)) {
  const worseSet = new Set(worse);
  for (const diagnostic of diagnostics) {
    if (worseSet.has(diagnostic.file)) {
      console.error(diagnostic.text);
    }
  }
}

if (update) {
  if (refuseUpdate) {
    console.error(summary);
    process.exit(1);
  }
  /** @type {Record<string, number>} */
  const next = {};
  for (const file of Object.keys(counts).sort()) {
    if (counts[file] > 0) next[file] = counts[file];
  }
  const total = Object.values(next).reduce((sum, count) => sum + count, 0);
  writeFileSync(baselinePath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`tsc: ${total} known, 0 new`);
  process.exit(0);
}

console.log(summary);
if (decreased && added === 0 && scopes.length === 0) {
  console.log('run yarn typecheck:update to lock in progress');
}
process.exit(added > 0 ? 1 : 0);
