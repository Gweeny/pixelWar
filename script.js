const game = document.getElementById("game");
const cursor = document.getElementById("cursor");
const colorChoice = document.getElementById("colorchoice");
game.width = 1910;
game.height = 850;
const el = document.getElementById("inGame");

const gridCellSize = 10;
let scale = 1;

const colorList = [
  "#000000", // Noir
  "#898D90", // Gris foncé
  "#D4D7D9", // Gris
  "#FFFFFF", // Blanc
  "#BE0039", // Rouge
  "#FF4500", // Orange foncé
  "#FFA800", // Orange
  "#FFD635", // Jaune
  "#FFF8B8", // Jaune pâle
  "#00A368", // Vert foncé
  "#00CC78", // Vert
  "#7EED56", // Vert clair
  "#00756F", // Bleu foncé
  "#009EAA", // Bleu
  "#00CCC0", // Cyan
  "#2450A4", // Bleu clair
  "#3690EA", // Indigo
  "#493AC1", // Violet foncé
  "#6A5CFF", // Violet
  "#811E9F", // Rose foncé
  "#B44AC0", // Rose
  "#FF3881", // Rose clair
  "#FF99AA", // Rose très clair
  "#6D001A", // Marron
];
let currentColorChoice = colorList[4];

colorList.forEach((color) => {
  const colorItem = document.createElement("div");
  colorItem.style.border = "2px solid black";
  colorItem.style.marginInline = "2px";
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
  const x = cursor.offsetLeft + (gridCellSize - (gridCellSize - 2)) / 2;
  const y =
    cursor.offsetTop - game.offsetTop + (gridCellSize - (gridCellSize - 2)) / 2;

  context.beginPath();
  context.fillStyle = currentColorChoice;
  context.fillRect(x, y, gridCellSize - 2, gridCellSize - 2);
}

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
  const cursorLeft = event.clientX - cursor.offsetWidth / 2;
  const cursorTop = event.clientY - cursor.offsetHeight / 2;
  cursor.style.left =
    Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px";
  cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px";
  cursor.style.backgroundColor = currentColorChoice;
});

// Zoom

let panning = false,
  pointX = 0,
  pointY = 0,
  start = { x: 0, y: 0 },
  zoom = document.getElementById("inGame");

function setTransform() {
  zoom.style.transform =
    "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

zoom.onmousedown = function (e) {
  e.preventDefault();
  start = { x: e.clientX - pointX, y: e.clientY - pointY };
  panning = true;
};

zoom.onmouseup = function (e) {
  panning = false;
};

zoom.onmousemove = function (e) {
  e.preventDefault();
  if (!panning) {
    return;
  }
  pointX = e.clientX - start.x;
  pointY = e.clientY - start.y;
  setTransform();
};

zoom.onwheel = function (e) {
  e.preventDefault();
  var xs = (e.clientX - pointX) / scale,
    ys = (e.clientY - pointY) / scale,
    delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;

  if (delta > 0 || (delta < 0 && scale > 1)) {
    scale = delta > 0 ? scale * 1.2 : scale / 1.2;
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;
    setTransform();
  }
};

/////////////////////////////////////////////////

// Drag and drop functionality
let isDragging = false;
let startX, startY, initialOffsetX, initialOffsetY;

game.addEventListener("mousedown", function (event) {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
  initialOffsetX = el.offsetLeft;
  initialOffsetY = el.offsetTop;
  el.style.cursor = "grabbing";
});

document.addEventListener("mousemove", function (event) {
  if (isDragging) {
    let dx = event.clientX - startX;
    let dy = event.clientY - startY;
    el.style.left = initialOffsetX + dx + "px";
    el.style.top = initialOffsetY + dy + "px";
  }
});

document.addEventListener("mouseup", function () {
  isDragging = false;
  el.style.cursor = "default";
});

// Countdown

function canPlacePixel() {
  const lastPixelTime = localStorage.getItem("lastPixelTime");
  if (!lastPixelTime) return true;
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - parseInt(lastPixelTime);
  const minuteInMilliseconds = 15 * 1000;
  return timeDiff >= minuteInMilliseconds;
}

function updateCountdown(seconds) {
  const countdownElement = document.getElementById("countdown");
  countdownElement.textContent = `Prochain pixel dans ${seconds} secondes`;
}

function startCountdown(remainingSeconds = 15) {
  updateCountdown(remainingSeconds);
  const countdownInterval = setInterval(() => {
    remainingSeconds--;
    updateCountdown(remainingSeconds);
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      updateCountdown(0);
      localStorage.removeItem("lastPixelTime");
      game.addEventListener("click", handleCanvasClick);
    }
  }, 1000);
}

function handleCanvasClick() {
  if (canPlacePixel()) {
    addPixelIntoGame();
    startCountdown();
    const currentTime = new Date().getTime();
    localStorage.setItem("lastPixelTime", currentTime.toString());
    console.log("Pixel placé avec succès.");
    game.removeEventListener("click", handleCanvasClick);
  } else {
    console.log("Vous devez attendre 1 minute avant de placer un autre pixel.");
    const lastPixelTime = parseInt(localStorage.getItem("lastPixelTime"));
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastPixelTime;
    const remainingSeconds = Math.max(0, 60 - Math.floor(timeDiff / 1000));
    startCountdown(remainingSeconds);
  }
}

game.addEventListener("click", handleCanvasClick);
