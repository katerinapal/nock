"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _back = require("../lib/back");

var _back2 = _interopRequireDefault(_back);

var _servers = require("./servers");

var _servers2 = _interopRequireDefault(_servers);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _proxyquire = require("proxyquire");

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var crypto = _crypto2.default;
var http = _http2.default;
var fs = _fs2.default;
var expect = _chai2.default.expect;

var path = _path2.default;
var rimraf = _rimraf2.default;
var sinon = _sinon2.default;
var proxyquire = _proxyquire2.default.preserveCache();
var nock = _2.default;
var startHttpServer = _servers2.default.startHttpServer;
var nockBack = nock.back;


function testNock(done) {
  var onData = sinon.spy();

  var scope = nock('http://www.example.test').get('/').reply(200, 'Hello World!');

  http.request({
    host: 'www.example.test',
    path: '/',
    port: 80
  }, function (res) {
    expect(res.statusCode).to.equal(200);
    res.once('end', function () {
      expect(onData).to.have.been.called();
      scope.done();
      done();
    });
    res.on('data', function (data) {
      onData();
      expect(data).to.be.an.instanceOf(Buffer);
      expect(data.toString()).to.equal('Hello World!');
    });
  }).end();
}

function nockBackWithFixture(mochaDone, scopesLoaded) {
  var scopesLength = scopesLoaded ? 1 : 0;

  nockBack('good_request.json', function (nockDone) {
    var _this = this;

    expect(this.scopes).to.have.length(scopesLength);
    http.get('http://www.example.test/', function () {
      _this.assertScopesFinished();
      nockDone();
      mochaDone();
    });
  });
}

var requestListener = function requestListener(request, response) {
  response.writeHead(217); // non-standard status code to ensure the response is not live
  response.write('server served a response');
  response.end();
};

// TODO: This was added as a temporary patch. It's possible that we don't need
// both `good_request.json`/`nockBackWithFixture()` on google.com and a second
// pair on localhost. Consolidate them if possible. Otherwise remove this
// comment.
function nockBackWithFixtureLocalhost(mochaDone) {
  nockBack('goodRequestLocalhost.json', function (nockDone) {
    var _this2 = this;

    expect(this.scopes).to.be.empty();

    startHttpServer(requestListener).then(function (server) {
      var request = http.request({
        host: 'localhost',
        path: '/',
        port: server.address().port
      }, function (response) {
        expect(response.statusCode).to.equal(217);
        _this2.assertScopesFinished();
        nockDone();
        mochaDone();
      });

      request.on('error', function () {
        return expect.fail();
      });
      request.end();
    });
  });
}

