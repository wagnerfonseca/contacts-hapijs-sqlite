var knexConfig = require('../../knexfile') 
var settings = require('./settings')

// Configuração do banco de dados - baseado no arquivo de configuracao do Knex
var knex = require('knex')(knexConfig[settings.environment])

// ORM 
var bookshelf = require('bookshelf')(knex)
module.exports = bookshelf