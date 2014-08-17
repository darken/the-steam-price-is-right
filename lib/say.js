var cp    = require('child_process'),
    util  = require('util');

function say(phrase, cb) {
  var params = '-vz';
  var command = util.format('say %s %s', params, phrase);

  cp.exec(command, function (error, stdout, stderr) {
    if (error) {
      cb(error);
      return;
    }

    log(stdout, 'stdout');
    log(stderr, 'stderr');
  });
}

function log(value, id) {
  if (value) console.log('%s: %s', id, value);
}

module.exports = say;
