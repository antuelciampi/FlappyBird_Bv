const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = '/assets/yo.png';

//constantes juego
const FLAP_SPEED = -5;
const BIRD_WIDTH = 35;
const BIRD_HEIGHT = 10;
const PIPE_WIDTH = 50;
const PIPE_GAP = 120;

// variables pajaro
let birdX = 50;
let birdY = 40;
let birdVelocity = 1;
let birdAcceleration = 0.1;

// variables de los tubos
let pipeX = 400;
let pipeY = canvas.height - 200;

// puntaje y puntaje máximo
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;

// manejar el pajaro (a mi xd) con el espacio
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

// reiniciar
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})



function increaseScore() {
    // aumenta numero si pasamos el tubo
    if(birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
        birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
        !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // hitbox

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // colision tubo arriba
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    // colision tubo abajo
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }

    // ver si el pajaro hitea estos
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }


    return false;
}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // siempre actualiza el mayor puntaje
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// reset
function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // dibujar pajaro
    ctx.drawImage(flappyImg, birdX, birdY);

    // dibujar los tubos
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // ver si nos golpeamos
    if (collisionCheck()) {
        endGame();
        return;
    }


    pipeX -= 1.5;
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    // dejar q se mueva
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore()
    requestAnimationFrame(loop);
}

loop();