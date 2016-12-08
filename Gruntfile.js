module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            main: {
                src: ['Gruntfile.js','index.js','lib/**/*.js']
            },
            test: {
                src: ['test/**/*.js'],
            }
        },
        mochaTest: {
            options: {
            },
            any: {
                src: ['test/**/*.js']
            }
        },
        clean: {
            cruft: ['dump.rdb', 'npm-debug.log'],
            dist: [ 'node_modules' ]
        },
    });

    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('default', ['eslint','mochaTest']);
};
