const game = document.getElementById('game');
const cursor = document.getElementById('cursor');
const colorChoice = document.getElementById('colorchoice');
game.width = 1200
game.height = 600

const gridCellSize = 10;


const colorList = ["#FF0000","#FFF500", "#00FF57", "#00FFFF", "#0500FF", "#AD00FF", ];
let currentColorChoice = colorList[4]

colorList.forEach(color => {
    const colorItem = document.createElement('div');
    colorItem.style.backgroundColor = color;
    colorChoice.appendChild(colorItem);

    colorItem.addEventListener('click', () => { 
        currentColorChoice = color;
        colorItem.innerHTML = `<i class="fa-solid fa-check"></i>`

        setTimeout(() => {
            colorItem.innerHTML = "";
        }, 1000);
    } 
    )
}
)


const context = game.getContext('2d');
const gridContext = game.getContext('2d');

function addPixelIntoGame(){
    const x = cursor.offsetLeft
    const y = cursor.offsetTop - game.offsetTop;

    context.beginPath()
context.fillStyle = currentColorChoice;
context.fillRect(x, y, gridCellSize, gridCellSize);


}

cursor.addEventListener('click', function(event) {
    addPixelIntoGame();
});

function drawGrids(context, width, height, cellWidth, cellHeight) {
    context.beginPath();
    context.strokeStyle = '#ccc';
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

game.addEventListener('mousemove', function(event) {
    const cursorLeft = cursor.style.left = event.clientX - (cursor.offsetWidth/2)
    const cursorTop = cursor.style.top = event.clientY -(cursor.offsetHeight/2)

    cursor.style.left = Math.floor(cursorLeft / gridCellSize)*gridCellSize + "px";
    cursor.style.top = Math.floor(cursorTop / gridCellSize)*gridCellSize + "px"; 
});

game.addEventListener('click', function() {
    addPixelIntoGame();
}); 