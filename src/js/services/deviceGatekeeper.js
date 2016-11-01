"use strict";
frontEndServices.service('deviceGatekeeper',
	['$q', '$http', 'sessionData', '$rootScope',
		function ($q, $http, sessionData, $rootScope) {
			var currentBreakpoint = '', lastBreakpoint = '', self = this;

			this.windowWidth = function windowWidth() {
				return document.documentElement.clientWidth;
			};


			// https://coderwall.com/p/ngisma/safe-apply-in-angular-js
			this.safeApply = function (fn) {
				var phase = $rootScope.$$phase;
				if (phase === '$apply' || phase === '$digest') {
					if (fn && (typeof(fn) === 'function')) {
						fn();
					}
				} else {
					$rootScope.$apply(fn);
				}
			};

			this.getBreakpointSize = function getBreakpointSize() {
				var myBreakpoint;

				self.safeApply(function () {
					var afterElement = window.getComputedStyle ? window.getComputedStyle(document.body, ':after') : false,
						prevBreakpoint;

					if (!afterElement) return false;

					currentBreakpoint = afterElement.getPropertyValue('content');

					if (currentBreakpoint != lastBreakpoint) {
						prevBreakpoint = lastBreakpoint;
						lastBreakpoint = currentBreakpoint;
						$rootScope.$broadcast('breakpointChange', {current: currentBreakpoint, prev: prevBreakpoint});
					}

					myBreakpoint = currentBreakpoint;
				});

				return myBreakpoint;
			};

			this.isMobile = function isMobile() {
				currentBreakpoint = this.getBreakpointSize();

				return currentBreakpoint.indexOf('small') > -1;
			};

			this.isMedSmall = function isMedSmall() {
				currentBreakpoint = this.getBreakpointSize();

				return currentBreakpoint.indexOf('medium-up') > -1;
			};

			this.isLandscape = function isLandscape() {
				if (this.isMobile) {
					return $(window).width() > $(window).height();
				}
				else {
					return false;
				}
			};

			this.isTechLarge = function isTechLarge() {
				currentBreakpoint = this.getBreakpointSize();

				return currentBreakpoint.indexOf('981') > -1 || currentBreakpoint.indexOf('large-up') > -1;
			};

			this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			this.iPad = /iPad/.test(navigator.userAgent) && !window.MSStream;
			this.android = /Android/.test(navigator.userAgent) && !window.MSStream;
			this.operaMini = navigator.userAgent.indexOf('Opera Mini') > -1;
			this.firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

			this.isWebView = function isWebView() {
				if (this.iOS) {
					return /\bGSA\b/.test(navigator.userAgent) || /.+AppleWebKit(?!.*Safari)/.test(navigator.userAgent);
				}

				if (this.android) {
					return /Version\/[\d\.]+/.test(navigator.userAgent) && !this.operaMini;
				}

				return this.operaMini;
			};

			$(window).on('resize orientationchange load', this.getBreakpointSize);

			$(window).on('resize', function () {
				$rootScope.$broadcast('resizeEvent');
			});
		}
	]
);
