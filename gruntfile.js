module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'res/js/<%= pkg.name %>.js',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
    all: ['Gruntfile.js', 'res/js/*.js']
    },  
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'dist/css/<%= pkg.name %>.min.css': 'res/scss/<%= pkg.name %>.scss'
            }
        }
    }, copy: {
        main: {
          expand: true,
          src: 'res/*.html',
          dest: 'dist/',
          filter: 'isFile',
          flatten: true
        }
      },
      clean: {
        build: ['dist']
      },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
 
  // Default task(s).  
  grunt.registerTask('build', ['clean','copy:main','jshint','uglify','sass']);


};