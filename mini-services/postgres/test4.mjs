import pg from 'pg';
import fs from 'node:fs';

const c = new pg.Client({ host: '127.0.0.1', port: 5432, database: 'musicosy', user: 'postgres', password: 'postgres' });
await c.connect();

const sql = fs.readFileSync('/home/z/my-project/supabase/migrations/20260815200000_full_schema.sql', 'utf8');

// Strip outer BEGIN/COMMIT (we'll handle statements individually)
const stripped = sql.replace(/^\s*BEGIN\s*;\s*/i, '').replace(/\s*COMMIT\s*;\s*$/i, '');

// Split on semicolons that are at end of line (rough heuristic; DO $$...$$ blocks contain semicolons inside)
// Better: split on \n\n or use simple statement splitter
const statements = stripped.split(/;\s*\n/).map(s => s.trim()).filter(Boolean).concat(['']);
console.log('total statements:', statements.length);

let ok = 0, fail = 0, firstFail = null;
for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  if (!stmt || stmt.startsWith('--')) continue;
  try {
    await c.query(stmt);
    ok++;
  } catch (e) {
    fail++;
    if (!firstFail) firstFail = { stmt: stmt.substring(0, 200), err: e.message.substring(0, 300) };
  }
}
console.log('ok:', ok, 'fail:', fail);
if (firstFail) console.log('first failure:', JSON.stringify(firstFail, null, 2));

const r = await c.query("SELECT count(*) FROM information_schema.tables WHERE table_schema='public'");
console.log('public tables:', r.rows[0].count);
await c.end();
