"use strict";

frontEndControllers.controller('headerMarketing',
	['$scope', '$modal', '$rootScope', '$cookies', 'deviceGatekeeper', '$window', 'sessionData', 'localTextStringsSvc', '$timeout',
		function ($scope, $modal, $rootScope, $cookies, deviceGatekeeper, $window, sessionData, localTextStringsSvc, $timeout) {
			var onScroll = function onScroll(page) {
					var currentWindowPos = $(window).scrollTop(),
						headerHeight = $('.header-market').innerHeight(),
						breakpoint = deviceGatekeeper.getBreakpointSize();

					if (deviceGatekeeper.isMobile() || (breakpoint.indexOf('medium-up') > -1) || page == 'secondary') {
						$scope.fixedNav = currentWindowPos >= headerHeight;
					} else if (!deviceGatekeeper.isMobile() && breakpoint.indexOf('medium-up') == -1) {
						$scope.fixedNav = false;
					}
				}
				, isLoggedIn = $cookies.get("l") ? true : false
				, cookies = $cookies.getAll();

			$scope.showOmgyes = false;
			$scope.showMovement = false;
			$scope.showCompany = false;
			$scope.showWelcome = !cookies['_wD'];

			var utmSource = window.getParameterByName("utm_source");
			if (utmSource == "glow" || utmSource == "eve" || utmSource == "nurture" || utmSource == "baby" || utmSource == "glowtcc" || utmSource == "glowntcc") {
				try {
					$window.localStorage.setItem('glowDiscount', 'true');
					$scope.showDiscountModal = true;
				} catch(e) {
					console.log("Local storage full, cannot set discount.")
				}
			}

			$scope.fixedNav = false;

			$scope.init = function init(page) {
				$scope.loggedIn = isLoggedIn;

				$timeout(function () {
					$scope.loginBtnText = ($scope.loggedIn) ? localTextStringsSvc["js.headerMarketing.members"] : localTextStringsSvc["login.signinButton"];
				}, 50);

				$(window).on('scroll resize', function () {
					$scope.$apply(function () {
						onScroll(page);
					});
				});
			};

			$scope.mobileMenuToggle = function mobileMenuToggle(evt) {
				if (typeof evt != 'undefined') {
					evt.preventDefault();
				}

				$('.mobileSideMenu').toggleClass('open');
			};

			$scope.doLogin = function doLogin(evt) {
				evt.preventDefault();

				if ($scope.loggedIn) {
					window.location = '/' + l_a + '/members';
				}
				else {
					window.location = '/' + l_a + '/login';
				}

			};

			$scope.loginModal = function loginModal(evt) {
				var modalInstance;

				evt.preventDefault();

				if ($scope.loggedIn) {
					window.location = '/' + l_a + '/members';
				}
				else {
					modalInstance = $modal.open({
						templateUrl: 'loginModal.html',
						windowClass: 'loginModal',
						controller: ['$scope', function ($scope) {
							$scope.cancel = function cancel() {
								$scope.$dismiss();
							};
						}]
					});
				}
			};

			$scope.secondarySidebarLink = function secondarySidebarLink(section, link, faqLink, evt) {
				if (typeof evt != 'undefined') {
					evt.preventDefault();
				}

				$rootScope.$broadcast('secondaryPageView', {
					section: section,
					link: link,
					faqLink: faqLink
				});

				$scope.mobileMenuToggle();

				$scope.showOmgyes = false;
				$scope.showMovement = false;
				$scope.showCompany = false;
			};

			$scope.welcomePosition = function (edges) {
				var leftRightOffset = Math.max((Math.min(window.innerWidth, document.documentElement.clientWidth) - 1280) / 2, 0),
					edgesArray = edges.split(','), styleObj = {}, i, headerRect = $('header')[0].getBoundingClientRect();

				styleObj.top = Math.max(0, headerRect.bottom) + 'px';

				for (i = 0; i < edgesArray.length; i++) {
					styleObj[edgesArray[i]] = leftRightOffset + 'px';
				}

				return styleObj;
			};

			$scope.closeWelcome = function closeWelcome() {
				var cookieExpiry = new Date();

				cookieExpiry.setTime(cookieExpiry.getTime() + (999 * 24 * 60 * 60 * 1000));

				$scope.showWelcome = false;

				if($scope.showDiscountModal) {
					$scope.showDiscountModal = false;
				}

				$cookies.put('_wD', 1, {
					path: '/',
					expires: cookieExpiry
				});
			};

			$(window).on('scroll', function () {
				if ($scope.showWelcome || $scope.showDiscountModal) {
					$('.welcomeOverlay').css($scope.welcomePosition('right,left'));
					$('.welcomeModal').css($scope.welcomePosition('right'));
				}
			});
		}
	]
);

frontEndControllers.animation('.header-market',
	['$animateCss', function ($animateCss) {
		return {
			addClass: function (element, className, doneFn) {
				var fixedHeader = angular.element(element.children('.header')[0]);
				if (className == 'fixed') {
					return $animateCss(fixedHeader, {
						from: {top: -57},
						to: {top: 0},
						easing: 'ease-out',
						duration: 0.35
					});
				} else {
					doneFn();
				}
			},
			removeClass: function (element, className, doneFn) {
				doneFn();
			}
		};
	}]
);
