"use strict";

/**
 * Class Brick
 **/

var Brick = function(game, x, y, color) {
  this.x = x;
  this.y = y;
  this.w = 30*game.mf.x;
  this.h = 13*game.mf.y;
  this.color = color;
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
