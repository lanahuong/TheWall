"use strict";

/**
 * Class Home
 **/

var Home = function(canvas, mf) {
  this.mf = mf;
  this.canvas = canvas;
  this.w = canvas.width;
  this.h = canvas.height;
  this.context = canvas.getContext("2d");
  this.choice = [];
  this.background = [];
  this.bricksTab = [];
  this.paddle = new Paddle(this);
};

Home.prototype = {
  init : function () {
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
    var X = null;


    this.choice = [
      {
        name: "Play",
        brick: new Brick(this, (this.w/2)-40*this.mf.x, (this.h/2)-20*this.mf.x, r)
      }
    ];

    for(var i=0, c=this.choice.length; i<c; i++) {
      this.choice[i].brick.w = 80*this.mf.x;
      this.choice[i].brick.h = 40*this.mf.y;
    }

      this.background = [
        [r,r,r,r,X,X,r,r,r,r],
        [o,o,o,X,X,X,X,o,o,o],
        [y,y,y,X,X,X,y,X,y,y],
        [g,g,X,g,X,X,X,g,g,g],
        [b,X,X,X,X,b,X,X,X,b]
      ];

      this.paddle.y = this.h-30*this.mf.y;
  },

  createHome : function(){
    var y = 1*this.mf.y;
    var brick = null;

    // Parse the background array to create the bricks
    for (var i=0, c=this.background.length; i<c; i++) {
      var x = 1*this.mf.x;
      for (var j=0, d=this.background[i].length; j<d; j++) {

        if (this.background[i][j]!==null) {
          brick = new Brick(this, x, y, this.background[i][j]);
          this.bricksTab.push(brick);
        }
        x += 32*this.mf.x;
      }
      y += 15*this.mf.y;
    }

    this.drawHome();  
  },

  drawHome : function() {
   for (var i=0, c=this.bricksTab.length; i<c; i++) {
     
     if (this.bricksTab[i].visible === true) {
      this.bricksTab[i].draw(this.context);
     }
   }

   for (var j=0, d=this.choice.length; j<d; j++) {
     this.choice[j].brick.draw(this.context);
     
     this.context.fillStyle = "black";
     this.context.font = "bold 18pt Calibri";
     this.context.textAlign = "center";
     
     this.context.fillText(this.choice[j].name, this.w/2, this.h/2+8*this.mf.y);
   }

   this.paddle.draw(this.context);
  }
};
