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
                    rank = response.rank;
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
        var trone = $('.gdout table tr:first');
        $('.gdout table').html(trone);

        console.log("出库操作");
        $(this).addClass('li-now');
        $(this).siblings().removeClass('li-now');
        $('.cznr .gdout').addClass('cznr_block');
        $('.cznr .gdout').siblings().removeClass('cznr_block');

        //获取尚未出库的货物信息
        $.ajax({
            type: "post",
            url: "/signin/goodsNeedOut",
            dataType: "json",
            success: function(response) {
                // console.log(response.list);
                if (response.list.length) {
                    console.log('ok', response.list.length);
                    for (var i = 0; i < response.list.length; i++) {
                        var tr = $('<tr class="tr' + i + '"><td class="hidden-xs hidden-sm">' + response.list[i].goodsNum + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsType + '</td>' + '<td>' + response.list[i].goodsName + '</td>' + '<td>' + response.list[i].goodsMany + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsInFrom + '</td>' + '<td>' + response.list[i].goodsInTime + '</td>' + '<td class="bosscz"> <span class="spChange">出库</span></td></tr>');
                        $('.gdout table').append(tr);
                    }

                    //点击确定出库操作
                    $('.spChange').on('click', function() {
                        var sure = confirm("确定将该货物出库吗？");
                        if (sure) {
                            var hang = $(this).parent().parent();
                            var oldId = hang.attr("class").split('r')[1];
                            var newData = {};
                            var outTime = new Date().toLocaleString();
                            var outEmployee = goodsEmp;
                            newData.id = response.list[oldId]._id;
                            newData.outTime = outTime;
                            newData.outEmployee = outEmployee;
                            // console.log(response.list[oldId]._id);
                            // console.log(newData);
                            $.ajax({
                                type: "post",
                                url: "/signin/goodsSureOut",
                                data: newData,
                                dataType: "json",
                                success: function(response) {
                                    alert(response.msg);
                                    hang.html("");
                                },
                                error: function(err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                } else {
                    $('.gdout').html("库存为0，货物已经全部出库了");
                }
            }
        });
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
                        var tr = $('<tr class="tr' + i + '"><td class="hidden-xs hidden-sm">' + response.list[i].goodsNum + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsType + '</td>' + '<td>' + response.list[i].goodsName + '</td>' + '<td>' + response.list[i].goodsMany + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsInFrom + '</td>' + '<td>' + response.list[i].goodsInTime + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsInEmployee + '</td>' + '<td>' + response.list[i].goodsOutTime + '</td>' + '<td class="hidden-xs hidden-sm">' + response.list[i].goodsOutEmployee + '</td></tr>');
                        $('.gds table').append(tr);
                    }
                } else {
                    $('.gds').html("emmm,现在还没有进出货单啊，查什么。 0.0");
                }
            }
        });
    });

    // 更改or删除货单  需要管理层以上的权限
    $('.goodsDelete').on('click', function() {
        if (rank == "employee") {
            alert("权限不足！请使用管理层及以上权限的账号操作！");
        } else {
            console.log(rank);
            var trone = $('.gdd table tr:first');
            $('.gdd table').html(trone);
            console.log("货单管理");
            $(this).addClass('li-now');
            $(this).siblings().removeClass('li-now');
            $('.cznr .gdd').addClass('cznr_block');
            $('.cznr .gdd').siblings().removeClass('cznr_block');
            $.ajax({
                type: "post",
                url: "/signin/goodsSearch",
                dataType: "json",
                success: function(response) {
                    // console.log(response.list);
                    if (response.list.length) {
                        console.log('ok', response.list.length);
                        for (var i = 0; i < response.list.length; i++) {
                            var tr = $('<tr class="tr' + i + '"><td class="hidden-xs hidden-sm"><input type="text" value="' + response.list[i].goodsNum + '">' + '</td>' + '<td class="hidden-xs hidden-sm"><input type="text" value="' + response.list[i].goodsType + '">' + '</td>' + '<td><input type="text" value="' + response.list[i].goodsName + '">' + '</td>' + '<td><input type="text" value="' + response.list[i].goodsMany + '">' + '</td>' + '<td><input type="text" value="' + response.list[i].goodsInFrom + '">' + '</td>' + '<td class="hidden-xs hidden-sm"><input type="text" value="' + response.list[i].goodsInEmployee + '">' + '</td>' + '<td class="hidden-xs hidden-sm"><input type="text" value="' + response.list[i].goodsOutEmployee + '">' + '</td><td class="bosscz"> <span class="spChange">修改</span> <span class="spDelete">删除</span></td></tr>');
                            $('.gdd table').append(tr);
                        }

                        //更改货单的操作
                        $('.spChange').on('click', function() {
                            var sure = confirm("确定更改货单吗？");
                            if (sure) {
                                var sib = $(this).parent().siblings();
                                var oldId = $(this).parent().parent().attr("class").split('r')[1];
                                var newData = {}
                                for (var i = 0; i < sib.length; i++) {
                                    // console.log(sib[i].children[0].value);
                                    newData[i] = sib[i].children[0].value;
                                }
                                newData.id = response.list[oldId]._id;
                                console.log(response.list[oldId]._id);
                                // console.log(newData);
                                $.ajax({
                                    type: "post",
                                    url: "/signin/goods-change",
                                    data: newData,
                                    dataType: "json",
                                    success: function(response) {
                                        alert("修改货单信息成功");
                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                });
                            }
                        });

                        //删除货单操作
                        $('.spDelete').on('click', function() {
                            var sure = confirm("确定删除这条货单吗？");
                            // console.log(newData);
                            // console.log(sure);
                            if (sure) {
                                var oldId = $(this).parent().parent().attr("class").split('r')[1];
                                var newData = {}
                                newData.id = response.list[oldId]._id;
                                $(this).parent().parent().html("");
                                $.ajax({
                                    type: "post",
                                    url: "/signin/goods-delete",
                                    data: newData,
                                    dataType: "json",
                                    success: function(response) {
                                        alert(response.dmsg);
                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                });
                            }
                        });
                    } else {
                        $('.gds').html("emmm,现在还没有货单啊，管理什么。 0.0");
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }

    });

    //人员管理的全部操作 需要最高权限boss
    $('.czuser').on('click', function() {
        if (rank != "boss") {
            alert("权限不足,请用boss权限的账号操作！");
        } else {
            var trone = $('.gdus table tr:first');
            $('.gdus table').html(trone);
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
                            console.log(111);
                            var tr = $('<tr class="tr' + i + '"><td><input type="text" value="' + response.dataList[i].user_name + '">' + '</td>' + '<td><input type="text" value="' + response.dataList[i].user_phone + '">' + '</td>' + '<td class="hidden-xs hidden-sm"><input type="text" value="' + response.dataList[i].user_email + '">' + '</td>' + '<td class="hidden-xs hidden-sm"><input type="text" value="' + response.dataList[i].user_qq + '">' + '</td>' + '<td><input type="text" value="' + response.dataList[i].user_pwd + '">' + '</td>' + '<td class="hidden-xs hidden-sm"><input type="text" value="' + response.dataList[i].user_register_time + '">' + '</td>' + '<td><input type="text" value="' + response.dataList[i].user_rank + '">' + '</td>' + '<td class="bosscz"> <span class="spChange">修改</span> <span class="spDelete">删除</span></td></tr>');
                            $('.gdus table').append(tr);
                        }
                        //人员信息修改操作的Ajax
                        $('.spChange').on('click', function() {

                            var sure = confirm("确定更改吗？");
                            if (sure) {
                                var sib = $(this).parent().siblings();
                                var oldId = $(this).parent().parent().attr("class").split('r')[1];
                                var newData = {}
                                for (var i = 0; i < sib.length; i++) {
                                    // console.log(sib[i].children[0].value);
                                    newData[i] = sib[i].children[0].value;
                                }
                                newData.id = response.dataList[oldId]._id;
                                // console.log(newData);
                                $.ajax({
                                    type: "post",
                                    url: "/users/rygl-change",
                                    data: newData,
                                    dataType: "json",
                                    success: function(response) {
                                        alert("修改信息成功");
                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                });
                            }

                        });
                        //人员信息删除操作的Ajax
                        $('.spDelete').on('click', function() {

                            var oldId = $(this).parent().parent().attr("class").split('r')[1];
                            var newData = {}
                            newData.id = response.dataList[oldId]._id;
                            // console.log(newData);
                            var sure = confirm("确定删除这名员工的信息吗？");
                            // console.log(sure);
                            if (sure) {
                                $(this).parent().parent().html("");
                                $.ajax({
                                    type: "post",
                                    url: "/users/rygl-delete",
                                    data: newData,
                                    dataType: "json",
                                    success: function(response) {
                                        alert(response.dmsg);
                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                });
                            }
                        });
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
        if ($('#gdMany').val() && $('#gdName').val() && $('#gdInFrom').val()) {
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
                goodsOutMany: 0,
                goodsFlag: 0
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
        } else {
            alert("请输入必要的货物信息！");
        }

    });


    //页面内的搜索操作

    //出库和查询货单页面搜索
    $('.outScAbs button,.seaScAbs button').on('click', function() {
        var butsib = $(this).siblings().val();
        var reg = new RegExp(butsib, "ig");
        console.log(butsib);
        if (butsib) {
            var all = $(this).parent().parent().find('tr[class^="tr"]');

            all.each(function() {
                var pand = reg.test($(this).text());
                if (!pand) {
                    $(this).css("display", "none");
                } else {
                    $(this).css("display", "");
                }
            });

        } else {
            alert("请输入搜索内容！");
        }
    });


    //货单管理和人员管理页面搜索
    $('.delScAbs button,.useScAbs button').on('click', function() {
        var butsib = $(this).siblings().val();
        var reg = new RegExp(butsib, "ig");
        // console.log(butsib);
        if (butsib) {
            var all = $(this).parent().parent().find('tr[class^="tr"]');
            all.each(function() {
                // console.log($(this).children());
                var pand = 0;
                $(this).children().each(function() {
                    var duan = reg.test($(this).children().val());
                    if (duan) {
                        return pand = 1;
                    }
                });
                if (pand) {
                    $(this).css("display", "");
                } else {
                    $(this).css("display", "none");
                }
            });

        } else {
            alert("请输入搜索内容！");
        }
    });
})(window, jQuery);