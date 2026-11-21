import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const SRC_DIR = path.resolve('src');
const MAX_LOC_PER_FILE = 300;
const PREFERRED_LOC_TARGET = 200;
const MIN_UNDER_TARGET_PERCENT = 90.0;

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.js', '.mjs', '.json']);

function getSourceFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getSourceFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SOURCE_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.length === 0) return 0;
  return content.split(/\r?\n/).length;
}

function runCheck() {
  const files = getSourceFiles(SRC_DIR);
  if (files.length === 0) {
    console.log('[check-loc] No files found in src/');
    process.exit(0);
  }

  let underTargetCount = 0;
  const offendersOverMax = [];
  const filesOverTarget = [];

  const stats = files.map((file) => {
    const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
    const loc = countLines(file);
    if (loc < PREFERRED_LOC_TARGET) {
      underTargetCount++;
    } else {
      filesOverTarget.push({ file: rel, loc });
    }
    if (loc > MAX_LOC_PER_FILE) {
      offendersOverMax.push({ file: rel, loc });
    }
    return { file: rel, loc };
  });

  const percentageUnder = ((underTargetCount / files.length) * 100);

  console.log(`\n--- LOC CHECK SUMMARY ---`);
  console.log(`Total source files: ${files.length}`);
  console.log(`Files < ${PREFERRED_LOC_TARGET} LOC: ${underTargetCount} (${percentageUnder.toFixed(1)}%) [Target: >= ${MIN_UNDER_TARGET_PERCENT}%]`);
  console.log(`Files >= ${PREFERRED_LOC_TARGET} LOC: ${filesOverTarget.length}`);
  console.log(`Files > ${MAX_LOC_PER_FILE} LOC (Hard Ceiling): ${offendersOverMax.length}\n`);

  if (filesOverTarget.length > 0) {
    console.log(`Files >= ${PREFERRED_LOC_TARGET} lines:`);
    filesOverTarget.forEach((f) => console.log(`  - ${f.file}: ${f.loc} lines`));
  }

  let failed = false;
  if (percentageUnder < MIN_UNDER_TARGET_PERCENT) {
    console.error(`\n❌ FAILED: Only ${percentageUnder.toFixed(1)}% of files are < ${PREFERRED_LOC_TARGET} lines (must be >= ${MIN_UNDER_TARGET_PERCENT}%).`);
    failed = true;
  }
  if (offendersOverMax.length > 0) {
    console.error(`\n❌ FAILED: ${offendersOverMax.length} file(s) exceed hard ceiling of ${MAX_LOC_PER_FILE} lines!`);
    offendersOverMax.forEach((f) => console.error(`  - ${f.file}: ${f.loc} lines`));
    failed = true;
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log(`✅ LOC check passed!\n`);
  }
}

runCheck();
