module.exports = function(grunt) {

  grunt.initConfig({
    transpile: {
      main: {
        type: "amd", // or "amd" or "yui"
        files: [{
          expand: true,
          src: ['src/aerogear.core.js'],
          dest: 'dist/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-es6-module-transpiler');

  grunt.registerTask('default', ['transpile']);

};