var  
  controller = require('./contacts.controller')

module.exports = [  
  {
    method: 'GET',
    path: '/api/contacts',
    config: controller.contacts
  }, {
    method: 'GET',
    path: '/api/contacts/{id}',
    config: controller.contact
  }, {
    method: 'POST',
    path: '/api/contacts',
    config: controller.contactCreate
  }, {
    method: 'PUT',
    path: '/api/contacts/{id}',
    config: controller.contactUpdate
  }, {
    method: 'DELETE',
    path: '/api/contacts/{id}',
    config: controller.contactDelete
  }
]