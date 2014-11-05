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
        },
        'multi-stage-sourcemap': {
            core: {}
        },
        uglify: {
            core: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true,
                    preserveComments: true,
                    sourceMap: true,
                    banner: grunt.file.read('node_modules/grunt-microlib/assets/loader.js') + '\n(function(globals) {\n',
                    footer: '\nwindow.AeroGear = requireModule("aerogear.core");\n})(window);'
                },
                files: {
                    'dist/aerogear.core.ugly.js': ['dist/aerogear.core.amd.js']
                }
            }
        },
        copy: {
            core: {
                expand: true,
                cwd: 'src/',
                src: 'aerogear.core.js',
                dest: 'dist/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadNpmTasks('grunt-microlib');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadTasks('tasks');
    grunt.renameTask('browser', 'microlib');

    //grunt.registerTask('default', ['clean', 'transpile', 'microlib', 'microlibMap', 'concat_sourcemap']);
    grunt.registerTask('default', ['clean', 'transpile', 'uglify', 'multi-stage-sourcemap', 'copy']);

};