import fs from 'node:fs';
import { splitSqlStatements } from './splitter.ts';

const sql = fs.readFileSync('/home/z/my-project/supabase/migrations/00000000000000_supabase_init.sql', 'utf8');
const stmts = splitSqlStatements(sql);
console.log('total:', stmts.length);
for (let i = 0; i < stmts.length; i++) {
  const s = stmts[i];
  const preview = s.substring(0, 100).replace(/\s+/g, ' ');
  console.log(`[${i}] ${preview}`);
}
