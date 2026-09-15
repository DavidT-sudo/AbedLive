// Runs at container boot, before the server starts (see Dockerfile CMD) —
// applies any pending SQL migrations from ./drizzle using drizzle-orm's own
// lightweight migrator, not the drizzle-kit CLI. This means there is no
// separate "migrate" container in the deployed stack: nothing here ever
// starts, finishes, and exits(0) as its own service, which is what was
// tripping up Coolify (it tears down the whole Compose stack whenever any
// container in it exits, mistaking a one-off job finishing for a crash —
// see web/README.md for the full story). Plain .mjs, not TypeScript: this
// runs inside the pruned Next.js standalone image, which has no ts-node/tsx
// toolchain, only Node itself.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql);

console.log("Applying database migrations...");
await migrate(db, { migrationsFolder: "./drizzle" });
console.log("Database is up to date.");
await sql.end();
