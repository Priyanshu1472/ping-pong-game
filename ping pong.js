// Mobile detection
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

if (isMobile()) {
  document.getElementById('mobileWarning').style.display = 'flex';
  document.getElementById('gamecontainer').style.display = 'none';
} else {
  // Game variables
  const gameboard = document.querySelector("#gameboard");
  const ctx = gameboard.getContext("2d");
  const scoretext = document.querySelector("#scoretext");
  const restartbtn = document.querySelector("#restart");
  const gamewidth = gameboard.width;
  const gameheight = gameboard.height;
  const paddlespeed = 8;
  let gameRunning = false;
  let animationId;
  let ballspeed = 3;
  let ballX = gamewidth / 2;
  let ballY = gameheight / 2;
  let ballXdirection = 0;
  let ballYdirection = 0;
  let ballradius = 12;
  let player1score = 0;
  let player2score = 0;
  
  // Smooth paddle movement variables
  let keys = {};
  
  let paddle1 = {
      width: 25,
      height: 120,
      x: 20,
      y: gameheight / 2 - 60,
      color: "#ff6b6b"
  }
  
  let paddle2 = {
      width: 25,
      height: 120,
      x: gamewidth - 45,
      y: gameheight / 2 - 60,
      color: "#4ecdc4"
  }

  // Event listeners
  document.addEventListener("keydown", (e) => { 
      keys[e.keyCode] = true; 
      e.preventDefault();
  });
  document.addEventListener("keyup", (e) => { 
      keys[e.keyCode] = false; 
      e.preventDefault();
  });
  restartbtn.addEventListener("click", restartgame);

  function startgame(){
      if (!gameRunning) {
          gameRunning = true;
          createball();
          gameloop();
      }
  }

  function gameloop(){
      if (!gameRunning) return;
      
      clearboard();
      handlepaddles();
      moveball();
      drawpaddles();
      drawball();
      checkcollision();
      
      animationId = requestAnimationFrame(gameloop);
  }

  function clearboard(){
      // Clear the entire canvas
      ctx.clearRect(0, 0, gamewidth, gameheight);
      
      // Set background
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, gamewidth, gameheight);
      
      // Draw center line
      ctx.setLineDash([15, 15]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(gamewidth / 2, 0);
      ctx.lineTo(gamewidth / 2, gameheight);
      ctx.stroke();
      ctx.setLineDash([]);
  }

  function handlepaddles(){
      // Player 1 controls (W/S)
      if(keys[87] && paddle1.y > 0){ // W key
          paddle1.y -= paddlespeed;
      }
      if(keys[83] && paddle1.y < gameheight - paddle1.height){ // S key
          paddle1.y += paddlespeed;
      }
      
      // Player 2 controls (Arrow keys)
      if(keys[38] && paddle2.y > 0){ // Up arrow
          paddle2.y -= paddlespeed;
      }
      if(keys[40] && paddle2.y < gameheight - paddle2.height){ // Down arrow
          paddle2.y += paddlespeed;
      }
  }

  function drawpaddles(){
      // Draw paddle 1
      ctx.fillStyle = paddle1.color;
      ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

      // Draw paddle 2
      ctx.fillStyle = paddle2.color;
      ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
      ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  }

  function createball(){
      ballspeed = 3;
      ballXdirection = Math.random() > 0.5 ? 1 : -1;
      ballYdirection = Math.random() > 0.5 ? 0.5 : -0.5;
      ballX = gamewidth / 2;
      ballY = gameheight / 2;
  }

  function moveball(){ 
      ballX += (ballspeed * ballXdirection);
      ballY += (ballspeed * ballYdirection);
  }

  function drawball(){
      ctx.fillStyle = "#45b7d1";
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballradius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
  }

  function checkcollision(){
      // Ball collision with top/bottom walls
      if(ballY <= ballradius){
          ballYdirection = Math.abs(ballYdirection);
      }
      if(ballY >= gameheight - ballradius){
          ballYdirection = -Math.abs(ballYdirection);
      }
      
      // Ball goes out of bounds - scoring
      if(ballX <= 0){
          player2score += 1;
          updatescore();
          createball();
          return;
      }
      if(ballX >= gamewidth){
          player1score += 1;
          updatescore();
          createball();
          return;
      }
      
      // Paddle 1 collision
      if(ballX - ballradius <= paddle1.x + paddle1.width && 
         ballX + ballradius >= paddle1.x && 
         ballY >= paddle1.y && 
         ballY <= paddle1.y + paddle1.height){
          ballXdirection = Math.abs(ballXdirection);
          ballX = paddle1.x + paddle1.width + ballradius;
          ballspeed += 0.2;
          
          // Add spin based on where ball hits paddle
          const hitPos = (ballY - paddle1.y) / paddle1.height;
          ballYdirection = (hitPos - 0.5) * 2;
      }
      
      // Paddle 2 collision
      if(ballX + ballradius >= paddle2.x && 
         ballX - ballradius <= paddle2.x + paddle2.width && 
         ballY >= paddle2.y && 
         ballY <= paddle2.y + paddle2.height){
          ballXdirection = -Math.abs(ballXdirection);
          ballX = paddle2.x - ballradius;
          ballspeed += 0.2;
          
          // Add spin based on where ball hits paddle
          const hitPos = (ballY - paddle2.y) / paddle2.height;
          ballYdirection = (hitPos - 0.5) * 2;
      }
  }

  function updatescore(){
      scoretext.textContent = `${player1score} : ${player2score}`;
  }

  function restartgame(){
      gameRunning = false;
      if (animationId) {
          cancelAnimationFrame(animationId);
      }
      
      player1score = 0;
      player2score = 0;
      paddle1.y = gameheight / 2 - 60;
      paddle2.y = gameheight / 2 - 60;
      ballspeed = 3;
      ballX = gamewidth / 2;
      ballY = gameheight / 2;
      ballXdirection = 0;
      ballYdirection = 0;
      keys = {}; // Clear all key states
      
      updatescore();
      startgame();
  }

  // Start the game
  startgame();
}