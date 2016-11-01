"use strict";

frontEndControllers.controller('checkout',
	['$scope', '$modal', '$routeParams', '$http', '$cookies', '$window', 'sessionData', 'apiService', 'localTextStringsSvc', 'localeSvc', 'deviceGatekeeper',
		function ($scope, $modal, $routeParams, $http, $cookies, $window, sessionData, apiService, localTextStringsSvc, localeSvc, deviceGatekeeper) {
			if (!String.prototype.startsWith) {
				String.prototype.startsWith = function(searchString, position){
					position = position || 0;
					return this.substr(position, searchString.length) === searchString;
				};
			}

			$scope.submitting = false;

			$scope.l_a = l_a;
			$scope.deviceGatekeeper = deviceGatekeeper;

			$scope.checkoutFormData = {
				email: '',
				password: '',
				cardNonce: '',
				option: '',
				price: '',
				currency: '',
				giftId: '',
				affTransId: '',
				discountCode: '',
				originalPrice: '',
				mxpId: ''
			};

			$scope.displayPrice = '';
			$scope.displayOriginalPrice = '';
			$scope.checkoutFormData.affTransId = $cookies.get("affTransId");
			$scope.checkoutFormData.discountCode = $window.localStorage.getItem("discountCode");
			$scope.errorMessage = "";
			$scope.countryCode = localTextStringsSvc["locale.country_code"];
			$scope.waitingPaypal = '';
			$scope.submittingPaypal = false;

			var paymentMethod = null;

			var hasAnalytics = function() {
				return typeof(analytics) !== 'undefined' && analytics;
			};

			if (hasAnalytics()) {
				analytics.ready(function () {
					$scope.checkoutFormData.mxpId = mixpanel.get_distinct_id();
				});
			}

			$scope.setOption = function(option) {
				$scope.checkoutFormData.option = option;
				var pricingParams = {
					option: option
				};
				if ($scope.checkoutFormData.discountCode) {
					pricingParams['discountCode'] = $scope.checkoutFormData.discountCode;
				}

				apiService.invoke('Pricing', pricingParams).then(function (response) {
					$scope.checkoutFormData.price = response.data.price;
					$scope.checkoutFormData.currency = response.data.currency;
					$scope.displayPrice = response.data.display_price;
					if (response.data.original_price) {
						$scope.checkoutFormData.originalPrice = response.data.original_price;
						$scope.displayOriginalPrice = response.data.display_original_price;
					}
					$scope.$applyAsync();
				});
			};

			$scope.showCvvHelp = false;
			$scope.toggleCvvHelp = function toggleCvvHelp() {
				$scope.showCvvHelp = !$scope.showCvvHelp;
			};

			$scope.cardFormValid = false;
			$scope.accountFormValid = false;
			/*$scope.disabledSubmit = "disabled";*/

			$scope.inputType = 'password';
			$scope.showPassword = false;
			$scope.toggleShowPassword = function toggleShowPassword() {
				$scope.showPassword = !$scope.showPassword;

				if ($scope.inputType == 'password') {
					$scope.inputType = 'text';
				} else if ($scope.inputType == 'text') {
					$scope.inputType = 'password';
				}
			};

			$scope.isCreditCard = true;
			$scope.creditOption = 'selected';
			$scope.togglePayment  = function togglePayment() {
				$scope.isCreditCard = !$scope.isCreditCard;

				if ($scope.isCreditCard) {
					$scope.creditOption = 'selected';
					$scope.paypalOption = '';
					$scope.paypalCopy = '';
					$scope.cardInfo = '';
				}

				else if (!$scope.isCreditCard) {
					$scope.creditOption = '';
					$scope.paypalOption = 'selected';
					$scope.paypalCopy = 'visible';
					$scope.cardInfo = 'hidden';
				}

				$scope.checkOurField();
			};

			$scope.authorization = $("meta[name=_tokenizationKey]").attr("content");

			braintree.client.create({
				authorization: $scope.authorization
			}, function (clientErr, clientInstance) {
				if (clientErr) {
					$scope.$applyAsync();
					trackFailed("createBraintreeClient", "clientErr", clientErr);
					return;
				}
				$scope.clientInstance = clientInstance;

				var fields = {
					number: {
						selector: '#cardNumber',
							placeholder: '**** **** **** ****'
					},
					cvv: {
						selector: '#cvv2',
							placeholder: '***'
					},
					expirationDate: {
						selector: '#expiry',
							placeholder: 'MM / YY'
					}
				};

				if(document.getElementById('zipdiv')) {
					if ($scope.countryCode == 'US' || $scope.countryCode == 'GB') {
						fields.postalCode = {
							selector: '#zipCode'
						};
					} else {
						document.getElementById('zipdiv').style.display = "none";
					}
				}

				braintree.hostedFields.create({
					client: clientInstance,
					styles: {
						'input': {
							'font-size': '14px',
							'max-height': '37px'
						},
						'input.invalid': {
							'color': 'red'
						},
						'input.valid': {
							'color': 'green'
						}
					},
					fields: fields
				}, function (hostedFieldsErr, hostedFieldsInstance) {
					if (hostedFieldsErr) {
						$scope.$applyAsync();
						trackFailed("createHostedFields", "hostedFieldError", hostedFieldsErr);
						return;
					}
					$scope.hostedFieldsInstance = hostedFieldsInstance;
					hostedFieldsInstance.on("validityChange", $scope.checkHostedField);
				});

				braintree.paypal.create({
					container: 'paypalBrandedButton',
					client: clientInstance
				}, function (paypalErr, paypalInstance) {
					if (paypalErr) {
						$scope.$applyAsync();
						trackFailed("createPaypal", "paypalError", paypalErr);
						return;
					}
					$scope.paypalInstance = paypalInstance;
				});
				doTrack("Checkout Form Built");
			});

			$scope.checkHostedField = function(event) {
				var valid = true;

				for(var field in event.fields) {
					if (! event.fields.hasOwnProperty(field)) {
						continue;
					}
					if (!event.fields[field].isValid) {
						valid = false;
						break;
					}
				}

				$scope.cardFormValid = valid;

				/*if ($scope.cardFormValid && $scope.accountFormValid) {
					$scope.disabledSubmit = '';
				} else {
					$scope.disabledSubmit = 'disabled';
				}*/
				$scope.$applyAsync();
			};

			$scope.checkOurField = function() {
				var valid = true;

				if (typeof $scope.checkoutFormData.email == 'undefined' || !$scope.checkoutFormData.email.length) {
					valid = false;
				} else if (!/^\s*[^@%]+@[^.@]+\.[^.@]+[^@]+\s*$/.test($scope.checkoutFormData.email)){
					valid = false;
				} else if (! $scope.checkoutFormData.giftId && (typeof $scope.checkoutFormData.password == 'undefined' || !/^[^\x00\x08\x0B\x0C\x0E-\x1F]{6,30}$/.test($scope.checkoutFormData.password))) {
					valid = false;
				}

				$scope.accountFormValid = valid;

				/*if ($scope.accountFormValid && ($scope.cardFormValid || ! $scope.creditOption)) {
					$scope.disabledSubmit = '';
				} else {
					$scope.disabledSubmit = 'disabled';
				}*/
			};

			$scope.doSubmit = function(event, method) {
				if ($scope.submitting) {
					return;
				}
				paymentMethod = method;

				$scope.checkOurField();

				var shouldSubmit = true;
				delete $scope.errorMsg;
				$scope.errorMessage = "";

				if (typeof $scope.checkoutFormData.email == 'undefined' || !$scope.checkoutFormData.email.length) {
					shouldSubmit = false;
					$scope.errorMsg = localTextStringsSvc["js.checkout.emailMissing"];
				} else if (!/^\s*[^@%]+@[^.@]+\.[^.@]+[^@]+\s*$/.test($scope.checkoutFormData.email)) {
					shouldSubmit = false;
					$scope.errorMsg = localTextStringsSvc["js.checkout.emailInvalid"];
				} else if (! $scope.checkoutFormData.giftId && (typeof $scope.checkoutFormData.password == 'undefined' || $scope.checkoutFormData.password.length < 6 || $scope.checkoutFormData.password.length > 30)) {
					shouldSubmit = false;
					$scope.errorMsg = localTextStringsSvc["js.checkout.passwordInvalid"];
				}

				if (shouldSubmit) {
					doTrack("Checkout Submit", {method: method});
					$scope.submitting = true;
					switch (method) {
						case 'credit':
							$scope.hostedFieldsInstance.tokenize($scope.handleToken);
							break;
						case 'paypal':
							$scope.waitingPaypal = 'waiting';
							$scope.paypalInstance.tokenize({
								flow: 'checkout',
								intent: 'authorize',
								useraction: 'commit',
								enableShippingAddress: false,
								shippingAddressEditable: false,
								locale: localeSvc.currentLocaleStr,
								amount: $scope.checkoutFormData.price,
								currency: $scope.checkoutFormData.currency
						},
						$scope.handleToken);
							break;
						default:
							log.warn("Unknown payment method:", method);
							$scope.errorMsg = localTextStringsSvc["js.checkout.paymentUnknown"];
							$scope.submitting = false;
					}
				}
			};
			
			$scope.handleToken = function handleToken(tokenizeErr, payload) {
				/*$scope.disabledSubmit = '';*/
				doTrack("Handle Token");
				if (tokenizeErr) {
					if (tokenizeErr.type === 'CUSTOMER' && tokenizeErr.message.startsWith("Frame closed before") || tokenizeErr.message.startsWith("Customer closed")) {
						$scope.errorMsg = localTextStringsSvc["js.checkout.paymentCancelled"];
						$scope.errorMessage = "cancelled";
					} else {
						switch (paymentMethod) {
							case 'credit':
								$scope.errorMsg = localTextStringsSvc["js.checkout.cardError"];
								break;
							case 'paypal':
								$scope.errorMsg = localTextStringsSvc["js.checkout.paypalError"];
								break;
							default:
								log.warn("Unknown payment method:", paymentMethod);
								$scope.errorMsg = localTextStringsSvc["js.checkout.paymentUnknown"];
						}
					}
					$scope.waitingPaypal = '';
					$scope.submitting = false;
					$scope.$applyAsync();
					trackFailed("handleToken", "tokenizeError", tokenizeErr);
					return;
				}
				$scope.checkoutFormData.cardNonce = payload.nonce;
				$scope.submitPayment();
			};

			var doTrack = function doTrack(event, properties) {
				try {
					if (hasAnalytics()) {
						analytics.track(event, properties);
					} else {
						console.log(event, properties || '');
					}
				} catch (err) {
					console.error(err);
				}
			};

			var trackFailed = function trackFailed(operation, error, message) {
				var properties = { op: operation, err: error, msg: message };
				if (message.hasOwnProperty('type') && message.hasOwnProperty('message')) {
					properties.type = message.type;
					properties.msg = message.message;
					properties.code = message.code;
					properties.details = JSON.stringify(message.details);
				}
				doTrack("Checkout Failed", properties);
			};

			$scope.submitPayment = function submitPayment() {
				var token = $("meta[name='_csrf']").attr("content");
				var header = $("meta[name='_csrf_header']").attr("content");
				var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
				headers[header] = token;
				$scope.submittingPaypal = true;
				$scope.waitingPaypal = '';
				$scope.$applyAsync();
				doTrack("Checkout Submit", {option: $scope.checkoutFormData.option, price: $scope.checkoutFormData.price, currency: $scope.checkoutFormData.currency });
				$http({
					method: 'POST',
					url: '/doCheckout',
					data: $.param($scope.checkoutFormData),
					headers: headers
				}).then(function success(response) {
					if (response.data.status === "OK") {
						var transactionId = response.data.arguments[0];
						var price = response.data.arguments[1];
						var currency = response.data.arguments[2];
						var purchase = {t: transactionId, a: price, c: currency};
						try {
							$window.sessionStorage.setItem("p", JSON.stringify(purchase));
							$window.localStorage.removeItem("discountCode");
							$window.localStorage.removeItem("glowDiscount");
						} catch (e) {} // Safari in private browsing doesn't allow storage
						setTimeout(function() {
							$window.location = '/success';
						}, 100);
					} else {
						var key;
						switch (response.data.code) {
							case "CheckoutController.emailExists":
								key = "js.checkout.emailExists";
								break;
							case "GiftEndpoint.passwordTooShort":
							case "GiftEndpoint.passwordTooLong":
							case "GiftEndpoint.passwordInvalid":
								key = "js.checkout.passwordInvalid";
								break;
							case "CheckoutController.cardError":
								key = "js.checkout.cardError";
								break;
							case "CheckoutController.processorError":
								key = "js.checkout.processorError";
								break;
							case "CheckoutController.cardProcessingError":
							default:
								key = "js.checkout.cardProcessingError";
						}
						if (key === "js.checkout.cardProcessingError" && paymentMethod === 'paypal') {
							key = 'js.checkout.paypalError';
						}
						$scope.errorMsg = localTextStringsSvc[key];
						if (response.data.body) {
							$scope.errorMsg += " [" + response.data.body + "]";
						}
						$scope.submitting = false;
						$scope.submittingPaypal = false;
						$scope.$applyAsync();
						// analytics.track not needed here, since server is recording failure
					}
				}, function error(response) {
					$scope.submitting = false;
					$scope.submittingPaypal = false;
					$scope.errorMsg = response.data ? response.data.code : localTextStringsSvc.js.checkout.cardProcessingError;
					$scope.$applyAsync();
					trackFailed("submitPayment", "httpError", response.statusText);
				});
			};
		}
	]
);
