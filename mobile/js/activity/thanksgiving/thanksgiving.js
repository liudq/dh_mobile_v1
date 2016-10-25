/**
 * Created by zhaojing on 2014/10/8.
 */
Zepto(function($){
    function ThanksGiving(){
        this.opt={
            statusUrl:"http://www.dhgate.com/sdCoupon/sdCoupon.do?act=getInitStatus&caller=wap&v="+Math.random(),
            getCouponUrl:"http://www.dhgate.com/sdCoupon/sdCoupon.do?act=getCoupon&caller=wap&v="+Math.random()+"&couponName=",
            getCouponId:".j-getCoupon",
            vipCouponId:".j-vipCoupon",
            couponSumId:".j-coupon-sum",
            hasLogin:false,
            closeDialog:null
        };
        this.init();
    }
    ThanksGiving.prototype.eType=function(){
        var isSupportTouch="ontouchend" in document?true:false;
        if(isSupportTouch){
            return 'touchend';
        }else{
            return 'click';
        }
    };
    ThanksGiving.prototype.request=function(o){
        var obj=$.extend({
            url:window.location.href,
            data:"none",//传给url的参数
            type:"POST",
            dataType:"json",
            fn:null,//成功后的方法
            scope:null,//成功调用方法所用的作用域
            fnParam:null//成功后调用方法所用的参数
        },o);
        if(!obj.url) return;
        $.ajax({
            url:obj.url,
            type:obj.type,
            data:obj.data,
            dataType:obj.dataType,
            success: function(res){
                if(obj.fn){
                    obj.fn(res,obj.scope,obj.fnParam);
                }
            },
            error: function(xhr, ts, et){
                console.log(xhr+"\n"+ts+"\n"+et);
                return false;
            }
        });
    };
    ThanksGiving.prototype.closeDialog=function(){
        var self=this;
        if(!self.opt.closeDialog){
            var html=['<div class="tg-close-layer">',
                '<h3></h3>',
                '<p class="j-cLayer-cont"></p>',
                '<div class="closeBtn"><a href="javascript:;">Closed</a></div>',
            '</div>'];
            var str=$(html.join(""));
            str.appendTo("body");
            str.find(".closeBtn").on(self.eType(),function(e){
                str.hide();
                self.$shadow.hide();
                e.preventDefault();
                e.stopPropagation();
            });
            self.opt.closeDialog=str;
        }
        return self.opt.closeDialog;
    };
    ThanksGiving.prototype.status=function(){
        var self=this;
        self.request({
            url:self.opt.statusUrl+"&callback=?",
            dataType:'jsonp',
            fn:self.statusRes,
            scope:self
        });
    };
    ThanksGiving.prototype.statusRes=function(data,scope,fnParam){
        var self=scope;
        var hasLogin=data.hasLogin,
            isVip=data.isVip,
            coupons=data.coupons;
        if(!hasLogin){
            for(var i = 0; i<coupons.length; i++){
                var coupon=coupons[i];
                if(coupon.total==0){
                    var $coupon=$("#"+coupon.name);
                    $coupon.addClass("gray");
                    $coupon.find("span").text("no coupons left");
                    $coupon.find(self.opt.getCouponId).attr("have","none");
                }
            }
            return false;
        }
        if(isVip){
            $(self.opt.vipCouponId).show();
            $(self.opt.couponSumId).text("$100")
        }
        for(var i = 0; i<coupons.length; i++){
            var coupon=coupons[i];
            if(coupon.name=="coupon3" && coupon.isExpire==false){
                $(self.opt.vipCouponId).show();
                $(self.opt.couponSumId).text("$100")
            }
            if(coupon.total==0){
                var $coupon=$("#"+coupon.name);
                $coupon.addClass("gray");
                $coupon.find("span").text("no coupons left");
                $coupon.find(self.opt.getCouponId).attr("have","none");
            }
        }
    };
    ThanksGiving.prototype.getCoupon=function(){
        var self=this;
        var $coupon=$(self.opt.getCouponId);
        $coupon.delegate($coupon,self.eType(),function(e){
            if($(this).attr("have")=="none") return;
            var domid=$(this).parent().attr("id");
            self.request({
                url:self.opt.getCouponUrl+domid+"&callback=?",
                dataType:'jsonp',
                fn:self.getCouponRes,
                scope:self,
                fnParam:domid
            });
            e.preventDefault();
            e.stopPropagation();
        });

    };
    ThanksGiving.prototype.getCouponRes=function(data,scope,fnParam){
        var self=scope,
            id=fnParam,
            hasLogin=data.hasLogin,
            mayGet=data.mayGet,
            isSuccess=data.isSuccess,
            hasGet=data.hasGet,
            have=data.hava;
        var $coupon=$("#"+id);
        if(!hasLogin){
            var str='You must be <a href="http://m.dhgate.com/login.do?returnURL=http://m.dhgate.com/thanksgiving.html" class="tg-underline">logged in</a> to receive a Thanksgiving Coupon.If you are not yet a DHgate user, please <a href="http://m.dhgate.com/register.do?returnURL=http://m.dhgate.com/thanksgiving.html" class="tg-underline">register</a> here.';
            var $close=self.closeDialog();
            $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/sorry.jpg" width="67" height="23">');
            $close.find(".j-cLayer-cont").html(str);
            self.$shadow.show();
            $close.show();
            return;
        }
        if(mayGet){
            if(isSuccess){
                var str=['This coupon will appear in your <a class="tg-underline" href="http://m.dhgate.com/mycoupon.do?ct=1">Coupons</a> and may be <span class="tg-color1">applied to orders of ',
                    '$100',
                    '</span> or more. valid from <span class="tg-color1">October 14 - December 16, 2014 EST</span>'];
                switch(id){
                     case "coupon1":
                        var $close=self.closeDialog();
                        str[1]="$10";
                        $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/out_10.jpg" width="239" height="126">');
                        $close.find(".j-cLayer-cont").html(str.join(""));
                        self.$shadow.show();
                        $close.show();
                        break;
                    case "coupon2":
                        var $close=self.closeDialog();
                        str[1]="$30";
                        $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/out_30.jpg" width="239" height="126">');
                        $close.find(".j-cLayer-cont").html(str.join(""));
                        self.$shadow.show();
                        $close.show();
                        break;
                    case "coupon3":
                        var $close=self.closeDialog();
                        str[1]="$50";
                        $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/out_50.jpg" width="239" height="126">');
                        $close.find(".j-cLayer-cont").html(str.join(""));
                        self.$shadow.show();
                        $close.show();
                        break;
                    case "coupon4":
                        var $close=self.closeDialog();
                        str[1]="$100";
                        $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/out_100.jpg" width="239" height="126">');
                        $close.find(".j-cLayer-cont").html(str.join(""));
                        self.$shadow.show();
                        $close.show();
                        break;
                }
            }else{
                var str="there seems to be a problem with the connection. Please try again later.";
                var $close=self.closeDialog();
                $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/sorry.jpg" width="67" height="23">');
                $close.find(".j-cLayer-cont").html(str);
                self.$shadow.show();
                $close.show();
            }
            return;
        }
        if(hasGet){
            var str='Sorry, only one coupon per customer.';
            var $close=self.closeDialog();
            $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/sorry.jpg" width="67" height="23">');
            $close.find(".j-cLayer-cont").html(str);
            self.$shadow.show();
            $close.show();
            return;
        }
        if(!have){
            var str='These coupons were all given out, please choose another.';
            var $close=self.closeDialog();
            $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/sorry.jpg" width="67" height="23">');
            $close.find(".j-cLayer-cont").html(str);
            $coupon.addClass("gray");
            $coupon.find("span").text("no coupons left");
            $coupon.find(self.opt.getCouponId).attr("have","none");
            self.$shadow.show();
            $close.show();
            return;
        }
    };
    ThanksGiving.prototype.init=function(){
        var self=this;
        self.status();
        self.getCoupon();
        self.$shadow=$('<div class="tg-shadow"></div>');
        $("body").append(self.$shadow);
    };
    new ThanksGiving();
});