/**
 * Created by zhaojing1 on 2014/11/7.
 */
Zepto(function($){
    function FlashSale(){
        this.opt={
            titId:".j-fs-tit"
        };
        this.init();
    }
    FlashSale.prototype.mToggle=function(){
        var self=this;
        var $tits=$(self.opt.titId);
        $tits.click(function(){
            var $con=$(this).next();
            var ifShow=$con.css("display");
            $tits.next().hide();
            if(ifShow=="block") return;
            $con.show();
        });
    };
    FlashSale.prototype.getServerTime=function(){
        var self=this;
        $.getJSON("http://m.dhgate.com/buyertime.do?callback=?", function(data){
            var time=data.time*1;
            self.oprTime(time);
        });
    };
    FlashSale.prototype.oprTime=function(t){
        var hour=new Date(t).getHours();
        if(hour>0&&hour<4){
            var $btn=$(".j-fs-main").find(".fs-btn");
            $btn.removeClass("org").text("coming soon");
            $(".j-time-2").find(".fs-btn").removeAttr("href");
            $(".j-time-3").find(".fs-btn").removeAttr("href");
            $(".j-time-4").find(".fs-btn").removeAttr("href");
            $(".j-time-5").find(".fs-btn").removeAttr("href");
            $(".j-time-6").find(".fs-btn").removeAttr("href");
            $(".j-time-1").find(".fs-btn").addClass("org").text("buy now");
        }
        if(hour>4&&hour<8){
            $(".j-fs-main").find(".fs-btn").removeClass("org").text("coming soon");
            $(".j-time-2").find(".fs-btn").addClass("org").text("buy now");
            $(".j-time-1").find(".fs-btn").removeAttr("href").text("sold out");
            $(".j-time-3").find(".fs-btn").removeAttr("href");
            $(".j-time-4").find(".fs-btn").removeAttr("href");
            $(".j-time-5").find(".fs-btn").removeAttr("href");
            $(".j-time-6").find(".fs-btn").removeAttr("href");
        }
        if(hour>8&&hour<12){
            $(".j-fs-main").find(".fs-btn").removeClass("org").text("coming soon");
            $(".j-time-3").find(".fs-btn").addClass("org").text("buy now");
            $(".j-time-1").find(".fs-btn").text("sold out").removeAttr("href");
            $(".j-time-2").find(".fs-btn").text("sold out").removeAttr("href");
            $(".j-time-4").find(".fs-btn").removeAttr("href");
            $(".j-time-5").find(".fs-btn").removeAttr("href");
            $(".j-time-6").find(".fs-btn").removeAttr("href");
        }
        if(hour>12&&hour<16){
            $(".j-fs-main").find(".fs-btn").removeClass("org").text("sold out");
            $(".j-time-4").find(".fs-btn").addClass("org").text("buy now");
            $(".j-time-5").find(".fs-btn").text("coming soon").removeAttr("href");
            $(".j-time-6").find(".fs-btn").text("coming soon").removeAttr("href");
            $(".j-time-2").find(".fs-btn").removeAttr("href");
            $(".j-time-3").find(".fs-btn").removeAttr("href");
            $(".j-time-1").find(".fs-btn").removeAttr("href");
        }
        if(hour>16&&hour<20){
            $(".j-fs-main").find(".fs-btn").removeClass("org").text("sold out");
            $(".j-time-5").find(".fs-btn").addClass("org").text("buy now");
            $(".j-time-6").find(".fs-btn").text("coming soon").removeAttr("href");
            $(".j-time-2").find(".fs-btn").removeAttr("href");
            $(".j-time-3").find(".fs-btn").removeAttr("href");
            $(".j-time-1").find(".fs-btn").removeAttr("href");
            $(".j-time-4").find(".fs-btn").removeAttr("href");
        }
        if(hour>20&&hour<=23){
            $(".j-fs-main").find(".fs-btn").removeClass("org").text("sold out");
            $(".j-time-6").find(".fs-btn").addClass("org").text("buy now");
            $(".j-time-2").find(".fs-btn").removeAttr("href");
            $(".j-time-3").find(".fs-btn").removeAttr("href");
            $(".j-time-1").find(".fs-btn").removeAttr("href");
            $(".j-time-4").find(".fs-btn").removeAttr("href");
            $(".j-time-5").find(".fs-btn").removeAttr("href");
        }
    };
    FlashSale.prototype.init=function(){
        this.mToggle();
        this.getServerTime();
    };
    new FlashSale();
});