var cp    = require('child_process'),
    util  = require('util');

function say(phrase, params) {
  if (!params) params = '';
  var command = util.format('say %s %s', params, phrase);

  cp.exec(command, function (error, stdout, stderr) {
    checkErr(error);

    log(stdout, 'stdout');
    log(stderr, 'stderr');
  });
}

function log(value, id) {
  if (value) console.log('%s: %s', id, value);
}

function checkErr(err) {
  if (err) throw err;
}

module.exports = say;
