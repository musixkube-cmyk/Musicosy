import pg from 'pg';
import fs from 'node:fs';

const c = new pg.Client({ host: '127.0.0.1', port: 5432, database: 'musicosy', user: 'postgres', password: 'postgres' });
await c.connect();

const files = ['20260815200000_full_schema.sql', '20260815202238_user_exists_by_email.sql', '20260816000000_rls_policies.sql'];
for (const f of files) {
  const sql = fs.readFileSync(`/home/z/my-project/supabase/migrations/${f}`, 'utf8');
  console.log(`--- ${f} ---`);
  try {
    await c.query(sql);
    console.log(`  ✓ applied`);
  } catch (e) {
    console.log(`  ✗ failed:`, e.message.substring(0, 300));
  }
}

const r = await c.query("SELECT count(*) FROM information_schema.tables WHERE table_schema='public'");
console.log('public tables:', r.rows[0].count);
const r2 = await c.query("SELECT count(*) FROM information_schema.tables WHERE table_schema='auth'");
console.log('auth tables:', r2.rows[0].count);
const r3 = await c.query("SELECT proname FROM pg_proc WHERE proname='user_exists_by_email'");
console.log('user_exists_by_email fn:', r3.rows);

await c.end();
