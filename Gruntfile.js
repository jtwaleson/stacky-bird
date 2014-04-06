module.exports = function(grunt) {

  grunt.initConfig({
    typescript: {
      base: {
        src: ['src/main.ts'],
        dest: 'bin/script.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', ['typescript']);

};
