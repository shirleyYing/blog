/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-12-16 16:27:21
 * @version $Id$
 */
// var mongoPool = require("../lib/mongopool");

exports.save = function(doc, callback) {
    mongoPool.acquire(function(err, client) {
        if (err) {
            return callback(exception(exception.MongoPoolError, err.message));
        }
        client.db("blog").connection("article").insert(doc, function(err, res) {
            if (err) {
                mongoPool.release(client);
                return callback(exception(exception.MongoPoolError, err.message));
            }
            mongoPool.release(client);
            callback(null, res);
        });
    });
};
exports.get = function(query, callback) {
    mongoPool.acquire(function(err, client) {
        if (err) {
            return callback(exception(exception.MongoPoolError, err.message));
        }
        client.db("blog").connection("article").findOne(query,{"_id":0},function(err,res){
            if(err){
                mongoPool.release(client);
                return callback(exception(exception.MongoPoolError, err.message));                
            }
            mongoPool.release(client);
            callback(null, res);
        });
    });
};
    // module.exports = Post;
