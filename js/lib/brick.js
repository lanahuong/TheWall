"use strict";

/**
 * Class Brick
 **/

var Brick = function(game, x, y, settings) {
  this.x = x;
  this.y = y;
  this.w = 30*game.mf.x;
  this.h = 13*game.mf.y;
  this.tabColor = settings.color;
  this.numColor = 0;
  this.color = this.tabColor[this.numColor];
  this.lives = settings.lives;
  this.visible = true;
};

Brick.prototype = {
  draw : function(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.w, this.h);
    this.visible = true;
  },

  erase : function(context) {
    context.fillRect(this.x, this.y, this.w, this.h);
  }
};
