"use strict";

/**
 * Class Game
 **/

var Game = function(canvas, mf) {
  this.mf = mf;
  this.canvas = canvas;
  this.w = canvas.width;
  this.h = canvas.height;
  this.context = canvas.getContext("2d");
  this.levelsSetUp = null;
  this.bricksTab = [];
  this.currentLevel = 1;
  this.pointsLevel = 0;
  this.points = 0;
  this.lives = 2;
  this.start = false;
};

Game.prototype = {
  init : function() {
    var R = "#e0002a";
    var O = "#ff7c00";
    var Y = "#fcec00";
    var G = "#39ff01";
    var B = "#00f3f0";
    var W = "#ffffff";
    var X = null;

    this.levelsSetUp = [
    {
      number: 0,
      points: 2,
      bricks: [[X,R]]
    },
    {
      number: 1,
      points: 100,
      bricks: [
        [R,R,R,R,R,R,R,R,R,R],
        [O,O,O,O,O,O,O,O,O,O],
        [Y,Y,Y,Y,Y,Y,Y,Y,Y,Y],
        [G,G,G,G,G,G,G,G,G,G],
        [B,B,B,B,B,B,B,B,B,B]
      ]
    },
    {
      number: 2,
      points: 100,
      bricks: [
        [X,X,X,X,B,B,X,X,X,X],
        [X,X,X,B,G,G,B,X,X,X],
        [X,X,B,G,Y,Y,G,B,X,X],
        [X,B,G,Y,O,O,Y,G,B,X],
        [B,G,Y,O,R,R,O,Y,G,B],
        [X,B,G,Y,O,O,Y,G,B,X],
        [X,X,B,G,Y,Y,G,B,X,X],
        [X,X,X,B,G,G,B,X,X,X],
        [X,X,X,X,B,B,X,X,X,X]
      ]
    },
    {
      number: 3,
      points: 120,
      bricks: [
        [R,O,Y,G,B,B,G,Y,O,R],
        [O,Y,G,B,X,X,B,G,Y,O],
        [Y,G,B,X,X,X,X,B,G,Y],
        [G,B,X,X,X,X,X,X,B,G],
        [B,X,X,X,R,R,X,X,X,B],
        [G,B,X,X,X,X,X,X,B,G],
        [Y,G,B,X,X,X,X,B,G,Y],
        [O,Y,G,B,X,X,B,G,Y,O],
        [R,O,Y,G,B,B,G,Y,O,R]
      ]
    },
    {
      number: 4,
      points: 120,
      bricks: [
        [X,X,X,Y,Y,Y,Y,X,X,X],
        [X,X,X,Y,Y,Y,Y,X,X,X],
        [X,X,Y,Y,Y,Y,Y,Y,X,X],
        [X,Y,Y,Y,Y,Y,X,Y,Y,X],
        [X,Y,Y,Y,Y,Y,Y,Y,Y,X],
        [X,Y,Y,Y,Y,Y,Y,Y,Y,X],
        [X,Y,Y,Y,Y,Y,Y,Y,X,X],
        [X,Y,Y,Y,Y,X,X,X,X,X],
        [X,X,Y,Y,Y,Y,X,X,X,X],
        [X,X,X,Y,Y,Y,Y,X,X,X],
        [X,X,X,Y,Y,Y,Y,X,X,X]
      ]
    }];

    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
  },

  constructLevel : function(levelArray) {
    var y = 40*this.mf.y;
    var brick = null;
    this.bricksTab = [];

    for (var i=0, c=levelArray.length; i<c; i++){
      var x = 1*this.mf.x;
      //create level's bricks then put in bricksTab
      for (var j=0, d=levelArray[i].length; j<d; j++) {
        if (levelArray[i][j]!==null) {
          brick = new Brick(this, x, y, levelArray[i][j]);
          this.bricksTab.push(brick);
        }
        x += 32*this.mf.x;
      }
      y += 15*this.mf.y;
    }
    
    this.drawLevel();
    this.drawInfo();
  },

  drawLevel : function() {
    for (var i=0, c=this.bricksTab.length; i<c; i++) {
      if (this.bricksTab[i].visible === true) {
        this.bricksTab[i].draw(this.context);
      }
    }

    this.paddle.draw(this.context);

    if (this.ball.y-this.ball.r <= this.paddle.y+this.paddle.h) {
      this.ball.draw(this.context);
    }
  },

  collideBorder : function() {
    if (this.ball.x+this.ball.r >= this.w ||
        this.ball.x-this.ball.r <= 0) {
      return true;
    } else { return false; }
  },

  collideTop : function() {
    if (this.ball.y-this.ball.r <= 0) {
      return true;
    } else { return false; }
  },

  collidePaddle : function() {
    //test collision with the paddle
    if (this.ball.y+this.ball.r >= this.paddle.y &&
        this.ball.y-this.ball.r < this.paddle.y) {

      if(this.ball.x-this.ball.r <= this.paddle.x+this.paddle.w &&
         this.ball.x+this.ball.r >= this.paddle.x) {
        return true;
      } else { return false; }
    } else { return false; }
  },

  collideBrick : function(brick) {
    if (this.ball.x >= brick.x &&
        this.ball.x <= brick.x+brick.w) {
  
      if (this.ball.y+this.ball.r >= brick.y &&
          this.ball.y < brick.y) {
        return "top";
      }
      if (this.ball.y-this.ball.r <= brick.y+brick.h &&
          this.ball.y > brick.y+brick.h) {
        return "bottom";
      }
    } else if (this.ball.y >= brick.y &&
               this.ball.y <= brick.y+brick.h) {
      
      if (this.ball.x+this.ball.r >= brick.x &&
          this.ball.x < brick.x) {
        return "left";
      } 
      if (this.ball.x-this.ball.r <= brick.x+brick.w &&
          this.ball.x > brick.x+brick.w) {
        return "right";
      }
    } else { return null; }
  },

  drawInfo : function() {
    this.context.clearRect(0, Math.round(this.h-48*this.mf.y), this.w, Math.round(48*this.mf.y));
    
    this.context.fillStyle = "white";
    this.context.strokeStyle = "white";
    this.context.lineWidth = 2;
    this.context.font = "bold 12pt Calibri";
    this.context.textAlign = "left";

    this.context.beginPath();
    this.context.moveTo(0, this.h-50*this.mf.y);
    this.context.lineTo(this.w, this.h-50*this.mf.y);
    this.context.stroke();
    
    this.context.fillText("Level "+this.levelsSetUp[this.currentLevel].number, 5*this.mf.x, this.h-35*this.mf.y);
    this.context.fillText("Points :   "+this.points, 5*this.mf.x, this.h-20*this.mf.y);
    this.context.fillText("Lives :   "+this.lives, 5*this.mf.x, this.h-5*this.mf.y);
  },

  loseMsg : function() {
    this.context.fillStyle = "white";
    this.context.font = "bold 24pt Calibri";
    this.context.textAlign = "center";

    this.context.fillText("You lose...", this.w/2, (this.h/2)-20*this.mf.y);
    this.context.fillText("Play again", this.w/2, (this.h/2)+20*this.mf.y);
  },

  winMsg : function() {
    this.context.fillStyle = "white";
    this.context.font = "bold 24pt Calibri";
    this.context.textAlign = "center";

    this.context.fillText("You win !", this.w/2, (this.h/2)-20*this.mf.y);
    this.context.fillText("Next level", this.w/2, (this.h/2)+20*this.mf.y);
  },

  playAgain : function() {
    this.ball = new Ball(this);
    this.points = 0;
    this.pointsLevel = 0;
    this.lives = 2;
    this.currentLevel = 1;
    this.constructLevel(this.levelsSetUp[this.currentLevel].bricks);
  },

  nextLevel : function() {
    this.currentLevel++;
    this.pointsLevel = 0;
    this.ball = new Ball(this);
    this.constructLevel(this.levelsSetUp[this.currentLevel].bricks);
  }
};
