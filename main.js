

"use strict";

var APP = APP || {};

APP.init = function() {

	APP.canvas = new MEDIA.Canvas();
	var effect = new APP.RGBEffect(new MEDIA.Canvas());
	var video = MEDIA.Camera.video;

	var controls = {
		Capture:function() {
			APP.drawImage(APP.canvas);
		},
		Pixels:function() {
			if (effect.interval) APP.Effect.stop(effect);
			else APP.Effect.start(effect);
		},
		ToggleVideo:function() {
			if (!video.style.display || video.style.display === 'none') video.style.display = 'block';
			else video.style.display = 'none';
		}
	};

	window.onload = function() {
		var gui = new dat.GUI();
		for (var key in controls) {
			var control = controls[key];
			switch (typeof control) {
				case 'function': gui.add(controls, key); break;
			}
		}
	};

};

APP.init();
