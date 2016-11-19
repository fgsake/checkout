"use strict";

frontEndControllers.controller('homeMinimal',
	['$scope', 'deviceGatekeeper', '$window', 'sessionData', '$modal', 'localTextStringsSvc',
		function ($scope, deviceGatekeeper, $window, sessionData, $modal, localTextStringsSvc) {
			var assetRoot = sessionData.getAssetRootPath(), modalInstance;

			$scope.deviceGatekeeper = deviceGatekeeper;
			$scope.previousPressQuote = 1;
			$scope.activePressQuote = 1;
			$scope.pageData = {
				showShare: false
			};

			$scope.localTextStrings = localTextStringsSvc;
			
			$scope.init = function init(isGiftPurchasedScreen) {
				$scope.onResize();

				if (isGiftPurchasedScreen) {
					modalInstance = $modal.open({
						templateUrl: assetRoot + '/ngTemplates/inc/gifts/gift-purchased-modal.html',
						windowClass: 'giftPurchased',
						scope: this
					});
				}
			};

			$scope.redirectToHome = function redirectToHome() {
				$window.location.href = '/';
			};

			$scope.onResize = function onResize() {
				var currentBreakpoint = deviceGatekeeper.getBreakpointSize();

				$scope.activePressQuote =
					(currentBreakpoint.indexOf('small') == -1 && currentBreakpoint.indexOf('medium-up') == -1) ? 'all' :
						(typeof $scope.activePressQuote == 'number') ? $scope.activePressQuote : 1;
			};

			$scope.window = angular.element($window);

			$scope.window.bind('resize', $scope.onResize);

			$scope.$on('videoComplete:topVideo', function () {
				$scope.pageData.showShare = true;
			});
		}
	]
);

frontEndDirectives.directive('swipePressQuotes',
	['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			replace: false,
			link: function (scope, elem, attrs) {
				elem.on('swipeleft', function () {
					this.attributes['data-swipe-press-quotes'].value = 'left';

					$timeout(function () {
						scope.activePressQuote += 1;
						if (scope.activePressQuote == 7) scope.activePressQuote = 1;
					}, 0)
				});
				elem.on('swiperight', function () {
					this.attributes['data-swipe-press-quotes'].value = 'right';

					$timeout(function () {
						scope.activePressQuote -= 1;
						if (scope.activePressQuote == 0) scope.activePressQuote = 6;
					}, 0);
				});
			}
		};
	}]
);

frontEndControllers.animation('.pqSwipeAnim',
	['$animateCss', '$timeout', function ($animateCss, $timeout) {
		var duration = 0.35;

		return {
			enter: function _pqSwipeEnter(element, doneFn) {
				var from = (element.parent()[0].attributes['data-swipe-press-quotes'].value == 'left') ? {left: '100%'} : {left: '-100%'},
					topPadding = element.parent().css('paddingTop');

				from.top = topPadding;

				$timeout(function () {
					element.parent()[0].attributes['data-swipe-press-quotes'].value = 'true';
				}, (duration * 1000) + 100);

				return $animateCss(element, {
					from: from,
					to: {left: '0%', top: topPadding},
					easing: 'ease-out',
					duration: duration
				});
			},
			leave: function _pqSwipeLeave(element, doneFn) {
				var to = (element.parent()[0].attributes['data-swipe-press-quotes'].value == 'left') ? {left: '-100%'} : {left: '100%'},
					topPadding = element.parent().css('paddingTop');

				to.top = topPadding;

				return $animateCss(element, {
					from: {left: '0%', top: topPadding},
					to: to,
					easing: 'ease-out',
					duration: duration
				});
			}
		};
	}]
);
