"use strict";

(function() {

function refresh() {
  game.context.clearRect(0, 0, game.w, game.h-51);
  
  // Test collision with the paddle
  if (game.collidePaddle()) {
    game.ball.inverseDirY();
    game.ball.changeAngle(game.paddle);
  }
  
  // Test collision with the screen margins
  if (game.collideBorder()) {
    game.ball.inverseDirX();
  }
  if (game.collideTop()) {
    game.ball.inverseDirY();
  }
  
  // Test collision with the bricks one by one
  for (var i=0, c=game.bricksTab.length; i<c; i++) {
    if (game.bricksTab[i].visible === true) {
      var collide = game.collideBrick(game.bricksTab[i]);
      
      if (collide == "top" || collide == "bottom") {
        game.ball.inverseDirY();
        game.bricksTab[i].visible = false;
        game.pointsLevel += 2;
        game.points += 2;
        game.drawInfo();
      }
      if (collide == "left" || collide == "right") {
        game.ball.inverseDirX();
        game.bricksTab[i].visible = false;
        game.pointsLevel += 2;
        game.pointLevel +=2;
        game.drawInfo();
      }
    }
  }
  
  // Test if the player win
  if (game.pointsLevel == game.levelsSetUp[game.currentLevel].points) {
    game.start = false;
    game.winMsg();
    
    if (touchMove[1] <= (game.h/2)+20 && touchMove[1] >= (game.h/2)-10 &&
        touchMove[0] >= 90 && touchMove[0] <= game.w-90) {
      game.nextLevel();
      setTimeout(function() { game.start = true; }, 3000);
    }
  }
  
  // Test if the player lose
  if (game.ball.y-game.ball.r > game.h-50) {
    game.start = false;
    
    if (game.lives === 0) {
      game.loseMsg();

      if (touchMove[1] <= (game.h/2)+20 && touchMove[1] >= (game.h/2)-10 &&
          touchMove[0] >= 90 && touchMove[0] <= game.w-90) {
        game.playAgain();
        setTimeout(function() { game.start = true; }, 3000);
      }
    } else {
      game.lives--;
      game.ball = new Ball(game);
      setTimeout(function() { game.start = true; }, 3000);
    }

    game.drawInfo();
  }
  
  // Move the paddle and the ball
  game.paddle.move(touchMove[0]-(game.paddle.w/2), game);
  if (game.start === true) {
    game.ball.move();
  }
  
  // Draw the whole screen
  game.drawLevel();
}


var game = new Game(document.getElementById("gamecanvas"));
game.init();
game.constructLevel(game.levelsSetUp[game.currentLevel].bricks);

var touchMove = [game.w/2, 0];

game.canvas.addEventListener("touchmove", function(event) {
  touchMove[0] = event.changedTouches[0].clientX;
  touchMove[1] = event.changedTouches[0].clientY;
}, false);

setTimeout(function() { game.start = true; }, 3000);
setInterval(refresh, 10);

}());
