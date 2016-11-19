"use strict";
frontEndServices.service('sessionData',
	[
		function () {
			var csrfHeader, csrfContent, csrfHeaderObject = undefined,
				assetRootPath = undefined;

			this.getCSRFHeader = function () {
				if (typeof csrfHeaderObject === 'undefined') {
					csrfHeader = $("meta[name='_csrf_header']").attr("content");
					csrfContent = $("meta[name='_csrf']").attr("content");
					csrfHeaderObject = {};
					if (csrfHeader) {
						csrfHeaderObject[csrfHeader] = csrfContent;
					}
				}

				return csrfHeaderObject;
			};

			this.getAssetRootPath = function () {
				if (typeof assetRootPath === 'undefined') {
					assetRootPath = $("meta[name='_assetRootPath']").attr('content');
				}

				return assetRootPath;
			};

			this.getPostHeaders = function getPostHeaders() {
				var headers = this.getCSRFHeader();

				headers ['Content-Type'] = 'application/x-www-form-urlencoded';

				return headers;
			};

			this.getPostJSONHeaders = function getPostJSONHeaders() {
				var headers = this.getCSRFHeader();

				headers ['Content-Type'] = 'application/json; charset=UTF-8';

				return headers;
			};
		}
	]
);
