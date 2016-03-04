const Joi = require("joi");
const mongoose = require('mongoose');
const db = mongoose.createConnection('localhost', 'test');

db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
  console.log("Mongo connected!");
});

var PersonSchema = new mongoose.Schema({
  name: String,
  hobby: String
});

var PersonModel = db.model('Person', PersonSchema);

const RegisterRoutes = (server, options, next) => {
  server.route({
    path: "/person",
    method: "POST",
    config: {
      tags: ['api'],
      validate: {
        payload: {
          name: Joi.string().required().description('test'),
          hobby: Joi.string().required()
        }
      },
      handler: function (request, reply) {
        reply(new PersonModel(request.payload).save());
      }
    }
  });

  server.route({
    path: "/persons",
    method: "GET",
    config: {
      tags: ['api'],
      handler: function (request, reply) {
        PersonModel.find((error, persons) => {
          reply(persons);
        });
      }
    }
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
    path: '/foo/{foo}/{bar}',
    method: 'PUT',
    config: {
      tags: ['api', "test"],
      validate: {
        params: {
          foo: Joi.string().required().description('test'),
          bar: Joi.string().required()
        },
        payload: {
          a: Joi.string().required().description('test'),
          b: Joi.string().required()
        }
      },
      handler: function (request, reply) {
        reply(Object.assign({}, request.params, request.payload));
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
  }, {
    method: 'GET',
    path: "/react/demo",
    config: {
      tags: ['api'],
      handler: function (request, reply) {
        reply.view('index', {
          name: 'Test xxx'
        });
      }
    }
  }]);

  next();
};

RegisterRoutes.attributes = {
  name: "RegisterRoutes",
  version: "1.0.0"
};

module.exports = RegisterRoutes;

