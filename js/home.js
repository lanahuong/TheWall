"use strict";
(function() {

var home = new Home(document.getElementById("homecanvas"));
home.init();
home.createHome();

home.canvas.addEventListener("touchstart", function(event) {
  var x = event.changedTouches[0].clientX;
  var y = event.changedTouches[0].clientY;
  var playBrick = home.choice[0].brick;
  
  if (x >= playBrick.x && x <= playBrick.x+playBrick.w &&
      y >= playBrick.y && y <= playBrick.y+playBrick.w) {

    window.top.window.document.getElementById("breakout").src = "game.html";
  }
}, false);

}());
