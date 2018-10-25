;
/**登陆页面的跳转和Ajax操作 */
(function(window, $) {
    $(function() {
        $('.register').on('click', function() {
            window.location.href += 'users';
        });
        $('.signin').on('click', function() {
            var data = {};
            data.user_name = $('#username').val();
            data.user_pwd = $('#pwd').val();
            $.ajax({
                type: "post",
                url: "signin",
                data: data,
                dataType: "json",
                success: function(response) {

                    if (response.session === 0) {
                        alert('用户名或密码错误');
                    } else {
                        // alert('登陆成功');
                        window.location.href += 'signin';
                        console.log(response.session);
                    }
                    console.log(response);
                }
            });

        });
    });

    var deng_flag = 1;
    $('.btn-deng').on('click', function() {
        $('.bodybox').toggleClass('box-dark');
        deng_flag == 1 ? deng_flag = 0 : deng_flag = 1; //$(this).html('开灯'): $(this).html('关灯');
        if (deng_flag == 0) {
            $(this).html('开灯');
        } else {
            $(this).html('关灯');
        }
    });
})(window, jQuery);