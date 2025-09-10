import { sql } from "./sql.js";

export async function createTables() {
    try {
        const newTable = await sql`
    CREATE TABLE IF NOT EXISTS scores(
    id integer GENERATED ALWAYS AS IDENTITY,
    date VARCHAR(25) NOT NULL,
    player VARCHAR(25) NOT NULL,
    difficulty VARCHAR(15) NOT NULL,
    level SMALLINT NOT NULL,
    score INTEGER NOT NULL
   );
   `;

        console.log(`Query: ${newTable.command}`);
        return;
    } catch (error) {
        console.log(error.message);
        return;
    }
}

export async function dropTables() {
    try {
        const dropTable = await sql`
        DROP TABLE IF EXISTS scores;`;
        console.log(`Query: ${dropTable.state.status}`);
        return;
    } catch (error) {
        console.log(error);
    }
}

export async function createScore(score) {
    try {
        const newScore = await sql`
    INSERT INTO scores ${sql(
        score,
        "date",
        "player",
        "difficulty",
        "level",
        "score"
    )}`;
        return newScore;
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

export async function getScores() {
    try {
        const scores = await sql`
        SELECT * FROM scores;
        `;
        return scores;
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}
