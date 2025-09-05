//GENERATE DATABASE AND  INITIAL TABLES
import sql from "./sql.js";

async function createTables() {
    await sql`
   CREATE TABLE IF NOT EXISTS scores(
    id DEFAULT PRIMARY KEY,
    date VARCHAR(25) NOT NULL,
    user VARCHAR(25) NOT NULL,
    difficulty VARCHAR(15) NOT NULL,
    level SMALLINT NOT NULL,
    score INTEGER NOT NULL,
   );
   `;
}
