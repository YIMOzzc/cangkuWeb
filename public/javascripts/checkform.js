(function(window, jQuery) {
    /**注册新用户页面的表单验证 */
    var password;
    $('#password').on('keyup', function() {
        password = $(this).val();
    })
    var reg = {
        user: [/^\w{6,16}$/, '*请使用数字字母下划线，长度6-16位'],
        pwd: [/^.{8,16}$/, '*密码长度为8-16位'],
        phone: [/^[1][3,4,5,7,8]\d{9}$/, '*请输入正确的手机号'],
        qq: [/^[1-9]\d{4,9}$/, '*请输入正确的qq号'],
        email: [/^[a-zA-Z0-9_-]{1,}@[a-zA-Z0-9_-]{1,}\.[a-zA-Z0-9_-]{1,}$/, '*请输入正确的邮箱'],
        dbpwd: '*两次输入的密码不一致'
    };
    var span = $('<span></span>');
    $('#dbpwd').parent().append(span);
    $('#dbpwd,#password').on('keyup', function() {
        if ($('#dbpwd').val() === password) {
            span.css({
                'color': 'green',
                'font-size': '16px',
                'font-weight': '900'
            }).html('&nbsp;&nbsp;&radic;').attr('data-check-value', 'true');
        } else {
            span.css({
                'color': 'red',
                'font-size': '16px',
                'font-weight': '400'
            }).html(reg.dbpwd).attr('data-check-value', 'false');
        }
        if (!$('#dbpwd').val()) {
            span.html('');
        }
    });
    $('input[data-type]:not(input[data-type="dbpwd"])').each(function(i, elm) {
        var span = $('<span></span>');
        var check;
        $(elm).parent().append(span);
        switch (elm.dataset.type) {
            case 'user':
                check = reg.user;
                break;
            case 'pwd':
                check = reg.pwd;
                break;
            case 'phone':
                check = reg.phone;
                break;
            case 'qq':
                check = reg.qq;
                break;
            case 'email':
                check = reg.email;
                break;
            case 'dbpwd':
                check = reg.dbpwd;
                break;

        }
        $(elm).on('keyup', function() {
            // console.log($(this).val());
            if (check[0].test($(this).val())) {
                span.css({
                    'color': 'green',
                    'font-size': '16px',
                    'font-weight': '900'
                }).html('&nbsp;&nbsp;&radic;').attr('data-check-value', 'true');
            } else {

                span.css({
                    'color': 'red',
                    'font-size': '16px',
                    'font-weight': '400'
                }).html(check[1]).attr('data-check-value', 'false');
            }
            if (!$(this).val()) {
                span.html('');
            }
        });
    });
})(window, jQuery);