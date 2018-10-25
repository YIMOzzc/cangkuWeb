const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017';

router.get('/', function(req, res, next) {
    req.session.user = null;
    req.session.rank = null;
    res.render('tc');
});

//回应Ajax请求的username信息
router.get('/timeover', function(req, res, next) {
    req.session.user = req.session.user;
    req.session.rank = req.session.rank;
    res.send(req.session);
});


//回应Ajax请求的userrank信息
router.get('/userrank', function(req, res, next) {
    MongoClient.connect(DB_CONN_STR, function(err, client) {
        var db = client.db('user'); //选择数据库;
        var usermsg = db.collection('usermsg'); //选择集合;
        var k = usermsg.find({ "user_name": req.session.user }).toArray();
        k.then(function(data) {
            if (data.length) {
                req.session.rank = data[0].user_rank;
                res.send({
                    'rank': data[0].user_rank,
                });
            } else {
                res.send({
                    'rank': "未能成功获取人员的rank信息",
                });
            }
        })
    });
});



// router.get('/mongo', function(req, res, next) {
//     var email = req.query.email;
//     var pass = req.query.password;
//     MongoClient.connect(DB_CONN_STR, function(err, client) {
//         if (err) console.log(err);
//         var db = client.db('user'); //选择数据库;
//         // console.log(db);
//         var usermsg = db.collection('usermsg'); //选择集合;
//         usermsg.insert({ email: email, password: pass });
//         res.redirect('/');
//     });
// });

module.exports = router;