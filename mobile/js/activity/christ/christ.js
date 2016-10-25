/**
 * Created by zhaojing on 2014/10/14.
 */
Zepto(function($){
//    与一些组件相关的js
    function MyInit(){
        this.init();
    }
    MyInit.prototype={
        constructor:MyInit,
        //   站内信和购物车数量,登录状态
        logoAndLogin:function(){
            DHM.Init.logoSummary();
            DHM.Init.loginState();
        },
        countdown:function(){
            var time=new Date($("#J_countDown").data("countdown")).getTime();
            DHM.Countdown({
                id:"#J_countDown"
                ,format:"hms"
                ,endTime:time
            });
        },
        init:function(){
            var self=this;
            self.countdown();
            self.logoAndLogin();
        }
    };
    new MyInit();
});