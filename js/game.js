"use strict";

(function() {

function refresh() {
  game.context.clearRect(0, 0, game.w, Math.round(game.h-51*game.mf.y));
  
  // Test collision with the paddle
  if (game.collidePaddle()) {
    game.ball.diry = -game.ball.diry;
    game.ball.changeAngle(game.paddle, game.mf);
  }
  
  // Test collision with the screen margins
  if (game.collideBorder()) {
    game.ball.dirx = -game.ball.dirx;
  }
  if (game.collideTop()) {
    game.ball.diry = -game.ball.diry;
  }
  
  // Test collision with the bricks one by one
  // Erease the brick, revers the angle and add points if needed
  for (var i=0, c=game.bricksTab.length; i<c; i++) {
    if (game.bricksTab[i].visible === true) {
      var collide = game.collideBrick(game.bricksTab[i]);
      
      if (collide == "corner") {
        game.ball.diry = -game.ball.diry;
        game.ball.dirx = -game.ball.dirx;
        game.bricksTab[i].visible = false;
        game.pointsLevel += 2;
        game.points += 2;
        game.drawInfo();
      }
      if (collide == "top" || collide == "bottom") {
        game.ball.diry = -game.ball.diry;
        game.bricksTab[i].visible = false;
        game.pointsLevel += 2;
        game.points += 2;
        game.drawInfo();
      }
      if (collide == "left" || collide == "right") {
        game.ball.dirx = -game.ball.dirx;
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
    
    if (touchMove[1] <= (game.h/2)+20*game.mf.y &&
        touchMove[1] >= (game.h/2)-10*game.mf.y &&
        touchMove[0] >= 90*game.mf.x && touchMove[0] <= game.w-90*game.mf.x) {
      game.nextLevel();
      setTimeout(function() { game.start = true; }, 3000);
    }
  }
  
  // Test if the player lose
  if (game.ball.y-game.ball.r > game.h-50) {
    game.start = false;
    
    if (game.lives === 0) {
      game.loseMsg();

      if (touchMove[1] <= (game.h/2)+20*game.mf.y &&
          touchMove[1] >= (game.h/2)-10*game.mf.y &&
          touchMove[0] >= 90*game.mf.x && touchMove[0] <= game.w-90*game.mf.x) {
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
  requestAnimationFrame(refresh);
}

var screenwidth = window.outerWidth*devicePixelRatio;
var screenheight = window.outerHeight*devicePixelRatio;

var mf = {
  x: screenwidth /320,
  y: screenheight /480
};

var canvas = document.createElement("canvas");
canvas.id = "gamecanvas";
canvas.height = screenheight;
canvas.width = screenwidth;
canvas.style.position = "absolute";
canvas.style.bottom = "0px";
canvas.padding = "0px";
canvas.style.margin = "0px";
canvas.style.background = "#000000";
canvas.style.height = ""+screenheight+"px";
canvas.style.width = ""+screenwidth+"px";

document.body.appendChild(canvas);

var game = new Game(canvas, mf);
game.init();
game.constructLevel(game.levelsSetUp[game.currentLevel].bricks);

var touchMove = [game.w/2, 0];

game.canvas.addEventListener("touchmove", function(event) {
  touchMove[0] = event.changedTouches[0].clientX;
  touchMove[1] = event.changedTouches[0].clientY;
}, false);

setTimeout(function() { game.start = true; }, 3000);
requestAnimationFrame(refresh);

}());
