"use strict";
frontEndServices.service('apiService',
	['sessionData', '$q', '$http',
		function (sessionData, $q, $http) {
			var endpoints = {
				AccountSignup: {
					url: '/api/account/signup',
					method: 'POST',
					type: 'form'
				},
				GiftRedeem: {
					url: '/api/gift/redeem',
					method: 'POST',
					type: 'form'
				},
				NewsletterStatus: {
					url: '/api/newsletter/status',
					method: 'GET'
				},
				NewsletterSubscribe: {
					url: '/api/newsletter/subscribe',
					method: 'GET'
				},
				NewsletterResend: {
					url: '/api/newsletter/resend',
					method: 'POST',
					type: 'form'
				},
				NewsletterUnsubscribe: {
					url: '/api/newsletter/unsubscribe',
					method: 'POST',
					type: 'form'
				},
				NewsletterTrySubscribe: {
					url: '/api/try/subscribe?address={address}',
					method: 'GET'
				},
				Pricing: {
					url: '/api/price/{option}',
					method: 'GET'
				},
				PrepSignup: {
					url: '/prepSignup?option={option}',
					method: 'POST'
				},
				VideoPlaylist: {
					url: '/api/video/{id}/playlist',
					method: 'GET'
				}
			};

			this.invoke = function (endpointName, params) {
				var deferred = $q.defer();

				var endpoint = endpoints[endpointName];
				if (!endpoint) {
					deferred.reject({message: 'BUG: Unknown endpoint'});
					return deferred.promise;
				}

				var requestObj = {
					url: endpoint.url.replace(/\{([^{}]+)}/g, function (match, p1) {
						var temp = params[p1];
						delete params[p1];
						return temp;
					}),
					method: endpoint.method,
					responseType: 'json'
				};

				if (requestObj.method === 'POST') {
					requestObj.data = params;
					if (endpoint.type === 'json') {
						requestObj.headers = sessionData.getPostJSONHeaders();
					} else if (endpoint.type === 'form') {
						requestObj.headers = sessionData.getPostHeaders();

						requestObj.transformRequest = function (obj) {
							var str = [];
							angular.forEach(obj, function (value, key) {
								str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
							});
							return str.join("&");
						};
					}
				}
				else if (requestObj.method === "GET" && endpointName != 'NewsletterTrySubscribe') {
					requestObj.url = requestObj.url + "?" + $.param(params);
				}

				$http(requestObj).success(function (data) {
					if (data.status === 'OK') {
						deferred.resolve({message: data.code, data: data.body});
					} else {
						deferred.reject({message: data.code, data: data.body});
					}
				}).error(function () {
					deferred.reject({message: 'Server Error'});
				});

				return deferred.promise;
			};
		}
	]
);
