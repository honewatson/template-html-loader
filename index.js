var cons = require('consolidate');
var utils = require('loader-utils');
var extname = require('path').extname;


module.exports = function(content) {
  this.cacheable && this.cacheable();

  var callback = this.async();
  var opt = utils.parseQuery(this.query);

  function exportContent(content) {
    if (opt.raw) {
      callback(null, content);
    } else {
      callback(null, "module.exports = " + JSON.stringify(content));
    }
  }

  // with no engine given, use the file extension as engine
  if(!opt.engine) {
    opt.engine = extname(this.request).substr(1).toLowerCase();
  }

  if(!cons[opt.engine]) {
    throw new Error("Engine '"+ opt.engine +"' isn't available in Consolidate.js");
  }

  // for relative includes
  opt.filename = this.resourcePath;

  cons[opt.engine].render(content, opt, function(err, html) {
    if(err) {
      console.log(err);
    }
    exportContent(html);
  });
};
