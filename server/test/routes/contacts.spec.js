describe('Contacts', function() {  

  it('Return a lists all contacts', function(done) {  
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

  it('Display a contact', function(done) {  
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

  it('Create a contact', function(done) {  
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

  it('Update a contact', done => {
    // Modify some of the data on our contact
    localContact.contact['first_name'] = 'Billy'
    localContact.contact['last_name'] = 'Smith'
    localContact.contact['phone_number'] = '(555) 111-2222'
    
    let options = {
      method: 'PUT',
      url: '/api/contacts/' + localContact.contact['id'],
      payload: JSON.stringify(localContact) // from JSON
    }

    server.inject(
      options, 
      response => {
        let result = response.result
        expect(response.statusCode).to.equal(200)
        let contact = JSON.parse(result)

        expect(contact).to.be.instanceof(Object)

        // Set our localContact variable for use in other tests
        localContact = contact

        expect(contact.contact['first_name']).to.equal('Billy')        
        expect(contact.contact['last_name']).to.equal('Smith')
        expect(contact.contact['phone_number']).to.equal('(555) 111-2222')

        let created = moment(contact.contact['created_at'])
        let updated = moment(contact.contact['updated_at'])
        expect(created.isValid()).to.equal(true)
        expect(updated.isValid()).to.equal(true)

        let now = moment()
        let then = moment().subtract(5, 'seconds')
        expect(now.isAfter(created) || now.isSame(created)).to.equal(true)
        expect(updated.isAfter(created)).to.equal(true)
        expect(now.isAfter(updated) || now.isSame(updated)).to.equal(true)
        expect(then.isAfter(updated)).to.equal(false)

        done()
      }
    )    
  }) 

  it('Delete a contact', done => {
    let options = {
      method: 'DELETE',
      url: `/api/contacts/${localContact.contact.id}`,
      payload: JSON.stringify(localContact) 
    }

    server.inject(
      options, 
      response => {
        expect(response.result).to.equal('{}')

        // Make sure our record is removed
        let options = {
          method: 'GET',
          url: '/api/contacts'
        }

        server.inject(options, response => {
          let result = response.result

          expect(response.statusCode).to.equal(200)
          let contacts = JSON.parse(result)
          expect(contacts).to.be.instanceof(Object)
          expect(contacts.contacts).to.be.instanceof(Array)
          expect(contacts.contacts).to.have.length(2)

          done()
        })
      }
    )
  })

  it('Create a contact fail first_name min length validation', done => {
    localContact.contact.first_name = 'J'

    let options = {
      method: 'POST',
      url: '/api/contacts',
      payload: JSON.stringify(localContact)
    }

    server.inject(
      options, 
      response => {
        let result = response.result

        expect(response.statusCode).to.equal(400)
        expect(result.validation.keys[0]).to.equal('contact.first_name')

        done()
      }
    )
  })

  it('Create a contact fail last_name required validation', done => {
    localContact.contact.first_name = 'Jack'
    localContact.contact.last_name = undefined

    let options = {
      method: 'POST',
      url: '/api/contacts',
      payload: JSON.stringify(localContact)
    }

    server.inject(options, response => {
      let result = response.result

      expect(response.statusCode).to.equal(400)
      expect(result.validation.keys[0]).to.equal('contact.last_name')
      
      expect(result.message).to.contain('"last_name" is required')

      done()
    })
  })

  it('Create a contact fail middle_initial max length validation', done => {
    localContact.contact.last_name = 'Johnson'
    localContact.contact.middle_initial = 'Long'

    let options = {
      method: 'POST',
      url: '/api/contacts',
      payload: JSON.stringify(localContact)
    }

    server.inject(options, response => {
      let result = response.result

      expect(response.statusCode).to.equal(400)
      expect(result.validation.keys[0]).to.equal('contact.middle_initial')

      done()
    })
  })

  it('Create a contact fail email format validation', done => {
    localContact.contact.middle_initial = undefined
    localContact.contact.email = 'invalidemail'

    let options = {
      method: 'POST',
      url: '/api/contacts',
      payload: JSON.stringify(localContact)
    }

    server.inject(options, response => {
      let result = response.result

      expect(response.statusCode).to.equal(400)
      expect(result.validation.keys[0]).to.equal('contact.email')
      expect(result.message).to.contain('"email" must be a valid email')

      done()
    })
  })
})