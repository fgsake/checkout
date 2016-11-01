"use strict";
(function (window) {
	window.l_a = 'en';
	window.s_l = 'en';

	// Tag html element with .iOS or .no-iOS class
	var myHtml = document.getElementsByTagName('html')[0];
	if (navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPod') > -1 || navigator.userAgent.indexOf('iPad') > -1) {
		myHtml.className = myHtml.className + " iOS";
	} else {
		myHtml.className = myHtml.className + " no-iOS";
	}

	// Create omgYes namespace and page data
	if (typeof window.omgYes == 'undefined') window.omgYes = {};
	if (typeof window.omgYes.pageData == 'undefined') window.omgYes.pageData = {};

	// Main angular app
	window.frontEnd = angular.module('frontEnd', [
		'ngRoute'
		, 'ngAnimate'
		, 'ngSanitize'
		, 'ngCookies'
		, 'frontEndControllers'
		, 'frontEndServices'
		, 'frontEndDirectives'
		, 'mm.foundation'
	])
		.filter('capitalize', function () {
			return function (input) {
				if (input !== null) {
					input = input.toLowerCase();
				}
				return input.substring(0, 1).toUpperCase() + input.substring(1);
			}
		}
	);

	window.frontEndControllers = angular.module('frontEndControllers', []);
	window.frontEndServices = angular.module('frontEndServices', []);
	window.frontEndDirectives = angular.module('frontEndDirectives', []);

	window.AudioContext = window.AudioContext ? window.AudioContext : window.webkitAudioContext;

	if (!window.Object.keys) {
		window.Object.keys = function Object_keys_shim(o) {
			if (o !== window.Object(o))
				throw new TypeError('Object.keys called on a non-object');
			var k = [], p;
			for (p in o) if (window.Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
			return k;
		};
	}

	if (!window.Array.prototype.equals) {
		window.Array.prototype.equals = function Array_equals_shim(array) {	// Array comparison method borrowed from stackoverflow
			// http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript

			// if the other array is a falsy value, return
			if (!array) return false;

			// compare lengths - can save a lot of time
			if (this.length !== array.length) return false;

			for (var i = 0, l = this.length; i < l; i++) {
				// Check if we have nested arrays
				if (this[i] instanceof window.Array && array[i] instanceof window.Array) {
					// recurse into the nested arrays
					if (!this[i].equals(array[i])) return false;
				}
				else if (this[i] !== array[i]) {
					// Warning - two different object instances will never be equal: {x:20} != {x:20}
					return false;
				}
			}
			return true;
		};
	}

	if (!window.Array.prototype.last) {
		window.Array.prototype.last = function Array_last_shim() {
			return this[this.length - 1];
		};
	}

	if (!window.Array.prototype.contains) {
		window.Array.prototype.contains = function Array_contains_shim(item) {
			return (this.indexOf(item) > -1);
		};
	}

	if (!window.String.prototype.toTitleCase) {
		window.String.prototype.toTitleCase = function String_title_case_shim() {
			return this.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		};
	}

	window.canFullscreen = function canFullscreen() {
		var document = window.document;

		return document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled;
	};

	window.fullscreenElement = function fullscreenElement() {
		var document = window.document;
		return document.fullscreenElement ||
			document.webkitFullscreenElement ||
			document.mozFullScreenElement ||
			document.msFullscreenElement;
	};

	window.addFullscreenHandlers = function addFullscreenHandlers(fn, errorFn) {
		var document = window.document;
		if (fn) {
			document.addEventListener("fullscreenchange", fn);
			document.addEventListener("webkitfullscreenchange", fn);
			document.addEventListener("mozfullscreenchange", fn);
			document.addEventListener("MSFullscreenChange", fn);
		}

		if (errorFn) {
			document.addEventListener("fullscreenerror", errorFn);
			document.addEventListener("webkitfullscreenerror", errorFn);
			document.addEventListener("mozfullscreenerror", errorFn);
			document.addEventListener("MSFullscreenError", errorFn);
		}
	};

	window.removeFullscreenHandlers = function removeFullscreenHandlers(fn, errorFn) {
		var document = window.document;
		if (fn) {
			document.removeEventListener("fullscreenchange", fn);
			document.removeEventListener("webkitfullscreenchange", fn);
			document.removeEventListener("mozfullscreenchange", fn);
			document.removeEventListener("MSFullscreenChange", fn);
		}

		if (errorFn) {
			document.removeEventListener("fullscreenerror", errorFn);
			document.removeEventListener("webkitfullscreenerror", errorFn);
			document.removeEventListener("mozfullscreenerror", errorFn);
			document.removeEventListener("MSFullscreenError", errorFn);
		}
	};

	window.requestFullscreen = function requestFullscreen(elem) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
	};

	window.exitFullscreen = function exitFullscreen() {
		var document = window.document;
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	};


	window.arrayToMap = function arrayToMap(inAry, inValueOptional) {
		var obj = {};
		for (var i = 0; i < inAry.length; i++) {
			// default to the item's index in the array
			obj [inAry [i]] = typeof inValueOptional === 'undefined' ? i : inValueOptional;
		}

		return obj;
	};

	// https://github.com/coolaj86/knuth-shuffle
	window.knuthShuffle = function knuthShuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = window.Math.floor(window.Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	// Set the name of the hidden property and the change event for visibility
	var hidden, visibilityChange;
	if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}

	window.addVisibilityChangeListener = function addVisibilityChangeListener(hiddenFn, visibleFn) {
		var handler = function (event) {
			if (document[hidden] && hiddenFn) {
				hiddenFn(event);
			} else if (!document[hidden] && visibleFn) {
				visibleFn(event);
			}
		};
		document.addEventListener(visibilityChange, handler);

		// return to caller so they can call removeVisibilityChangeListener with it if needed
		return handler;
	};

	window.removeVisibilityChangeListener = function removeVisibilityChangeListener(handlerFn) {
		document.removeEventListener(visibilityChange, handlerFn);
	};

	window.getParameterByName = function getParameterByName(name) {
		// From http://stackoverflow.com/a/901144
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(window.location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
})(window);
