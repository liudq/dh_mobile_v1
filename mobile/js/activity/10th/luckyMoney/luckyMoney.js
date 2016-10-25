/**
 * Created by zhaojing on 2014/7/15.
 */
Zepto(function($){
    function LuckyMoney(opts){
        this.opts=$.extend({
            validateUrl:null
            ,luckyTenthUrl:null
            ,luckyId:null
        },opts);
        this.init();
    }
    LuckyMoney.prototype={
        constructor:LuckyMoney,
        luckyDraw:function(){
            var _self=this;
            var url=_self.opts.validateUrl;
            if(!url) return;
            DHM.Util.request({
                url:url+"&callback=?",
                dataType:'jsonp',
                data:'',
                fn:_self.luckMoneyRes,
                scope:_self
            });
        },
        luckMoneyRes:function(data,scope){
            if(!data) return;
            var $lucky=scope.$lucky,endEvent=DHM.Util.events().end;
            $lucky.delegate($lucky,endEvent,function(){
                switch(data.status){
                    case "0":
                        window.location.href="http://m.dhgate.com/login.do?returnURL=http://m.dhgate.com/luckyMoney.html";
                        break;
                    case "1":
                        DHM.Util.request({
                            url:scope.opts.luckyTenthUrl+"&callback=?",
                            dataType:'jsonp',
                            data:'',
                            fn:scope.luckyResultRes,
                            scope:scope
                        });
                        break;
                    case "2":
                        scope.alreadyFn(scope);
                        break;
                    case "3":
                        console.log("not beginning.");
                        break;
                    case "4":
                        console.log("end");
                        break;
                    default:
                        console.log("no data");
                }
            });
        },
        alreadyFn:function(scope){
            if(!scope.$already){
                var str=['<div class="l-layyerFrame"></div>','<div class="l-layyer">',
                    '<h3>SORRY</h3>',
                    '<p>only one red envelope per customer</p>',
                    '<div class="closeBtn"><a href="javascript:;">Closed</a></div>',
                    '</div>'];
                scope.$already=$(str.join(''));
                $("body").append(scope.$already);
                scope.$already.find("a").delegate("a",DHM.Util.events().end,function(){
                    scope.$already.hide();
                });
            }
            scope.$already.show();
        },
        luckyResultRes:function(data){
            if(data.status=="5"||data.status==5){
                alert("Sorry, the Red Envelope Giveaway has not started yet, or has ended.");
                return;
            }
            var param=[];
            param.push("awardsInfo="+data.awardsInfo);
            param.push("&couponCode="+data.couponCode);
            param.push("&status="+data.status);
            DHM.Cookie.setCookie("luckyMoneyData",param.join(""),{expires:1});
            window.location.href="http://m.dhgate.com/luckyMResult.html";
        },
        luckyResultPage:function(){
            var herf=window.document.location.href.toString();
            if(herf.indexOf("luckyMResult")==-1) return;
            var luckdata=DHM.Cookie.getCookie("luckyMoneyData");
            var obj={};
            if(typeof luckdata == "string"){
                luckdata = luckdata.split("&");
                for(var i in luckdata){
                    var j = luckdata[i].split("=");
                    obj[j[0]] = j[1];
                }
            }
            switch(obj.status){
                case "1":
                    $(".j-wonTips").text("You’ve won a $10 coupon!");
                    $(".j-money").text("$10");
                    $(".j-coupon").text(obj.couponCode);
                    break;
                case "2":
                    $(".j-wonTips").text("You’ve won a $100 coupon!");
                    $(".j-money").text("$100");
                    $(".j-coupon").text(obj.couponCode);
                    break;
                case "3":
                    $(".j-wonTips").text("You’ve won a $1000 coupon!");
                    $(".j-money").text("$1000");
                    $(".j-coupon").text(obj.couponCode);
                    break;
                case "4":
                    $(".j-wonTips").text("You’ve won our grand prize trip to China!");
                    $(".j-money").text("").parent().addClass("big-prize");
                    $(".j-coupon").parent().text("");
                    $(".j-counponTips").text("Please be sure that the contact information you’ve provided in your account is complete and accurate. Our staff will get in touch with you within 10 business days to further discuss details.")
                    break;
                default:
                    console.log("no data");
            }
        },
        init:function(){
            DHM.Init.logoSummary();//头部购物车数量、信件数量
            DHM.Init.loginState();//登录名字信息显示
            this.luckyResultPage();
            this.$lucky=DHM.Util.domExist(this.opts.luckyId);
            if(!this.$lucky) return;
            this.luckyDraw();
        }
    };
    new LuckyMoney({
        validateUrl:"http://www.dhgate.com/lucky/luckydraw.do?act=validateLoginAjax"
        ,luckyTenthUrl:"http://www.dhgate.com/lucky/luckydraw.do?act=luckyTenthAjax"
        ,luckyId:".j-luckClick"
    });
});