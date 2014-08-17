var delegate = require('./say');

delegate('', function (error) {
  if (error) {
    delegate = require('./win-beep');
  }
});

module.exports = function () {
  delegate.apply(this, arguments);
};