const score = document.querySelector(".score");
const bar = document.querySelector(".bar");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");



gameMessage.addEventListener("click", start);
startScreen.addEventListener("click", start);

document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);


let keys = {};
let player = {};

function start() {
    player.speed = 40;
    player.score = 0;
    player.inplay = true;
    gameArea.style.width = "110%";
    gameArea.style.background = "rgb(165, 121, 231)";
    gameArea.innerHTML = "";
    gameMessage.classList.add("hide");
    startScreen.classList.add("hide");
    score.classList.remove("hide");
    bar.classList.remove("hide");
    let bird = document.createElement("div");
    bird.setAttribute("class", "bird");
    let wing = document.createElement("span");
    wing.setAttribute("class", "wing");
    wing.pos = 24;
    wing.style.top = wing.pos + "px";
    bird.appendChild(wing);
    gameArea.appendChild(bird);
    player.x = bird.offsetLeft;
    player.y = bird.offsetTop;

    player.pipe = 0;
    let spacing = 400;
    let numberOf = Math.floor((gameArea.offsetWidth) / spacing);
    for (let x = 0; x <numberOf; x++) {
        buildPipes(player.pipe * spacing);
    }
    window.requestAnimationFrame(playGame);
}

function buildPipes(startPos) {
    let totalHeight = gameArea.offsetHeight;
    let totalWidth = gameArea.offsetWidth;
    player.pipe++;
    let pipe1 = document.createElement("div");
    pipe1.start = startPos + totalWidth;
    pipe1.classList.add("pipe");
    pipe1.innerHTML = player.pipe;
    pipe1.height = Math.floor(Math.random() * 200) + 100;
    pipe1.style.height = pipe1.height + "px";
    pipe1.style.left = pipe1.start + "px";
    pipe1.style.top = "0px";
    pipe1.x = pipe1.start;
    pipe1.id = player.pipe;
    pipe1.passed = false;
    pipe1.style.background = "darkorange";
    gameArea.appendChild(pipe1);
    let pipeSpace = Math.floor(Math.random() * 100) + 100;
    let pipe2 = document.createElement("div");
    pipe2.start = pipe1.start;
    pipe2.classList.add("pipe");
    pipe2.innerHTML = player.pipe;
    pipe2.style.height = totalHeight - pipe1.height - pipeSpace + "px";
    pipe2.style.left = pipe1.start + "px";
    pipe2.style.bottom = "0px";
    pipe2.x = pipe1.start;
    pipe2.id = player.pipe;
    pipe2.passed = false;
    pipe2.style.background = "springgreen";
    gameArea.appendChild(pipe2);
}

function movePipes(bird) {
    let columns = document.querySelectorAll(".pipe");
    let counter = 0; 
    columns.forEach(function (column) {
        column.x -= player.speed/10;
        column.style.left = column.x + "px";
        // Check if bird passes the pipes
        if (column.x + column.offsetWidth < player.x && !column.passed){
            column.passed = true;
            player.score += Math.round(Math.random()*10 + 100); // score for passing each pipe pair
        }
        if (column.x < 0) {
            column.parentElement.removeChild(column);
            counter++;
        }
    })
    counter = counter / 2;
    for (let x = 0; x < counter; x++) {
        buildPipes(0);
    }
}


function checkCollision(bird, pipe) {
    const birdRect = bird.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();
    return !(
        birdRect.top > pipeRect.bottom ||
        birdRect.bottom < pipeRect.top ||
        birdRect.left > pipeRect.right ||
        birdRect.right < pipeRect.left
    );
}


function playGame() {
    if (player.inplay) {
        let bird = document.querySelector(".bird");
        let pipes = document.querySelectorAll(".pipe");
        pipes.forEach(pipe => {
            if (checkCollision(bird, pipe)) {
                playGameOver(bird);
            }
        });
        let wing = document.querySelector(".wing");
        let move = false;

        if (keys.ArrowLeft && player.x > 20) {
            player.x -= player.speed;
            move = true;
        }
        if (keys.ArrowRight && player.x < (gameArea.offsetWidth - 100)) {
            player.x += player.speed;
            move = true;
        }
        if ((keys.ArrowUp || keys.Space) && player.y > 40) {
            player.y -= player.speed/2;
            move = true;
        }
        if (keys.ArrowDown && player.y < (gameArea.offsetHeight - 60)) {
            player.y += player.speed/2;
            move = true;
        }
        if (move) {
            wing.pos = (wing.pos == 24) ? 30 : 24;
            wing.style.top = wing.pos + "px";
        }
        // Gravity
        player.y += (player.speed * 0.02);

        // Update position
        bird.style.top = player.y + "px";
        bird.style.left = player.x + "px";

        // Move pipes and check collision
        movePipes(bird);

        // Fall off the bottom game area
        if (player.y > gameArea.offsetHeight) {
            playGameOver(bird);
        }

        window.requestAnimationFrame(playGame);
        bar.innerHTML = "Birdy Game"; 
        score.innerText = `Score: ${player.score}`; 
    }
}

function playGameOver(bird) {
    player.inplay = false;
    gameMessage.classList.remove("hide");
    bird.setAttribute("style", "position: absolute; top: 40vh; left: 50vw; transform: translateX(-50%) rotate(180deg) scale(1.6);");
    gameMessage.innerHTML = "Birdy scored " + player.score + " points <br>Click to start again";
}


function pressOn(e) {
    e.preventDefault();
    keys[e.code] = true;
    console.log(keys);
}

function pressOff(e) {
    e.preventDefault();
    keys[e.code] = false;
}
