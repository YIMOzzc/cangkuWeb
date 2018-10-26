/**登陆成功之后的页面路由 */
var express = require('express'),
    router = express.Router();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017';

/* 登陆之后的页面加载或刷新 */
router.get('/', function(req, res, next) {
    // console.log("ok:1");
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

//货物出库操作 查询尚未出库的所有货物信息
router.post('/goodsNeedOut', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true }, function(err, client) {
        var db = client.db('goods'); //选择数据库;
        var goods = db.collection('goodsmsg'); //选择集合;
        var k = goods.find({ "goodsFlag": "0" }).toArray();
        // console.log(k);
        k.then(function(data) {
            // console.log(data);
            res.send({
                list: data,
            });
        });
    });
});


router.post('/goodsSureOut', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true }, function(err, client) {
        var db = client.db('goods'); //选择数据库;
        var goods = db.collection('goodsmsg'); //选择集合;
        var objid = mongoose.Types.ObjectId(req.body.id);
        goods.updateOne({ "_id": objid }, { $set: { "goodsOutTime": req.body.outTime, "goodsOutEmployee": req.body.outEmployee, "goodsFlag": "1" } });
        res.send({ "msg": "货物出库成功,请在查询进出货单页查看详情！" });
        // var k = goods.find({ "goodsFlag": "0" }).toArray();
        // // console.log(k);
        // k.then(function(data) {
        //     // console.log(data);
        //     res.send({
        //         list: data,
        //     });
        // });
    });
});


//货物表单查询
router.post('/goodsSearch', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true }, function(err, client) {
        var db = client.db('goods'); //选择数据库;
        var goods = db.collection('goodsmsg'); //选择集合;
        var k = goods.find().toArray();
        // console.log(k);
        k.then(function(data) {
            // console.log(data);
            res.send({
                list: data,
            });
        });
    });
});


//货单管理  货单信息修改
router.post('/goods-change', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true }, function(err, client) {
        if (err) console.log(err);
        var db = client.db('goods'); //选择数据库;
        var usermsg = db.collection('goodsmsg'); //选择集合;
        var objid = mongoose.Types.ObjectId(req.body.id);
        usermsg.updateOne({ "_id": objid }, { $set: { "user_name": req.body[0], "user_phone": req.body[1], "user_email": req.body[2], "user_qq": req.body[3], "user_pwd": req.body[4], "user_rank": req.body[6] } });
        // console.log(req.body.id);
        res.send({ "msg": "ok" });
    });
});

//货单管理  删除货单
router.post('/goods-delete', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true }, function(err, client) {
        if (err) console.log(err);
        var db = client.db('goods'); //选择数据库;
        var usermsg = db.collection('goodsmsg'); //选择集合;
        var objid = mongoose.Types.ObjectId(req.body.id);
        usermsg.remove({ "_id": objid });
        // console.log(req.body.id);
        res.send({ "dmsg": "已经成功删除这条货单！" });
    });
});


module.exports = router;