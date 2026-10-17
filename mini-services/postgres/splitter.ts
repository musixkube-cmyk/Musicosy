/**
 * Smart SQL statement splitter that respects Postgres dollar-quoted strings
 * (`$$ ... $$` and `$tag$ ... $tag$`) and single-quoted string literals.
 *
 * Returns an array of statements (without trailing semicolons).
 */
export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let buf = "";
  let i = 0;
  const n = sql.length;

  while (i < n) {
    const ch = sql[i];
    const next = sql[i + 1];

    // Line comment — skip to end of line
    if (ch === "-" && next === "-") {
      const eol = sql.indexOf("\n", i);
      const end = eol === -1 ? n : eol + 1;
      buf += sql.slice(i, end);
      i = end;
      continue;
    }

    // Block comment — skip to */
    if (ch === "/" && next === "*") {
      const end = sql.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      buf += sql.slice(i, stop);
      i = stop;
      continue;
    }

    // Single-quoted string literal
    if (ch === "'") {
      buf += "'";
      i++;
      while (i < n) {
        const c = sql[i];
        buf += c;
        if (c === "'" && sql[i + 1] === "'") {
          // Escaped single quote
          buf += "'";
          i += 2;
          continue;
        }
        if (c === "'") {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    // Dollar-quoted string: $$ or $tag$
    if (ch === "$") {
      // Match $tag$ where tag is [a-z_][a-z0-9_]*
      const m = /^\$(?:([a-z_][a-z0-9_]*)?)\$/i.exec(sql.slice(i));
      if (m) {
        const tag = m[0]; // includes both $$ delimiters
        const close = sql.indexOf(tag, i + tag.length);
        if (close === -1) {
          // Malformed; treat literally
          buf += ch;
          i++;
          continue;
        }
        const end = close + tag.length;
        buf += sql.slice(i, end);
        i = end;
        continue;
      }
      // Bare $ (e.g. in operator) — treat literally
      buf += ch;
      i++;
      continue;
    }

    // Statement terminator
    if (ch === ";") {
      const stmt = buf.trim();
      if (stmt) statements.push(stmt);
      buf = "";
      i++;
      continue;
    }

    buf += ch;
    i++;
  }

  const last = buf.trim();
  if (last) statements.push(last);
  return statements;
}

/**
 * Strips leading line/block comments and whitespace from a statement so the
 * runner can detect "this statement is actually empty" vs "this is real SQL
 * preceded by commentary". Pure-comment statements become "".
 */
export function stripLeadingComments(stmt: string): string {
  let s = stmt;
  while (true) {
    s = s.trimStart();
    if (s.startsWith("--")) {
      const eol = s.indexOf("\n");
      if (eol === -1) return "";
      s = s.slice(eol + 1);
      continue;
    }
    if (s.startsWith("/*")) {
      const end = s.indexOf("*/");
      if (end === -1) return "";
      s = s.slice(end + 2);
      continue;
    }
    return s;
  }
}
