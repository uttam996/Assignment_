import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
console.log(process.env.DATABASE_URL);
const db = drizzle(process.env.DATABASE_URL!);

export default db;
