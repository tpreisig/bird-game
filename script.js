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
    // console.log("start");
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
    pipe1.height = Math.floor(Math.random() * 350) + 100;
    pipe1.style.height = pipe1.height + "px";
    pipe1.style.left = pipe1.start + "px";
    pipe1.style.top = "0px";
    pipe1.x = pipe1.start;
    pipe1.id = player.pipe;
    pipe1.style.background = "darkorange";
    gameArea.appendChild(pipe1);
    let pipeSpace = Math.floor(Math.random() * 200);
    let pipe2 = document.createElement("div");
    pipe2.start = pipe1.start;
    pipe2.classList.add("pipe");
    pipe2.innerHTML = player.pipe;
    pipe2.style.height = totalHeight - pipe1.height - pipeSpace + "px";
    pipe2.style.left = pipe1.start + "px";
    pipe2.style.bottom = "0px";
    pipe2.x = pipe1.start;
    pipe2.id = player.pipe;
    pipe2.style.background = "springgreen";
    gameArea.appendChild(pipe2);
}



function movePipes(bird) {
    let columns = document.querySelectorAll(".pipe");
    let counter = 0; //counts pipes to remove
    columns.forEach(function (column) {
        console.log(column);
        column.x -= player.speed/10;
        column.style.left = column.x + "px";
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

function playGame() {
    if (player.inplay) {
        let bird = document.querySelector(".bird");
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
            player.y -= player.speed;
            move = true;
        }
        if (keys.ArrowDown && player.y < (gameArea.offsetHeight - 60)) {
            player.y += player.speed;
            move = true;
        }
        if (move) {
            wing.pos = (wing.pos == 24) ? 30 : 24;
            wing.style.top = wing.pos + "px";
        }
        // Gravity
        player.y += (player.speed * 0.04);

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
        player.score++;
        bar.innerHTML = "Birdy Game"; 
        score.innerText = `Score: ${player.score}`;
        
    }
}

function playGameOver(bird) {
    player.inplay = false;
    gameMessage.classList.remove("hide");
    bird.setAttribute("style", "transform: translate(500%, 200%) rotate(180deg) scale(1.5);");
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
