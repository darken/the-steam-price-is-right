var http = require('http'),
    util = require('util'),
    play = require('play');

var WAIT = 3000;

var mainUrl = 'http://steamcommunity.com/market/search/render/?query=appid%3A%d+%s&start=%d&count=%d';

var checker = {};

checker.init = function (appId, itemsQuery, start, count, maxPrice) {
  this.itemName = itemsQuery;
  itemsQuery = itemsQuery.trim().replace(/ /g, '+');
  this.url = util.format(mainUrl, appId, itemsQuery, start, count);
  this.maxPrice = maxPrice;
  this.reqNum = 1;
  this.next = this;
};

checker.check = function () {
  try {
    this.doCheck();
  } catch (err) {
    console.log(err);
  }
};

checker.doCheck = function () {
  var that = this;
  function checkIt() {
    that.next.check();
  }

  http.get(this.url, function(res) {
    //res.setEncoding('utf8');

    var data = '';

    res.on('data', function (chunk){
      data += chunk;
    });

    res.on('end', function(){
      setTimeout(checkIt, WAIT);
      try {
        var obj = JSON.parse(data);
        that.handleResponseData(obj);
      } catch(err) {
        console.error('on end error');
        console.error(err);
      }
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    setTimeout(checkIt, 0);
  }).on('close', function() {
    console.log('on end');
  }).setTimeout(WAIT, function() {
    console.warn('======= TIMEOUT ======');
    try {
      this.abort();
    } catch (err) {
      console.error('timeout error');
      console.error(err);
    }
  });
  console.log('\n(#%d) Checking %s', this.reqNum++, this.itemName);
};

checker.handleResponseData = function (data) {
  if (!data.success) {
    console.warn('===== RESPONSE success', data.success);
    return;
  }

  var results = data.results_html;
  var regexp = /&#36;.* /;
  var price = regexp.exec(results);

  if (!price) return;

  price = price[0];

  var number = Number(price.replace(/&#36;/,""));

  var soundAlarm = number <= this.maxPrice;
  console.log('%s: $%d ($%d)%s', this.itemName, number, this.maxPrice, soundAlarm ? ' <-------' : '');
  if (soundAlarm) playAlarm();
};

function playAlarm() {
  play.sound('./node_modules/play/wavs/sfx/alarm.wav');
}

checker.chain = function (next) {
  next.next = this.next;
  this.next = next;

  return this;
};

function createChecker(appId, itemsQuery, start, count, maxPrice) {
  var newChecker = Object.create(checker);
  newChecker.init(appId, itemsQuery, start, count, maxPrice);
  return newChecker;
}

exports.createChecker = createChecker;
