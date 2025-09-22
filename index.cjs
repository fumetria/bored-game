const express = require("express");
const app = express();
const port = 4500;
const dbQuerys = require("./database/db-querys.js");

app.use(express.static("public"));
app.use(express.json());

app.post("/submit-score", (req, res) => {
    console.log("submitting a score");
    console.log(req.body);
    try {
        dbQuerys.createScore(req.body);
        res.json({ status: 201, received: req.body });
    } catch (error) {
        res.json({ status: 422, received: req.body });
    }
})

app.get("/scores", async (req, res) => {
    console.log("getting scores...");
    try {
        const scores = await dbQuerys.getScores();
        console.log(scores);
        res.json(scores);
    } catch (error) {
        res.json({ status: 404, message: "Error getting data..." });
    }
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log(`Game running on port: ${port}`);
});
