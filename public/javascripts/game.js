const gameContainer = document.getElementById('game'),
    wait1s = ms => new Promise((r, j) => setTimeout((r), 1000)),
    accuracy = document.getElementById('accuracy');

let gameRunning = false,
    totalScore = 0,
    clicks = 0,
    targetClicks = 0;

async function gameStart() {
    const timerContainer = document.getElementById('timeLeft'),
        body = document.body;

    if (!gameRunning) {
        gameRunning = true;
        await startTime();
        let seconds = 0;

        body.addEventListener('click', function () {
            clicks++;
            const calculatedAcc = ((targetClicks/clicks)*100).toFixed(2);
            accuracy.innerHTML = `${calculatedAcc}%`;
        });

        let gameTimer = setInterval(() => {
            seconds++
            if (seconds == 60) {
                gameRunning = false;
                clearInterval(gameTimer);
                //gameContainer.remove();
            } else {
                timerContainer.innerHTML = 60 - seconds;
            }
        }, 1000)

        createTarget();
    }
}

async function startTime() {
    let time = 3;

    console.log('started game');
    console.log(`Starting in: ${time}`)

    while (time > 1) {
        await wait1s(1000);
        time--;
        console.log(`Starting in: ${time}`);
    }

    console.log('GOGOGO')
}

function createTarget() {
    let circ = null;
    circ = new Target(50, 'easy');
    circ.populate();
}

class Target {
    constructor(size, difficulty) {
        this.size = size;
        this.difficulty = difficulty;
    }

    async populate() {
        gameContainer.innerHTML += `<div id='target'></div>`;

        const targetNode = document.getElementById('target'),
            startTime = new Date(),
            randomHeight = Math.floor(Math.random() * 100) + 1,
            randomWidth = Math.floor(Math.random() * 100) + 1;

        target.style.right = `${randomWidth}%`;
        target.style.top = `${randomHeight}%`;

        // Moves target when after specific amount of seconds
        let moveTimer = setTimeout((res) => {
            if (target) {
                console.log('Moving Target')               
                gameContainer.innerHTML = '';

                clearTimeout(moveTimer);
                createTarget();
            }
        }, 2000);

        target.addEventListener('click', function (e) {

            const endTime = new Date();
            let timeDiff = endTime - startTime,
                score = 2000 - timeDiff;

            console.log(`TIME TOOK: ${timeDiff} SCORE: ${score}`)

            totalScore += score;
            document.getElementById('score').innerHTML = totalScore;

            //CLEAR THE GAME AREA   
            gameContainer.innerHTML = '';
            targetNode.style.height = '0px'
            targetClicks++;

            //STOPS CURRENT MOVE TIMER AND CREATE A NEW TARGET.
            clearTimeout(moveTimer);
            createTarget();
        });
    }
}