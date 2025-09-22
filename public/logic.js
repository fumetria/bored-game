document.addEventListener("DOMContentLoaded", () => {
    // Game variables
    let userSequence = [];
    let cpuSequence = [];
    let gameStart = false;
    let userTurn = false;
    let round = 0;
    let score = 0;
    let scores = [];
    let userName = "";
    let gameDificulty = "easy";
    let date = "";
    let maxRound = 5;

    // html DOM elements
    const roundIndex = document.getElementById("round-index");
    const board = document.getElementById("board");
    const startButton = document.getElementById("start-btn");
    const startSection = document.getElementById("game-start");
    const nameSection = document.getElementById("user-name");
    const gameSection = document.getElementById("game");
    const endGameSection = document.getElementById("end-game");
    const endButton = document.getElementById("end-btn");
    const homeBtn = document.getElementById("home-btn");
    const scoreIndex = document.getElementById("score-index");
    const inputUserName = document.getElementById("name");
    const nameBtn = document.getElementById("btn-name");
    const inputError = document.getElementById("input-error");
    const user = document.getElementById("user");
    const scoreBtn = document.getElementById("score-btn");
    const scoreSection = document.getElementById("score-board");
    const scoreData = document.getElementById("score-data");
    const scoreBack = document.getElementById("score-back-btn");
    const userSelected = document.getElementById("user-turn");
    const difficultySelector = document.getElementById("difficulty");
    const difficultyIndex = document.getElementById("dif-index");
    const endGameMessage = document.getElementById("end-msg");
    const correctSound = new Audio("./sounds/correct.mp3");
    const incorrectSound = new Audio("./sounds/incorrect.mp3");

    //Game functions
    /**
     * Hidden current section and show next section of the game.
     * @param {*} hidden
     * @param {*} show
     */
    function transitionSection(hidden, show) {
        hidden.classList.add("hidden");
        show.classList.remove("hidden");
    }

    /**
     * Get current date and returns in format {dd/mm/YYYY hh:mm}
     * @returns {string}
     */
    function getDate() {
        const date = Date.now();
        const today = new Date(date);

        let day = today.getDate().toString();
        if (day.length < 2) {
            day = "0" + day;
        }
        let month = (today.getMonth() + 1).toString();
        if (month.length < 2) {
            month = "0" + month;
        }
        let year = today.getFullYear();
        let hours = today.getHours();
        let minutes = today.getMinutes().toString();
        if (minutes.length < 2) {
            minutes = "0" + minutes;
        }

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    /**
     * Get data from the game and returns new object newScore.
     * @param {string} date
     * @param {string} userName
     * @param {string} difficulty
     * @param {int} level
     * @param {int} userScore
     * @returns {Object}
     */
    function newScore(date, userName, difficulty, level, userScore) {
        let newScore = {
            date: date,
            player: userName,
            difficulty: difficulty,
            level: level,
            score: userScore,
        };
        return newScore;
    }

    function createUserName() {
        difficultyConfig();
        let userNameIn = inputUserName.value;
        if (userNameIn === null || userNameIn === "" || userNameIn >= 6) {
            inputError.classList.remove("hidden");
            return;
        }
        if (userNameIn.length <= 6) {
            userName = userNameIn;
            user.innerHTML = userName;
            return true;
        }
    }

    function difficultyConfig() {
        const dificultySelected = difficultySelector.value;
        if (dificultySelected.toString().toLowerCase() === "hard") {
            maxRound = 20;
            gameDificulty = "hard";
            difficultyIndex.innerHTML = gameDificulty;
            return;
        }
        if (dificultySelected.toString().toLowerCase() === "medium") {
            maxRound = 15;
            gameDificulty = "medium";
            difficultyIndex.innerHTML = gameDificulty;
            return;
        }
        difficultyIndex.innerHTML = gameDificulty;
        return;
    }
    async function checkUserInput() {
        if (
            userSequence[userSequence.length - 1] !=
            cpuSequence[userSequence.length - 1]
        ) {
            incorrectSound.play();
            let nScore = "";
            nScore = newScore(date, userName, gameDificulty, round, score);
            let createScore = await fetch("https://bored-game-weld.vercel.app/submit-score/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nScore),
                }
            );
            console.log("New score: ", nScore);
            console.log(createScore.status);
            scores.push(nScore);
            endGameMessage.innerHTML = "You lose!";
            gameStart = false;
            transitionSection(gameSection, endGameSection);
        } else {
            correctSound.play();
            score += 10;
            scoreIndex.innerText = score;
            if (userSequence.length < cpuSequence.length) {
                return;
            }
            userTurn = false;
            if (round >= maxRound) {
                let nScore = "";
                nScore = newScore(date, userName, gameDificulty, round, score);
                let createScore = await fetch("https://bored-game-weld.vercel.app/submit-score/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(nScore),
                    }
                );
                scores.push(nScore);
                endGameMessage.innerHTML = "You Win!";
                gameStart = false;
                transitionSection(gameSection, endGameSection);
                confetti(100, 160);
                return;
            } else {
                setTimeout(newRound, 1000);
            }
        }
    }

    function displayCpuSequence() {
        for (let i = 0; i < cpuSequence.length; i++) {
            const btnSelected = document.getElementById(cpuSequence[i]);
            setTimeout(() => {
                btnSelected.classList.add("selected");
                setTimeout(() => {
                    btnSelected.classList.remove("selected");
                }, 700);
            }, i * 1000);
        }
        return true;
    }

    function newRound() {
        userSelected.classList.remove("active");
        round++;
        roundIndex.innerText = round;
        cpuSequence.push(Math.ceil(Math.random() * 4));
        const endSequence = cpuSequence.length * 1000;
        displayCpuSequence();
        setTimeout(() => {
            userSequence = [];
            userTurn = true;
            userSelected.classList.add("active");
        }, endSequence);
    }

    function newGame() {
        date = getDate();
        gameStart = true;
        userTurn = false;
        userSequence = [];
        cpuSequence = [];
        round = 0;
        score = 0;
        scoreIndex.innerText = score;
        newRound();
    }

    function showScore() {
        console.log("Scores: ", scores);
        for (let i = 0; i < scores.length; i++) {
            const userScore = scores[i];
            let tr = document.createElement("tr");
            let tdDate = document.createElement("td");
            tdDate.innerHTML = userScore.date;
            let tdName = document.createElement("td");
            tdName.innerHTML = userScore.player;
            let tdScore = document.createElement("td");
            tdScore.innerHTML = userScore.score;
            tr.appendChild(tdDate);
            tr.appendChild(tdName);
            tr.appendChild(tdScore);
            scoreData.appendChild(tr);
        }
    }

    async function showScore2() {
        const scoresApi = await fetch("https://bored-game-weld.vercel.app/scores/");
        console.log("Response: ", scoresApi)
        const jsonScores = await scoresApi.json();
        console.log(jsonScores);
        console.log(jsonScores.status);
        if (jsonScores.status === 404) {
            showScore();
            return;
        }
        for (let i = 0; i < jsonScores.length; i++) {
            const userScore = jsonScores[i];
            let tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${userScore.date}</td>
            <td>${userScore.player}</td>
            <td>${userScore.score}</td>
            `;
            scoreData.appendChild(tr);
        }
    }

    //Listeners
    scoreBtn.addEventListener("click", () => {
        transitionSection(startSection, scoreSection);
        showScore2();
    });

    scoreBack.addEventListener("click", () => {
        scoreData.innerHTML = "";
        transitionSection(scoreSection, startSection);
    });

    startButton.addEventListener("click", () => {
        transitionSection(startSection, nameSection);
    });

    nameBtn.addEventListener("click", () => {
        if (createUserName()) {
            transitionSection(nameSection, gameSection);
            newGame();
        }
    });

    endButton.addEventListener("click", () => {
        transitionSection(endGameSection, gameSection);
        newGame();
    });

    homeBtn.addEventListener("click", () => {
        transitionSection(endGameSection, startSection);
    });

    board.addEventListener("click", (event) => {
        if (!userTurn) {
            return;
        }
        if (event.target.id != "board") {
            const btnSelected = document.getElementById(event.target.id);
            btnSelected.classList.add("selected");
            setTimeout(() => {
                btnSelected.classList.remove("selected");
            }, 700);
            let userInput = event.target.id;
            userSequence.push(userInput);
            checkUserInput();
        }
    });
});
