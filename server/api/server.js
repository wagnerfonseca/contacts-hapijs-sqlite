const Hapi = require('hapi'),
  config = require('./config/settings')

var server = new Hapi.Server()  

server.connection({host: '0.0.0.0', port: config.port})

// add thye server routes
server.route(require('./config/routes'))  

server.start(() => {  
  console.log('Server running at:', server.info.uri)
})

module.exports = server