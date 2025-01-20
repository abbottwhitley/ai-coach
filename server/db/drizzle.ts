import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';

config({ path: ".env.local" }); // or .env.local

export const db = drizzle(process.env.DATABASE_URL!);

// Alternative: Setting up a singleton
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schema from './schemas'; // Import your Drizzle schema

// let db: any;

// if (process.env.NODE_ENV === 'production') {
//     db = drizzle(process.env.DATABASE_URL!), { schema });
// } else {
//     if (!globalThis._drizzle) {
//         globalThis._drizzle = drizzle(postgres(process.env.DATABASE_URL!), { schema });
//     }
//     db = globalThis._drizzle;
// }

// export default db;