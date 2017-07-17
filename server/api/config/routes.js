const _ = require('lodash'),
  wrench = require('wrench'),
  settings = require('./settings')

// file path point
var files = wrench.readdirSyncRecursive(settings.rootPath)
files = _.filter(files, (f) => {
  return _.endsWith(f, '.routes.js')
})

var routes = []
_.forEach(files, (f) => {    
  // return obj routes  
  if(!_.includes(f, '/node_modules/'))   
    routes = _.concat(routes, require(settings.rootPath + f))
})

module.exports = routes