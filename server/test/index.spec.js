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

describe('Contacts', function() {  
  it('should be return a lists all contacts', function(done) {  
    var options = {
      method: 'GET',
      url: '/api/contacts'
    }

    server.inject(options, function(response) {
      var result = response.result

      expect(response.statusCode).to.equal(200)
      var contacts = JSON.parse(result)
      expect(contacts).to.be.instanceof(Object)
      expect(contacts.contacts).to.be.instanceof(Array)
      expect(contacts.contacts).to.have.length(2)

      done()
    })
  })
})