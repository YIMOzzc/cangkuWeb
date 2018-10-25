;
(function(window, $) {
    var indexHtml = "http://localhost:3000/";
    //光标离开用户名输入框时进行验证

    $('input[data-type="user"]').on('blur', function() {
        var _this = $(this);
        if (_this.next('span').attr('data-check-value') == 'true') {
            $.ajax({
                type: "post",
                url: "/users/hasUser",
                data: { 'user_name': _this.val() },
                dataType: "json",
                success: function(response) {
                    if (response.has == 1) {
                        _this.next('span').css({
                            'color': 'green',
                            'font-size': '16px',
                            'font-weight': '900'
                        }).html('&nbsp;&nbsp;&radic;用户名可用').attr('data-check-value', 'true');
                        console.log(response.msg);
                    } else {
                        _this.next('span').css({
                            'color': 'red',
                            'font-size': '16px',
                            'font-weight': '900'
                        }).html('*用户名已存在').attr('data-check-value', 'true');
                        console.log(response.msg);
                    }
                }
            });
        }

    });

    //点击注册发送表单数据
    $('.btn1').on('click', function() {
        if ($('span[data-check-value="true"]').length >= 6) {
            var data = {
                user_name: $('#username').val(),
                user_pwd: $('#password').val(),
                user_phone: $('#phone').val(),
                user_qq: $('#qq').val(),
                user_email: $('#email').val(),
                // user_address: $('#add').val(),
                // user_sex: $('input[type="radio"]:checked').val()
            };
            $.ajax({
                type: "post",
                url: "/users/regaaa",
                data: data,
                dataType: "json",
                success: function(response) {
                    // alert('注册成功', response);
                    window.location.href = indexHtml + 'signin';
                }

            });
        } else {
            alert('请填写正确的注册信息');
        }
    });

})(window, jQuery);