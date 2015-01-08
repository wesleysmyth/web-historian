var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers.js");
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (archive.staticFiles.hasOwnProperty(req.url)) {
      var filePath = archive.staticFiles[req.url];
    }
      helpers.serveAssets(res, filePath, function(err, data) {
        var statusCode = 200;
        if (err) {
          statusCode = 404;
        }
        res.writeHead(statusCode, helpers.headers);
        res.write(data);
        res.end();
      });
  }
};

// exports.handlePostRequest = function (req, res) {
//   res.end(archive.paths.list);
// };
