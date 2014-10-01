module.exports = function (grunt) {

    grunt.initConfig({
        cfg: {
            barename: 'aerogear.core',
            namespace: 'AeroGear'
        },
        clean: [ 'dist' ],
        transpile: {
            core: {}
        },
        microlib: {
            core: {
                files: [ { src: 'dist/aerogear.core.amd.js', dest: 'dist/aerogear.core.micro.js' } ]
            }
        },
        microlibMap: {
            core: {}
        },
        concat_sourcemap: {
            core: {
                files: {
                    'dist/aerogear.core.concat.js': ['node_modules/grunt-microlib/assets/loader.js', 'dist/aerogear.core.micro.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadNpmTasks('grunt-microlib');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadTasks('tasks');
    grunt.renameTask('browser', 'microlib');

    grunt.registerTask('default', ['clean', 'transpile', 'microlib', 'microlibMap', 'concat_sourcemap']);

};