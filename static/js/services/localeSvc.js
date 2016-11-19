frontEndServices.service('localeSvc',
	['sessionData', 'filterLanguagesFilter', function (sessionData, filterLanguagesFilter) {
		var i, assetRootPath = sessionData.getAssetRootPath(),
			findLocaleObj = function findLocale(locale) {
				var i, localeLength = this.supportedLocales.length;

				for (i = 0; i < localeLength; i++) {
					if (this.supportedLocales[i].label === locale) {
						return this.supportedLocales[i];
					}
				}

				return false;
			}.bind(this),

			filterLocales = function filterLocales(localeArray) {
				var i, localeLength = localeArray.length, supportedLocales = [];

				for (i = 0; i < localeLength; i++) {
					supportedLocales.push(findLocaleObj(localeArray[i]));
				}

				return supportedLocales;
			}.bind(this);

		this.supportedLocales = [
			{
				label: 'en',
				name: 'English'
			}, {
				label: 'de',
				name: 'Deutsch'
			}, {
				label: 'fr',
				name: 'Français'
			}, {
				label: 'es',
				name: 'Español'
			}, {
				label: 'es-XL',
				name: 'Español (LA)'
			}, {
				label: 'ja',
				name: '日本語'
			}, {
				label: 'pt',
				name: 'Português'
			}, {
				label: 'ko',
				name: '한국어'
			}, {
				label: 'it',
				name: 'Italiano'
			}, {
				label: 'zh',
				name: '普通話'
			}
		];
		this.currentSupportedLocales = filterLocales(s_l.split(','));
		this.currentLocaleStr = l_a;
		this.currentLocaleObj = findLocaleObj(l_a);

		this.filteredSupportedLocales = filterLanguagesFilter(this.currentSupportedLocales, this.currentLocaleStr);

		this.currentSupportedLocaleStrs = [];

		for (i = 0; i < this.currentSupportedLocales.length; i++) {
			this.currentSupportedLocaleStrs.push(this.currentSupportedLocales[i].label);
		}
	}]
);

// This will return all languages _except_ the currently-selected one (for the language-selection dropdown)
frontEndServices.filter('filterLanguages',
	[function () {
		return function (input, currentLang) {
			var i, outputArray = [];

			for (i = 0; i < input.length; i++) {
				if (input[i].label != currentLang) {
					outputArray.push(input[i]);
				}
			}

			return outputArray;
		};
	}]
);
