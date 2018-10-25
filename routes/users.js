/**注册新用户页面路由 */
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017';

router.get('/', function(req, res, next) {
    res.render('user');
});


//用户注册数据库查重
router.post('/hasUser', function(req, res, next) {
    var data = req.body;
    MongoClient.connect(DB_CONN_STR, function(err, client) {
        if (err) console.log(err);
        var db = client.db('user'); //选择数据库;
        var usermsg = db.collection('usermsg'); //选择集合;
        var k = usermsg.find({ 'user_name': req.body.user_name }).toArray();
        k.then(function(data) {
            !data.length ? res.send({ has: true, msg: '用户名可用' }) : res.send({ has: false, msg: '用户名已存在' });
        });
    });
});

//返回注册结果
router.post('/regaaa', function(req, res, next) {
    var time = new Date().getTime();
    var ip = (req.connection.remoteAddress || req.socket.remoteAddress).split(':');
    MongoClient.connect(DB_CONN_STR, function(err, client) {
        if (err) console.log(err);
        var db = client.db('user'); //选择数据库;
        var usermsg = db.collection('usermsg'); //选择集合;
        usermsg.insert({ "user_name": req.body.user_name, "user_pwd": req.body.user_pwd, "user_phone": req.body.user_phone, "user_email": req.body.user_email, "user_qq": req.body.user_qq, "user_last_login_time": time, "user_register_time": time, "user_register_ip": ip[3] || "0.0.0.0", "user_last_login_ip": ip[3] || "0.0.0.0", "user_rank": "employee" });
        req.session.user = req.body.user_name;
        res.send({
            'status': 200,
            'msg': '注册成功',
            'session': 1
        });
    });
});

//人员管理 信息表查询
router.post('/rygl', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, function(err, client) {
        if (err) console.log(err);
        var db = client.db('user'); //选择数据库;
        var usermsg = db.collection('usermsg'); //选择集合;
        var k = usermsg.find().toArray();
        k.then(function(data) {
            data.length ? res.send({ msg: '获取人员列表成功', dataList: data }) : res.send({ msg: '获取人员列表失败' });
        });
    });
});

module.exports = router;