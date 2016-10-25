/**
 * Created by liudongqing on 2015/5/21.
 */
Zepto(function($) {
//    与一些组件相关的js
    function MyInit() {
        this.init();
    }
    MyInit.prototype= {
        constructor: MyInit,
        //   站内信和购物车数量,登录状态
        logoAndLogin:function(){
            DHM.Init.logoSummary();
            DHM.Init.loginState();
        },

        init: function () {
            var self = this;
            self.logoAndLogin();
        }
    }
    var myInit = new MyInit();
    var sMore = $(".s_more");
    var dds = $(".ddWords").children();
    for(var i=4;i<=dds.length;i++){
        $(".ddWords a:nth-child("+i+")").hide();
    }
    sMore.click(function(){
        $(this).parent().siblings().children().show();
        $(this).hide();
    });

    $(".viewmorelink").click(function () {
        if ($(this).html() == "View More +") {
            $(this).siblings("span.viewmorelist").show();
            $(this).html("View Less -");
        } else {
            $(this).siblings("span.viewmorelist").hide();
            $(this).html("View More +");
        }
    });
});

