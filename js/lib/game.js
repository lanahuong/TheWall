"use strict";

/**
 * Class Game
 **/

var Game = function(canvas, mf, audio) {
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
  this.bonusTab = [];
  this.audio = audio;
};

Game.prototype = {
  init : function() {
    var r = {
      color: ["#e0002a"],
      lives: 1};
    var o = {
      color: ["#ff7c00"],
      lives: 1};
    var y = {
      color: ["#fcec00"],
      lives: 1};
    var g = {
      color: ["#39ff01"],
      lives: 1};
    var b = {
      color: ["#00f3f0"],
      lives: 1};
    var R = {
      color: ["#a61a00", "#e0002a"],
      lives: 2};
    var O = {
      color: ["#c36812", "#ff7c00"],
      lives: 2};
    var Y = {
      color: ["#c4ba17","#fcec00"],
      lives: 2};
    var G = {
      color: ["#339900", "#39ff01"],
      lives: 2};
    var B = {
      color: ["#009999", "#00f3f0"],
      lives: 2};
    var X = null;

    this.levelsSetUp = [
    {
      number: 0,
      points: 2,
      bricks: [[X,r]]
    },
    {
      number: 1,
      points: 100,
      bricks: [
        [r,r,r,r,r,r,r,r,r,r],
        [o,o,o,o,o,o,o,o,o,o],
        [y,y,y,y,y,y,y,y,y,y],
        [g,g,g,g,g,g,g,g,g,g],
        [b,b,b,b,b,b,b,b,b,b]
      ]
    },
    {
      number: 2,
      points: 148,
      bricks: [
        [X,X,X,X,B,B,X,X,X,X],
        [X,X,X,B,g,g,B,X,X,X],
        [X,X,B,g,y,y,g,B,X,X],
        [X,B,g,y,O,O,y,g,B,X],
        [B,g,y,O,r,r,O,y,g,B],
        [X,B,g,y,O,O,y,g,B,X],
        [X,X,B,g,y,y,g,B,X,X],
        [X,X,X,B,g,g,B,X,X,X],
        [X,X,X,X,B,B,X,X,X,X]
      ]
    },
    {
      number: 3,
      points: 164,
      bricks: [
        [R,o,y,G,b,b,G,y,o,R],
        [o,y,G,b,X,X,b,G,y,o],
        [y,G,b,X,X,X,X,b,G,y],
        [G,b,X,X,X,X,X,X,b,G],
        [b,X,X,X,R,R,X,X,X,b],
        [G,b,X,X,X,X,X,X,b,G],
        [y,G,b,X,X,X,X,b,G,y],
        [o,y,G,b,X,X,b,G,y,o],
        [R,o,y,G,b,b,G,y,o,R]
      ]
    },
    {
      number: 4,
      points: 240,
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

  buildLevel : function(levelArray) {
    var y = 40;
    var brick = null;
    this.bricksTab = [];

    for (var i=0, c=levelArray.length; i<c; i++){
      var x = 1;
      //Create level's bricks then put in bricksTab
      for (var j=0, d=levelArray[i].length; j<d; j++) {
        if (levelArray[i][j]!==null) {
          brick = new Brick(this, x, y, levelArray[i][j]);
          this.bricksTab.push(brick);
        }
        x += 32*this.mf.x;
      }
      y += 15*this.mf.y;
    }

    //Determine the bonus
    var pts = this.levelsSetUp[this.currentLevel].points;
    var bricks = this.bricksTab.length;
    var b1 = Math.floor((Math.random()*bricks+1));
    var b2 = Math.floor((Math.random()*bricks+1));
    var b3 = Math.floor((Math.random()*bricks+1));

    while (b2==b3) {
      b2 = Math.floor((Math.random()*bricks+1));
    }
    while (b1==b2 || b1==b3) {
      b1 = Math.floor((Math.random()*bricks+1));
    }
    this.bonusTab = [
      new Bonus("life", "+1", this.bricksTab[b1], b1, this),
      new Bonus("life", "+1", this.bricksTab[b2], b2, this),
      new Bonus("speedUp", "Speed up !", this.bricksTab[b3], b3, this)
    ];

    if (pts > 200) {
      var b4 = Math.floor((Math.random()*bricks+1));
      while (b4==b1 || b4==b2 || b4==b3) {
        b4 = Math.floor((Math.random()*bricks+1));
      }
      this.bonusTab.push(new Bonus("speedUp", "Speed up !", this.bricksTab[b4], b4, this));

      if (pts > 300) {
        var b5 = Math.floor((Math.random()*bricks+1));
        while (b5==b1 || b5==b2 || b5==b3 || b5==b4) {
          b5 = Math.floor((Math.random()*bricks+1));
        }
        this.bonusTab.push(new Bonus("life", "+1", this.bricksTab[b5], b5, this));
      }
    }

    
    this.drawLevel();
    this.drawInfo();
  },

  drawLevel : function() {
    // Draw the bricks
    for (var i=0, c=this.bricksTab.length; i<c; i++) {
      if (this.bricksTab[i].visible === true) {
        this.bricksTab[i].draw(this.context);
      }
    }

    this.paddle.draw(this.context);

    if (this.ball.y-this.ball.r <= this.paddle.y+this.paddle.h) {
      this.ball.draw(this.context);
    }
    // Draw the objects notifications
    for (var j=0, d=this.bonusTab.length; j<d; j++) {
      var bonus = this.bonusTab[j];
      if(bonus.visible && !bonus.used){
        var side = 13*this.mf.y;
        this.context.drawImage(bonus.img, bonus.x+(bonus.img.width/2)-(side/2), bonus.y, side, side);
      }
      if(bonus.note === true){
        this.context.fillStyle = "white";
        this.context.font = "bold 12pt Calibri";
        this.context.textAlign = "center";

        this.context.fillText(bonus.msg, bonus.x, bonus.y);  
      }
    }
  },

  collideBorder : function() {
    if (this.ball.x+this.ball.r >= this.w ||
        this.ball.x-this.ball.r <= 0) {
      return true;
    }
    return false;
  },

  collideTop : function() {
    if (this.ball.y-this.ball.r <= 0) {
      return true;
    }
    return false;
  },

  collidePaddle : function() {
    //test collision with the paddle
    if (this.ball.y+this.ball.r >= this.paddle.y &&
        this.ball.y-this.ball.r < this.paddle.y) {

      if(this.ball.x-this.ball.r <= this.paddle.x+this.paddle.w &&
         this.ball.x+this.ball.r >= this.paddle.x) {
        return true;
      }
      return false;
    }
    return false;
  },

  collideBrick : function(brick) {
    // Test if the ball collides the brick and on which side

    // Calculate the squared vectors from the ball to the corners of the brick
    // TopLeft, TopRight, BottomLeft, BottomRight
    var vecTL = (brick.x-this.ball.x)*(brick.x-this.ballx)+(brick.y-this.ball.y)*(brick.y-this.ball.y);
    var vecTR = (brick.x+brick.w-this.ball.x)*(brick.x+brick.w-this.ball.x)+(brick.y-this.ball.y)*(brick.y-this.ball.y);
    var vecBL = (brick.x-this.ball.x)*(brick.x-this.ballx)+(brick.y+brick.h-this.ball.y)*(brick.y+brick.h-this.ball.y);
    var vecBR = (brick.x+brick.w-this.ball.x)*(brick.x+brick.w-this.ball.x)+(brick.y+brick.h-this.ball.y)*(brick.y+brick.h-this.ball.y);
    
    // If the squared vectors are smaller than the squared radius of the ball there is a collision
    if (vecTL <= this.ball.r*this.ball.r ||
        vecTR <= this.ball.r*this.ball.r ||
        vecBL <= this.ball.r*this.ball.r ||
        vecBR <= this.ball.r*this.ball.r) {

      return "corner";
    }

    if (this.ball.x >= brick.x &&
        this.ball.x <= brick.x+brick.w) {
      
      if (this.ball.y+this.ball.r >= brick.y &&
          this.ball.y-this.ball.r <= brick.y) {
        return "top";
      }
      if (this.ball.y-this.ball.r <= brick.y+brick.h &&
          this.ball.y+this.ball.r >= brick.y+brick.h) {
        return "bottom";
      }
      
    }
    
    if (this.ball.y >= brick.y &&
               this.ball.y <= brick.y+brick.h) {
      
      if (this.ball.x+this.ball.r >= brick.x &&
          this.ball.x-this.ball.r < brick.x) {
        return "left";
      } 
      if (this.ball.x-this.ball.r <= brick.x+brick.w &&
          this.ball.x+this.ball.r > brick.x+brick.w) {
        return "right";
      }
    }
    return null;
  },

  drawInfo : function() {
    this.context.clearRect(0, Math.round(this.h-48), this.w, Math.round(48));
    
    this.context.fillStyle = "white";
    this.context.strokeStyle = "white";
    this.context.lineWidth = 2;
    this.context.font = "bold 12pt Calibri";
    this.context.textAlign = "left";

    this.context.beginPath();
    this.context.moveTo(0, this.h-50);
    this.context.lineTo(this.w, this.h-50);
    this.context.stroke();
    
    this.context.fillText("Level "+this.levelsSetUp[this.currentLevel].number, 5, this.h-35);
    this.context.fillText("Points :   "+this.points, 5, this.h-20);
    this.context.fillText("Lives :   "+this.lives, 5, this.h-5);
  },

  loseMsg : function() {
    this.context.fillStyle = "white";
    this.context.font = "bold 24pt Calibri";
    this.context.textAlign = "center";

    this.context.fillText("You lose...", this.w/2, (this.h/2)-20);
    this.context.fillText("Play again", this.w/2, (this.h/2)+20);
  },

  winMsg : function() {
    this.context.fillStyle = "white";
    this.context.font = "bold 24pt Calibri";
    this.context.textAlign = "center";

    this.context.fillText("You win !", this.w/2, (this.h/2)-20);
    this.context.fillText("Next level", this.w/2, (this.h/2)+20);
  },

  playAgain : function() {
    this.ball = new Ball(this);
    this.points = 0;
    this.pointsLevel = 0;
    this.lives = 2;
    this.bonusTab = [];
    this.currentLevel = 1;
    this.buildLevel(this.levelsSetUp[this.currentLevel].bricks);
  },

  nextLevel : function() {
    this.currentLevel++;
    this.pointsLevel = 0;
    this.lives++;
    this.ball = new Ball(this);
    this.bonusTab = [];
    this.buildLevel(this.levelsSetUp[this.currentLevel].bricks);
  },

  hiddenObject : function(brick) {
    for (var i=0, c=this.bonusTab.length; i<c; i++) {
      if (this.bonusTab[i].brickNum == brick &&
          !this.bonusTab[i].used) {

        this.bonusTab[i].visible = true;

        if (this.bonusTab[i].type == "speedUp") {
          this.bonusTab[i].used = true;
          this.bonusTab[i].speedUp(this);
        }

      }
    }
  },

  sound_wall : function() {
    this.audio.wall.play();
  },

  sound_brick : function() {
    this.audio.brick.play();
  }
};
