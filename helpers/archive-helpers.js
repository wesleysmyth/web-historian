var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.staticFiles = {
  '/' : path.join(__dirname, '../web/public/index.html'),
  '/styles.css' : path.join(__dirname, '../web/public/styles.css'),
  '/loading.html' : path.join(__dirname, '../web/public/loading.html')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) { throw err; }
    var sites = data.toString('utf-8').split('\n');
    callback(sites);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(sites) {
    callback(sites.indexOf(url) >= 0);
  });
};

exports.addUrlToList = function(url, callback){
  // is the URL in the list?
  // call isUrlInList, pass url as first argument ...
  // second arg is an anonymous function that takes an 'exists' argument
  exports.isUrlInList(url, function(exists) {
    exists ?
    // if(exists) call callback();
    callback() :
    // if(!exists)
      // Append url to list (fs.appendFile)
      // call a callback where the callback takes an error as an argument
    fs.appendFile(exports.paths.list, url + '\n', function(err) {
      callback(err);
    });
  });
};

exports.isURLArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    callback(files.indexOf(url) >= 0);
  });
};

exports.downloadUrls = function(){
};
