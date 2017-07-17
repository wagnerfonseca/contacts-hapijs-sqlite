var models = require('./contacts.model'),
  utils =require('../utils/utils')

module.exports = {  
  contacts: {
    handler: (request, reply) => {
      // http://bookshelfjs.org/#Model-subsection-methods
      models.Contact.fetchAll()
        .then((contacts) => {
          reply(utils.formatJson('contacts', contacts))
        })
    }
  },
  contact: {
    handler: (request, reply) => {
      new models.Contact({id: request.params.id})
        .fetch()
        .then((contact) => {
          reply(utils.formatJson('contacts', contact))
        })
    }
  }
}