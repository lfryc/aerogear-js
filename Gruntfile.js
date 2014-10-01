module.exports = function (grunt) {

    grunt.initConfig({
        transpile: {
            core: {}
        }
    });

    grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['transpile']);

};