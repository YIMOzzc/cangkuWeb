/**登陆成功之后的页面路由 */
var express = require('express'),
    router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017';

/* 登陆之后的页面加载或刷新 */
router.get('/', function(req, res, next) {
    console.log("ok:1");
    var user = req.session.user;
    res.render('main', { "user": user });
});

//货物入库操作
router.post('/goodsIn', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true }, function(err, client) {
        var db = client.db('goods'); //选择数据库;
        var goods = db.collection('goodsmsg'); //选择集合;
        goods.insert(req.body);
        res.send({
            msg: "入库成功!",
            flag: 1
        });
    });
});

router.post('/goodsSearch', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true }, function(err, client) {
        var db = client.db('goods'); //选择数据库;
        var goods = db.collection('goodsmsg'); //选择集合;
        var k = goods.find().toArray();
        console.log(k);
        k.then(function(data) {
            console.log(data);
            res.send({
                list: data,
            });
        });
    });
});
/**
 * 退出接口
 */
// router.get('/loginout', (req, res, next) => {
//     req.session.user = null;
//     req.session.admin = null;
//     res.redirect('/admin');
// });

// /**
//  * 获取用户列表
//  */
// router.get('/getUsers', function(req, res, next) {
//     var sql = `select * from user`;
//     if (req.session.admin) {
//         mysql.getConnection(function(err, connection) {
//             if (err) console.log(err);
//             connection.query(sql, function(err, result) {
//                 if (err) console.log(err);
//                 connection.release();
//                 res.send({ 'users': result });
//             });
//         });
//     } else {
//         res.send({ 'msg': '权限不够' });
//     }
// });

// /**
//  * 通过id查询用户，渲染用户设置页面
//  */
// router.get('/searchUserById', function(req, res, next) {
//     var sql = `select * from user where user_id = ${req.query.id}`;
//     if (req.session.admin) {
//         mysql.getConnection(function(err, connection) {
//             if (err) console.log(err);
//             connection.query(sql, function(err, result) {
//                 if (err) console.log(err);
//                 connection.release();
//                 res.render('admin/userMore', { 'row': result[0] });
//             });
//         });
//     } else {
//         res.send({ 'msg': '权限不够' });
//     }
// });
module.exports = router;