const inputSize = document.getElementById("input-size");
const sizeShow = document.querySelector(".size-show");

let size = 5; // Default size
let intervalVar;
let direction = { x: 1, y: 0 }; // Initial direction is not moving
let gameStarted = false;
let food = { x: 0, y: 0 };
let isOver = false;

// Function to create the grid
function createGrid(size) {
  const container = document.querySelector(".container");
  container.innerHTML = ""; // Clear previous grid if any
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    container.appendChild(tile);
  }
}

// Function to start the game
function startGame() {
  if (!isOver) {
    document.querySelector(".container").style.display = "grid";
    document.querySelector("#lost-screen").style.display = "none";
    document.querySelector(".start-menu").style.display = "none";
    createGrid(size);

    // Clear existing interval if any
    if (intervalVar) {
      clearInterval(intervalVar);
    }

    // Initialize game state
    snake = [
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];
    direction = { x: 1, y: 0 };
    spawnFood();

    // Start the game with a new interval
    intervalVar = setInterval(moveSnake, 500);
    gameStarted = true;
  }
}

// Function to update the range display
function updateRange() {
  const max = inputSize.getAttribute("max");
  const min = inputSize.getAttribute("min");
  const value = inputSize.value;
  const percentage = ((value - min) * 100) / (max - min);
  sizeShow.style.left = `calc(${percentage}% + (${8 - percentage * 0.15}px))`;

  size = value;
  sizeShow.textContent = `${size}x${size}`;

  // Handle gap between tiles
  let gap;
  if (value >= min && value <= 7) gap = "5px";
  else if (value > 7 && value <= 10) gap = "4px";
  else if (value > 10 && value <= 12) gap = "3px";
  else if (value > 12 && value <= max) gap = "2px";
  else gap = "1px";
  document.querySelector(".container").style.gap = gap;
}

// Function to render the snake
function renderSnake() {
  const gridTiles = document.querySelectorAll(".tile");
  // Clear previous snake tiles
  gridTiles.forEach((tile) => tile.classList.remove("snake-tile"));

  // Render new snake tiles
  snake.forEach((tile) => {
    const index = tile.x + tile.y * size;
    if (gridTiles[index]) {
      gridTiles[index].classList.add("snake-tile");
    }
  });
  gameStarted = true;
}

// Function to move the snake
function moveSnake() {
  const gridTiles = document.querySelectorAll(".tile");
  const newSnake = [];

  // Compute new head position
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Handle wrapping around the grid

  // Check for collision with itself
  snake.forEach((segment) => {
    if (segment.x == head.x && segment.y === head.y && gameStarted) {
      
      showLostScreen();
    }
  });

  // Handle food consumption
  if (head.x === food.x && head.y === food.y) {
    newSnake.push(food); // Add food to the snake
    spawnFood(); // Spawn new food
  }

  // Add new head to the snake
  newSnake.push(head);
  if (newSnake[0].x > size) newSnake[0].x = 1;
  if (newSnake[0].x <= 0) newSnake[0].x = size - 0;
  if (newSnake[0].y >= size) newSnake[0].y = 0;
  if (newSnake[0].y < 0) newSnake[0].y = size - 1;
  // Add the rest of the snake's body
  for (let i = 0; i < snake.length - 1; i++) {
    newSnake.push(snake[i]);
  }

  // Clear previous head and render new snake
  gridTiles.forEach((tile) => tile.classList.remove("head"));

  snake = newSnake;

  // Set the head class to the new head position
  gridTiles[snake[0].x + snake[0].y * size].classList.add("head");
  renderSnake();
}

// Function to spawn food
function spawnFood() {
  const gridTiles = document.querySelectorAll(".tile");
  let newFoodPosition;
  let foodPositionValid = false;

  while (!foodPositionValid) {
    newFoodPosition = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
    };

    // Check if the new food position is not occupied by the snake
    foodPositionValid = !snake.some(
      (segment) =>
        segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
    );
  }

  food = newFoodPosition;
  const index = food.x + food.y * size;
  gridTiles.forEach((tile) => tile.classList.remove("food-tile")); // Clear previous food
  gridTiles[index].classList.add("food-tile");
  renderSnake();
}

// Handle key events
function handleKeyDown(event) {
  switch (event.code) {
    case "KeyW":
      if (direction.x !== 0 && direction.y !== 1) direction = { x: 0, y: -1 };
      break;
    case "KeyA":
      if (direction.x !== 1 && direction.y !== 0) direction = { x: -1, y: 0 };
      break;
    case "KeyS":
      if (direction.x !== 0 && direction.y !== -1) direction = { x: 0, y: 1 };
      break;
    case "KeyD":
      if (direction.x !== -1 && direction.y !== 0) direction = { x: 1, y: 0 };
      break;
  }
}

function restart() {
  clearInterval(intervalVar);
  direction = { x: 1, y: 0 };
  gameStarted = false;
  isOver = false;
  startGame();
}

function showLostScreen() {
  isOver = true;
  document.querySelector(".container").style.display = "none";
  document.querySelector("#lost-screen").style.display = "flex";
}
// Event listeners
inputSize.addEventListener("input", updateRange);
document.addEventListener("DOMContentLoaded", updateRange);
document.querySelector(".start-button").addEventListener("click", startGame);
document.addEventListener("keydown", handleKeyDown);
