"use strict";

/**
 * Class Bonus
 **/

var Bonus = function(type, msg, brick, num, game) {
  this.type = type;
  this.msg = msg;
  this.brickNum = num;
  if (type == "life") {
    this.x = brick.x;
    this.y = brick.y;
    this.img = new Image();
    switch(window.devicePixelRatio){
      case 1:
        this.img.src = "../../resources/images/firefox_1x.png";
        break;
      case 1.5:
        this.img.src = "../../resources/images/firefox_1,5x.png";
        break;
      case 2:
        this.img.src = "../../resources/images/firefox_2x.png";
        break;
      case 2,25:
        this.img.src = "../../resources/images/firefox_2,25x.png";
        break;
    }
  } else {
    this.x = game.w/2;
    this.y = game.h/2;
  }
  this.visible = false;
  this.used = false;
  this.note = false;
};

Bonus.prototype = {
  lifeUp : function(game) {
    // Add life and show a notification for 2 sec
    game.lives++;
    this.x = this.x+(30)/2;
    this.y += 20;
    this.visible = false;
    this.used = true;
    this.note = true;
    setTimeout(this.endNotify, 2000, this);
  },
  normalSpeed : function(game) {
    game.ball.speed = 1.5;
  },
  speedUp : function(game) {
    // The ball go faster for 15 sec
    game.ball.speed = 2;
    this.visible = false;
    this.note = true;
    setTimeout(this.normalSpeed, 15000, game);
    setTimeout(this.endNotify, 2000, this);
  },
  endNotify : function(bonus) {
    bonus.note = false;
  }
};
