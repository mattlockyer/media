
var App = {};

App.init = function() {

	var canvasInterval;

	var controls = {
		Capture:MEDIA.Camera.capture,
		Pixels:function() {
			if (canvasInterval) {
				clearInterval(canvasInterval);
				canvasInterval = null;
			} else {
				canvasInterval = setInterval(MEDIA.Camera.pixels, 25);
			}
		},
		ToggleVideo:function() {
			if (!MEDIA.Camera.video.style.display || MEDIA.Camera.video.style.display === 'none') MEDIA.Camera.video.style.display = 'block';
			else MEDIA.Camera.video.style.display = 'none';
		}
	};

	window.onload = function() {
		var gui = new dat.GUI();
		gui.add(controls, 'Capture');
		gui.add(controls, 'Pixels');
		gui.add(controls, 'ToggleVideo');
	};

};

App.init();
