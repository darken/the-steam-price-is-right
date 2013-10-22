var createChecker = require('./lib/checker').createChecker,
    readArgs = require('./lib/read-args');

var prevChecker;
var paramsArr = readArgs('items_to_check')
if (!paramsArr.length) throw 'items_to_check file can\'t be empty';

paramsArr.forEach(function (params) {
  var checker = createChecker.apply(null, params);
  if (prevChecker) prevChecker.chain(checker);
  prevChecker = checker;
});

prevChecker.check();
