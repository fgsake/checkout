frontEndControllers.controller('langSelect',
	['$scope', 'localeSvc', '$cookies', '$window', function ($scope, localeSvc, $cookies, $window) {
		$scope.supportedLocales = localeSvc.currentSupportedLocales;
		$scope.currentLocale = localeSvc.currentLocaleObj;
		$scope.showLanguages = false;

		$scope.setLocale = function setLocale (locale) {
			var currentPathArray = $window.location.pathname.substr(1).split('/'), newPath;

			$cookies.put('loc', locale, {path: '/', expires: new Date(3000,12,31,23,59,59,999)});

			if (localeSvc.currentSupportedLocaleStrs.indexOf(currentPathArray[0]) > -1) {
				currentPathArray[0] = locale;
			} else {
				currentPathArray.unshift(locale);
			}

			currentPathArray.unshift('');
			newPath = currentPathArray.join('/');

			$window.location = newPath;
		};
	}]
);
