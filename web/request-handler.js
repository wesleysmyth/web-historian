var path = require('path');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers.js");
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var urlParts = url.parse(req.url, true, true);
  if (req.method === 'GET') {
    if (archive.staticFiles.hasOwnProperty(urlParts.pathname)) {
      var filePath = archive.staticFiles[urlParts.pathname];
      helpers.serveAssets(res, filePath, function(err, data) {
        if (err) { throw err; }
        helpers.respond(res, 200, data);
      });

    } else {
      // read the sites.txt file to determine if urlParts.pathname exists in file
      fs.readFile(archive.paths.list, function(err, data) {
        var sites = data.toString('utf-8').split('\n');

        // if sites.txt contains the file
        if (sites.indexOf(urlParts.pathname.slice(1)) >= 0) {
          var filePath = archive.paths.archivedSites + urlParts.pathname;
          // YES: check if site exists in the sites folder
          helpers.serveAssets(res, filePath, function(err, data) {
            if (err) {
              // NO: send a 302 to loading.html
              var queryUrl = url.format({
                pathname: '/loading.html',
                query: {site: urlParts.pathname.slice(1)}
              });

              helpers.respond(res, 302, '', {Location: queryUrl});

            } else {
              // YES: serve the site
              helpers.respond(res, 200, data);
            }
          });
        } else {
          // NO: send a 404, site not found
          helpers.respond(res, 404, 'Not Found');
        }
      });
      }
    }else if (req.method === 'POST') {
      fs.readFile(archive.paths.list, function(err, data) {
        var sites = data.toString('utf-8').split('\n');
        var body = '';

        req.on('data', function(data) {
          body += data;
        });

        req.on('end', function() {
          var siteUrl = qs.parse(body).url;
          if (sites.indexOf(siteUrl) === -1) {
            fs.appendFile(archive.paths.list, siteUrl + '\n', function(err) {
              if (err) { throw err; }
            });
          }

          var queryUrl = url.format({
            pathname: '/loading.html',
            query: {site: siteUrl}
          });

          helpers.respond(res, 302, '', {Location: queryUrl});
        });

      });
    }
};

// exports.handlePostRequest = function (req, res) {
//   res.end(archive.paths.list);
// };
