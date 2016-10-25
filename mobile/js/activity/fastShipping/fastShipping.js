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
    FlashSale.prototype.init=function(){
        this.mToggle();
    };
    new FlashSale();
});