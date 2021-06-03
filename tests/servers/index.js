"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var startHttpServer = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var requestListener = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultRequestListener;
    var server;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            server = http.createServer(requestListener);
            _context.next = 3;
            return new _promise2.default(function (resolve) {
              return server.listen(resolve);
            });

          case 3:
            servers.push(server);
            server.port = server.address().port;
            server.origin = "http://localhost:" + server.port;
            return _context.abrupt("return", server);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function startHttpServer() {
    return _ref.apply(this, arguments);
  };
}();

var startHttpsServer = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var requestListener = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultRequestListener;
    var server;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            server = https.createServer({
              key: fs.readFileSync(path.resolve(__dirname, './localhost.key')),
              cert: fs.readFileSync(path.resolve(__dirname, './localhost.crt'))
            }, requestListener);
            _context2.next = 3;
            return new _promise2.default(function (resolve) {
              return server.listen(resolve);
            });

          case 3:
            servers.push(server);
            server.port = server.address().port;
            server.origin = "https://localhost:" + server.port;
            return _context2.abrupt("return", server);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function startHttpsServer() {
    return _ref2.apply(this, arguments);
  };
}();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

'use strict';

// With OpenSSL installed, you can set up your CA and certificates with
// the following commands, valid for 10 years:
//
//   openssl genrsa -out localhost.key 2048
//   # Set the common name to "localhost"
//   openssl req -new -key localhost.key -out localhost.csr
//   openssl genrsa -out ca.key 2048
//   # Set the common name to "Nock CA"
//   openssl req -new -x509 -key ca.key -out ca.crt -days 3650
//   openssl x509 -req -in localhost.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out localhost.crt -days 3650
//   rm ca.srl localhost.csr
//
var http = _http2.default;
var https = _https2.default;
var path = _path2.default;
var fs = _fs2.default;

var servers = [];

afterEach(function () {
  while (servers.length) {
    var server = servers.pop();
    server.close();
  }
});

var defaultRequestListener = function defaultRequestListener(req, res) {
  res.writeHead(200);
  res.write('OK');
  res.end();
};

mod_indexjs = {
  ca: fs.readFileSync(path.resolve(__dirname, './ca.crt')),
  startHttpServer: startHttpServer,
  startHttpsServer: startHttpsServer
};
var mod_indexjs;
exports.default = mod_indexjs;
module.exports = exports.default;