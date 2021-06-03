"use strict";

var _setImmediate2 = require("babel-runtime/core-js/set-immediate");

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _servers = require("./servers");

var _servers2 = _interopRequireDefault(_servers);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _zlib = require("zlib");

var _zlib2 = _interopRequireDefault(_zlib);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var http = _http2.default;
var https = _https2.default;
var URLSearchParams = _url2.default.URLSearchParams;

var zlib = _zlib2.default;
var sinon = _sinon2.default;
var expect = _chai2.default.expect;

var nock = _2.default;

var got = _got_client2.default;
var servers = _servers2.default;

describe('Recorder', function () {
  var globalCount = void 0;
  beforeEach(function () {
    globalCount = (0, _keys2.default)(global).length;
  });
  afterEach(function () {
    var leaks = (0, _keys2.default)(global).splice(globalCount, Number.MAX_VALUE);
    if (leaks.length === 1 && leaks[0] === '_key') {
      leaks = [];
    }
    expect(leaks).to.be.empty();
  });

  it('does not record requests from previous sessions', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref2, origin, req1, req1Promise, outputs;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return servers.startHttpServer();

          case 2:
            _ref2 = _context.sent;
            origin = _ref2.origin;


            nock.restore();
            nock.recorder.clear();
            nock.recorder.rec(true);

            req1 = http.get(origin + "/foo");
            req1Promise = new _promise2.default(function (resolve) {
              req1.on('response', function (res) {
                res.on('end', resolve);
                res.resume();
              });
            });

            // start a new recording session while the first request is still in flight

            nock.restore();
            nock.recorder.rec(true);
            _context.next = 13;
            return got.post(origin + "/bar");

          case 13:
            _context.next = 15;
            return req1Promise;

          case 15:

            // validate only the request from the second session is in the outputs
            outputs = nock.recorder.play();

            expect(outputs).to.have.lengthOf(1);
            expect(outputs[0]).to.match(/\.post\('\/bar'\)/);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('when request port is different, use the alternate port', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var _ref4, origin, port, recorded;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            nock.restore();
            nock.recorder.clear();
            nock.recorder.rec(true);

            _context2.next = 5;
            return servers.startHttpServer();

          case 5:
            _ref4 = _context2.sent;
            origin = _ref4.origin;
            port = _ref4.port;


            expect(port).not.to.equal(80);

            _context2.next = 11;
            return got.post(origin);

          case 11:
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.include("nock('http://localhost:" + port + "',");

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('recording turns off nock interception (backward compatibility behavior)', function () {
    //  We ensure that there are no overrides.
    nock.restore();
    expect(nock.isActive()).to.be.false();
    //  We active the nock overriding - as it's done by merely loading nock.
    nock.activate();
    expect(nock.isActive()).to.be.true();
    //  We start recording.
    nock.recorder.rec();
    //  Nothing happens (nothing has been thrown) - which was the original behavior -
    //  and mocking has been deactivated.
    expect(nock.isActive()).to.be.false();
  });

  it('records', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var gotRequest, _ref6, origin, port, recorded;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            gotRequest = sinon.spy();


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            _context3.next = 6;
            return servers.startHttpServer(function (request, response) {
              gotRequest();
              response.writeHead(200);
              response.end();
            });

          case 6:
            _ref6 = _context3.sent;
            origin = _ref6.origin;
            port = _ref6.port;


            nock.recorder.rec(true);

            _context3.next = 12;
            return got.post(origin);

          case 12:

            expect(gotRequest).to.have.been.calledOnce();

            nock.restore();

            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.be.a('string');
            // TODO: Use chai-string?
            expect(recorded[0].startsWith("\nnock('http://localhost:" + port + "', {\"encodedQueryParams\":true})\n  .post('/')")).to.be.true();

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('records objects', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var gotRequest, _ref8, origin, requestBody, recorded;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            gotRequest = sinon.spy();


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            _context4.next = 6;
            return servers.startHttpServer(function (request, response) {
              gotRequest();
              response.writeHead(200);
              response.end();
            });

          case 6:
            _ref8 = _context4.sent;
            origin = _ref8.origin;


            nock.recorder.rec({
              dont_print: true,
              output_objects: true
            });

            requestBody = '0123455';
            _context4.next = 12;
            return got.post(origin, { body: requestBody });

          case 12:

            expect(gotRequest).to.have.been.calledOnce();
            nock.restore();
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.include({
              scope: origin,
              method: 'POST',
              body: requestBody
            });

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('logs recorded objects', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var gotRequest, loggingFn, _ref10, origin;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            gotRequest = sinon.spy();
            loggingFn = sinon.spy();


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            _context5.next = 7;
            return servers.startHttpServer(function (request, response) {
              gotRequest();
              response.writeHead(200);
              response.end();
            });

          case 7:
            _ref10 = _context5.sent;
            origin = _ref10.origin;


            nock.recorder.rec({
              logging: loggingFn,
              output_objects: true
            });

            _context5.next = 12;
            return got.post(origin);

          case 12:

            expect(gotRequest).to.have.been.calledOnce();
            expect(loggingFn).to.have.been.calledOnce();
            expect(loggingFn.getCall(0).args[0].startsWith('\n<<<<<<-- cut here -->>>>>>\n{\n  "scope": "http://localhost:')).to.be.true();

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('records objects and correctly stores JSON object in body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var _ref12, origin, exampleBody, recorded;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            _context6.next = 5;
            return servers.startHttpServer();

          case 5:
            _ref12 = _context6.sent;
            origin = _ref12.origin;


            nock.recorder.rec({
              dont_print: true,
              output_objects: true
            });

            exampleBody = { foo: 123 };
            _context6.next = 11;
            return got.post(origin, {
              headers: { 'content-type': 'application/json' },
              body: (0, _stringify2.default)(exampleBody)
            });

          case 11:

            nock.restore();
            recorded = nock.recorder.play();

            nock.recorder.clear();
            nock.activate();

            expect(recorded).to.have.lengthOf(1);

            // TODO See https://github.com/nock/nock/issues/1229

            // This is the current behavior: store body as decoded JSON.
            expect(recorded[0]).to.deep.include({ body: exampleBody });

            // This is the desired behavior: store the body as encoded JSON. The second
            // test shows desired behavior: store body as encoded JSON so that JSON
            // strings can be correctly matched at runtime. Because headers are not
            // stored in the recorder output, it is impossible for the loader to
            // differentiate a stored JSON string from a non-JSON body.
            // expect(recorded[0]).to.include({ body: JSON.stringify(exampleBody) })

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('records and replays objects correctly', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var exampleText, _ref14, origin, response1, recorded, nocks, response2;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            exampleText = '<html><body>example</body></html>';
            _context7.next = 3;
            return servers.startHttpServer(function (request, response) {
              switch (_url2.default.parse(request.url).pathname) {
                case '/':
                  response.writeHead(302, { Location: '/abc' });
                  break;
                case '/abc':
                  response.write(exampleText);
                  break;
              }
              response.end();
            });

          case 3:
            _ref14 = _context7.sent;
            origin = _ref14.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec({
              dont_print: true,
              output_objects: true
            });

            _context7.next = 11;
            return got(origin);

          case 11:
            response1 = _context7.sent;

            expect(response1.body).to.equal(exampleText);

            nock.restore();
            recorded = nock.recorder.play();

            nock.recorder.clear();
            nock.activate();

            expect(recorded).to.have.lengthOf(2);
            nocks = nock.define(recorded);
            _context7.next = 21;
            return got(origin);

          case 21:
            response2 = _context7.sent;

            expect(response2.body).to.equal(exampleText);
            nocks.forEach(function (nock) {
              return nock.done();
            });

          case 24:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('records and replays correctly with filteringRequestBody', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var responseBody, _ref16, origin, response1, recorded, onFilteringRequestBody, _recorded, definition, nocks, response2;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            responseBody = '<html><body>example</body></html>';
            _context8.next = 3;
            return servers.startHttpServer(function (request, response) {
              response.write(responseBody);
              response.end();
            });

          case 3:
            _ref16 = _context8.sent;
            origin = _ref16.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec({
              dont_print: true,
              output_objects: true
            });

            _context8.next = 11;
            return got(origin);

          case 11:
            response1 = _context8.sent;

            expect(response1.body).to.equal(responseBody);
            expect(response1.headers).to.be.ok();

            nock.restore();
            recorded = nock.recorder.play();

            nock.recorder.clear();
            nock.activate();

            expect(recorded).to.have.lengthOf(1);
            onFilteringRequestBody = sinon.spy();
            _recorded = (0, _slicedToArray3.default)(recorded, 1), definition = _recorded[0];

            definition.filteringRequestBody = function (body, aRecodedBody) {
              onFilteringRequestBody();
              expect(body).to.equal(aRecodedBody);
              return body;
            };
            nocks = nock.define([definition]);
            _context8.next = 25;
            return got(origin);

          case 25:
            response2 = _context8.sent;

            expect(response2.body).to.equal(responseBody);
            nocks.forEach(function (nock) {
              return nock.done();
            });
            expect(onFilteringRequestBody).to.have.been.calledOnce();

          case 29:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  // https://github.com/nock/nock/issues/29
  it('http request without callback should not crash', function (done) {
    var serverFinished = sinon.spy();

    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer().then(function (_ref17) {
      var port = _ref17.port;

      nock.recorder.rec(true);
      var req = http.request({
        host: 'localhost',
        port: port,
        method: 'GET',
        path: '/'
      });

      req.on('response', function (res) {
        res.once('end', function () {
          expect(serverFinished).to.have.been.calledOnce();
          done();
        });
        res.resume();
      });

      req.end();
      serverFinished();
    });
  });

  it('checks that data is specified', function () {
    nock.restore();
    nock.recorder.clear();
    nock.recorder.rec(true);

    var req = http.request({
      method: 'POST',
      host: 'localhost',
      path: '/',
      port: '80',
      body: undefined
    });

    expect(function () {
      return req.write();
    }).to.throw(Error, 'Data was undefined.');
    req.abort();
  });

  it('when request body is json, it goes unstringified', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var _ref19, origin, payload, recorded;

    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return servers.startHttpServer();

          case 2:
            _ref19 = _context9.sent;
            origin = _ref19.origin;


            nock.restore();
            nock.recorder.clear();
            nock.recorder.rec(true);

            payload = { a: 1, b: true };
            _context9.next = 10;
            return got.post(origin, { body: (0, _stringify2.default)(payload) });

          case 10:
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.include('.post(\'/\', {"a":1,"b":true})');

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('when request body is json, it goes unstringified in objects', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var _ref21, origin, payload, recorded;

    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return servers.startHttpServer();

          case 2:
            _ref21 = _context10.sent;
            origin = _ref21.origin;


            nock.restore();
            nock.recorder.clear();
            nock.recorder.rec({ dont_print: true, output_objects: true });

            payload = { a: 1, b: true };
            _context10.next = 10;
            return got.post(origin, { body: (0, _stringify2.default)(payload) });

          case 10:
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.be.an('object');
            expect(recorded[0].body).to.be.an('object').and.deep.equal(payload);

          case 14:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  })));

  it('records nonstandard ports', function (done) {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    var requestBody = 'ABCDEF';
    var responseBody = '012345';

    var requestListener = function requestListener(req, res) {
      res.end(responseBody);
    };

    servers.startHttpServer(requestListener).then(function (_ref22) {
      var origin = _ref22.origin,
          port = _ref22.port;

      nock.recorder.rec({
        dont_print: true,
        output_objects: true
      });

      // Confidence check that we have a non-standard port.
      expect(port).to.be.greaterThan(8000);
      var req = http.request({
        host: 'localhost',
        port: port,
        path: '/'
      }, function (res) {
        res.resume();
        res.once('end', function () {
          nock.restore();
          var recorded = nock.recorder.play();
          expect(recorded).to.have.lengthOf(1);
          expect(recorded[0]).to.be.an('object').and.include({
            scope: origin,
            method: 'GET',
            body: requestBody,
            status: 200,
            response: responseBody
          });
          done();
        });
      });

      req.end(requestBody);
    });
  });

  it('`req.end()` accepts and calls a callback when recording', function (done) {
    var onEnd = sinon.spy();

    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer().then(function (_ref23) {
      var port = _ref23.port;

      nock.recorder.rec({ dont_print: true });

      var req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET'
      }, function (res) {
        expect(onEnd).to.have.been.calledOnce();
        expect(res.statusCode).to.equal(200);
        res.on('end', function () {
          done();
        });
        res.resume();
      });

      req.end(onEnd);
    });
  });

  // https://nodejs.org/api/http.html#http_request_end_data_encoding_callback
  it('when recording, when `req.end()` is called with only data and a callback, the callback is invoked and the data is sent', function (done) {
    var onEnd = sinon.spy();

    var requestBody = '';
    var requestListener = function requestListener(request, response) {
      request.on('data', function (data) {
        requestBody += data;
      });
      request.on('end', function () {
        response.writeHead(200);
        response.end();
      });
    };

    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer(requestListener).then(function (_ref24) {
      var port = _ref24.port;

      nock.recorder.rec({ dont_print: true });

      var req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'POST'
      }, function (res) {
        expect(onEnd).to.have.been.calledOnce();
        expect(res.statusCode).to.equal(200);

        res.on('end', function () {
          expect(requestBody).to.equal('foobar');
          done();
        });
        res.resume();
      });

      req.end('foobar', onEnd);
    });
  });

  it('`rec()` throws when reinvoked with already recorder requests', function () {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    nock.recorder.rec();
    expect(function () {
      return nock.recorder.rec();
    }).to.throw(Error, 'Nock recording already in progress');
  });

  it('records https correctly', function (done) {
    var requestBody = '012345';
    var responseBody = '<html><body>example</body></html>';

    var requestListener = function requestListener(request, response) {
      response.write(responseBody);
      response.end();
    };

    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    nock.recorder.rec({
      dont_print: true,
      output_objects: true
    });

    servers.startHttpsServer(requestListener).then(function (_ref25) {
      var origin = _ref25.origin,
          port = _ref25.port;

      https.request({
        method: 'POST',
        host: 'localhost',
        port: port,
        path: '/',
        rejectUnauthorized: false
      }, function (res) {
        res.resume();
        res.once('end', function () {
          nock.restore();
          var recorded = nock.recorder.play();
          expect(recorded).to.have.lengthOf(1);
          expect(recorded[0]).to.be.an('object').and.to.include({
            scope: origin,
            method: 'POST',
            body: requestBody,
            status: 200,
            response: responseBody
          });
          done();
        });
      }).end(requestBody);
    });
  });

  it('records request headers correctly as an object', function (done) {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer().then(function (_ref26) {
      var port = _ref26.port;

      nock.recorder.rec({
        dont_print: true,
        output_objects: true,
        enable_reqheaders_recording: true
      });

      http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET',
        auth: 'foo:bar'
      }, function (res) {
        res.resume();
        res.once('end', function () {
          nock.restore();
          var recorded = nock.recorder.play();
          expect(recorded).to.have.lengthOf(1);
          expect(recorded[0]).to.be.an('object').and.deep.include({
            reqheaders: {
              host: "localhost:" + port,
              authorization: "Basic " + Buffer.from('foo:bar').toString('base64')
            }
          });
          done();
        });
      }).end();
    });
  });

  it('records request headers correctly when not outputting objects', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
    var gotRequest, _ref28, origin, recorded;

    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            gotRequest = sinon.spy();


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            _context11.next = 6;
            return servers.startHttpServer(function (request, response) {
              gotRequest();
              response.writeHead(200);
              response.end();
            });

          case 6:
            _ref28 = _context11.sent;
            origin = _ref28.origin;


            nock.recorder.rec({
              dont_print: true,
              enable_reqheaders_recording: true
            });

            _context11.next = 11;
            return got.post(origin, { headers: { 'X-Foo': 'bar' } });

          case 11:
            expect(gotRequest).to.have.been.calledOnce();

            nock.restore();

            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.be.a('string').and.include('  .matchHeader("x-foo", "bar")');

          case 16:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  })));

  it('records and replays gzipped nocks correctly', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var exampleText, _ref30, origin, response1, recorded, nocks, response2;

    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            exampleText = '<html><body>example</body></html>';
            _context12.next = 3;
            return servers.startHttpServer(function (request, response) {
              zlib.gzip(exampleText, function (err, result) {
                expect(err).to.be.null();
                response.writeHead(200, { 'content-encoding': 'gzip' });
                response.end(result);
              });
            });

          case 3:
            _ref30 = _context12.sent;
            origin = _ref30.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec({
              dont_print: true,
              output_objects: true
            });

            _context12.next = 11;
            return got(origin);

          case 11:
            response1 = _context12.sent;

            expect(response1.body).to.equal(exampleText);
            expect(response1.headers).to.include({ 'content-encoding': 'gzip' });

            nock.restore();
            recorded = nock.recorder.play();

            nock.recorder.clear();
            nock.activate();

            expect(recorded).to.have.lengthOf(1);
            nocks = nock.define(recorded);
            _context12.next = 22;
            return got(origin);

          case 22:
            response2 = _context12.sent;

            expect(response2.body).to.equal(exampleText);
            expect(response2.headers).to.include({ 'content-encoding': 'gzip' });

            nocks.forEach(function (nock) {
              return nock.done();
            });

          case 26:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  it('records and replays the response body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    var exampleBody, _ref32, origin, response1, recorded, nocks, response2;

    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            exampleBody = '<html><body>example</body></html>';
            _context13.next = 3;
            return servers.startHttpServer(function (request, response) {
              switch (_url2.default.parse(request.url).pathname) {
                case '/':
                  response.writeHead(302, { Location: '/abc' });
                  break;
                case '/abc':
                  response.write(exampleBody);
                  break;
              }
              response.end();
            });

          case 3:
            _ref32 = _context13.sent;
            origin = _ref32.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec({
              dont_print: true,
              output_objects: true
            });

            _context13.next = 11;
            return got(origin);

          case 11:
            response1 = _context13.sent;

            expect(response1.body).to.equal(exampleBody);

            nock.restore();
            recorded = nock.recorder.play();

            nock.recorder.clear();
            nock.activate();

            // Two requests, on account of the redirect.
            expect(recorded).to.have.lengthOf(2);
            nocks = nock.define(recorded);
            _context13.next = 21;
            return got(origin);

          case 21:
            response2 = _context13.sent;

            expect(response2.body).to.equal(exampleBody);
            nocks.forEach(function (nock) {
              return nock.done();
            });

          case 24:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));

  it('when encoding is set during recording, body is still recorded correctly', function (done) {
    var responseBody = '<html><body>example</body></html>';

    var requestListener = function requestListener(request, response) {
      response.write(responseBody);
      response.end();
    };

    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer(requestListener).then(function (_ref33) {
      var port = _ref33.port;

      nock.recorder.rec({
        dont_print: true,
        output_objects: true
      });

      var req = http.request({ host: 'localhost', port: port, path: '/', method: 'POST' }, function (res) {
        res.setEncoding('hex');

        var hexChunks = [];
        res.on('data', function (data) {
          hexChunks.push(data);
        });

        res.on('end', function () {
          nock.restore();
          var recorded = nock.recorder.play();
          nock.recorder.clear();
          nock.activate();

          // Confidence check: we're getting hex.
          expect(hexChunks.join('')).to.equal(Buffer.from(responseBody, 'utf8').toString('hex'));

          // Assert: we're recording utf-8.
          expect(recorded).to.have.lengthOf(1);
          expect(recorded[0]).to.include({ response: responseBody });

          done();
        });
      });
      req.end();
    });
  });

  it("doesn't record request headers by default", function (done) {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer().then(function (_ref34) {
      var port = _ref34.port;

      nock.recorder.rec({
        dont_print: true,
        output_objects: true
      });

      http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET',
        auth: 'foo:bar'
      }, function (res) {
        res.resume();
        res.once('end', function () {
          nock.restore();
          var recorded = nock.recorder.play();
          expect(recorded).to.have.lengthOf(1);
          expect(recorded[0]).to.be.an('object');
          expect(recorded[0].reqheaders).to.be.undefined();
          done();
        });
      }).end();
    });
  });

  it('will call a custom logging function', function (done) {
    // This also tests that use_separator is on by default.
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer().then(function (_ref35) {
      var port = _ref35.port;

      var loggingFn = sinon.spy();
      nock.recorder.rec({ logging: loggingFn });

      http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET',
        auth: 'foo:bar'
      }, function (res) {
        res.resume();
        res.once('end', function () {
          nock.restore();

          expect(loggingFn).to.have.been.calledOnce();
          expect(loggingFn.getCall(0).args[0]).to.be.a('string');
          done();
        });
      }).end();
    });
  });

  it('use_separator:false is respected', function (done) {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer().then(function (_ref36) {
      var port = _ref36.port;

      var loggingFn = sinon.spy();
      nock.recorder.rec({
        logging: loggingFn,
        output_objects: true,
        use_separator: false
      });

      http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET',
        auth: 'foo:bar'
      }, function (res) {
        res.resume();
        res.once('end', function () {
          nock.restore();
          expect(loggingFn).to.have.been.calledOnce();
          // This is still an object, because the "cut here" strings have not
          // been appended.
          expect(loggingFn.getCall(0).args[0]).to.be.an('object');
          done();
        });
      }).end();
    });
  });

  it('records request headers except user-agent if enable_reqheaders_recording is set to true', function (done) {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer().then(function (_ref37) {
      var port = _ref37.port;

      nock.recorder.rec({
        dont_print: true,
        output_objects: true,
        enable_reqheaders_recording: true
      });

      http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET',
        auth: 'foo:bar'
      }, function (res) {
        res.resume();
        res.once('end', function () {
          nock.restore();
          var recorded = nock.recorder.play();
          expect(recorded).to.have.lengthOf(1);
          expect(recorded[0]).to.be.an('object');
          expect(recorded[0].reqheaders).to.be.an('object');
          expect(recorded[0].reqheaders['user-agent']).to.be.undefined();
          done();
        });
      }).end();
    });
  });

  it('records query parameters', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
    var _ref39, origin, recorded;

    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return servers.startHttpServer();

          case 2:
            _ref39 = _context14.sent;
            origin = _ref39.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec({
              dont_print: true,
              output_objects: true
            });

            _context14.next = 10;
            return got(origin, {
              searchParams: { q: 'test search' }
            });

          case 10:

            nock.restore();
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.include({ path: '/?q=test+search' });

          case 14:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));

  it('encodes the query parameters when not outputting objects', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
    var _ref41, origin, recorded;

    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return servers.startHttpServer();

          case 2:
            _ref41 = _context15.sent;
            origin = _ref41.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec({
              dont_print: true,
              output_objects: false
            });

            _context15.next = 10;
            return got(origin, {
              searchParams: { q: 'test search++' }
            });

          case 10:

            nock.restore();
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.include('test%20search%2B%2B');

          case 14:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  })));

  // https://github.com/nock/nock/issues/193
  it('works with clients listening for readable', function (done) {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    var requestBody = 'ABCDEF';
    var responseBody = '012345';

    var requestListener = function requestListener(req, res) {
      res.end(responseBody);
    };

    servers.startHttpServer(requestListener).then(function (_ref42) {
      var origin = _ref42.origin,
          port = _ref42.port;

      nock.recorder.rec({ dont_print: true, output_objects: true });

      http.request({
        host: 'localhost',
        port: port,
        path: '/'
      }, function (res) {
        var readableCount = 0;
        var chunkCount = 0;

        res.on('readable', function () {
          ++readableCount;
          var chunk = void 0;
          while ((chunk = res.read()) !== null) {
            expect(chunk.toString()).to.equal(responseBody);
            ++chunkCount;
          }
        });

        res.once('end', function () {
          expect(readableCount).to.equal(1);
          expect(chunkCount).to.equal(1);

          var recorded = nock.recorder.play();
          expect(recorded).to.have.lengthOf(1);
          expect(recorded[0]).to.be.an('object').and.include({
            scope: origin,
            method: 'GET',
            body: requestBody,
            status: 200,
            response: responseBody
          });
          done();
        });
      }).end(requestBody);
    });
  });

  it('outputs query string parameters using query()', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
    var _ref44, origin, recorded;

    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return servers.startHttpServer();

          case 2:
            _ref44 = _context16.sent;
            origin = _ref44.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec(true);

            _context16.next = 10;
            return got(origin, {
              searchParams: { param1: 1, param2: 2 }
            });

          case 10:
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.be.a('string').and.include(".query({\"param1\":\"1\",\"param2\":\"2\"})");

          case 13:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, undefined);
  })));

  it('outputs query string arrays correctly', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
    var _ref46, origin, recorded;

    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return servers.startHttpServer();

          case 2:
            _ref46 = _context17.sent;
            origin = _ref46.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec(true);

            _context17.next = 10;
            return got(origin, {
              searchParams: new URLSearchParams([['foo', 'bar'], ['foo', 'baz']])
            });

          case 10:
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.be.a('string').and.include(".query({\"foo\":[\"bar\",\"baz\"]})");

          case 13:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, undefined);
  })));

  it('removes query params from the path and puts them in query()', function (done) {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    servers.startHttpServer().then(function (_ref47) {
      var port = _ref47.port;

      nock.recorder.rec(true);
      http.request({
        method: 'POST',
        host: 'localhost',
        port: port,
        path: '/?param1=1&param2=2'
      }, function (res) {
        res.resume();
        res.once('end', function () {
          var recorded = nock.recorder.play();
          expect(recorded).to.have.lengthOf(1);
          expect(recorded[0]).to.be.a('string').and.include("nock('http://localhost:" + port + "',").and.include(".query({\"param1\":\"1\",\"param2\":\"2\"})");
          done();
        });
      }).end('ABCDEF');
    });
  });

  // https://github.com/nock/nock/issues/2136
  it('escapes single quotes in the path', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
    var _ref49, origin, recorded;

    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return servers.startHttpServer();

          case 2:
            _ref49 = _context18.sent;
            origin = _ref49.origin;


            nock.restore();
            nock.recorder.clear();
            expect(nock.recorder.play()).to.be.empty();

            nock.recorder.rec(true);

            _context18.next = 10;
            return got(origin + "/foo'bar'baz");

          case 10:
            recorded = nock.recorder.play();

            expect(recorded).to.have.lengthOf(1);
            expect(recorded[0]).to.be.a('string').and.include(".get('/foo\\'bar\\'baz')");

          case 13:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, undefined);
  })));

  it('respects http.request() consumers', function (done) {
    var requestListener = function requestListener(req, res) {
      res.write('foo');
      setTimeout(function () {
        res.end('bar');
      }, 25);
    };

    servers.startHttpServer(requestListener).then(function (_ref50) {
      var port = _ref50.port;

      nock.restore();
      nock.recorder.clear();
      nock.recorder.rec({
        dont_print: true,
        output_objects: true
      });

      var req = http.request({
        host: 'localhost',
        port: port,
        path: '/'
      }, function (res) {
        var buffer = Buffer.from('');

        setTimeout(function () {
          res.on('data', function (data) {
            buffer = Buffer.concat([buffer, data]);
          }).on('end', function () {
            nock.restore();
            expect(buffer.toString()).to.equal('foobar');
            done();
          });
        });
      }, 50);

      req.end();
    });
  });

  it('records and replays binary response correctly', function (done) {
    nock.restore();
    nock.recorder.clear();
    expect(nock.recorder.play()).to.be.empty();

    nock.recorder.rec({
      output_objects: true,
      dont_print: true
    });

    var transparentGifHex = '47494638396101000100800000000000ffffff21f90401000000002c000000000100010000020144003b';
    var transparentGifBuffer = Buffer.from(transparentGifHex, 'hex');

    var requestListener = function requestListener(request, response) {
      response.writeHead(201, {
        'Content-Type': 'image/gif',
        'Content-Length': transparentGifBuffer.length
      });
      response.write(transparentGifBuffer, 'binary');
      response.end();
    };

    servers.startHttpServer(requestListener).then(function (server) {
      var options = {
        method: 'PUT',
        host: 'localhost',
        port: server.port,
        path: '/clear.gif',
        headers: {
          'Content-Type': 'image/gif',
          'Content-Length': transparentGifBuffer.length
        }
      };

      var postRequest1 = http.request(options, function (response) {
        var data = [];

        response.on('data', function (chunk) {
          data.push(chunk);
        });

        response.on('end', function () {
          expect(Buffer.concat(data).toString('hex')).to.equal(transparentGifHex);

          var recordedFixtures = nock.recorder.play();

          server.close(function (error) {
            server = undefined;
            expect(error).to.be.undefined();

            nock.restore();
            nock.activate();
            nock.define(recordedFixtures);

            // Send same post request again.
            var postRequest2 = http.request(options, function (response) {
              var data = [];

              response.on('data', function (chunk) {
                data.push(chunk);
              });

              response.on('end', function () {
                expect(Buffer.concat(data).toString('hex')).to.equal(transparentGifHex);
                done();
              });
            });

            postRequest2.write(transparentGifBuffer);
            postRequest2.end();
          });
        });
      });

      postRequest1.write(transparentGifBuffer);
      postRequest1.end();
    });
  });

  // https://github.com/nock/nock/issues/2086
  it('should not resume the response stream', function (done) {
    nock.recorder.rec(true);

    servers.startHttpServer().then(function (_ref51) {
      var origin = _ref51.origin;

      var req = http.request(origin);

      req.on('response', function (res) {
        // wait for an iteration of the event loop to prove that the `end`
        // listener is being added after a delay. We want to show that callers
        // have time to register listeners before they manually call `resume`.
        (0, _setImmediate3.default)(function () {
          res.on('end', function () {
            return done();
          });
          res.resume();
        });
      });

      req.end();
    });
  });
});