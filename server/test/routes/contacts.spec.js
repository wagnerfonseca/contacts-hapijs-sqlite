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

  it('should be display a contact', function(done) {  
    var options = {
      method: 'GET',
      url: '/api/contacts/1'
    }

    server.inject(options, function(response) {
      var result = response.result

      expect(response.statusCode).to.equal(200)
      var contact = JSON.parse(result) 
      expect(contact).to.be.instanceof(Object)
      expect(contact.contacts['first_name']).to.equal('Joe')
      expect(contact.contacts['middle_initial']).to.equal(null)
      expect(contact.contacts['last_name']).to.equal('Smith')
      expect(contact.contacts['created_at']).to.not.equal(null)
      expect(contact.contacts['updated_at']).to.equal(null)

      done()
    })
  })
})