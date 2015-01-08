var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers.js");
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.url === '/' || req.url === '/index.html') {
    var filePath = archive.paths.siteAssets + '/index.html';
    helpers.serveAssets(res, filePath, function(err, data) {
      if (err) {
        throw err;
      }
      res.writeHead(200, helpers.headers);
      res.write(data);
      res.end();
    });
  }
};

// exports.handlePostRequest = function (req, res) {
//   res.end(archive.paths.list);
// };
