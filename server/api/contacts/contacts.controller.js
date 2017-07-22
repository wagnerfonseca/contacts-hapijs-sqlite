var models = require('./contacts.model').Contact,
  utils = require('../utils/utils')

module.exports = {  
  contacts: {
    handler: (request, reply) => {
      // http://bookshelfjs.org/#Model-subsection-methods
      models.fetchAll()
        .then((contacts) => {
          reply(utils.formatJson('contacts', contacts))
        })
    }
  },
  contact: {
    handler: (request, reply) => {
      new models({id: request.params.id})
        .fetch()
        .then((contact) => {
          reply(utils.formatJson('contacts', contact))
        })
    }
  },
  contactCreate: {  
    handler: function(request, reply) {
      request.payload.contact.created_at = new Date()
      request.payload.contact.updated_at = new Date()
      new models(request.payload.contact).save().then(function(contact) {
        reply(utils.formatJson('contact', contact))
      })
    }
  },
  contactUpdate: {
    handler: function(request, reply) {
      request.payload.contact.updated_at = new Date()
      new models(request.payload.contact).save()
        .then(function(contact) {
          reply(utils.formatJson('contact', contact))
        })
    }
  },
  contactDelete: {
    handler: function(request, reply) {
      new models(request.params)
        .destroy()
        .then(function(contact) {
          reply(JSON.stringify(contact))
        })
    }
  }
}