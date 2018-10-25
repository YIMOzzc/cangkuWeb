;
/**登陆页面的跳转和Ajax操作 */
(function(window, $) {
    var indexHtml = "http://localhost:3000/";
    $(function() {
        $('.register').on('click', function() {
            window.location.href += 'users';
        });
        $('#signindlbtn').on('click', function() {
            var data = {};
            data.user_name = $('#username').val();
            data.user_pwd = $('#password').val();
            $.ajax({
                type: "post",
                url: "/signin",
                data: data,
                dataType: "json",
                success: function(response) {

                    if (response.session === 0) {
                        alert('用户名或密码错误');
                    } else {
                        // alert('登陆成功');
                        window.location.href = indexHtml + 'signin';
                        console.log(response.session);
                    }
                    console.log(response);
                }
            });

        });
    });

})(window, jQuery);