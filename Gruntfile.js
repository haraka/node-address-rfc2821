module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: true,
            },
            bin: [ 'bin/*' ],
            lib: [ 'lib/**/*.js' ],
            all: [ '<%= jshint.bin %>', '<%= jshint.lib %>' ],
        },
        mochaTest: {
            options: {
            },
            any: {
                src: ['test/**/*.js']
            }
        },
        clean: {
            dist: [ 'node_modules' ]
        },
        coveralls: {
            options: {
              // LCOV coverage file relevant to every target
              src: 'coverage-results/lcov.info',
              force: true
            },
            your_target: {
              // Target-specific LCOV coverage file
              src: 'coverage-results/extra-results-*.info'
            },
          },
    });

    grunt.registerTask('default', ['jshint','mochaTest']);
};