const game = document.getElementById("game");
const cursor = document.getElementById("cursor");
const colorChoice = document.getElementById("colorchoice");
game.width = window.innerWidth;
game.height = window.innerHeight;

const gridCellSize = 10;

const colorList = [
  "#000000",
  "#FF0000",
  "#ff6f00",
  "#FFF500",
  "#00FF57",
  "#00FFFF",
  "#0500FF",
  "#AD00FF",
  "#FFFFFF",
];
let currentColorChoice = colorList[1];

colorList.forEach((color) => {
  const colorItem = document.createElement("div");
  colorItem.style.border = "1px solid black";
  colorItem.style.backgroundColor = color;
  colorChoice.appendChild(colorItem);

  colorItem.addEventListener("click", () => {
    currentColorChoice = color;

    setTimeout(() => {
      colorItem.innerHTML = "";
    }, 1000);
  });
});

const context = game.getContext("2d");

let scale = 1;
let panning = false;
let start = { x: 0, y: 0 };
let panX = 0;
let panY = 0;

function drawGrids() {
  context.clearRect(0, 0, game.width, game.height);
  context.save();
  context.translate(panX, panY);
  context.scale(scale, scale);

  context.beginPath();
  context.strokeStyle = "#ccc";
  for (let i = 0; i < game.width / scale; i += gridCellSize) {
    context.moveTo(i, 0);
    context.lineTo(i, game.height / scale);
  }
  for (let j = 0; j < game.height / scale; j += gridCellSize) {
    context.moveTo(0, j);
    context.lineTo(game.width / scale, j);
  }
  context.stroke();
  context.restore();
}

function addPixelIntoGame() {
  const rect = game.getBoundingClientRect();
  const x =
    Math.floor((cursor.offsetLeft - rect.left - panX) / scale / gridCellSize) *
    gridCellSize;
  const y =
    Math.floor((cursor.offsetTop - rect.top - panY) / scale / gridCellSize) *
    gridCellSize;

  context.save();
  context.translate(panX, panY);
  context.scale(scale, scale);
  context.fillStyle = currentColorChoice;
  context.fillRect(x, y, gridCellSize, gridCellSize);
  context.restore();
}

cursor.addEventListener("click", function () {
  addPixelIntoGame();
});

game.addEventListener("mousemove", function (event) {
  const rect = game.getBoundingClientRect();
  const cursorLeft = event.clientX - rect.left;
  const cursorTop = event.clientY - rect.top;

  cursor.style.left =
    Math.floor(cursorLeft / scale / gridCellSize) * gridCellSize * scale +
    panX +
    "px";
  cursor.style.top =
    Math.floor(cursorTop / scale / gridCellSize) * gridCellSize * scale +
    panY +
    "px";
  cursor.style.backgroundColor = currentColorChoice;
});
drawGrids();
