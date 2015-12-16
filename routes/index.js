var crypto = require('crypto'),
    User = require('../models/user.js');
    Post = require('../models/Post.js');

var express = require('express');
var router = express.Router();

/* GET home page. */
function route(app) {
    app.get('/', function(req, res) {
        // console.log(req.hostname);
        res.render('index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.get('/reg',checkNotLogin);
    app.get('/reg', function(req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/reg', function(req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg'); //返回注册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5');
        password = md5.update(req.body.password).digest('hex');
        var newUser = {
            name: name,
            password: password,
            email: req.body.email
        };
        //检查用户名是否已经存在 
        User.get(newUser.name, function(err, user) {
            // console.log(user);
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg'); //返回注册页
            }
            //如果不存在则新增用户
            User.save(newUser,function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg'); //注册失败返回主册页
                }
                req.session.user = user; //用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/'); //注册成功后返回主页
            });
        });
    });
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    });

    app.post('/login', function(req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.get(req.body.name, function(err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login'); //用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login'); //密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/'); //登陆成功后跳转到主页
        });
    });
    
    app.get('/post',checkLogin);
    app.get('/post', function(req, res) {
        var post = [];
        Post.get(null,function(err,post){
            if(!err){
                post =post;
            }
        });
        res.render('post', {
            title: '发表',
            user: req.session.user,
            post:post,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', function(req, res) {
        var userName = req.session.name;
        var title = req.body.title;
        var post = req.body.post;
        var time = new Date();
/*        Post.get(title,function(err,article){
            if(article){
                req.flash("error","文章题目重复，需要更换题目");
                return 
            }
        });
*/      var article = {
            userName:userName,
            title :title,
            post:post,
            time : time
        };
        Post.save(article,function(err,res){
            if(err){
                req.flash("error","发布失败");
                return res.redirect("/post");
            }
            req.flash("success","发布成功");
            res.redirect("/");
        });
    });
    app.get('/logout', function(req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });


    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash("error", "未登录");
            res.redirect("/login");
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        // console.log(req.session.user);
        if (req.session.user) {
            req.flash("error", "已登录");
            res.redirect("back");
        }
        next();
    }
}
module.exports = route;
