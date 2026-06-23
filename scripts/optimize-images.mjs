// ─────────────────────────────────────────────────────────────────────────────
// Image optimiser
//
// Generates resized WebP copies of every source JPEG/PNG under
// src/assets/gellery/** and src/assets/OC/**. The generated files are written to
// a SEPARATE output tree at src/assets/optimized/** that mirrors the source
// folder structure — the original source folders are never touched. The app
// imports ONLY these optimised `.webp` files (see src/constants/images.ts), so
// the browser downloads ~150-250 KB WebPs instead of multi-megabyte photos.
//
//   src/assets/gellery/Group/background.jpg
//     → src/assets/optimized/gellery/Group/background.webp
//
// Behaviour:
//  • Incremental — skips files whose .webp is already newer than the source.
//  • Files named "background.*" get a larger 1920px width (full-bleed hero).
//  • HEIC/MP4 are ignored (no browser support / sharp can't decode HEIC here).
//
// Run with:  npm run optimize:images   (also runs automatically before build)
// ─────────────────────────────────────────────────────────────────────────────

import sharp from 'sharp';
import { readdir, stat, access, mkdir } from 'node:fs/promises';
import { join, extname, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '..', 'src', 'assets');
const OUT_ROOT = join(ASSETS, 'optimized');
const ROOTS = [join(ASSETS, 'gellery'), join(ASSETS, 'OC')];
const SRC_EXT = new Set(['.jpg', '.jpeg', '.png']);

const DEFAULT_WIDTH = 1280;
const DEFAULT_QUALITY = 80;
const BG_WIDTH = 1920;
const BG_QUALITY = 82;

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (SRC_EXT.has(extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

let generated = 0;
let upToDate = 0;
let failed = 0;

for (const root of ROOTS) {
  if (!(await exists(root))) continue;

  for (const file of await walk(root)) {
    // Mirror the path under src/assets into src/assets/optimized, swapping the
    // extension for .webp. e.g. gellery/Group/x.jpg → optimized/gellery/Group/x.webp
    const rel = relative(ASSETS, file);
    const out = join(OUT_ROOT, dirname(rel), basename(rel, extname(rel)) + '.webp');

    // Skip when the existing webp is newer than (or same age as) the source.
    if (await exists(out)) {
      const [srcStat, outStat] = await Promise.all([stat(file), stat(out)]);
      if (outStat.mtimeMs >= srcStat.mtimeMs) { upToDate++; continue; }
    }

    const isBackground = basename(file).toLowerCase().startsWith('background');
    const width = isBackground ? BG_WIDTH : DEFAULT_WIDTH;
    const quality = isBackground ? BG_QUALITY : DEFAULT_QUALITY;

    try {
      await mkdir(dirname(out), { recursive: true });
      await sharp(file)
        .rotate() // respect EXIF orientation
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(out);
      generated++;
      console.log('  ✓', out.replace(ASSETS, 'assets'));
    } catch (err) {
      failed++;
      console.error('  ✗ failed:', file.replace(ASSETS, 'assets'), '-', err.message);
    }
  }
}

console.log(`\nImage optimisation complete — ${generated} generated, ${upToDate} up-to-date, ${failed} failed.`);
if (failed > 0) process.exitCode = 1;
