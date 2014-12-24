"use strict";

(function() {

function refresh() {
  game.context.clearRect(0, 0, game.w, Math.round(game.h-51));
  
  // Test collision with the paddle
  if (game.collidePaddle()) {
    game.ball.diry = -game.ball.diry;
    game.ball.changeAngle(game.paddle, game.mf);
    game.sound_wall();
  }
  
  // Test collision with the screen margins
  if (game.collideBorder()) {
    game.ball.dirx = -game.ball.dirx;
    game.sound_wall();
  }
  if (game.collideTop()) {
    game.ball.diry = -game.ball.diry;
    game.sound_wall();
  }
  // If there is a bonus, test if the player touch it
  for (var j=0, d=game.bonusTab.length; j<d; j++) {
    var bonus = game.bonusTab[j];
    if (bonus.type == "life" && bonus.visible) {
      if (game.ball.x+game.ball.r >= bonus.x &&
          game.ball.x-game.ball.r <= bonus.x+bonus.img.width &&
          game.ball.y+game.ball.r <= bonus.y+bonus.img.height &&
          game.ball.y-game.ball.r >= bonus.y) {
        bonus.lifeUp(game); 
      }
    }
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
        game.sound_brick();
      }
      if (collide == "top" || collide == "bottom") {
        game.ball.diry = -game.ball.diry;
        game.bricksTab[i].lives --;
        game.bricksTab[i].numColor ++;
        game.pointsLevel += 2;
        game.points += 2;
        game.drawInfo();
        game.sound_brick();
      }
      if (collide == "left" || collide == "right") {
        game.ball.dirx = -game.ball.dirx;
        game.bricksTab[i].lives --;
        game.bricksTab[i].numColor ++;
        game.pointsLevel += 2;
        game.pointLevel +=2;
        game.drawInfo();
        game.sound_brick();
      }
      // Check if the brick is completly destroyed and see for bonus
      if (game.bricksTab[i].lives === 0) {
        game.hiddenObject(i);
        game.bricksTab[i].visible = false;
      } else {
        game.bricksTab[i].color = game.bricksTab[i].tabColor[game.bricksTab[i].numColor];
      }
    }
  }
  
  // Test if the player win
  if (game.pointsLevel == game.levelsSetUp[game.currentLevel].points) {
    game.start = false;
    game.winMsg();
    
    if (touchMove[1] <= (game.h/2)+20 &&
        touchMove[1] >= (game.h/2)-10 &&
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

      if (touchMove[1] <= (game.h/2)+20 &&
          touchMove[1] >= (game.h/2)-10 &&
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
  requestAnimationFrame(refresh);
}

var screenwidth = window.innerWidth;
var screenheight = window.innerHeight;

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

var audio = {
  brick: document.getElementById("brick_sound"),
  wall: document.getElementById("wall_sound")
};

audio.brick.preload = "auto";
audio.wall.preload = "auto";

var game = new Game(canvas, mf, audio);
game.init();
game.buildLevel(game.levelsSetUp[game.currentLevel].bricks);

var touchMove = [game.w/2, 0];

var getCoor =  function(event) {
  touchMove[0] = event.changedTouches[0].clientX;
  touchMove[1] = event.changedTouches[0].clientY;
};

game.canvas.addEventListener("touchstart", getCoor, false);
game.canvas.addEventListener("touchmove", getCoor, false);

setTimeout(function() { game.start = true; }, 3000);
requestAnimationFrame(refresh);

}());
