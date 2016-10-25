Zepto(function($){
    function ThanksGiving(){
        this.opt={
            statusUrl:"http://www.dhgate.com/sdCoupon/sdCoupon.do?act=getInitStatus&caller=wap&v="+Math.random(),
            getCouponUrl:"http://www.dhgate.com/sdCoupon/sdCoupon.do?act=getCoupon&caller=wap&v="+Math.random()+"&couponName=",
            getCouponId:".j-getCoupon",
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
            coupons=data.coupons;
        for(var i=0;i<coupons.length;i++){
            var coupon=coupons[i];
            if(coupon.total==0){
                var $coupon=$("#"+coupon.name);
                $coupon.addClass("gray-1111");
                $coupon.text("no coupons left");
                $coupon.attr("have","none");
            }
        }
    };
    ThanksGiving.prototype.getCoupon=function(){
        var self=this;
        var $coupon=$(self.opt.getCouponId);
        $coupon.delegate($coupon,self.eType(),function(e){
            if($(this).attr("have")=="none") return;
            var domid=$(this).attr("id");
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
            have=data.hava;
        var $coupon=$("#"+id);
        if(!hasLogin){
            var str='You must be <a href="http://m.dhgate.com/login.do?returnURL=http://m.dhgate.com/flashSaleCoupon.html" class="tg-underline">logged in</a> to receive a Thanksgiving Coupon.If you are not yet a DHgate user, please <a href="http://m.dhgate.com/register.do?returnURL=http://m.dhgate.com/flashSaleCoupon.html" class="tg-underline">register</a> here.';
            var $close=self.closeDialog();
            $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/sorry.jpg" width="67" height="23">');
            $close.find(".j-cLayer-cont").html(str);
            self.$shadow.show();
            $close.show();
            return;
        }
        if(mayGet){
            if(isSuccess){
                switch(id){
                    case "coupon1":
                        var $close=self.closeDialog();
                        $close.find("h3").html('<img src="http://css.dhresource.com/mobile/1111/image/title-bg.jpg" width="186" height="21">');
                        $close.find(".j-cLayer-cont").html('You’ve won a $10 coupon!');
                        self.$shadow.show();
                        $close.show();
                        break;
                    case "coupon2":
                        var $close=self.closeDialog();
                        $close.find("h3").html('<img src="http://css.dhresource.com/mobile/1111/image/title-bg.png" width="186" height="21">');
                        $close.find(".j-cLayer-cont").html("You’ve won a $20 coupon!");
                        self.$shadow.show();
                        $close.show();
                        break;
                    case "coupon3":
                        var $close=self.closeDialog();
                        $close.find("h3").html('<img src="http://css.dhresource.com/mobile/1111/image/title-bg.png" width="186" height="21">');
                        $close.find(".j-cLayer-cont").html("You’ve won a $100 coupon!");
                        self.$shadow.show();
                        $close.show();
                        break;
                }
            }else{
                var str="there seems to be a problem with the connection. Please try again later.";
                var $close=self.closeDialog();
                $close.find("h3").html('<img src="http://css.dhresource.com/mobile/thanksgiving/image/sorry.png" width="67" height="23">');
                $close.find(".j-cLayer-cont").html(str);
                self.$shadow.show();
                $close.show();
            }
            return;
        }
        if(data.buyerHasGet||data.ipHasGet){
            var str='Sorry, only one coupon per customer or IP.';
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
            $coupon.addClass("gray-1111");
            $coupon.text("no coupons left");
            $coupon.attr("have","none");
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