var config = require("../config.json");

var MongoClient = require('mongodb').MongoClient;
var poolModule = require('generic-pool');

var options = config.mongo || {};

var host = options.host || "localhost",
    port = options.port || 27017,
    db = options.db || "blog",
    max = options.max || 10,
    min = options.min || 1,
    timeout = options.timeout || 3600000,
    log = options.log || false,
    mongoUrl = "";

if (options.user && options.pass) {
    mongoUrl = "mongodb://" + options.user + ":" + options.pass + "@" + host + ":" + port;
} else {

    mongoUrl = "mongodb://" + host + ":" + port;
}
/*var mongoPool = poolMoudle.Pool({
    name: "mongodb",
    create: function(callback) {
       /* MongoClient.connect(mongoUrl, {
            server: {
                poolSize: 1
            },
            native_parser: true,
        }, callback);
         // var mongodb = Db();
            var mongodb = require("../models/db");
            mongodb.open(function (err, db) {
              callback(err, db);
            });
    },
    destroy: function(mongodb) {
        mongodb.close();
    },
    max: max,
    min: min,
    indleTimeoutMillis: timeout,
    log: log
});
module.exports = mongoPool;*/

var mongoPool = poolModule.Pool({
  name     : 'mongodb',
  create   : function (callback) {
    MongoClient.connect(mongoUrl, {
      server: {poolSize: 1},
      native_parser: true
    }, callback);
  },
  destroy  : function(client) {client.close();},
  max      : max,
  min      : min, 
  idleTimeoutMillis : timeout,
  log : log 
});

module.exports = mongoPool;