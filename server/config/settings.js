var path = require('path')

// Defaults that you can access when you require this config.
module.exports = {  
  rootPath: path.normalize(__dirname + '/..'),
  // If we specify a PORT environment variable use it otherwise use 3000
  port: parseInt(process.env.PORT, 10) || 3000,
  // If we specify a NODE_ENV environment variable use it otherwise use development
  // Note: The environment configuration is in knexfile.js
  environment: process.env.NODE_ENV || 'development', 
  // We can use this to add options when constructing our Hapi server
  hapi: {
    options: {
    }
  }
} 