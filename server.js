'use strict';

const Hapi = require('hapi');
const Good = require('good');
const engine = require('hapi-react')({beautify: true});
const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 3000,
  labels: ['api', 'test']
});

server.register([
    require('inert'),
    require("vision"),
    require("./routes"),
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

    server.views({
      defaultExtension: 'jsx',
      engines: {
        jsx: engine, // support for .jsx files
        js: engine // support for .js
      },
      relativeTo: __dirname,
      path: 'views'
    });

    server.start((err) => {
      if (err) {
        throw err;
      }
      server.log('info', 'Server running at: ' + server.info.uri);
    })
    ;

  });
