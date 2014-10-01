module.exports = function (grunt) {

    grunt.initConfig({
        cfg: {
            barename: 'aerogear.core',
            namespace: 'AeroGear'
        },
        transpile: {
            core: {}
        },
        microlib: {
            core: {
                files: [ { src: 'dist/aerogear.core.amd.js', dest: 'dist/aerogear.core.micro.js' } ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadNpmTasks('grunt-microlib');
    grunt.loadTasks('tasks');
    grunt.renameTask('browser', 'microlib');

    grunt.registerTask('default', ['transpile', 'microlib']);

};