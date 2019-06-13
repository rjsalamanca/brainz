const gameContainer = document.getElementById('game'),
    wait1s = ms => new Promise((r, j) => setTimeout((r), 1000)),
    accuracy = document.getElementById('accuracy');

let gameRunning = false,
    totalScore = 0,
    clicks = 0,
    targetClicks = 0,
    moveTimer;

document.body.addEventListener('click', function(){
    if(gameRunning == true){
        let calculatedAcc = ((targetClicks/clicks)*100).toFixed(2);
        accuracy.innerHTML = calculatedAcc == 'NaN' ? `0.00`:`${calculatedAcc}`;
        document.getElementById('accuracySend').value = accuracy.innerHTML;
        clicks++;
    }
});

async function gameStart(mode,difficulty) {
    const timerContainer = document.getElementById('timeLeft');

    let seconds = 0;

    // RESET
    timerContainer.innerHTML = 60;
    document.getElementById('score').innerHTML = 0;
    document.getElementById('accuracy').innerHTML = '0.00%';
    document.getElementById('accuracySend').value = 0.00;
    document.getElementById('pointsSend').value = 0;

    clicks = 0;
    targetClicks = 0;
    totalScore = 0;

    if (!gameRunning) {
        gameRunning = true;
        await startTime();


        let gameTimer = setInterval(() => {
            seconds++
            if (seconds == 60) {
                gameRunning = false;
                clearInterval(gameTimer);
                clearInterval(moveTimer)
                document.getElementById('target').remove();

                // SUBMIT FORM WHEN DONE
                document.getElementById('gameInfo').submit()

            } else {
                timerContainer.innerHTML = 60 - seconds;
            }
        }, 1000)

        if(difficulty == 'easy'){
            console.log('ez')
            createTarget(75,3000);
        } else if(difficulty == 'medium') {
            console.log('med')
            createTarget(40,2000);
        } else if(difficulty == 'hard'){
            console.log('hard')
            createTarget(25,1000);
        }else if(difficulty == 'apocalypse'){
            console.log('apocalypse')
            createTarget(10,200);
        }
    }
}

async function startTime() {
    let time = 3;
    const countDownContainer = document.getElementById('startCountDown'),
        countDownNumber = document.getElementById('startCountDownNumber');

    countDownContainer.style.visibility = 'visible';
    countDownNumber.innerHTML = time;

    while (time > 0) {
        await wait1s(1000);
        time--;
        console.log(`Starting in: ${time}`);
        countDownNumber.innerHTML = time;
    }

    countDownContainer.style.visibility = 'hidden';
    time = 3;
}

function createTarget(size,speed) {
    let circ = null;
    circ = new Target(size, speed);
    circ.populate();
}

class Target {
    constructor(size, speed) {
        this.size = size;
        this.speed = speed;
    }

    async populate() {
        gameContainer.innerHTML += `<div id='target'></div>`;

        const targetNode = document.getElementById('target'),
            storeSize = this.size,
            storeSpeed = this.speed,
            startTime = new Date(),
            randomHeight = Math.floor(Math.random() * 100) + 1,
            randomWidth = Math.floor(Math.random() * 100) + 1;

        target.style.height = `${this.size * 2}px`;
        target.style.width = `${this.size}px`;
        target.style.right = `${randomWidth}%`;
        target.style.top = `${randomHeight}%`;
        
        // Moves target when after specific amount of seconds
        moveTimer = setTimeout((res) => {
            if (target) {
                console.log('Moving Target')               
                targetNode.remove();
                clearTimeout(moveTimer);
                createTarget(this.size,this.speed);
            }
        }, this.speed);

        // Activates when we click the target
        target.addEventListener('click', function (e) {
            const endTime = new Date();

            let timeDiff = endTime - startTime,
                score = storeSpeed - timeDiff;

            console.log(`TIME TOOK: ${timeDiff} SCORE: ${score}`)

            totalScore += score;
            document.getElementById('score').innerHTML = totalScore;
            document.getElementById('pointsSend').value = totalScore;

            //CLEAR THE GAME AREA   
            //gameContainer.innerHTML = '';
            //targetNode.style.height = '0px'
            targetNode.remove();
            targetClicks++;

            //STOPS CURRENT MOVE TIMER AND CREATE A NEW TARGET.
            console.log(storeSize);
            clearTimeout(moveTimer);
            createTarget(storeSize,storeSpeed);
        });
    }
}