
"use strict";

var APP = APP || {};

APP.drawImage = function(canvas) {
	canvas.context.drawImage(MEDIA.Camera.video, 0, 0, MEDIA.width, MEDIA.height);
};

APP.Effect = {
	start:function(effect) {
		effect.interval = setInterval(effect.draw.bind(effect), 25);
	},
	stop:function(effect) {
		clearInterval(effect.interval);
		effect.interval = null;
	}
};