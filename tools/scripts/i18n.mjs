#!/usr/bin/env node
/**
 * i18n helper so agents never open the big strings files.
 *
 *   yarn i18n get <key>
 *   yarn i18n add <domain> <key> --en "Text" --ru "Текст" [--de "..."]   (missing locales copy en)
 *   yarn i18n set <key> --en "New" --ru "Новый"                          (only given locales change)
 *
 * domain: onboarding | input | charts | result/shared | result/steps | result/legend | result/help
 * `add` also appends the key to utils/i18n/translationKeys.ts.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const STRINGS = join(ROOT, 'utils/i18n/strings');
const KEYS_FILE = join(ROOT, 'utils/i18n/translationKeys.ts');
const DOMAINS = ['onboarding', 'input', 'charts', 'result/shared', 'result/steps', 'result/legend', 'result/help'];

const LOCALES = [
  ...readFileSync(join(ROOT, 'utils/i18n/supportedLanguages.ts'), 'utf8').matchAll(/code:\s*'(\w+)'/g),
].map((m) => m[1]);

function die(msg) {
  console.error(`i18n: ${msg}`);
  process.exit(1);
}

function parseFlags(args) {
  const out = {};
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    if (!flag?.startsWith('--') || args[i + 1] === undefined) die(`bad argument "${flag}"`);
    const loc = flag.slice(2);
    if (!LOCALES.includes(loc)) die(`unknown locale "${loc}" (known: ${LOCALES.join(', ')})`);
    out[loc] = args[i + 1];
  }
  return out;
}

const domainFile = (d) => join(STRINGS, `${d}.ts`);

function findKey(key) {
  const re = new RegExp(`^export const ${key} = \\{\\n[\\s\\S]*?^\\};?\\n`, 'm');
  for (const d of DOMAINS) {
    const file = domainFile(d);
    const src = readFileSync(file, 'utf8');
    const m = src.match(re);
    if (m) return { domain: d, file, src, block: m[0], index: m.index };
  }
  return null;
}

const line = (loc, text) => `  ${loc}: ${JSON.stringify(text)},`;

const [cmd, ...rest] = process.argv.slice(2);

if (cmd === 'get') {
  const [key] = rest;
  if (!key) die('usage: get <key>');
  const hit = findKey(key);
  if (!hit) die(`key "${key}" not found`);
  console.log(`// ${hit.domain}.ts`);
  process.stdout.write(hit.block);
} else if (cmd === 'add') {
  const [domain, key, ...flagArgs] = rest;
  if (!DOMAINS.includes(domain)) die(`domain must be one of: ${DOMAINS.join(', ')}`);
  if (!/^[a-zA-Z_$][\w$]*$/.test(key ?? '')) die('key must be a JS identifier');
  if (findKey(key)) die(`key "${key}" already exists; use set`);
  const vals = parseFlags(flagArgs);
  if (!vals.en || !vals.ru) die('--en and --ru are required');
  const file = domainFile(domain);
  if (!existsSync(file)) die(`missing ${file}`);
  const block = `\nexport const ${key} = {\n${LOCALES.map((l) => line(l, vals[l] ?? vals.en)).join('\n')}\n};\n`;
  writeFileSync(file, readFileSync(file, 'utf8').replace(/\n*$/, '\n') + block);
  const keys = readFileSync(KEYS_FILE, 'utf8');
  if (!keys.includes('] as const;')) die('cannot find end of TRANSLATION_KEYS');
  writeFileSync(KEYS_FILE, keys.replace('] as const;', `  "${key}",\n] as const;`));
  const copied = LOCALES.filter((l) => !vals[l]);
  console.log(`added ${key} to ${domain}.ts + translationKeys.ts${copied.length ? ` (en copied to: ${copied.join(', ')})` : ''}`);
} else if (cmd === 'set') {
  const [key, ...flagArgs] = rest;
  const hit = findKey(key ?? '');
  if (!hit) die(`key "${key}" not found`);
  const vals = parseFlags(flagArgs);
  if (!Object.keys(vals).length) die('give at least one --<locale> "text"');
  let block = hit.block;
  for (const [loc, text] of Object.entries(vals)) {
    const locRe = new RegExp(`^\\s*${loc}\\s*:.*$`, 'm');
    block = locRe.test(block) ? block.replace(locRe, line(loc, text)) : block.replace(/^\};?\n$/m, `${line(loc, text)}\n};\n`);
  }
  writeFileSync(hit.file, hit.src.slice(0, hit.index) + block + hit.src.slice(hit.index + hit.block.length));
  console.log(`updated ${key} in ${hit.domain}.ts: ${Object.keys(vals).join(', ')}`);
} else {
  die('usage: get <key> | add <domain> <key> --en .. --ru .. | set <key> --<loc> ..');
}
