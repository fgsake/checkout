exports.task = {
  dist: {
    options: {
      style: 'expanded',
      lineNumbers: true, // 1
      sourcemap: 'none',
      compass: true
    },
    files: [{
      expand: true, // 2
      cwd: '../src/scss',
      src: [ '**/*.scss' ],
      dest: '../static/css',
      ext: '.css'
    }]
  }
};
