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
        pipeCount: 0,
    };

    // Audio for background music
    this.backgroundMusic = new Audio("/audio/background.mp3"); // Replace with your audio file
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3; // Adjust volume

    // Bind event listeners
    this.startScreen.addEventListener("click", () => this.start());
    this.gameMessage.addEventListener("click", () => this.start());
    document.addEventListener("keydown", (e) => this.pressOn(e));
    document.addEventListener("keyup", (e) => this.pressOff(e));


    // keyboard state
    this.keys = {};

    // game objects
    this.bird = null;
    this.pipes = [];
   
  }
  start() {
    this.player.score = 0;
    this.player.inplay = true;
    this.player.pipeCount = 0;
    this.gameArea.innerHTML = "";
    this.gameArea.style.width = "100%";
    this.gameArea.style.background = "rgb(165, 121, 231)";
    this.gameMessage.classList.add("hide");
    this.startScreen.classList.add("hide");
    this.scoreDisplay.classList.remove("hide");
    this.bar.classList.remove("hide");

    // Initialize the bird
    this.bird = new Bird(this.gameArea, this.player.speed);

    // Generate initial pipes
    const spacing = 400;
    const numberOfPipes = Math.floor(this.gameArea.offsetWidth / spacing);
    for (let i = 0; i < numberOfPipes; i++) {
      this.pipes.push(...this.buildPipes(this.player.pipeCount * spacing));
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
    const pipeSpace = Math.floor(Math.random() * 100) + 100;
    const pipe2 = new Pipe(this.gameArea, this.player.pipeCount, startPos + totalWidth, false, totalHeight, pipe1.height, pipeSpace);
        
    return [pipe1, pipe2];
  }
  update() {}

  movePipes() {}

  gameOver() {
    this.player.inplay = false;
    this.backgroundMusic.pause();
    this.gameMessage.classList.remove("hide");
    this.gameMessage.innerHTML = `Game Over! Your score: ${this.player.score}`;
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
        this.wing = document.createElement("div");
        this.wing.classList.add("wing");
        this.wing.pos = 24
    }
    update() {}
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
    update() {}

    checkCollision(){}

}

// Initialize game
const game = new Game();
console.log(game);

