module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var PATH = {
    assets: {
      stylesheets: 'assets/stylesheets/**/*.scss',
      javascripts: {
        app: 'assets/javascripts/**/*.coffee',
      }
    },
    public: {
      views: 'public/views',
      javascripts: 'public/javascripts',
      stylesheets: 'public/stylesheets',
      images: 'public/images'
    },
    app: {
      root: './app'
    }
  };

  grunt.initConfig({

    PATH: PATH,

    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },

    coffee: {
      compileJoined: {
        options: {
          join: true,
          sourceMap: true
        },
        files: {
          '<%= PATH.public.javascripts %>/application.js': ['<%= PATH.assets.javascripts.app %>']
        }
      }
    },

    concat: {
      application_and_libs: {
        files: '<%= PATH.assets.javascripts.libs %>'
      }
    },

    concurrent: {
      dev: ['compass', 'coffee', 'concat'],
    },

    connect: {
      server: {
        options: {
          port: 3000,
          open: true,
          hostname: 'localhost',
          onCreateServer: function(server, connect, options) {
            var io = require('socket.io').listen(server);
            io.sockets.on('connection', function(socket) {
              // do something with socket
            });
          }
        }
      }
    },

    watch: {
      css: {
          files: '<%= PATH.assets.stylesheets %>',
          tasks: ['compass']
      },

      scripts: {
          files: '<%= PATH.assets.javascripts.app %>',
          tasks: ['coffee']
      },

      html: {
        files: '**/*.html'
      },

      options: {
        livereload: true
      }
    }

  });

  grunt.registerTask('default', ['concurrent:dev', 'compass', 'coffee', 'concat', 'connect', 'watch']);

};
