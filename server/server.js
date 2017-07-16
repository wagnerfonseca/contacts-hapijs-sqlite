const Hapi = require('hapi')
const server = new Hapi.Server();  

server.connection({host: '0.0.0.0', port: 3000});

server.route({  
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
      reply('Hello, world!');
  }
})

// configurando o banco de dados
var knex = require('knex')({  
  client: 'sqlite3',
  connection: {
      filename: "./dev.sqlite3"
  },
  useNullAsDefault: false
})

// ORM para Node.js
var bookshelf = require('bookshelf')(knex);

var Contact = bookshelf.Model.extend({  
  tableName: 'contacts'
})

server.route({  
  method: 'GET',
  path: '/api/contacts',
  handler: function(request, reply) {
      Contact.fetchAll().then(function(contacts) {
          reply('{"contacts:" ' + JSON.stringify(contacts) + '}');
      });
  }
});

server.start(function() {  
  console.log('Server running at:', server.info.uri);
})
