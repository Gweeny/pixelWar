const game = document.getElementById("game");
const cursor = document.getElementById("cursor");
const colorChoice = document.getElementById("colorchoice");
game.width = window.window.innerWidth;
game.height = window.window.innerHeight;

const el = document.getElementById("inGame");

const gridCellSize = 10;
let scale = 1;

const colorList = [
  "#000000",
  "#FF0000",
  "#FFF500",
  "#00FF57",
  "#00FFFF",
  "#0500FF",
  "#AD00FF",
  "#FFFFFF",
];
let currentColorChoice = colorList[4];

colorList.forEach((color) => {
  const colorItem = document.createElement("div");
  colorItem.style.border = "2px solid black";
  colorItem.style.marginInline = "10px";
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
const gridContext = game.getContext("2d");

function addPixelIntoGame() {
  const x = cursor.offsetLeft;
  const y = cursor.offsetTop - game.offsetTop;
  console.log(x);
  console.log(y);
  context.beginPath();
  context.fillStyle = currentColorChoice;
  context.fillRect(x, y, gridCellSize, gridCellSize);
}

cursor.addEventListener("click", function () {
  addPixelIntoGame();
});

function drawGrids(context, width, height, cellWidth, cellHeight) {
  context.beginPath();
  context.strokeStyle = "#ccc";
  for (let i = 0; i < width; i += cellWidth) {
    context.moveTo(i + cellWidth, 0);
    context.lineTo(i + cellWidth, height);
  }
  for (let i = 0; i < height; i += cellWidth) {
    context.moveTo(0, i + cellHeight, 0);
    context.lineTo(width, i + cellHeight);
  }
  context.stroke();
}
drawGrids(gridContext, game.width, game.height, gridCellSize, gridCellSize);

// Carré de la souris
game.addEventListener("mousemove", function (event) {
  const cursorLeft = (cursor.style.left =
    event.clientX - cursor.offsetWidth / 2);
  const cursorTop = (cursor.style.top =
    event.clientY - cursor.offsetHeight / 2);

  cursor.style.left =
    Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px";
  cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px";
  cursor.style.backgroundColor = currentColorChoice;
});

game.addEventListener("click", function () {
  addPixelIntoGame();
});

function zoom(event) {
  event.preventDefault();

  scale += event.deltaY * -0.01;

  // Restrict scale
  scale = Math.min(Math.max(1, scale), 5);

  // Apply scale transform
  el.style.transform = `scale(${scale})`;
}
el.onwheel = zoom;
