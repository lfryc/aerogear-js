module.exports = function(grunt) {

  grunt.initConfig({
    transpile: {
      main: {
        type: "amd", // or "amd" or "yui"
        files: [{
          expand: true,
          src: ['tmp/aerogear.core.js'],
          dest: 'dist/'
        }]
      }
    },

    es6transpiler: {                           // Task
      dist: {                                // Target
        files: {                           // Dictionary of files
          'tmp/aerogear.core.js': 'src/aerogear.core.js'    // Destination: Source
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-es6-transpiler');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');

  grunt.registerTask('default', ['es6transpiler', 'transpile']);

};