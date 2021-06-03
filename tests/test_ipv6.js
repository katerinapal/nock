"use strict";

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var http = _http2.default;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var nock = _2.default;

describe('IPv6', function () {
  it('IPV6 URL in http.get get gets mocked', function (done) {
    var responseBody = 'Hello World!';
    var scope = nock('http://[2607:f0d0:1002:51::4]:8080').get('/').reply(200, responseBody);

    http.get('http://[2607:f0d0:1002:51::4]:8080/', function (res) {
      expect(res).to.include({ statusCode: 200 });
      var onData = sinon.spy();
      res.on('data', function (data) {
        onData();
        expect(data).to.be.an.instanceOf(Buffer);
        expect(data.toString()).to.equal(responseBody);
      });
      res.on('end', function () {
        expect(onData).to.have.been.calledOnce();
        scope.done();
        done();
      });
    });
  });

  it('IPV6 hostname in http.request get gets mocked', function (done) {
    var responseBody = 'Hello World!';
    var scope = nock('http://[2607:f0d0:1002:51::5]:8080').get('/').reply(200, responseBody);

    http.request({
      hostname: '2607:f0d0:1002:51::5',
      path: '/',
      method: 'GET',
      port: 8080
    }, function (res) {
      expect(res).to.include({ statusCode: 200 });
      var onData = sinon.spy();
      res.on('data', function (data) {
        onData();
        expect(data).to.be.an.instanceOf(Buffer);
        expect(data.toString()).to.equal(responseBody);
      });
      res.on('end', function () {
        expect(onData).to.have.been.calledOnce();
        scope.done();
        done();
      });
    }).end();
  });
});