import pg from 'pg';
const c = new pg.Client({ host: '127.0.0.1', port: 5432, database: 'musicosy', user: 'postgres', password: 'postgres' });
await c.connect();

const exts = await c.query("SELECT extname, extnamespace::regnamespace AS schema FROM pg_extension");
console.log('extensions:', exts.rows);

const r1 = await c.query("SELECT uuid_generate_v4()").catch(e => ({error: e.message}));
console.log('uuid_generate_v4:', r1.error || r1.rows[0]);

const r2 = await c.query("SELECT gen_random_uuid()").catch(e => ({error: e.message}));
console.log('gen_random_uuid:', r2.error || r2.rows[0]);

const r3 = await c.query("SELECT crypt('test', gen_salt('bf'))").catch(e => ({error: e.message}));
console.log('crypt+gen_salt:', r3.error || 'works');

const r4 = await c.query("SELECT count(*) FROM information_schema.tables WHERE table_schema='public'");
console.log('public tables:', r4.rows[0].count);

const r5 = await c.query("SELECT count(*) FROM information_schema.schemata WHERE schema_name='auth'");
console.log('auth schema exists:', r5.rows[0].count);

const r6 = await c.query("SELECT count(*) FROM information_schema.tables WHERE table_schema='auth'");
console.log('auth tables:', r6.rows[0].count);

const r7 = await c.query("SELECT rolname FROM pg_roles WHERE rolname IN ('anon','authenticated','service_role')");
console.log('supabase roles:', r7.rows);

await c.end();
