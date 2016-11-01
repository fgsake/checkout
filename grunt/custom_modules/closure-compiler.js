exports.task = {
    frontend: {
      js: ['../src/js/app.js', '../src/js/directives.js', '../src/js/services/*.js', '../src/js/controllers/*.js'],
      jsOutputFile: '../static/js/all.min.js',
      maxBuffer: 500,
      closurePath: '../closure-compiler',
      options: {
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ES5',
        create_source_map: '../static/js/all.min.js.map',
        output_wrapper: '%output%//# sourceMappingURL=all.min.js.map'
      }
    },
    frontendLibs: {
        js: ['../lib/jquery.scrollTo.min.js', '../lib/mm-foundation-tpls-0.6.0.js', '../lib/jquery.detect_swipe.js'],
        jsOutputFile: '../static/js/libs.min.js',
        maxBuffer: 999,
        closurePath: '../closure-compiler',
        options: {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            language_in: 'ES5'
        }
    },
    checkoutLibs: {
        js: ['../lib/braintree/client.js', '../lib/braintree/hosted-fields.js', '../lib/braintree/data-collector.js', '../lib/braintree/paypal.js'],
        jsOutputFile: '../static/js/checkout.min.js',
        maxBuffer: 999,
        closurePath: '../closure-compiler',
        options: {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            language_in: 'ES5'
        }
    },
    homePageHeadLibs: {
        js: ['../lib/modernizr-custom.js', '../lib/local/jquery-2.1.3.min.js'],
        jsOutputFile: '../static/js/head.min.js',
        maxBuffer: 500,
        closurePath: '../closure-compiler',
        options: {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            language_in: 'ES5'
        }
    },
    homePageFootLibs: {
        js: ['../lib/jquery.easing.1.3.js', '../lib/local/angular.min.js', '../lib/local/angular-route.min.js', '../lib/local/angular-animate.min.js', '../lib/local/angular-cookies.min.js', '../lib/local/angular-sanitize.min.js', '../lib/local/foundation.min.js'],
        jsOutputFile: '../static/js/foot.min.js',
        maxBuffer: 500,
        closurePath: '../closure-compiler',
        options: {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            language_in: 'ES5'
        }
    }
}
;
