var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers.js");
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (archive.staticFiles.hasOwnProperty(req.url)) {
      var filePath = archive.staticFiles[req.url];
      helpers.serveAssets(res, filePath, function(err, data) {
        var statusCode = 200;
        if (err) {
          statusCode = 404;
        }
        res.writeHead(statusCode, helpers.headers);
        res.write(data);
        res.end();
      });
    } else {
      // read the sites.txt file to determine if req.url exists in file
      fs.readFile(archive.paths.list, function(err, data) {
        var sites = data.toString('utf-8').split('\n');

        // if sites.txt contains the file
        if (sites.indexOf(req.url.slice(1)) >= 0) {
          var filePath = archive.paths.archivedSites + req.url;
          // YES: check if site exists in the sites folder
          helpers.serveAssets(res, filePath, function(err, data) {
            if (err) {
              // NO: send a 302 to loading.html
              var statusCode = 302;
              helpers.headers.Location = '/loading.html';
              res.writeHead(statusCode, helpers.headers);
              delete helpers.headers.Location;
              res.end();
            } else {
              // YES: serve the site
              var statusCode = 200;
              res.writeHead(statusCode, helpers.headers);
              res.write(data);
              res.end();
            }
          });
        } else {
          // NO: send a 404, site not found
          var statusCode = 404;
          res.writeHead(statusCode, helpers.headers);
          res.end('Not found');
        }
      });
    }
  }
};

// exports.handlePostRequest = function (req, res) {
//   res.end(archive.paths.list);
// };
