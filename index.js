const state = {
  numCells: (600 / 40) * (600 / 40),
  cells: [],
  shipPosition: 217,
  alienPosition: [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22, 23, 24, 25, 26, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56,
  ],
  gameOver: false,
};

const setGameUp = (element) => {
  state.element = element;
  // do all things needed to draw the game
  // draw the grid
  drawGrid();
  // draw the spaceship
  drawShip();
  // draw the aliens
  drawAliens();
  // add the instructions and the score
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
  //adding the aliens to the grid > we need to store position of alients in game state
  state.cells.forEach((cell, index) => {
    if (cell.classList.contains("alien")) {
      cell.classList.remove("alien");
    }
    //add image to cell if the index is in the set of alien position
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
  //remove image from current position
  state.cells[state.shipPosition].classList.remove("spaceship");
  // figure out the delta
  if (direction === "left" && state.shipPosition % 15 !== 0) {
    state.shipPosition--;
  } else if (direction === "right" && state.shipPosition % 15 !== 14) {
    state.shipPosition++;
  }
  //add image to new position
  state.cells[state.shipPosition].classList.add("spaceship");
};

const fire = () => {
  // use interval to run code after each time after a specified time
  let interval;
  // laser start at ship position
  let laserPosition = state.shipPosition;
  interval = setInterval(() => {
    // remove laesr image
    state.cells[laserPosition].classList.remove("laser");
    // decrease (move up a row) laser position
    laserPosition -= 15;
    // check we are still in bounds of the grid
    if (laserPosition < 0) {
      clearInterval(interval);
      return;
    }
    // if there is an alien boom
    //clear interval, remove alient image, remove the alien from alien position, add boom, set a time out to remove boom image3
    if (state.alienPosition.includes(laserPosition)) {
      clearInterval(interval);
      state.alienPosition.splice(state.alienPosition.indexOf(laserPosition), 1);
      state.cells[laserPosition].classList.remove("alien", "laser");
      state.cells[laserPosition].classList.add("boom");
      setTimeout(() => {
        state.cells[laserPosition].classList.remove("boom");
      }, 200);
      return;
    }
    // add image again
    state.cells[laserPosition].classList.add("laser");
  }, 100);
};

const play = () => {
  // start the march of the aliens
  let interval;
  //starting direction
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

  // set up ship controls
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
  // have the aliens got to the bottom

  // or aliens all dead
  if (state.alienPosition.length === 0) {
    state.gameOver = true;
    // stop everything
    clearInterval(interval);
    drawMessage("HUMAN WINS!!");
  } else if (
    state.alienPosition.some((position) => position >= state.shipPosition)
  ) {
    clearInterval(interval);
    state.gameOver = true;
    // make ship go boom
    //remove ship image and add explosion
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
// query the page for the place to insert my game
const appElement = document.querySelector(".app");

// do all the things needed to draw the game
setGameUp(appElement);

play();
