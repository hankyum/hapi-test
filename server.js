'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Joi = require("joi");

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 3000,
  labels: ['api']
});

server.register([
    require('inert'),
    require("vision"),
    {
      register: Good,
      options: {
        reporters: [{
          reporter: require('good-console'),
          events: {
            response: '*',
            log: '*'
          }
        }]
      }
    },
    {
      register: require('hapi-swaggered'),
      options: {
        tags: {
          'foobar/test': 'Example foobar description'
        },
        info: {
          title: 'Example API',
          description: 'Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui',
          version: '1.0'
        }
      }
    },
    {
      register: require('hapi-swaggered-ui'),
      options: {
        title: 'Example API',
        path: '/docs',
        authorization: {
          field: 'apiKey',
          scope: 'query', // header works as well
          // valuePrefix: 'bearer '// prefix incase
          defaultValue: 'demoKey',
          placeholder: 'Enter your apiKey here'
        },
        swaggerOptions: {
          validatorUrl: null
        }
      }
    }],

  {
    select: 'api'
  },

  (err) => {

    if (err) {
      throw err;
    }

    server.route({
      path: '/',
      method: 'GET',
      handler: function (request, reply) {
        reply.redirect('/docs')
      }
    });

    server.start((err) => {
      if (err) {
        throw err;
      }
      server.log('info', 'Server running at: ' + server.info.uri);
    })
    ;

  });

server.route([{
  path: '/foobar/{foo}/{bar}',
  method: 'GET',
  config: {
    tags: ['api'],
    validate: {
      params: {
        foo: Joi.string().required().description('test'),
        bar: Joi.string().required()
      }
    },
    handler: function (request, reply) {
      reply({
        foo: request.params.foo,
        bar: request.params.bar
      });
    }
  }
}, {
  method: 'GET',
  path: '/hello',
  config: {
    tags: ['api'],
    handler: function (request, reply) {
      reply.file('./public/hello.html');
    }
  }
}]);