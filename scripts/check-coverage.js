/**
 * Quality gate script — checks that test coverage meets thresholds.
 * Exits with code 1 if any metric is below the threshold.
 */

const fs = require('fs');
const path = require('path');

const THRESHOLD = 80;

const summaryPath = path.join(__dirname, '../coverage/coverage-summary.json');

if (!fs.existsSync(summaryPath)) {
  console.error('❌ Coverage summary not found. Run tests with --coverageReporters=json-summary first.');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;

const metrics = ['statements', 'branches', 'functions', 'lines'];
let passed = true;

console.log('\n📊 Coverage Quality Gate\n');
console.log(`Threshold: ${THRESHOLD}%\n`);

for (const metric of metrics) {
  const pct = total[metric].pct;
  const status = pct >= THRESHOLD ? '✅' : '❌';
  console.log(`  ${status} ${metric}: ${pct}%`);
  if (pct < THRESHOLD) passed = false;
}

console.log('');

if (passed) {
  console.log('✅ All coverage metrics meet the threshold.\n');
  process.exit(0);
} else {
  console.error('❌ Coverage is below the required threshold. Please add more tests.\n');
  process.exit(1);
}
