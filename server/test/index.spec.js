process.env.NODE_ENV = 'test'

global.moment = require('moment')  
global.Code = require('code')  
global.Lab = require('lab')  
global.server = require('../api/server')  
global.bookshelf = require('../api/config/bookshelf')  
global.lab = exports.lab = Lab.script()

global.describe = lab.describe  
global.it = lab.it  
global.before = lab.before  
global.after = lab.after  
global.expect = Code.expect

// Antes de executar qualquer teste realiza a inserção de dados
before(function(done) {  
  bookshelf.knex.migrate.latest().then(function() {
    bookshelf.knex.seed.run().then(function() {
      done()
    })
  })
})


after(function(done) {  
  bookshelf.knex('contacts').truncate().then(function() {
    done()
  })
})