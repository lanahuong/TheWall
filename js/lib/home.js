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
      var R = "#e0002a";
      var O = "#ff7c00";
      var Y = "#fcec00";
      var G = "#39ff01";
      var B = "#00f3f0";
      var X = null;

      this.choice = [
        {
          name: "Play",
          brick: new Brick(this, (this.w/2)-40*this.mf.x, (this.h/2)-20*this.mf.x, R)
        }
      ];

      for(var i=0, c=this.choice.length; i<c; i++) {
        this.choice[i].brick.w = 80*this.mf.x;
        this.choice[i].brick.h = 40*this.mf.y;
      }

      this.background = [
        [R,R,R,R,X,X,R,R,R,R],
        [O,O,O,X,X,X,X,O,O,O],
        [Y,Y,Y,X,X,X,Y,X,Y,Y],
        [G,G,X,G,X,X,X,G,G,G],
        [B,X,X,X,X,B,X,X,X,B]
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
