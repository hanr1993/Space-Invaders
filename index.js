const state = {
  numCells: (600 / 40) * (600 / 40),
  cells: [],
  shipPosition: 217,
  alienPosition: [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22, 23, 24, 25, 26, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56,
  ],
  gameOver: false,
  score: 0,
};

const setGameUp = (element) => {
  state.element = element;

  drawGrid();

  drawShip();

  drawAliens();

  drawScoreboard();
};

const drawGrid = () => {
  const grid = document.createElement("div");
  grid.classList.add("grid");

  for (let i = 0; i < state.numCells; i++) {
    const cell = document.createElement("div");
    grid.append(cell);

    state.element.append(grid);
    state.cells.push(cell);
  }
};

const drawShip = () => {
  state.cells[state.shipPosition].classList.add("spaceship");
};

const drawAliens = () => {
  state.cells.forEach((cell, index) => {
    if (cell.classList.contains("alien")) {
      cell.classList.remove("alien");
    }

    if (state.alienPosition.includes(index)) {
      cell.classList.add("alien");
    }
  });
};

const controlShip = (event) => {
  if (state.gameOver) return;
  if (event.code === "ArrowLeft") {
    moveShip("left");
  } else if (event.code === "ArrowRight") {
    moveShip("right");
  } else if (event.code === "Space") {
    fire();
  }
};

const moveShip = (direction) => {
  state.cells[state.shipPosition].classList.remove("spaceship");

  if (direction === "left" && state.shipPosition % 15 !== 0) {
    state.shipPosition--;
  } else if (direction === "right" && state.shipPosition % 15 !== 14) {
    state.shipPosition++;
  }

  state.cells[state.shipPosition].classList.add("spaceship");
};

const fire = () => {
  let interval;

  let laserPosition = state.shipPosition;
  interval = setInterval(() => {
    state.cells[laserPosition].classList.remove("laser");

    laserPosition -= 15;

    if (laserPosition < 0) {
      clearInterval(interval);
      return;
    }
    3;
    if (state.alienPosition.includes(laserPosition)) {
      clearInterval(interval);
      state.alienPosition.splice(state.alienPosition.indexOf(laserPosition), 1);
      state.cells[laserPosition].classList.remove("alien", "laser");
      state.cells[laserPosition].classList.add("boom");
      state.score++;
      state.scoreElement.innerText = state.score;
      setTimeout(() => {
        state.cells[laserPosition].classList.remove("boom");
      }, 200);
      return;
    }

    state.cells[laserPosition].classList.add("laser");
  }, 100);
};

const play = () => {
  let interval;

  let direction = "right";
  interval = setInterval(() => {
    let movement;

    if (direction === "right") {
      if (atEdge("right")) {
        movement = 15 - 1;
        direction = "left";
      } else {
        movement = 1;
      }
    } else if (direction === "left") {
      if (atEdge("left")) {
        movement = 15 + 1;
        direction = "right";
      } else {
        movement = -1;
      }
    }

    state.alienPosition = state.alienPosition.map(
      (position) => position + movement
    );

    drawAliens();
    checkGameState(interval);
  }, 400);

  window.addEventListener("keydown", controlShip);
};

const atEdge = (side) => {
  if (side === "left") {
    return state.alienPosition.some((position) => position % 15 === 0);
  }
  if (side === "right") {
    return state.alienPosition.some((position) => position % 15 === 14);
  }
};

const checkGameState = (interval) => {
  if (state.alienPosition.length === 0) {
    state.gameOver = true;

    clearInterval(interval);
    drawMessage("HUMAN WINS!!");
  } else if (
    state.alienPosition.some((position) => position >= state.shipPosition)
  ) {
    clearInterval(interval);
    state.gameOver = true;

    state.cells[state.shipPosition].classList.remove("spaceship");
    state.cells[state.shipPosition].classList.add("boom");
    drawMessage("GAME OVER!");
  }
};

const drawMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  const h1 = document.createElement("h1");
  h1.innerText = message;
  messageElement.append(h1);
  state.element.append(messageElement);
};

const drawScoreboard = () => {
  const heading = document.createElement("h1");
  heading.innerText = "Space Invaders";
  const paragraph1 = document.createElement("p");
  paragraph1.innerText = "Press SPACE to shoot.";
  const paragraph2 = document.createElement("p");
  paragraph2.innerText = "Press ← and → to move";
  const scoreboard = document.createElement("div");
  scoreboard.classList.add("scoreboard");
  const scoreElement = document.createElement("span");
  scoreElement.innerText = state.score;
  const heading3 = document.createElement("h3");
  heading3.innerText = "Score: ";
  heading3.append(scoreElement);
  scoreboard.append(heading, paragraph1, paragraph2, heading3);

  state.scoreElement = scoreElement;
  state.element.append(scoreboard);
};

const appElement = document.querySelector(".app");

setGameUp(appElement);

play();
