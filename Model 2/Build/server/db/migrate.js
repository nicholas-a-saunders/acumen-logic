/**
 * Migration Runner
 *
 * Runs the schema.sql to create/update tables.
 * Run: node db/migrate.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running database migration...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);

    console.log('Migration complete. Tables created/verified:');
    console.log('  - m2_users');
    console.log('  - m2_assessment_sessions');
    console.log('  - m2_session_answers');
    console.log('  - m2_percentile_cache');
    console.log('  - m2_seed_data');

    // Check table counts
    const tables = ['m2_users', 'm2_assessment_sessions', 'm2_session_answers', 'm2_seed_data'];
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`  ${table}: ${result.rows[0].count} rows`);
    }

  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
