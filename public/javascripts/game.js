let gameRunning = false;
const gameContainer = document.getElementById('game');
const wait1s = ms => new Promise((r, j) => setTimeout((r), 1000))
let totalScore = 0;

class Target {
    constructor(size, difficulty) {
        this.size = size;
        this.difficulty = difficulty;
    }

    async populate() {

        const body = document.body;
        const accuracy = document.body;
        let clicks = 0;
        let targetClicks = 0;

        body.addEventListener('click', function () {
            clicks++;

        });

        gameContainer.innerHTML += `<div id='target'></div>`;
        let targetNode = document.getElementById('target');
        // setTimeout(()=>{                
        //     targetNode.style.height = '200px'
        //     targetNode.style.top = `${this.size*2}px`;
        // },200)

        var startTime = new Date();
        let targ = this;
        let game = {
            height: gameContainer.offsetHeight,
            width: gameContainer.offsetWidth
        }
        let randomHeight = Math.floor(Math.random() * 100) + 1
        let randomWidth = Math.floor(Math.random() * 100) + 1

        target.style.right = `calc(${randomWidth}% - ${this.size}px)`;
        target.style.top = `calc(${randomHeight}% - ${this.size}px)`;

        let timer = setTimeout((res) => {
            const target = document.getElementById('target');
            if (target) {
                console.log('Moving')
                gameContainer.innerHTML = '';

                clearTimeout(timer);
                createTarget();
            }
        }, 2000);

        target.addEventListener('click', function (e) {

            const endTime = new Date();
            var timeDiff = endTime - startTime;
            var score = 2000 - timeDiff;
            console.log('TIME TOOK: ', timeDiff)

            totalScore += score;
            document.getElementById('score').innerHTML = totalScore;

            gameContainer.innerHTML = '';
            targetNode.style.height = '0px'

            targetClicks++;
            clearTimeout(timer)
            createTarget();
        })
    }
}

async function gameStart() {
    if (!gameRunning) {
        gameRunning = true;
        await startTime();
        let seconds = 0;
        let minute = setInterval(() => {
            seconds++
            if (seconds == 60) {
                gameRunning = false;
                clearInterval(minute);
                console.log('DONE PLAYING: ', seconds);
                gameContainer.remove();
            } else {
                console.log(seconds)
            }
        }, 1000)

        createTarget();
    }
}

function createTarget() {
    let circ = null;
    circ = new Target(50, 'easy');
    circ.populate();
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