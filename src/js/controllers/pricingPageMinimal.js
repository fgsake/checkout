"use strict";
frontEndControllers.controller('pricingPageMinimal',
	['$scope', 'deviceGatekeeper', '$rootScope', '$timeout', '$interval', 'localTextStringsSvc',
		function ($scope, deviceGatekeeper, $rootScope, $timeout, $interval, localTextStringsSvc) {
			var pressQuoteRotate = function _pressQuoteRotate() {
					var prevQuotesShown = $scope.activePressQuotes,
						prevQuotesNumber = prevQuotesShown.length,
						lastShown = prevQuotesShown.last(),
						i;

					if (deviceGatekeeper.isMobile()) {
						if (prevQuotesNumber == 0) {
							$scope.activePressQuotes = [0];
						} else if (prevQuotesNumber == 1) {
							$scope.activePressQuotes[0] = (lastShown + 1 >= $scope.pressQuoteBlocks.length) ? 0 : lastShown + 1;
						} else {
							$scope.activePressQuotes = [];
							$scope.activePressQuotes[0] = (lastShown + 1 >= $scope.pressQuoteBlocks.length) ? 0 : lastShown + 1;
						}
					} else {
						if (prevQuotesNumber == 0) {
							for (i = 0; i < $scope.pressQuoteBlocks.length / 2; i++) {
								$scope.activePressQuotes.push(i);
							}
						} else if (prevQuotesNumber == 1) {
							$scope.activePressQuotes = [];
							if (lastShown < $scope.pressQuoteBlocks.length / 2) {
								for (i = 0; i < $scope.pressQuoteBlocks.length / 2; i++) {
									$scope.activePressQuotes.push(i);
								}
							} else {
								for (i = Math.floor($scope.pressQuoteBlocks.length / 2); i < $scope.pressQuoteBlocks.length; i++) {
									$scope.activePressQuotes.push(i);
								}
							}
						} else {
							$scope.activePressQuotes = [];
							if (lastShown >= $scope.pressQuoteBlocks.length / 2) {
								for (i = 0; i < $scope.pressQuoteBlocks.length / 2; i++) {
									$scope.activePressQuotes.push(i);
								}
							} else {
								for (i = Math.floor($scope.pressQuoteBlocks.length / 2); i < $scope.pressQuoteBlocks.length; i++) {
									$scope.activePressQuotes.push(i);
								}
							}
						}
					}
				},
				pressQuoteInterval = undefined;

			$scope.deviceGatekeeper = deviceGatekeeper;

			$scope.bottomBlockView = (deviceGatekeeper.isMobile() || deviceGatekeeper.getBreakpointSize().indexOf('medium-up') > -1) ? '' : 'faq';

			$scope.activePressQuotes = [];
			$scope.pressQuoteBlocks = angular.element('.quoteBlock').children();

			$scope.bottomBlockSwitcher = function bottomBlockSwitcher(view, evt) {
				if (typeof evt != 'undefined') {
					evt.preventDefault();
				}

				$scope.bottomBlockView = view;

				$rootScope.$broadcast('bottomBlockViewSwitched');
			};

			$scope.bottomBlockToggle = function bottomBlockToggle(view, evt) {
				if (typeof evt != 'undefined') {
					evt.preventDefault();
				}

				if ($scope.bottomBlockView == view) {
					$scope.bottomBlockView = undefined;
				} else {
					$scope.bottomBlockView = view;
					$timeout(function () {
						$('html, body').animate({scrollTop: $('.block.' + view).offset().top - 128})
					});
				}

				$rootScope.$broadcast('bottomBlockViewSwitched');
			};

			$scope.initAccordions = function initAccordions() {
				$('.accToggle').each(function (idx, el) {
					var blockMinHeight = parseInt($(el).css('minHeight')),
						blockHeight = $(el).outerHeight(),
						innerSpan = $(el).find('> a > span'),
						innerSpanHeight = 0,
						svgs = $(el).find('svg'),
						svgHeight = svgs.innerHeight(),
						blockPadding = parseInt($(el).css('paddingTop')),
						spanPadding = 0,
						svgMargin = 0, i;

					for (i = 0; i < innerSpan.length; i++) {
						if ($(innerSpan[i]).css('display') != 'none') {
							innerSpanHeight = Math.max(innerSpanHeight, $(innerSpan[i]).height())
						}
					}

					spanPadding = Math.max((blockMinHeight - (blockPadding * 2) - innerSpanHeight) / 2, 0);

					svgMargin = Math.max((blockMinHeight - (blockPadding * 2) - svgHeight) / 2, 0);

					innerSpan.css({paddingTop: spanPadding, paddingBottom: spanPadding});
					svgs.css({marginTop: svgMargin, marginBottom: svgMargin});
				});
			};

			$scope.formData = {
				email: '',
				purchaseOption: localTextStringsSvc["js.pricingPageMinimal.purchase"],
				submitting: false
			};

			$scope.$on('pricing:compatibility', function () {
				$scope.bottomBlockSwitcher('compatibility');
			});

			$scope.$on('pricing:buzz', function () {
				$scope.bottomBlockSwitcher('buzz');
			});

			$scope.$on('breakpointChange', function () {
				if (!deviceGatekeeper.isMobile() && deviceGatekeeper.getBreakpointSize().indexOf('medium-up') == -1 && ($scope.bottomBlockView == '' || typeof $scope.bottomBlockView == 'undefined')) {
					$scope.bottomBlockView = 'faq';
				}
			});

			$scope.submitForm = function submitForm(evt) {
				if (!$scope.formData.submitting) {
					$scope.formData.submitting = true;
				}
			};

			$scope.init = function init() {
				$scope.initAccordions();

				if (window.location.hash.indexOf('buzz') > -1) {
					$scope.bottomBlockView = 'buzz';
				}

				pressQuoteRotate();

				pressQuoteInterval = $interval(pressQuoteRotate, 4500);
			};

			$scope.$on('breakpointChange', pressQuoteRotate);

			$scope.$on('resizeEvent', $scope.initAccordions);

			
			$scope.$on('pricing:compatibility', function () {
                $scope.bottomBlockSwitcher('compatibility');
            });

            $scope.$on('pricing:buzz', function () {
                $scope.bottomBlockSwitcher('buzz');
            });

            $scope.compatibleLink = function compatibleLink (evt) {
                if (typeof evt != 'undefined') { evt.preventDefault(); }

                $rootScope.$broadcast('pricing:compatibility');

                $('html, body').animate({scrollTop: $('.bottomBlock').offset().top});
            };
		}
	]
);
