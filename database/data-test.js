//GENERATE DATABASE AND  INITIAL TABLES
import { createTables, createScore, getScores } from "./db-querys.js";

async function main() {
    await createTables();

    const score = {
        date: "11-09-2025 00:00",
        player: "Fumetria",
        difficulty: "easy",
        level: 5,
        score: 100,
    };

    const newScore = await createScore(score);
    console.log(`New Score: ${newScore}`);

    const scores = await getScores();
    console.log("Scores:", scores);
}

main().catch((err) => {
    console.error("Error en la ejecución:", err);
});
