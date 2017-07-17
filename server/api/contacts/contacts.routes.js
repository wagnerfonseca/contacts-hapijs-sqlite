var  
  controller = require('./contacts.controller')

module.exports = [  
  {
    method: 'GET',
    path: '/api/contacts',
    config: controller.contacts
  },
  {
    method: 'GET',
    path: '/api/contacts/{id}',
    config: controller.contact
  }
]