$(document).ready(function () {
let GAME_SPEED = 80;
const CANVAS_BORDER_COLOUR = '#3b3b3b';
const CANVAS_BACKGROUND_COLOUR = '#e4e4e4';
const SNAKE_COLOUR = '#fa9a1d';
const SNAKE_BORDER_COLOUR = '#3b3b3b';
const FOOD_COLOUR = '#d9ff00';
const FOOD_BORDER_COLOUR = '#3b3b3b';

let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 }
]

let score = 0;
let changingDirection = false;
let foodX;
let foodY;
//horizontal
let dx = 10;
//vertical
let dy = 0;

const gameCanvas = document.querySelector("#gameCanvas");
//2d convert
const ctx = gameCanvas.getContext("2d");

//restart
$('#start').click(function() {
    location.reload();
});

//start game
main();
createFood();
document.addEventListener("keydown", changeDirection);

function main() {

    if (didGameEnd()) return;

    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        
        main();
    }, GAME_SPEED)
}

function clearCanvas() {

    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;

    ctx.strokestyle = CANVAS_BORDER_COLOUR;

    //window back
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    //window border
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokestyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;

        $('#score').text(score);

        createFood();
    } else {
        snake.pop();
    }
    if (score == 100) {
        GAME_SPEED = 60;
    }
}



function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    if (hitBottomWall || hitToptWall || hitLeftWall || hitRightWall == true) {
        $(document).keyup(function (e) {
            if (e.keyCode == 13) {
                location.reload();
            }
        });
    }

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    //random food x
    foodX = randomTen(0, gameCanvas.width - 10);
    //random number food y
    foodY = randomTen(0, gameCanvas.height - 10);

    //new food location
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsoNsnake = part.x == foodX && part.y == foodY;
        if (foodIsoNsnake) { 
            createFood();
        }
        });
}

function drawSnake() {
    snake.forEach(drawSnakePart)
}

function drawSnakePart(snakePart) {
    //snake color
    ctx.fillStyle = SNAKE_COLOUR;

    //border color
    ctx.strokestyle = SNAKE_BORDER_COLOUR;

    //fill snake
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

    //border snake
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    if (changingDirection) {
        return;
    }
    changingDirection = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

});