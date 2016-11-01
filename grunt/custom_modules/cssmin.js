exports.task = {
  my_target: {
    files: [{
      expand: true,
      cwd: '../static/css/',
      src: [ '*.css', '!*.min.css' ], // 1
      dest: '../static/css/',
      ext: '.min.css'
    }]
  }
};
