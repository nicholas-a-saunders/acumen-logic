/**
 * Seed Data Generator
 *
 * Generates 500 simulated benchmark results with a realistic bell curve distribution.
 * Run: node db/seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
});

function gaussianRandom(mean, stdDev) {
  let u1 = Math.random();
  let u2 = Math.random();
  while (u1 === 0) u1 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z * stdDev;
}

function clamp(val, min, max) {
  return Math.round(Math.min(max, Math.max(min, val)));
}

async function seed() {
  const client = await pool.connect();

  try {
    // Check if seed data already exists
    const existing = await client.query('SELECT COUNT(*) FROM m2_seed_data');
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Seed data already exists (${existing.rows[0].count} records). Skipping.`);
      console.log('To re-seed, run: DELETE FROM m2_seed_data; then re-run this script.');
      return;
    }

    console.log('Generating 500 simulated benchmark results...');

    const records = [];
    for (let i = 0; i < 500; i++) {
      const overall = clamp(gaussianRandom(60, 15), 5, 100);
      const nr = clamp(gaussianRandom(62, 16), 0, 100);
      const di = clamp(gaussianRandom(58, 17), 0, 100);
      const lr = clamp(gaussianRandom(60, 15), 0, 100);

      records.push({ overall, nr, di, lr });
    }

    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const values = [];
      const params = [];
      let paramIdx = 1;

      for (const r of batch) {
        values.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3})`);
        params.push(r.overall, r.nr, r.di, r.lr);
        paramIdx += 4;
      }

      await client.query(
        `INSERT INTO m2_seed_data (score_percentage, score_nr, score_di, score_lr) VALUES ${values.join(', ')}`,
        params
      );
    }

    console.log(`Seeded ${records.length} simulated results.`);

    // Print distribution summary
    const buckets = {};
    for (const r of records) {
      const bucket = Math.floor(r.overall / 10) * 10;
      const label = `${bucket}-${bucket + 9}%`;
      buckets[label] = (buckets[label] || 0) + 1;
    }

    console.log('\nScore Distribution:');
    const sortedBuckets = Object.entries(buckets).sort((a, b) => a[0].localeCompare(b[0]));
    for (const [label, count] of sortedBuckets) {
      const bar = '█'.repeat(Math.round(count / 5));
      console.log(`  ${label.padEnd(10)} ${String(count).padStart(3)} ${bar}`);
    }

    const avg = records.reduce((s, r) => s + r.overall, 0) / records.length;
    console.log(`\nMean: ${avg.toFixed(1)}%`);

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
