import pg from 'pg';
import fs from 'node:fs';
import { splitSqlStatements } from './splitter.ts';

const c = new pg.Client({ host: '127.0.0.1', port: 5432, database: 'musicosy', user: 'postgres', password: 'postgres' });
await c.connect();

const sql = fs.readFileSync('/home/z/my-project/supabase/migrations/00000000000000_supabase_init.sql', 'utf8');
const stmts = splitSqlStatements(sql);
console.log('pre-migration statements:', stmts.length);

for (let i = 0; i < stmts.length; i++) {
  const s = stmts[i];
  if (!s || s.startsWith('--')) continue;
  console.log(`\n[${i}] ${s.substring(0, 120).replace(/\s+/g, ' ')}...`);
  try {
    await c.query(s);
    console.log(`  ✓ ok`);
  } catch (e) {
    console.log(`  ✗ ${e.message.substring(0, 200)}`);
  }
}

await c.end();
