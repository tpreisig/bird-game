class Game {
    constructor() {
        this.gameArea = document.querySelector(".gameArea");
        this.scoreDisplay = document.querySelector(".score");
        this.bar = document.querySelector(".bar");
        this.startScreen = document.querySelector(".startScreen");
        this.gameMessage = document.querySelector(".gameMessage");

        // Game state
        this.player = {
            speed: 40,
            score: 0,
            highScore: localStorage.getItem("highScore") || 0,
            inplay: false,
            pipeCount: 0
        };

        // Define spacing as a class property
        this.spacing = 400;

        // Audio for background music
        this.backgroundMusic = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;

        // Bind event listeners
        this.startScreen.addEventListener("click", () => this.start());
        this.gameMessage.addEventListener("click", () => this.start());
        document.addEventListener("keydown", (e) => this.pressOn(e));
        document.addEventListener("keyup", (e) => this.pressOff(e));

        // Keyboard state
        this.keys = {};

        // Game objects
        this.bird = null;
        this.pipes = [];
    }

    start() {
        // Reset game state
        this.player.score = 0;
        this.player.inplay = true;
        this.player.pipeCount = 0;
        this.gameArea.innerHTML = "";
        this.pipes = []; // Clear pipes to prevent jamming on restart
        this.gameArea.style.width = "100%";
        this.gameArea.style.background = "rgb(165, 121, 231)";
        this.gameMessage.classList.add("hide");
        this.startScreen.classList.add("hide");
        this.scoreDisplay.classList.remove("hide");
        this.bar.classList.remove("hide");

        // Initialize bird
        this.bird = new Bird(this.gameArea, this.player.speed);

        // Generate initial pipes
        const numberOfPipes = Math.floor(this.gameArea.offsetWidth / this.spacing);
        for (let x = 0; x < numberOfPipes; x++) {
            this.pipes.push(...this.buildPipes(this.player.pipeCount * this.spacing));
        }

        // Start background music
        this.backgroundMusic.play().catch(e => console.error("Audio playback failed:", e));

        // Start game loop
        this.update();
    }

    buildPipes(startPos) {
        const totalHeight = this.gameArea.offsetHeight;
        const totalWidth = this.gameArea.offsetWidth;
        this.player.pipeCount++;

        const pipe1 = new Pipe(this.gameArea, this.player.pipeCount, startPos + totalWidth, true, totalHeight);
        const pipeSpace = Math.floor(Math.random() * 200) + 100;
        const pipe2 = new Pipe(this.gameArea, this.player.pipeCount, startPos + totalWidth, false, totalHeight, pipe1.height, pipeSpace);

        return [pipe1, pipe2];
    }

    update() {
        if (!this.player.inplay) return;

        this.bird.update(this.keys, this.gameArea.offsetWidth, this.gameArea.offsetHeight);
        this.movePipes();
        this.scoreDisplay.innerText = `Score: ${this.player.score} | High Score: ${this.player.highScore}`;

        if (this.bird.y > this.gameArea.offsetHeight) {
            this.gameOver();
        }
        window.requestAnimationFrame(() => this.update());
    }

    movePipes() {
        let counter = 0;
        this.pipes = this.pipes.filter(pipe => {
            pipe.update(this.player.speed);

            // Check collision
            if (pipe.checkCollision(this.bird.element)) {
                this.gameOver();
                return false;
            }

            // Update score when passing pipes
            if (!pipe.passed && pipe.x + pipe.element.offsetWidth < this.bird.x) {
                pipe.passed = true;
                if (pipe.isTop) {
                    this.player.score += Math.round(Math.random() * 10 + 100);
                    if (this.player.score > this.player.highScore) {
                        this.player.highScore = this.player.score;
                        localStorage.setItem("highScore", this.player.highScore);
                    }
                }
            }

            // Remove pipes that are off-screen
            if (pipe.x < -pipe.element.offsetWidth) {
                pipe.element.remove();
                counter++;
                return false;
            }
            return true;
        });

        // Generate new pipes
        const pairsToAdd = Math.floor(counter / 2);
        for (let x = 0; x < pairsToAdd; x++) {
            this.pipes.push(...this.buildPipes(x * this.spacing));
        }
    }

    gameOver() {
        this.player.inplay = false;
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0; // Reset music
        this.gameMessage.classList.remove("hide");
        this.bird.element.style.position = "absolute";
        this.bird.element.style.top = "40vh";
        this.bird.element.style.left = "50vw";
        this.bird.element.style.transform = "translateX(-50%) rotate(180deg) scale(1.6)";
        this.gameMessage.innerHTML = `Birdy scored ${this.player.score} points<br>High Score: ${this.player.highScore}<br>Click to start again`;
    }

    pressOn(e) {
        e.preventDefault();
        this.keys[e.code] = true;
    }

    pressOff(e) {
        e.preventDefault();
        this.keys[e.code] = false;
    }
}

class Bird {
    constructor(gameArea, speed) {
        this.speed = speed;
        this.element = document.createElement("div");
        this.element.classList.add("bird");
        this.wing = document.createElement("span");
        this.wing.classList.add("wing");
        this.wing.pos = 24;
        this.wing.style.top = `${this.wing.pos}px`;
        this.element.appendChild(this.wing);
        gameArea.appendChild(this.element);
        this.x = this.element.offsetLeft;
        this.y = this.element.offsetTop;
    }

    update(keys, maxWidth, maxHeight) {
        let move = false;
        if (keys.ArrowLeft && this.x > 20) {
            this.x -= this.speed;
            move = true;
        }
        if (keys.ArrowRight && this.x < maxWidth - 100) {
            this.x += this.speed;
            move = true;
        }
        if ((keys.ArrowUp || keys.Space) && this.y > 40) {
            this.y -= this.speed / 2;
            move = true;
        }
        if (keys.ArrowDown && this.y < maxHeight - 60) {
            this.y += this.speed / 2;
            move = true;
        }
        if (move) {
            this.wing.pos = this.wing.pos === 24 ? 30 : 24;
            this.wing.style.top = `${this.wing.pos}px`;
        }
        // Apply gravity
        this.y += this.speed * 0.02;

        // Update position
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
    }
}
class Pipe {
    constructor(gameArea, id, startX, isTop, totalHeight, topHeight = 0, pipeSpace = 0) {
        this.element = document.createElement("div");
        this.element.classList.add("pipe");
        this.element.innerHTML = id;
        this.isTop = isTop;
        this.passed = false;
        this.x = startX;
        this.element.style.left = `${startX}px`;
        if (isTop) {
            this.height = Math.floor(Math.random() * 200) + 100;
            this.element.style.height = `${this.height}px`;
            this.element.style.top = "0px";
            this.element.style.background = "darkorange";
        } else {
            this.height = totalHeight - topHeight - pipeSpace;
            this.element.style.height = `${this.height}px`;
            this.element.style.bottom = "0px";
            this.element.style.background = "springgreen";
        }
        gameArea.appendChild(this.element);
    }

    update(speed) {
        this.x -= speed / 10;
        this.element.style.left = `${this.x}px`;
    }

    checkCollision(bird) {
        const birdRect = bird.getBoundingClientRect();
        const pipeRect = this.element.getBoundingClientRect();
        return !(
            birdRect.top > pipeRect.bottom ||
            birdRect.bottom < pipeRect.top ||
            birdRect.left > pipeRect.right ||
            birdRect.right < pipeRect.left
        );
    }
}

const game = new Game();