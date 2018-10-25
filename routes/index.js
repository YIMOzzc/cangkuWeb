/**登陆页面路由 */
var express = require('express'),
    router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017';
// console.log(111);
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/signin', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, function(err, client) {
        var db = client.db('user'); //选择数据库;
        var usermsg = db.collection('usermsg'); //选择集合;
        var k = usermsg.find({ "user_name": req.body.user_name, "user_pwd": req.body.user_pwd }).toArray();
        k.then(function(data) {
            if (data.length) {
                req.session.user = req.body.user_name;
                res.send({
                    'status': 200,
                    'msg': "登陆成功",
                    'session': 1
                });
            } else {
                res.send({
                    'status': 200,
                    'msg': "用户名或密码错误",
                    'session': 0
                });
            }
        })
    });
});
//     // var sql = 'SELECT `user_id`,`user_name`,`user_pwd`,`user_lock` FROM `user`';
//     var ip = (req.connection.remoteAddress || req.socket.remoteAddress).split(':');
//     mysql.getConnection(function(err, connection) {
//         if (err) console.log(err);
//         connection.query(sql, function(err, result) {
//             if (err) console.log(err);
//             new Promise(function(resolve, reject) {
//                 result.forEach(function(elm, index) {
//                     // console.log('111');
//                     if (elm.user_name === req.body.username && elm.user_pwd === req.body.password && elm.user_lock == 0) {
//                         req.session.user = req.body.username;
//                         console.log(req.session.user);
//                         let sql2 = `update user set user_last_login_time=${new Date().getTime()},user_last_login_ip='${ip[3]||"0.0.0.0"}' where user_id=${elm.user_id}`;
//                         connection.query(sql2, function(err, data) {
//                             if (err) console.log('sql2' + err);
//                         });
//                         // console.log('ok');
//                         resolve('登录成功');
//                     }
//                 });
//                 reject('用户名或密码错误');
//             }).then(function(val) {
//                 res.send({
//                     'status': 200,
//                     'msg': val,
//                     'session': 1
//                 });
//             }).catch(function(val) {
//                 res.send({
//                     'status': 200,
//                     'msg': val,
//                     'session': 0
//                 });

//             });
//             connection.release();
//         });
//     });
// });



// router.get('/register', function(req, res, next) {
//     res.render('register');
// });

//用户注册数据库查重
// router.post('/hasUser', function(req, res, next) {
//     var data = req.body;
//     var sql = `select * from user where user_name='${data.user_name}'`;
//     mysql.getConnection(function(err, connection) {
//         if (err) console.log(err);
//         connection.query(sql, function(err, result) {
//             if (err) console.log(err);
//             connection.release();
//             !result.length ? res.send({ has: true, msg: '用户名可用' }) : res.send({ has: false, msg: '用户名已存在' });
//         });
//     });
//     return;
// });

//返回注册结果
// router.post('/regaaa', function(req, res, next) {
//     var data = req.body;
//     var time = new Date().getTime();
//     var ip = (req.connection.remoteAddress || req.socket.remoteAddress).split(':');
//     var sql = `insert into user (user_name,user_pwd,user_phone,user_sex,user_qq,user_email,user_address,user_last_login_time,user_register_time,user_register_ip,user_last_login_ip) values ("${data.user_name}","${data.user_pwd}",${data.user_phone},'null',${data.user_qq},"${data.user_email}",'null',${time},${time},'${ip[3]||"0.0.0.0"}','${ip[3]||"0.0.0.0"}')`;
//     mysql.getConnection(function(err, connection) {
//         if (err) console.log(err);
//         connection.query(sql, function(err, result) {
//             if (err) console.log(err);
//             connection.release();
//             if (result) {
//                 // req.session.user = req.body.user_name;
//                 res.send({
//                     'status': 200,
//                     'msg': '注册成功',
//                     'session': 1
//                 });
//             }

//         });

//     });
// });

module.exports = router