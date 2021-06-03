"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ = require("../");

var _2 = _interopRequireDefault(_);

var _servers = require("./servers");

var _servers2 = _interopRequireDefault(_servers);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var fs = _fs2.default;
var path = _path2.default;
var rimraf = _rimraf2.default;

var got = _got_client2.default;
var startHttpServer = _servers2.default.startHttpServer;


var nock = _2.default;

var nockBack = nock.back;
var originalMode = nockBack.currentMode;
var fixturesDir = path.resolve(__dirname, 'fixtures');
var fixtureFilename = 'recording_filters_test.json';
var fixtureFullPath = path.resolve(fixturesDir, fixtureFilename);

var getFixtureContent = function getFixtureContent() {
  return JSON.parse(fs.readFileSync(fixtureFullPath).toString());
};

describe('nockBack filters', function () {
  beforeEach(function () {
    nockBack.fixtures = fixturesDir;
    nockBack.setMode('record');
  });

  afterEach(function () {
    rimraf.sync(fixtureFullPath);
  });

  it('should pass filteringPath options', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var server, nockBackOptions, back1, response1, fixtureContent, back2, response2, fixtureContentReloaded;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return startHttpServer();

          case 2:
            server = _context.sent;
            nockBackOptions = {
              before: function before(scope) {
                scope.filteringPath = function (path) {
                  return path.replace(/timestamp=[0-9]+/, 'timestamp=1111');
                };
              }
            };
            _context.next = 6;
            return nockBack(fixtureFilename, nockBackOptions);

          case 6:
            back1 = _context.sent;
            _context.next = 9;
            return got(server.origin + "/?timestamp=1111");

          case 9:
            response1 = _context.sent;

            back1.nockDone();

            fixtureContent = getFixtureContent();

            expect(fixtureContent).to.have.lengthOf(1);
            expect(fixtureContent[0].path).to.equal('/?timestamp=1111');

            _context.next = 16;
            return nockBack(fixtureFilename, nockBackOptions);

          case 16:
            back2 = _context.sent;
            _context.next = 19;
            return got(server.origin + "/?timestamp=2222");

          case 19:
            response2 = _context.sent;

            back2.nockDone();

            expect(response2.body).to.deep.equal(response1.body);

            fixtureContentReloaded = getFixtureContent();

            expect(fixtureContentReloaded).to.have.lengthOf(1);
            expect(fixtureContentReloaded[0].path).to.equal('/?timestamp=1111');

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('should pass filteringRequestBody options', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var server, nockBackOptions, back1, response1, fixtureContent, back2, response2, fixtureContentReloaded;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return startHttpServer();

          case 2:
            server = _context2.sent;
            nockBackOptions = {
              before: function before(scope) {
                scope.filteringRequestBody = function (body, recordedBody) {
                  var regExp = /token=[a-z-]+/;
                  var recordedBodyMatched = recordedBody.match(regExp);

                  if (recordedBodyMatched && regExp.test(body)) {
                    return body.replace(regExp, recordedBodyMatched[0]);
                  }

                  return body;
                };
              }
            };
            _context2.next = 6;
            return nockBack(fixtureFilename, nockBackOptions);

          case 6:
            back1 = _context2.sent;
            _context2.next = 9;
            return got.post(server.origin, {
              form: { token: 'aaa-bbb-ccc' }
            });

          case 9:
            response1 = _context2.sent;

            back1.nockDone();

            fixtureContent = getFixtureContent();

            expect(fixtureContent).to.have.lengthOf(1);
            expect(fixtureContent[0].body).to.equal('token=aaa-bbb-ccc');

            _context2.next = 16;
            return nockBack(fixtureFilename, nockBackOptions);

          case 16:
            back2 = _context2.sent;
            _context2.next = 19;
            return got.post(server.origin, {
              form: { token: 'ddd-eee-fff' }
            });

          case 19:
            response2 = _context2.sent;

            back2.nockDone();

            expect(response2.text).to.deep.equal(response1.text);

            fixtureContentReloaded = getFixtureContent();

            expect(fixtureContentReloaded).to.have.lengthOf(1);
            expect(fixtureContentReloaded[0].body).to.equal('token=aaa-bbb-ccc');

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('should be able to reset the mode', function () {
    nockBack.setMode(originalMode);
  });
});