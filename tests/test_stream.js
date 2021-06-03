"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var events = _events2.default;
var http = _http2.default;
var path = _path2.default;
var stream = _stream2.default;
var util = _util2.default;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var nock = _2.default;
var got = _got_client2.default;

var textFilePath = path.resolve(__dirname, './assets/reply_file_1.txt');

it('reply with file and pipe response', function (done) {
  var scope = nock('http://example.test').get('/').replyWithFile(200, textFilePath);

  var text = '';
  var fakeStream = new stream.Stream();
  fakeStream.writable = true;
  fakeStream.write = function (d) {
    text += d;
  };
  fakeStream.end = function () {
    expect(text).to.equal('Hello from the file!');
    scope.done();
    done();
  };

  got.stream('http://example.test/').pipe(fakeStream);
});

// TODO Convert to async / got.
it('pause response after data', function (done) {
  var response = new stream.PassThrough();
  var scope = nock('http://example.test').get('/')
  // Node does not pause the 'end' event so we need to use a stream to simulate
  // multiple 'data' events.
  .reply(200, response);

  http.get('http://example.test', function (res) {
    var didTimeout = sinon.spy();

    setTimeout(function () {
      didTimeout();
      res.resume();
    }, 500);

    res.on('data', function () {
      return res.pause();
    });

    res.on('end', function () {
      expect(didTimeout).to.have.been.calledOnce();
      scope.done();
      done();
    });

    // Manually simulate multiple 'data' events.
    response.emit('data', 'one');
    setTimeout(function () {
      response.emit('data', 'two');
      response.end();
    }, 0);
  });
});

// https://github.com/nock/nock/issues/1493
it("response has 'complete' property and it's true after end", function (done) {
  var response = new stream.PassThrough();
  var scope = nock('http://example.test').get('/')
  // Node does not pause the 'end' event so we need to use a stream to simulate
  // multiple 'data' events.
  .reply(200, response);

  http.get('http://example.test', function (res) {
    var onData = sinon.spy();

    res.on('data', onData);

    res.on('end', function () {
      expect(onData).to.have.been.called();
      expect(res.complete).to.be.true();
      scope.done();
      done();
    });

    // Manually simulate multiple 'data' events.
    response.emit('data', 'one');
    response.end();
  });
});

// TODO Convert to async / got.
it('response pipe', function (done) {
  var dest = function () {
    function Constructor() {
      events.EventEmitter.call(this);

      this.buffer = Buffer.alloc(0);
      this.writable = true;
    }

    util.inherits(Constructor, events.EventEmitter);

    Constructor.prototype.end = function () {
      this.emit('end');
    };

    Constructor.prototype.write = function (chunk) {
      var buf = Buffer.alloc(this.buffer.length + chunk.length);

      this.buffer.copy(buf);
      chunk.copy(buf, this.buffer.length);

      this.buffer = buf;

      return true;
    };

    return new Constructor();
  }();

  var scope = nock('http://example.test').get('/').reply(200, 'nobody');

  http.get({
    host: 'example.test',
    path: '/'
  }, function (res) {
    var onPipeEvent = sinon.spy();

    dest.on('pipe', onPipeEvent);

    dest.on('end', function () {
      scope.done();
      expect(onPipeEvent).to.have.been.calledOnce();
      expect(dest.buffer.toString()).to.equal('nobody');
      done();
    });

    res.pipe(dest);
  });
});

// TODO Convert to async / got.
it('response pipe without implicit end', function (done) {
  var dest = function () {
    function Constructor() {
      events.EventEmitter.call(this);

      this.buffer = Buffer.alloc(0);
      this.writable = true;
    }

    util.inherits(Constructor, events.EventEmitter);

    Constructor.prototype.end = function () {
      this.emit('end');
    };

    Constructor.prototype.write = function (chunk) {
      var buf = Buffer.alloc(this.buffer.length + chunk.length);

      this.buffer.copy(buf);
      chunk.copy(buf, this.buffer.length);

      this.buffer = buf;

      return true;
    };

    return new Constructor();
  }();

  var scope = nock('http://example.test').get('/').reply(200, 'nobody');

  http.get({
    host: 'example.test',
    path: '/'
  }, function (res) {
    dest.on('end', function () {
      return expect.fail('should not call end implicitly');
    });

    res.on('end', function () {
      scope.done();
      done();
    });

    res.pipe(dest, { end: false });
  });
});

it('response is streams2 compatible', function (done) {
  var responseText = 'streams2 streams2 streams2';
  nock('http://example.test').get('/somepath').reply(200, responseText);

  http.request({
    host: 'example.test',
    path: '/somepath'
  }, function (res) {
    res.setEncoding('utf8');

    var body = '';

    res.on('readable', function () {
      var buf = void 0;
      while (buf = res.read()) {
        body += buf;
      }
    });

    res.once('end', function () {
      expect(body).to.equal(responseText);
      done();
    });
  }).end();
});

it('when a stream is used for the response body, it will not be read until after the response event', function (done) {
  var responseEvent = false;
  var responseText = 'Hello World\n';

  var SimpleStream = function (_stream$Readable) {
    (0, _inherits3.default)(SimpleStream, _stream$Readable);

    function SimpleStream() {
      (0, _classCallCheck3.default)(this, SimpleStream);
      return (0, _possibleConstructorReturn3.default)(this, (SimpleStream.__proto__ || (0, _getPrototypeOf2.default)(SimpleStream)).apply(this, arguments));
    }

    (0, _createClass3.default)(SimpleStream, [{
      key: "_read",
      value: function _read() {
        expect(responseEvent).to.be.true();
        this.push(responseText);
        this.push(null);
      }
    }]);
    return SimpleStream;
  }(stream.Readable);

  nock('http://localhost').get('/').reply(201, function () {
    return new SimpleStream();
  });

  http.get('http://localhost/', function (res) {
    responseEvent = true;
    res.setEncoding('utf8');

    var body = '';
    expect(res.statusCode).to.equal(201);

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.once('end', function () {
      expect(body).to.equal(responseText);
      done();
    });
  });
});

// https://github.com/nock/nock/issues/193
it('response readable pull stream works as expected', function (done) {
  nock('http://example.test').get('/ssstream').reply(200, 'this is the response body yeah');

  var req = http.request({
    host: 'example.test',
    path: '/ssstream',
    port: 80
  }, function (res) {
    var ended = false;
    var responseBody = '';
    expect(res.statusCode).to.equal(200);
    res.on('readable', function () {
      var chunk = void 0;
      while ((chunk = res.read()) !== null) {
        responseBody += chunk.toString();
      }
      if (chunk === null && !ended) {
        ended = true;
        expect(responseBody).to.equal('this is the response body yeah');
        done();
      }
    });
  });

  req.end();
});

it('error events on reply streams proxy to the response', function (done) {
  // This test could probably be written to use got, however, that lib has a lot
  // of built in error handling and this test would get convoluted.

  var replyBody = new stream.PassThrough();
  var scope = nock('http://example.test').get('/').reply(201, replyBody);

  http.get({
    host: 'example.test',
    method: 'GET',
    path: '/'
  }, function (res) {
    res.on('error', function (err) {
      expect(err).to.equal('oh no!');
      scope.done();
      done();
    });

    replyBody.end(function () {
      replyBody.emit('error', 'oh no!');
    });
  });
});