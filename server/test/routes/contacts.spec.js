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

  var localContact = {  
    contact: {
      first_name: 'Jack',
      middle_initial: null,
      last_name: 'Johnson',
      title: 'President',
      phone_number: '(555) 222-2034',
      email: 'jjohnson@test.net',
      street_address: '123 Some Street',
      city: 'Pittsburgh',
      state: 'PA',
      zip_code: '11223'
    }
  }

  it('should create a contact', function(done) {  
    var options = {
      method: 'POST',
      url: '/api/contacts',
      payload: JSON.stringify(localContact)
    }

    server.inject(options, function(response) {  
      var result = response.result

      expect(response.statusCode).to.equal(200)
      var contact = JSON.parse(result)
      expect(contact).to.be.instanceof(Object)
      // Set our localContact variable for use in other tests 
      localContact = contact
      expect(contact.contact['first_name']).to.equal('Jack')
      expect(contact.contact['middle_initial']).to.equal(null)
      expect(contact.contact['last_name']).to.equal('Johnson')
      expect(contact.contact['phone_number']).to.equal('(555) 222-2034')

      var created = moment(contact.contact['created_at'])
      var updated = moment(contact.contact['updated_at'])

      expect(created.isValid()).to.equal(true)
      expect(updated.isValid()).to.equal(true)

      var now = moment()
      var then = moment().subtract(5, 'seconds')

      expect(now.isAfter(created) || now.isSame(created)).to.equal(true)
      expect(then.isAfter(created)).to.equal(false)
      expect(now.isAfter(updated) || now.isSame(updated)).to.equal(true)
      expect(then.isAfter(updated)).to.equal(false)
      // Make sure our record is added
      options = {
        method: 'GET',
        url: '/api/contacts'
      }

      server.inject(options, function(response) {
        var result = response.result

        expect(response.statusCode).to.equal(200)
        var contacts = JSON.parse(result)
        expect(contacts).to.be.instanceof(Object)
        expect(contacts.contacts).to.be.instanceof(Array)
        expect(contacts.contacts).to.have.length(3)

        done()
      })
    })
  })

})