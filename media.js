

/*! getUserMedia - v0.1.0 - 2012-08-19
* https://github.com/addyosmani/getUserMedia.js
* Copyright (c) 2012 addyosmani; Licensed MIT */

"use strict";

;(function (window, document) {
	window.getUserMedia = function (options, successCallback, errorCallback) {
        // Options are required
        if (options !== undefined) {
            // getUserMedia() feature detection
            navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
            if ( !! navigator.getUserMedia_) {
                // constructing a getUserMedia config-object and 
                // an string (we will try both)
                var option_object = {};
                var option_string = '';
                var getUserMediaOptions, container, temp, video, ow, oh;

                if (options.video === true) {
                	option_object.video = true;
                	option_string = 'video';
                }
                if (options.audio === true) {
                	option_object.audio = true;
                	if (option_string !== '') {
                		option_string = option_string + ', ';
                	}
                	option_string = option_string + 'audio';
                }

                temp = document.createElement('video');
                temp.className = 'video';

                // configure the interim video
                temp.width = options.width;
                temp.height = options.height;
                temp.autoplay = true;
                document.body.appendChild(temp);
                video = temp;

                // referenced for use in your applications
                options.video = video;

                // first we try if getUserMedia supports the config object
                try {
                    // try object
                    navigator.getUserMedia_(option_object, successCallback, errorCallback);
                } catch (e) {
                    // option object fails
                    try {
                        // try string syntax
                        // if the config object failes, we try a config string
                        navigator.getUserMedia_(option_string, successCallback, errorCallback);
                    } catch (e2) {
                        // both failed
                        // neither object nor string works
                        return undefined;
                    }
                }
            } else {
            	alert('No HMTL5 Video Support');
            }
        }
    };
}(this, document));

/*******************************
* Media Tools for App
*******************************/

var MEDIA = {};

MEDIA.width = 640;
MEDIA.height = 480;
MEDIA.quality = 100;

MEDIA.Canvas = {
	init: function(args) {
		this.el = document.createElement('canvas');
		this.el.className = 'canvas';
		document.body.appendChild(this.el);
		this.el.width = args.width;
		this.el.height = args.height;
		this.context = this.el.getContext("2d");
	}
};

MEDIA.Camera = {
	init: function(args) {
		args = args || {};
		MEDIA.width = args.width = args.width || MEDIA.width;
		MEDIA.height = args.height = args.height || MEDIA.height;
		args.quality = args.quality || MEDIA.quality;
		args.audio = args.audio || false;
		args.video = args.video || true;

		MEDIA.Canvas.init(args);
		
		getUserMedia(args, this.success, this.deviceError);

		this.video = args.video;
	},

	success: function (stream) {
		var video = MEDIA.Camera.video;
		if ((typeof MediaStream !== "undefined" && MediaStream !== null) && stream instanceof MediaStream) {
			if (video.mozSrcObject !== undefined) { //FF18a
				video.mozSrcObject = stream;
			} else { //FF16a, 17a
				video.src = stream;
			}
			return video.play();
		} else {
			var vendorURL = window.URL || window.webkitURL;
			video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
		}
		video.onerror = function () {
			stream.stop();
			streamError();
		};
	},

	deviceError: function (error) {
		alert('No camera available.');
		console.error('An error occurred: [CODE ' + error.code + ']');
	},

	changeFilter: function () {
		if (this.filter_on) {
			this.filter_id = (this.filter_id + 1) & 7;
		}
	},

	capture: function () {
		MEDIA.Canvas.context.drawImage(MEDIA.Camera.video, 0, 0, MEDIA.width, MEDIA.height);
	},

	getImageData:function() {
		return MEDIA.Canvas.context.getImageData(0, 0, MEDIA.width, MEDIA.height);
	},

	putImageData:function(img) {
		MEDIA.Canvas.context.putImageData(img, 0, 0);
	},

	pixels:function() {

		var w = MEDIA.width,
		h = MEDIA.height;

		MEDIA.Camera.capture();

		var img = MEDIA.Canvas.context.getImageData(0, 0, w, h);
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

		MEDIA.Canvas.context.putImageData(img, 0, 0);
	}

};

MEDIA.Camera.init();
