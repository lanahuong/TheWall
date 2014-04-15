"use strict";
(function() {

var screenwidth = window.outerWidth*devicePixelRatio;
var screenheight = window.outerHeight*devicePixelRatio;

var mf = {
  x: screenwidth /320,
  y: screenheight /480
};

var frame = window.top.window.document.getElementById("breakout");
frame.style.height = ""+screenheight+"px";
frame.style.width = ""+screenwidth+"px";

var canvas = document.createElement("canvas");
canvas.id = "homecanvas";
canvas.height = screenheight;
canvas.width = screenwidth;
canvas.style.position = "absolute";
canvas.style.bottom = "0px";
canvas.padding = "0px";
canvas.style.margin = "0px";
canvas.style.background = "#000000";
canvas.style.height = frame.style.height;
canvas.style.width = frame.style.width;

document.body.appendChild(canvas);

var home = new Home(canvas, mf);
home.init();
home.createHome();

home.canvas.addEventListener("touchstart", function(event) {
  var x = event.changedTouches[0].clientX;
  var y = event.changedTouches[0].clientY;
  var playBrick = home.choice[0].brick;
  
  if (x >= playBrick.x && x <= playBrick.x+playBrick.w &&
      y >= playBrick.y && y <= playBrick.y+playBrick.w) {

    frame.src = "game.html";
  }
}, false);

}());
