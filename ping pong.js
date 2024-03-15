const gameboard = document.querySelector("#gameboard");
const ctx = gameboard.getContext("2d");
const scoretext = document.querySelector("#scoretext");
const restartbtn = document.querySelector("#restart");
const gamewidth = gameboard.width;
const gameheight = gameboard.height;
const boardbackground = "white";
const paddle1color = "Red";
const paddle2color = "blue";
const paddleborder = "black";
const ballcolor = "green";
const ballborder = "black"
const ballradius = 12.5;
const paddlespeed = 40;
let IntervalID;
let ballspeed = 1;
let ballX = gameboard.width/2;
let ballY = gameboard.height/2;
let ballXdirection = 0;
let ballYdirection = 0;
let player1score = 0;
let player2score = 0;
let paddle1 = {
    width:25,
    height:120,
    x:0,
    y:0
}
let paddle2 = {
  width: 25,
  height: 120,
  x: gamewidth-25,
  y: gameheight-120,
};


window.addEventListener("keydown", changedirection);
restartbtn.addEventListener("click", restartgame);

startgame();

function startgame(){
  createball();
  nexttick();
};
function nexttick(){
  IntervalID = setTimeout ( () => {
    clearboard();
    drawpaddle();
    moveball();
    drawball(ballX, ballY);
    checkcollision();
    nexttick();
  }, 1);
};
function clearboard(){
  ctx.fillStyle = boardbackground;
  ctx.fillRect(0,0,gamewidth,gameheight)
};
function drawpaddle(){
  ctx.strokeStyle = paddleborder;

  ctx.fillStyle = paddle1color;
  ctx.fillRect(paddle1.x,paddle1.y,paddle1.width,paddle1.height);
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  ctx.fillStyle = paddle2color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};
function createball(){
  ballspeed = 1;
  if(Math.round(Math.random()) == 1){;
    ballXdirection=1;
  }
  else{
    ballXdirection = -1;
  }
  if(Math.round(Math.random()) == 1){;
    ballYdirection;
  }
  else{
    ballYdirection = -1;
  }
  ballX = gamewidth/2;
  ballY = gameheight/2;
  drawball(ballX, ballY);
};
function moveball(){ 
  ballX += (ballspeed * ballXdirection);
  ballY += (ballspeed * ballYdirection);
};
function drawball(ballX, ballY){
  ctx.fillStyle = ballcolor;
  ctx.strokeStyle = ballborder;
  ctx.linewidth = 2;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballradius, 0 , 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
};
function checkcollision(){
  if(ballY <= 0 + ballradius){
    ballYdirection *= -1;
  }
  if(ballY >= gameheight - ballradius){
    ballYdirection *= -1;
  }
  if(ballX <= 0){
    player2score+=1;
    updatescore();
    createball();
    return;
  }
  if(ballX >= gamewidth){
    player1score+=1;
    updatescore();
    createball();
    return;
  }
  if(ballX <=(paddle1.x +paddle1.width + ballradius)){
    if(ballY> paddle1.y && ballY <paddle1.y + paddle1.height){
      ballX = (paddle1.x + paddle1.width)+ballradius;
      ballXdirection *= -1;
      ballspeed+=1;
       const relativeY = ballY - paddle1.y;
       const normalizedRelativeY = (relativeY / paddle1.height) * 2 - 1; 
       ballYdirection = -normalizedRelativeY;
    }
  }
  if(ballX>=(paddle2.x-ballradius)){
    if(ballY> paddle2.y && ballY <paddle2.y + paddle2.height){
      ballX = paddle2.x - ballradius;
      ballXdirection *= -1;
      ballspeed+=1;
      const relativeY = ballY - paddle2.y;
      const normalizedRelativeY = (relativeY / paddle2.height) * 2 - 1; 
      ballYdirection = -normalizedRelativeY;
    }
  }
};
function changedirection(event){
  const keypressed= event.keyCode;
  console.log(keypressed);
  const paddle1up = 87;
  const paddle1down = 83;
  const paddle2up = 38;
  const paddle2down = 40;

  switch (keypressed) {
    case paddle1up:
      if (paddle1.y > 0) {
        paddle1.y -= paddlespeed;
      }
      break;
    case paddle1down:
      if (paddle1.y < gameheight - paddle1.height) {
        paddle1.y += paddlespeed;
      }
      break;
    case paddle2up:
      if (paddle2.y > 0) {
        paddle2.y -= paddlespeed;
      }
      break;
    case paddle2down:
      if (paddle2.y < gameheight - paddle2.height) {
        paddle2.y += paddlespeed;
      }
      break;
  }
};
function updatescore(){
  scoretext.textContent = `${player1score}:${player2score}`
};
function restartgame(){
  player1score = 0;
  player2score = 0;
  let paddle1 = {
    width: 25,
    height: 120,
    x: 0,
    y: 0,
  };
  let paddle2 = {
    width: 25,
    height: 120,
    x: gamewidth - 25,
    y: gameheight - 120,
  };
  ballspeed = 1;
  ballX = 0;
  ballY = 0;
  ballXdirection = 0;
  ballYdirection = 0;
  updatescore();
  clearInterval(IntervalID);
  gamestart();
};
