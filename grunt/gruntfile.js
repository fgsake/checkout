module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-closure-compiler');

	grunt.initConfig({
		sass: require('./custom_modules/sass').task,
		cssmin: require('./custom_modules/cssmin').task,
		'closure-compiler': require('./custom_modules/closure-compiler').task
	});

	grunt.registerTask('all', ['sass', 'cssmin', 'closure-compiler']);
	grunt.registerTask('js', ['closure-compiler']);
	grunt.registerTask('css', ['sass', 'cssmin']);
};
