import pg from 'pg';
import fs from 'node:fs';

const c = new pg.Client({ host: '127.0.0.1', port: 5432, database: 'musicosy', user: 'postgres', password: 'postgres' });
await c.connect();

const sql = fs.readFileSync('/home/z/my-project/supabase/migrations/20260815200000_full_schema.sql', 'utf8');
console.log('schema file size:', sql.length, 'chars');

try {
  await c.query(sql);
  console.log('✓ schema applied');
} catch (e) {
  console.log('✗ schema failed:', e.message.substring(0, 500));
}

const r = await c.query("SELECT count(*) FROM information_schema.tables WHERE table_schema='public'");
console.log('public tables:', r.rows[0].count);
await c.end();
