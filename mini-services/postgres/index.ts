/**
 * Local embedded Postgres for the Musicosy sandbox deployment.
 *
 * - Spawns PostgreSQL 18.4 in-process (no Docker / apt needed)
 * - Listens on 127.0.0.1:5432 (matches DATABASE_URL default)
 * - Creates the `musicosy` database on first start
 * - Keeps running until killed; --hot restarts on file changes
 *
 * Used by:
 *   - The Next.js app via DATABASE_URL in .env.local
 *   - The signup route (direct INSERT into auth.users with crypt())
 *   - The local-signin route (verifies password via crypt())
 *   - The check-email route (queries auth.users via service-role RPC)
 */

import EmbeddedPostgres from "embedded-postgres";
import fs from "node:fs";
import path from "node:path";
import { splitSqlStatements, stripLeadingComments } from "./splitter";

const DATA_DIR = process.env.PG_DATA_DIR ?? path.resolve(import.meta.dir, "data");
const PORT = Number(process.env.PG_PORT ?? 5432);
const DB_NAME = process.env.PG_DB_NAME ?? "musicosy";

async function main() {
  // Fresh start on each launch (sandbox data is ephemeral anyway; migrations
  // re-run from supabase/migrations on every boot so we always have a known
  // good state).
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    pgDataDir: path.join(DATA_DIR, "pgdata"),
    user: "postgres",
    password: "postgres",
    authMethod: "password",
    persistent: false,
    config: {
      port: PORT,
      // Listen only on loopback so the gateway doesn't proxy it
      listen_addresses: "127.0.0.1",
    },
  });

  console.log(`[postgres] initdb at ${DATA_DIR}/pgdata`);
  await pg.initialise();

  console.log(`[postgres] starting on 127.0.0.1:${PORT}`);
  await pg.start();

  console.log(`[postgres] creating database "${DB_NAME}"`);
  await pg.createDatabase(DB_NAME);

  console.log("[postgres] ready ✓");
  console.log(`[postgres] connection string: postgresql://localhost:${PORT}/${DB_NAME}`);

  // Apply migrations from the project's supabase/migrations folder.
  const migrationsDir = path.resolve(import.meta.dir, "../../supabase/migrations");
  if (fs.existsSync(migrationsDir)) {
    const { default: Pg } = await import("pg");
    const client = new Pg.Client({
      host: "127.0.0.1",
      port: PORT,
      database: DB_NAME,
      user: "postgres",
      password: "postgres",
    });
    await client.connect();

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      console.log(`[postgres] applying migration: ${file}`);
      const statements = splitSqlStatements(sql);
      let ok = 0;
      let skipped = 0;
      const errors: string[] = [];
      for (const stmt of statements) {
        // Strip leading comments so we can detect pure-comment "statements"
        // (which should be skipped) vs real SQL preceded by commentary.
        const cleaned = stripLeadingComments(stmt);
        if (!cleaned) continue;
        try {
          await client.query(cleaned);
          ok++;
        } catch (err) {
          const msg = (err as Error).message;
          // Idempotent migrations: ignore "already exists" / duplicate_object
          if (
            msg.includes("already exists") ||
            msg.includes("duplicate_object") ||
            msg.includes("extension") && msg.includes("already") ||
            msg.includes("function") && msg.includes("already")
          ) {
            skipped++;
          } else {
            errors.push(`${stmt.substring(0, 80).replace(/\s+/g, " ")} → ${msg.substring(0, 120)}`);
          }
        }
      }
      console.log(
        `[postgres]   ✓ ${file} (${ok} ok, ${skipped} skipped, ${errors.length} errors)`,
      );
      if (errors.length > 0) {
        // Print first 5 errors so we can see what failed
        for (const e of errors.slice(0, 5)) {
          console.log(`[postgres]     ✗ ${e}`);
        }
        if (errors.length > 5) {
          console.log(`[postgres]     ... and ${errors.length - 5} more errors`);
        }
      }
    }
    await client.end();
    console.log("[postgres] migrations complete");
  }

  // Keep alive
  console.log("[postgres] running — press Ctrl+C to stop");
  setInterval(() => {}, 1 << 30);
}

main().catch((err) => {
  console.error("[postgres] FATAL:", err);
  process.exit(1);
});
