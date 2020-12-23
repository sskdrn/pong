var canvas, canvasContext, mouseX, mouseY, playerPaddle, computerPaddle, ball, speed = [5, -5], prevBallX, prevBallY, player1 = 0, player2 = 0;
var isPaused = false, gameOver = false, gameStart = true;
class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.render();
    }
    render() {
        canvasContext.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.x_speed = speed[Math.floor(Math.random() * speed.length)];
        this.y_speed = speed[Math.floor(Math.random() * speed.length)];
        this.render();
    }
    render() {
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        canvasContext.stroke()
        canvasContext.fillStyle = "#07DA63";
        canvasContext.fill();
    }
    updatePosition(y) {
        this.y = y;
    }
}
let ballHitsPlayerPaddle = (x, y) => {
    let slope = ((y - prevBallY) * 1.00) / (x - prevBallX);
    let v;
    if ((ball.x <= playerPaddle.x + playerPaddle.width && ball.x >= playerPaddle.x) && (ball.y <= playerPaddle.y + playerPaddle.height && ball.y >= playerPaddle.y)) {
        if (slope > -1 && slope <= 0)
            v = 2;
        else
            v = 1;
    }
    else
        v = 0;
    return v;
}
let ballHitsComputerPaddle = (x, y) => {
    let slope = ((y - prevBallY) * 1.00) / (x - prevBallX);
    let v;
    if ((ball.x <= computerPaddle.x + computerPaddle.width && ball.x >= computerPaddle.x) && (ball.y <= computerPaddle.y + computerPaddle.height && ball.y >= computerPaddle.y)) {
        if (slope > -1 && slope <= 0)
            v = 2;
        else
            v = 1;
    }
    else
        v = 0;
    return v;
}
let collisionCheck = () => {
    if (ballHitsPlayerPaddle(ball.x, ball.y) == 2)
        ball.y_speed *= -1;
    else if (ballHitsPlayerPaddle(ball.x, ball.y) == 1)
        ball.x_speed *= -1;

    if (ballHitsComputerPaddle(ball.x, ball.y) == 2)
        ball.y_speed *= -1;
    else if (ballHitsComputerPaddle(ball.x, ball.y) == 1)
        ball.x_speed *= -1;

    if (ball.x + ball.radius * 2 >= canvas.offsetLeft + canvas.width) {
        ballOut(1);
    }
    if (ball.x - ball.radius <= canvas.offsetLeft)
        ballOut(2);
    if (ball.y + ball.radius * 2 >= canvas.offsetTop + canvas.height || ball.y <= canvas.offsetTop)
        ball.y_speed *= -1;
}
let ballOut = player => {
    if (player == 1)
        player1++;
    else if (player == 2)
        player2++;
    if (player1 == 5)
        endGame(1);
    else if (player2 == 5)
        endGame(2);
    else {
        isPaused = true;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        playerPaddle.render();
        drawCourt();
    }
}
let drawCourt = () => {
    canvasContext.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height);
    canvasContext.font = "25px Arial"
    canvasContext.strokeStyle = "#07DA63";
    canvasContext.fillText(player1.toString(), canvas.width / 2 - 30, 30);
    canvasContext.fillText(player2.toString(), canvas.width / 2 + 25, 30);
    canvasContext.fillStyle = "#07DA63";
    canvasContext.beginPath();
    canvasContext.lineWidth = 5;
    canvasContext.arc(canvas.width / 2, canvas.height / 2, 25, 0, Math.PI * 2, false);
    canvasContext.stroke()
    canvasContext.fillStyle = "#07DA63";


}
let moveBall = () => {

    collisionCheck();
    prevBallX = ball.x;
    prevBallY = ball.y;
    if (!gameOver) {
        ball.x += ball.x_speed;
        ball.y += ball.y_speed;
        ball.render();
    }
}
let movePlayerPaddle = () => {
    if (mouseY <= canvas.height - playerPaddle.height) {
        playerPaddle.y = mouseY;
        playerPaddle.render();

    }
    else
        playerPaddle.render();
}
let moveComputerPaddle = () => {
    if (ball.x > canvas.width / 2 + canvas.offsetLeft && ball.x_speed > 0) {
        if (ball.y > computerPaddle.y + computerPaddle.height / 2 && (computerPaddle.y + computerPaddle.height <= canvas.offsetTop + canvas.height))
            computerPaddle.y += computerPaddle.speed;
        else if (ball.y < computerPaddle.y + computerPaddle.height / 2 && computerPaddle.y >= canvas.offsetTop)
            computerPaddle.y -= computerPaddle.speed;
        computerPaddle.render();
    }
    else
        computerPaddle.render();

}
let endGame = winner => {
    isPaused = true;
    gameOver = true;
    let message;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    if (winner == 1)
        message = "YOU WIN!!!!"
    else if (winner == 2)
        message = "COMPUTER WINS!!!";
    canvasContext.font = "50px Arial"
    canvasContext.fillText(message, canvas.width / 2 - 300, canvas.height / 2);
    canvasContext.font = "30px Arial"
    canvasContext.fillText("Click anywhere to play again", canvas.width / 2 - 300, canvas.height / 2 + 40);
    player1 = player2 = 0;
}
let animate = () => {
    if (!isPaused) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
        drawCourt();
        movePlayerPaddle();
        moveBall();
        if (!gameOver) {
            moveComputerPaddle();
            window.requestAnimationFrame(animate);
        }
    }

}
let initializeCanvas = () => {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext = canvas.getContext("2d"); //Get canvas context
    canvasContext.fillStyle = "#07DA63";
    canvasContext.font = "50px Arial"
    canvasContext.fillText("LET'S PLAY PONG!", canvas.width / 2 - 300, canvas.height / 2);
    canvasContext.font = "30px Arial"
    canvasContext.fillText("Score 5 to win - click anywhere to start/pause", canvas.width / 2 - 300, canvas.height / 2 + 40);
    canvas.addEventListener("mousemove", event => {
        mouseX = event.x;
        mouseY = event.y;
    });
    canvas.addEventListener("click", () => {
        if (gameOver) {
            gameOver = false;
            isPaused = !isPaused;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.render();
            animate();
        }
        if (isPaused) {
            isPaused = !isPaused;
            animate();
        }
        else if (gameStart) {
            gameStart = false;
            playerPaddle = new Paddle(30, canvas.height / 2 - 25, 10, 75);
            computerPaddle = new Paddle(canvas.width - 30, canvas.height / 2 - 25, 10, 75);
            ball = new Ball(canvas.width / 2, canvas.height / 2, 5);
            animate();
        }
        else
            isPaused = !isPaused;

    });
}
window.addEventListener("load", initializeCanvas);
