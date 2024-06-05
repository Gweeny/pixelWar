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
  const x = cursor.offsetLeft;
  const y = cursor.offsetTop - game.offsetTop;

  context.beginPath();
  context.fillStyle = currentColorChoice;
  context.fillRect(x, y, gridCellSize, gridCellSize);
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
  const cursorLeft = (cursor.style.left =
    event.clientX - cursor.offsetWidth / 2);
  const cursorTop = (cursor.style.top =
    event.clientY - cursor.offsetHeight / 2);

  cursor.style.left =
    Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px";
  cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px";
  cursor.style.backgroundColor = currentColorChoice;
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

// Countdown

// Fonction pour vérifier si un pixel peut être placé
function canPlacePixel() {
  const lastPixelTime = localStorage.getItem("lastPixelTime");
  if (!lastPixelTime) {
    return true;
  } else {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - parseInt(lastPixelTime);
    const minuteInMilliseconds = 60 * 1000;
    return timeDiff >= minuteInMilliseconds;
  }
}

// Fonction pour mettre à jour l'affichage du compte à rebours
function updateCountdown(seconds) {
  const countdownElement = document.getElementById("countdown");
  countdownElement.textContent = `Prochain pixel dans ${seconds} secondes`;
}

// Fonction pour démarrer le compte à rebours
function startCountdown() {
  let remainingSeconds = 30;
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

// Gestionnaire d'événements de clic sur le canvas
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

// Ajouter l'écouteur d'événements de clic initial sur le canvas
game.addEventListener("click", handleCanvasClick);
