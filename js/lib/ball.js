"use strict";

/**
 * Class Ball
 **/

var Ball = function(game) {
  this.r = 5;
  this.x = (game.w/2)-(this.r);
  this.y = (game.h/2)+20+this.r;
  this.dirx = 3;
  this.diry = 3;
  this.prevX = 0;
  this.prevY = 0;
  this.speed = 1.5;
};

Ball.prototype = {
  draw : function(context) {
    context.fillStyle = "white";
    context.beginPath();
    context.arc(this.x,this.y,this.r,0,Math.PI*2,true);
    context.fill();
  },

  erase : function(context) {
    context.clearRect(this.x-this.r, this.y-this.r, this.r*2, this.r*2);
  },

  move : function() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += this.dirx*this.speed;
    this.y += this.diry*this.speed;
  },

  changeAngle : function(paddle, mf) {
    this.dirx = 12*((this.x-(paddle.x+paddle.w/2))/paddle.w);
    var norme = Math.sqrt((this.dirx*this.dirx)+(this.diry*this.diry));
    this.diry = this.diry*6/norme;
    this.dirx = this.dirx*6/norme;
  }
};
