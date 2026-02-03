import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@repo/database/schemas";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: false
});

export const db = drizzle({ client: pool, schema });
