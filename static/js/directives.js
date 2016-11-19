"use strict";

frontEndDirectives.directive('localTextStrings',
	['localTextStringsSvc',
		function ($localTextStrings) {
			return {
				restrict: 'A',
				replace: false,
				link: function (scope, elem, attrs) {
					var children = elem.children(), childrenLength = children.length, i, subElem;

					for (i = 0; i < childrenLength; i++) {
						subElem = angular.element(elem.children()[i]);
						$localTextStrings.addTextString(subElem.data().keyname, subElem.html());
					}
				}
			};
		}
	]
);
