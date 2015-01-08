var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  fs.readFile(asset, callback);
};

exports.respond = function (res, statusCode, data, additionalHeaders) {
  var headers = exports.headers;
  data = data || '';

  if (additionalHeaders) {
    headers = _.extend(_.clone(headers), additionalHeaders);
  }

  res.writeHead(statusCode, headers);
  res.write(data);
  res.end();
};


// As you progress, keep thinking about what helper functions you can put here!
