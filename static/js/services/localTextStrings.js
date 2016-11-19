"use strict";
frontEndServices.service('localTextStringsSvc',
	[
		function () {
			this.addTextString = function addTextString(keyname, value) {
				this[keyname] = value;
			};
		}
	]
);