describe('Nock Back', function () {
  beforeEach(function () {
    nockBack.fixtures = path.resolve(__dirname, 'fixtures');
  });

  it('should throw an exception when fixtures is not set', function () {
    nockBack.fixtures = undefined;

    expect(nockBack).to.throw('Back requires nock.back.fixtures to be set');
  });

  it('should throw an exception when fixtureName is not a string', function () {
    expect(nockBack).to.throw('Parameter fixtureName must be a string');
  });

  it('should return a promise when neither options nor nockbackFn are specified', function (done) {
    nockBack('test-promise-fixture.json').then(function (_ref) {
      var nockDone = _ref.nockDone,
          context = _ref.context;

      expect(nockDone).to.be.a('function');
      expect(context).to.be.an('object');
      done();
    });
  });

  it('should throw an exception when a hook is not a function', function () {
    expect(function () {
      return nockBack('good_request.json', { before: 'not-a-function-innit' });
    }).to.throw('processing hooks must be a function');
  });

  it('should return a promise when nockbackFn is not specified', function (done) {
    nockBack('test-promise-fixture.json', { test: 'options' }).then(function (_ref2) {
      var nockDone = _ref2.nockDone,
          context = _ref2.context;

      expect(nockDone).to.be.a('function');
      expect(context).to.be.an('object');
      done();
    });
  });

  it('`setMode` throws an exception on unknown mode', function () {
    expect(function () {
      return nockBack.setMode('bogus');
    }).to.throw('Unknown mode: bogus');
  });

  it('`assertScopesFinished` throws exception when Back still has pending scopes', function (done) {
    var fixtureName = 'good_request.json';
    var fixturePath = path.join(nockBack.fixtures, fixtureName);
    nockBack(fixtureName, function (nockDone) {
      var _this3 = this;

      expect(function () {
        return _this3.assertScopesFinished();
      }).to.throw("[\"GET http://www.example.test:80/\"] was not used, consider removing " + fixturePath + " to rerecord fixture");
      nockDone();
      done();
    });
  });

  describe('wild mode', function () {
    beforeEach(function () {
      nockBack.setMode('wild');
    });

    it('should allow normal nocks to work', testNock);

    it('should enable net connect', function (done) {
      nock.disableNetConnect();
      nockBack.setMode('wild');
      // TODO: It would be nice if there were a cleaner way to assert that net
      // connect is allowed.
      nockBackWithFixtureLocalhost(done);
    });

    it("shouldn't do anything when fixtures are present", nockBackWithFixtureLocalhost);
  });

  describe('dryrun mode', function () {
    beforeEach(function () {
      // Manually disable net connectivity to confirm that dryrun enables it.
      nock.disableNetConnect();
      nockBack.setMode('dryrun');
    });

    it('goes to internet even when no nockBacks are running', function (done) {
      startHttpServer(requestListener).then(function (server) {
        var request = http.request({
          host: 'localhost',
          path: '/',
          port: server.address().port
        }, function (response) {
          expect(response.statusCode).to.equal(217);
          done();
        });

        request.on('error', function () {
          return expect.fail();
        });
        request.end();
      });
    });

    it('normal nocks work', testNock);

    it('uses recorded fixtures', function (done) {
      return nockBackWithFixture(done, true);
    });

    it("goes to internet, doesn't record new fixtures", function (done) {
      var onData = sinon.spy();

      var fixture = 'someDryrunFixture.json';
      var fixtureLoc = nockBack.fixtures + "/" + fixture;

      expect(fs.existsSync(fixtureLoc)).to.be.false();

      nockBack(fixture, function () {
        startHttpServer(requestListener).then(function (server) {
          var request = http.request({
            host: 'localhost',
            path: '/',
            port: server.address().port
          }, function (response) {
            expect(response.statusCode).to.equal(217);

            response.on('data', onData);

            response.on('end', function () {
              expect(onData).to.have.been.called();
              expect(fs.existsSync(fixtureLoc)).to.be.false();
              done();
            });
          });

          request.on('error', function () {
            return expect.fail();
          });
          request.end();
        });
      });
    });

    it('should throw the expected exception when fs is not available', function () {
      var nockBackWithoutFs = _back2.default;
      nockBackWithoutFs.setMode('dryrun');

      nockBackWithoutFs.fixtures = path.resolve(__dirname, 'fixtures');
      expect(function () {
        return nockBackWithoutFs('good_request.json');
      }).to.throw('no fs');
    });
  });

  describe('record mode', function () {
    var fixture = void 0;
    var fixtureLoc = void 0;

    beforeEach(function () {
      // random fixture file so tests don't interfere with each other
      var token = crypto.randomBytes(4).toString('hex');
      fixture = "temp_" + token + ".json";
      fixtureLoc = path.resolve(__dirname, 'fixtures', fixture);
      nockBack.setMode('record');
    });

    after(function () {
      rimraf.sync(path.resolve(__dirname, 'fixtures', 'temp_*.json'));
    });

    it('should record when configured correctly', function (done) {
      expect(fs.existsSync(fixtureLoc)).to.be.false();

      nockBack(fixture, function (nockDone) {
        startHttpServer(requestListener).then(function (server) {
          var request = http.request({
            host: 'localhost',
            path: '/',
            port: server.address().port
          }, function (response) {
            nockDone();

            expect(response.statusCode).to.equal(217);
            expect(fs.existsSync(fixtureLoc)).to.be.true();
            done();
          });

          request.on('error', function () {
            return expect.fail();
          });
          request.end();
        });
      });
    });

    it('should record the expected data', function (done) {
      nockBack(fixture, function (nockDone) {
        startHttpServer(requestListener).then(function (server) {
          var request = http.request({
            host: 'localhost',
            path: '/',
            port: server.address().port,
            method: 'GET'
          }, function (response) {
            response.once('end', function () {
              nockDone();

              var fixtureContent = JSON.parse(fs.readFileSync(fixtureLoc).toString('utf8'));
              expect(fixtureContent).to.have.length(1);

              var _fixtureContent = (0, _slicedToArray3.default)(fixtureContent, 1),
                  firstFixture = _fixtureContent[0];

              expect(firstFixture).to.include({
                method: 'GET',
                path: '/',
                status: 217
              });

              done();
            });

            response.resume();
          });

          request.on('error', function (err) {
            return expect.fail(err.message);
          });
          request.end();
        });
      });
    });

    // Adding this test because there was an issue when not calling
    // nock.activate() after calling nock.restore().
    it('can record twice', function (done) {
      expect(fs.existsSync(fixtureLoc)).to.be.false();

      nockBack(fixture, function (nockDone) {
        startHttpServer(requestListener).then(function (server) {
          var request = http.request({
            host: 'localhost',
            path: '/',
            port: server.address().port
          }, function (response) {
            nockDone();

            expect(response.statusCode).to.equal(217);
            expect(fs.existsSync(fixtureLoc)).to.be.true();
            done();
          });

          request.on('error', function () {
            return expect.fail();
          });
          request.end();
        });
      });
    });

    it("shouldn't allow outside calls", function (done) {
      nockBack('wrong_uri.json', function (nockDone) {
        http.get('http://other.example.test', function () {
          return expect.fail();
        }).on('error', function (err) {
          expect(err.message).to.equal('Nock: Disallowed net connect for "other.example.test:80/"');
          nockDone();
          done();
        });
      });
    });

    it('should load recorded tests', function (done) {
      nockBack('good_request.json', function (nockDone) {
        var _this4 = this;

        expect(this.scopes).to.have.lengthOf.at.least(1);
        http.get('http://www.example.test/', function () {
          _this4.assertScopesFinished();
          nockDone();
          done();
        });
      });
    });

    it('should filter after recording', function (done) {
      expect(fs.existsSync(fixtureLoc)).to.be.false();

      // You would do some filtering here, but for this test we'll just return
      // an empty array.
      var afterRecord = function afterRecord() {
        return [];
      };

      nockBack(fixture, { afterRecord: afterRecord }, function (nockDone) {
        var _this5 = this;

        startHttpServer(requestListener).then(function (server) {
          var request = http.request({
            host: 'localhost',
            path: '/',
            port: server.address().port
          }, function (response) {
            nockDone();

            expect(response.statusCode).to.equal(217);
            expect(fs.existsSync(fixtureLoc)).to.be.true();
            expect(_this5.scopes).to.be.empty();
            done();
          });
          request.on('error', function () {
            return expect.fail();
          });
          request.end();
        });
      });
    });

    it('should format after recording', function (done) {
      expect(fs.existsSync(fixtureLoc)).to.be.false();

      var afterRecord = function afterRecord() {
        return 'string-response';
      };

      nockBack(fixture, { afterRecord: afterRecord }, function (nockDone) {
        startHttpServer(requestListener).then(function (server) {
          var request = http.request({
            host: 'localhost',
            path: '/',
            port: server.address().port
          }, function (response) {
            nockDone();

            expect(response.statusCode).to.equal(217);
            expect(fs.existsSync(fixtureLoc)).to.be.true();
            expect(fs.readFileSync(fixtureLoc, 'utf8')).to.equal('string-response');
            done();
          });
          request.on('error', function () {
            return expect.fail();
          });
          request.end();
        });
      });
    });

    it('should pass custom options to recorder', function (done) {
      nockBack(fixture, { recorder: { enable_reqheaders_recording: true } }, function (nockDone) {
        startHttpServer(requestListener).then(function (server) {
          var request = http.request({
            host: 'localhost',
            path: '/',
            port: server.address().port,
            method: 'GET'
          }, function (response) {
            response.once('end', function () {
              nockDone();

              var fixtureContent = JSON.parse(fs.readFileSync(fixtureLoc).toString('utf8'));

              expect(fixtureContent).to.have.length(1);
              expect(fixtureContent[0].reqheaders).to.be.ok();

              done();
            });
            response.resume();
          });

          request.on('error', function () {
            return expect.fail();
          });
          request.end();
        });
      });
    });

    it('should throw the expected exception when fs is not available', function () {
      var nockBackWithoutFs = _back2.default;
      nockBackWithoutFs.setMode('record');

      nockBackWithoutFs.fixtures = path.resolve(__dirname, 'fixtures');
      expect(function () {
        return nockBackWithoutFs('good_request.json');
      }).to.throw('no fs');
    });
  });

  describe('lockdown mode', function () {
    beforeEach(function () {
      nockBack.setMode('lockdown');
    });

    it('normal nocks work', testNock);

    it('nock back loads scope', function (done) {
      return nockBackWithFixture(done, true);
    });

    it('no unnocked http calls work', function (done) {
      var req = http.request({
        host: 'other.example.test',
        path: '/'
      }, function () {
        return expect.fail('Should not come here!');
      });

      req.on('error', function (err) {
        expect(err.message.trim()).to.equal('Nock: Disallowed net connect for "other.example.test:80/"');
        done();
      });

      req.end();
    });
  });
});