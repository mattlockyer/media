

"use strict";

var APP = APP || {};

APP.RGBEffect = function(canvas) {
	this.canvas = canvas;
	this.interval = null;
};

APP.RGBEffect.prototype = {
	draw: function() {
		var canvas = this.canvas,
		w = MEDIA.width,
		h = MEDIA.height;

		APP.drawImage(canvas);

		var img = canvas.getImageData();
		var data = img.data;

		var pos = 0;
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];

			if (r > g && r > b) {
				data[i] = r > 128 ? 255 : 0;
				data[i + 1] = 0;
				data[i + 2] = 0;
			} else if (g > r && g > b) {
				data[i] = 0;
				data[i + 1] = g > 128 ? 255 : 0;
				data[i + 2] = 0;
			} else {
				data[i] = 0;
				data[i + 1] = 0;
				data[i + 2] = b > 128 ? 255 : 0;
			}
		}

		canvas.putImageData(img);
	}
};