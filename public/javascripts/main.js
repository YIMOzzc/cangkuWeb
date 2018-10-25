;

(function(window, jQuery) {
    var rank;
    var goodsEmp;
    var indexHtml = "http://localhost:3000/";
    //退出的ajax请求
    $('#tuichu').on('click', function() {
        $.ajax({
            type: "get",
            url: "/",
        });
    });

    //请求用户等级
    $.ajax({
        type: "get",
        url: "/tc_dl/userrank",
        dataType: 'json',
        success: function(response) {
            rank = response.rank;
        }
    });

    //操作时判断用户登录是否超时
    $('body').on('click', function() {
        $.ajax({
            type: "get",
            url: "/tc_dl/timeover",
            dataType: "json",
            success: function(response) {
                if (response.user) {
                    // console.log(response.user);
                    goodsEmp = response.user;
                } else {
                    var r = confirm("登陆超时，请重新登陆！");
                    if (r) {
                        window.location.href = indexHtml + 'tc_dl';
                    } else {
                        window.location.href = indexHtml;
                    }
                }
            }
        });
    });

    //操作

    //点击入库
    $('.goodsIn').on('click', function() {
        console.log("入库操作");
        $(this).addClass('li-now');
        $(this).siblings().removeClass('li-now');
        $('.cznr .gdin').addClass('cznr_block');
        $('.cznr .gdin').siblings().removeClass('cznr_block');
    });

    //点击出库
    $('.goodsOut').on('click', function() {
        console.log("出库操作");
        $(this).addClass('li-now');
        $(this).siblings().removeClass('li-now');
        $('.cznr .gdout').addClass('cznr_block');
        $('.cznr .gdout').siblings().removeClass('cznr_block');
    });

    //点击查询进出货单
    $('.goodsSearch').on('click', function() {
        var trone = $('.gds table tr:first');
        $('.gds table').html(trone);
        console.log("查询操作");
        $(this).addClass('li-now');
        $(this).siblings().removeClass('li-now');
        $('.cznr .gds').addClass('cznr_block');
        $('.cznr .gds').siblings().removeClass('cznr_block');

        //查询进出货单的Ajax操作
        $.ajax({
            type: "post",
            url: "/signin/goodsSearch",
            dataType: "json",
            success: function(response) {
                // console.log(response.list);
                if (response.list.length) {
                    console.log('ok', response.list.length);
                    for (var i = 0; i < response.list.length; i++) {
                        var tr = $('<tr><td class="hidden-xs hidden-sm">' + response.list[i].goodsNum + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsType + '</td>' + '<td>' + response.list[i].goodsName + '</td>' + '<td>' + response.list[i].goodsMany + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsInFrom + '</td>' + '<td>' + response.list[i].goodsInTime + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsInEmployee + '</td>' + '<td>' + response.list[i].goodsOutTime + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsOutEmployee + '</td></tr>');
                        $('.gds table').append(tr);
                    }
                } else {
                    $('.gds').html("emmm,现在还没有进出货单啊，查什么。 0.0");
                }
            }
        });
    });
    $('.goodsDelete').on('click', function() {
        if (rank == "employee") {
            alert("权限不足！");
        } else {
            console.log("删除操作");
            $(this).addClass('li-now');
            $(this).siblings().removeClass('li-now');
            $('.cznr .gdd').addClass('cznr_block');
            $('.cznr .gdd').siblings().removeClass('cznr_block');
        }

    });
    $('.czuser').on('click', function() {
        if (rank != "boss") {
            alert("权限不足");
        } else {
            console.log("人员管理");
            $(this).addClass('li-now');
            $(this).siblings().removeClass('li-now');
            $('.cznr .gdus').addClass('cznr_block');
            $('.cznr .gdus').siblings().removeClass('cznr_block');

            //从ajax获取人员列表
            $.ajax({
                type: "post",
                url: "/users/rygl",
                dataType: "json",
                success: function(response) {
                    console.log(response.msg);
                    console.log(response.dataList);
                    if (response.dataList.length) {
                        console.log('ok', response.dataList.length);
                        for (var i = 0; i < response.dataList.length; i++) {
                            var tr = $('<tr><td class="hidden-xs hidden-sm">' + response.list[i].goodsNum + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsType + '</td>' + '<td>' + response.list[i].goodsName + '</td>' + '<td>' + response.list[i].goodsMany + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsInFrom + '</td>' + '<td>' + response.list[i].goodsInTime + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsInEmployee + '</td>' + '<td>' + response.list[i].goodsOutTime + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsOutEmployee + '</td></tr>');
                            $('.gds table').append(tr);
                        }
                    } else {
                        $('.gds').html("emmm,员工信息都不见了，查什么。 0.0");
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }

    });


    //入库操作的Ajax
    $('.surein').on('click', function() {
        var inTime = new Date().toLocaleString();
        var datas = {
            goodsNum: $('#gdNum').val(),
            goodsType: $('#gdType').val(),
            goodsName: $('#gdName').val(),
            goodsMany: $('#gdMany').val(),
            goodsInFrom: $('#gdInFrom').val(),
            goodsInTime: inTime,
            goodsInEmployee: goodsEmp,
            goodsOutTime: "未出库",
            goodsOutEmployee: "未出库",
        }
        $.ajax({
            type: "post",
            url: "signin/goodsIn",
            data: datas,
            dataType: "json",
            success: function(response) {
                console.log(response.msg);
                if (response.flag) {
                    alert("入库成功！请点击 货物进出货单 查看详情");
                } else {
                    alert("不好意思，后台出问题啦！0.0");
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });



})(window, jQuery);