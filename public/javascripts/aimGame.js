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

        let gun = document.getElementById('gun');
        gun.src = '/images/gun-shotv2.png';
        setTimeout(()=>{gun.src = '/images/gunv2.png'},100)
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
            // CHANGE THIS SO GAME RUNS QUICKER
            if (seconds == 30) {
                gameRunning = false;
                clearInterval(gameTimer);
                clearInterval(moveTimer)
                // SUBMIT FORM WHEN DONE
                document.getElementById('gameInfo').submit();
                document.getElementById('target').remove();
            } else {
                timerContainer.innerHTML = 30 - seconds;
            }
        }, 1000)

        if(difficulty == 'easy'){
            console.log('ez')
            createTarget(75,3000);
        } else if(difficulty == 'medium') {
            console.log('med')
            createTarget(40,1500);
        } else if(difficulty == 'hard'){
            console.log('hard')
            createTarget(25,1000);
        }else if(difficulty == 'apocalypse'){
            console.log('apocalypse')
            createTarget(50,400);
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
        gameContainer.innerHTML += `<div id='targetContainer'><img id='lastZ' src='/images/zombie/z-4.png'/><div id='target'><img id='zombieImg' src='/images/zombie/z-1.png'/></div></div>`;

        const targetContainer = document.getElementById('targetContainer'),
            targetContainerFinalZ = document.getElementById('lastZ'),
            targetNode = document.getElementById('target'),
            targetZombie = document.getElementById('zombieImg'),
            storeSize = this.size,
            storeSpeed = this.speed,
            startTime = new Date();

        let randomHeight = Math.floor(Math.random() * (100-(((this.size*2)/gameContainer.scrollHeight)*100)) ) + 1,
            randomWidth = Math.floor(Math.random() * (100-(((this.size)/gameContainer.scrollWidth)*100)) ) + 1,
            imageRotate = 0;

        targetContainerFinalZ.style.width = `${this.size}px`
        targetZombie.style.width = `${this.size}px`

        let zombieGif = setInterval(()=>{
            if(imageRotate == 0){
                targetZombie.src = '/images/zombie/z-1.png';
            } else if(imageRotate == 1) {
                targetZombie.src = '/images/zombie/z-2.png';
            } else if(imageRotate == 2) {
                targetZombie.src = '/images/zombie/z-3.png';
            } else if(imageRotate == 3) {
                targetZombie.src = '/images/zombie/z-4.png';
                clearInterval(zombieGif);
            }
            targetZombie.style.width = `${this.size}px`

            imageRotate++;
        },100)
        // targetContainer.style.height = `${this.size * 2}px`;
        // targetContainer.style.width = `${this.size}px`;
        targetContainer.style.right = `${randomWidth}%`;
        targetContainer.style.top = `${randomHeight}%`;
        
        // targetNode.style.height = `${this.size * 2}px`;
        // targetNode.style.width = `${this.size}px`;
        targetNode.style.marginTop = 0;
        
        // Moves target when after specific amount of seconds
        moveTimer = setTimeout((res) => {
            if (target) {
                console.log('Moving Target')               
                targetContainer.remove();
                clearTimeout(moveTimer);
                createTarget(this.size,this.speed);
            }
        }, this.speed);

        // Activates when we click the target
        targetNode.addEventListener('click', function (e) {
            const endTime = new Date(),
                hitTarget = document.getElementById('hitTarget'),
                gun = document.getElementById('gun');

            let timeDiff = endTime - startTime,
                score = storeSpeed - timeDiff;

            console.log(`TIME TOOK: ${timeDiff} SCORE: ${score}`)

            hitTarget.play();
            totalScore += score;
            document.getElementById('score').innerHTML = totalScore;
            document.getElementById('pointsSend').value = totalScore;

            //CLEAR THE GAME AREA   
            //gameContainer.innerHTML = '';
            //targetNode.style.height = '0px'
            //this.src = '';
            targetZombie.src = '/images/zombie/explosion.png';

            setTimeout(()=>{
                targetContainer.remove();
                targetClicks++;
                gun.src = '/images/gunv2.png';
                //STOPS CURRENT MOVE TIMER AND CREATE A NEW TARGET.
                clearTimeout(moveTimer);
                createTarget(storeSize,storeSpeed);
            },100)
        });
    }
}