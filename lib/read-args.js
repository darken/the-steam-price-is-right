var fs = require('fs');

function readArgs(path) {
  var lines = fs.readFileSync(path, 'utf8').split('\n'),
      args = [];

  lines.forEach(function (line) {
    if ('' !== line && line.indexOf('//') !== 0) {
      args.push(JSON.parse('[' + line + ']'));
    }
  });
  return args;
}

module.exports = readArgs;
