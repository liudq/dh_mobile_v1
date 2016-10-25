/* cart by zj*/
Zepto(function($){
    var Util={
        events:function(){
            var isSupportTouch="ontouchend" in document?true:false;
            if(isSupportTouch){
                return {start:'touchstart',move:'touchmove',end:'touchend'};
            }else{
                return {start:'mousetart',move:'mousemove',end:'mouseup'};
            }
        },
        domExist:function(id){
            if(!id||!$(id).get(0)){
                return false;
            }
            return $(id);
        },
        loading:function(){
            var $div=$('<div class="j-shadow shadow"></div>');
            $("body").append($div);
        },
        request:function(obj){
            $(".j-shadow").show();
            $.ajax({
                url: obj.url,
                type:obj.type,
                data:obj.data||"none",
                dataType: obj.dataType,
                success: function(res){
                    $(".j-shadow").hide();
                    if(obj.fn){
                        obj.fn(res,obj.scope);
                    }
                },
                error: function(xhr){
                    $(".j-shadow").hide();
                    console.log('Ajax error!'+xhr);
                    return false;
                }
            });
        }
    };
    Util.loading();

    //    倒计时
    function DHCountDown(opts){
        var opts=opts||{};
        this.timerId=opts.timerId||null;
        this.dataAttr=opts.dataAttr||null;
        this.init();
    }
    DHCountDown.prototype={
        constructor:DHCountDown,
        //获取服务器时间
        getServerTime:function(){
            var _self = this;
            $.getJSON("http://m.dhgate.com/buyertime.do?callback=?", function(data){
                var serverTime = data.time * 1;
                _self.countdown(_self,serverTime);
            });
        },
        countdown:function(scope,serverTime){
            var _self = scope;
            _self.$time.each(function(i,n){
                var attr=$(n).attr(_self.dataAttr);
                if(!attr) return;
                var info=attr.split("|");
                if(!info.length) return;
                var discount=info[0],startTime=new Date(info[1]).getTime(),endTime=new Date(info[2]).getTime();
                if (serverTime < endTime) {
                    //距离活动结束剩余时间
                    var leftTime=Math.floor((endTime-serverTime)/1000);
                    _self.setTime(_self,discount,leftTime,n);
                }else if (serverTime < startTime) {
                    //距离活动开始剩余时间
//                    _self.ready = Math.floor((startTime-serverTime)/1000);
                }else if (serverTime > endTime) {
                    //活动已结束
//                    _self.end = true;
                }
            });
        },
        setTime:function(scope,discount,leftTime,dom){
            var _self = scope;
            if (dom.timer) {
                clearTimeout(dom.timer);
            }
            dom.timer=setInterval(function(){
                leftTime--;
                if(leftTime<=0){
                    clearTimeout(dom.timer);
                    return;
                }
                var d=Math.floor(leftTime/60/60/24);
                var h=Math.floor(leftTime/60/60%24);
                if(h<10){h="0"+h;}
                var m=Math.floor(leftTime/60%60);
                if(m<10){m="0"+m;}
                var s=Math.floor(leftTime%60);
                if(s<10){s="0"+s;}
                $(dom).text(d+"d  "+h+"h");
            },1000);
        },
        init:function(){
            this.$time=Util.domExist(this.timerId);
            if(!this.$time) return;
            this.getServerTime();
        }
    };
    new DHCountDown({
        timerId:".j-cartLT",
        dataAttr:"timeData"
    });

    function DHCart(opts){
        var opts=opts||{};
        this.odDetailsId=opts.odDetailsId||null;
        this.errorId=opts.errorId||null;
        this.checkOutId=opts.checkOutId||null;
        this.itemPriceUrl=opts.itemPriceUrl||null;
        this.delItemUrl=opts.delItemUrl||null;
        this.init();
    }
    DHCart.prototype={
        constructor:DHCart,
        getDom:function(){
            return Util.domExist(this.odDetailsId);
        },
        getCheckNum:function(){
            var _self=this;
            var $checked=$(".j-orderDetails").find(".j-odChecked");
            var i=0;
            $checked.each(function(index,n){
                if($(n).hasClass("checked")){
                    i++;
                }
            });
            $(".j-itemsTotal").text(i);
            return i;
        },
        getTotalPrice:function(){
            var total=0;
            $(".j-orderDetails").each(function(i,n){
                var $n=$(n);
                if($n.find(".j-odChecked").hasClass("checked")){
                    var i=parseInt($n.find(".j-num").val());
                    var p=parseInt($n.find(".j-itemPrice").text().replace(/[,]/g,"")*1000);
                    total+=parseInt(i*p);
                }
            });
            return total/1000;
        },
        priceResponse:function(data,scope){
            var _self=scope[1];
            var $item=scope[0];
            var success=data.success;
            if(success=="true"){
                $item.find(".j-itemPrice").text(data.price);
                $(".j-totalPrice").text(_self.getTotalPrice());
            }else{
                window.location.href=data.url;
            }
        },
        delResponse:function(data,scope){
            var _self=scope[1];
            var $item=scope[0];
            var success=data.success;
            if(success=="true"){
                var $p=$item.parent();
                $item.remove();
                var len=$p.find(".j-orderDetails").length;
                if(len){
                    $p.find(".j-orderTotal").text($p.find(".j-orderDetails").length);
                }else{
                    $p.remove();
                }

                $(".j-totalPrice").text(_self.getTotalPrice());
                var i=_self.getCheckNum();
                if(i==0){
                    $(_self.checkOutId).parent().addClass("noClick");
                }else{
                    $(_self.checkOutId).parent().removeClass("noClick");
                }
            }else{
                window.location.href=data.url;
            }

        },
        checked:function(){
            var _self=this;
            var $checked=$(".j-orderDetails").find(".j-odChecked");
            $checked.delegate($checked,Util.events().end,function(){
                var i=_self.getCheckNum();
                $(this).toggleClass("checked");
                if($(this).hasClass("checked")){
                    ++i;
                }else{
                    --i;
                }
                $(".j-itemsTotal").text(i);
                if(i==0){
                    $(_self.checkOutId).parent().addClass("noClick");
                }else{
                    $(_self.checkOutId).parent().removeClass("noClick");
                }
                $(".j-totalPrice").text(_self.getTotalPrice());
            });
        },
        odDelete:function(){
            var _self=this;
            var $del=_self.$details.find(".j-odDelete");
            $del.delegate($del,Util.events().end,function(){
                if(confirm(msgObj['CART_remove'])){
                    var $item=$(this).parents(".j-orderDetails");
                    Util.request({
                        url: _self.delItemUrl,
                        fn: _self.delResponse,
                        data:"itemid="+$item.attr("id")+"&pid="+$item.attr("pid"),
                        type:"POST",
                        dataType:"json",
                        scope:[$item,_self]
                    });
                }
            });
        },
        valid:function(i,$num,$error){
            $error.html("");
            var min=$num.attr("min");
            var max=$num.attr("max");
            if(i<min){
                i=parseInt(min);
                $error.html(msgObj["PO_only"]+"&nbsp;"+min+"&nbsp;"+msgObj["PO_to"]+"&nbsp;"+max+"&nbsp;"+msgObj["PO_is_allow"]);
            }
            if(i>max){
                i=parseInt(max);
                $error.html(msgObj["PO_only"]+"&nbsp;"+min+"&nbsp;"+msgObj["PO_to"]+"&nbsp;"+max+"&nbsp;"+msgObj["PO_is_allow"]);
            }
            return i;
        },
        numDecrease:function(){
            var _self=this;
            var $decrease=_self.$details.find(".j-numDecrease");
            $decrease.delegate($decrease,Util.events().end,function(){
                var $num=$(this).next();
                var $error=$(this).parent().next(_self.errorId);
                if(!$num.val()||isNaN($num.val())){
                    $error.text(msgObj["PO_number_allow"]).show();
                    return;
                }
                var $item=$(this).parents(".j-orderDetails");
                $num[0].numberValue=$num.val();
                var i=parseInt($num.val())-1;
                var rei=_self.valid(i,$num,$error);
                if(rei==$num[0].numberValue) return;
                $num[0].numberValue=rei;
                $num.val(rei);
                Util.request({
                    url: _self.itemPriceUrl,
                    fn: _self.priceResponse,
                    data: "itemid="+$item.attr("id")+"&num="+rei,
                    type:"POST",
                    dataType:"json",
                    scope:[$item,_self]
                });
            });
        },
        numIncrease:function(){
            var _self=this;
            var $decrease=_self.$details.find(".j-numIncrease");
            $decrease.delegate($decrease,Util.events().end,function(){
                var $error=$(this).parent().next(_self.errorId);
                var $num=$(this).prev();
                if(!$num.val()||isNaN($num.val())){
                    $error.text(msgObj["PO_number_allow"]).show();
                    return;
                }
                $num[0].numberValue=$num.val();
                var $item=$(this).parents(".j-orderDetails");
                var i=parseInt($num.val())+1;
                var rei=_self.valid(i,$num,$error);
                if(rei==$num[0].numberValue) return;
                $num[0].numberValue=rei;
                $num.val(rei);
                Util.request({
                    url: _self.itemPriceUrl,
                    fn: _self.priceResponse,
                    data: "itemid="+$item.attr("id")+"&num="+rei,
                    type:"POST",
                    dataType:"json",
                    scope:[$item,_self]
                });
            });
        },
        numInput:function(){
            var _self=this;
            var $num=_self.$details.find(".j-num");
            $num.blur(function(){
                var $error=$(this).parent().next(_self.errorId);
                var $item=$(this).parents(".j-orderDetails");
                var i=parseInt($(this).val());
                if(!i||isNaN(i)){
                    $error.text(msgObj["PO_number_allow"]).show();
                    return;
                }
                var rei=_self.valid(i,$(this),$error);
                if(rei==this.numberValue) return;
                this.numberValue=rei;
                $(this).val(rei);
                Util.request({
                    url: _self.itemPriceUrl,
                    fn: _self.priceResponse,
                    data: "itemid="+$item.attr("id")+"&num="+rei,
                    type:"POST",
                    dataType:"json",
                    scope:[$item,_self]
                });
            }).focus(function(){
                this.numberValue=$(this).val();
                $(this).parent().next(_self.errorId).html("");
            });
        },
        checkOut:function(){
            var $checkOut=$(this.checkOutId);
            $checkOut.delegate($checkOut,Util.events().end,function(){
                if($checkOut.parent().hasClass("noClick")) return;
                var cartids=[];
                $(".j-orderDetails").each(function(i,n){
                    var $n=$(n);
                    if($n.find(".j-odChecked").hasClass("checked")){
                        cartids.push($n.attr("id"));
                    }
                });
                window.location.href="checkoutcart.do?cartids="+cartids.join(",");
            });
        },
        init:function(){
            this.$details=this.getDom();
            if(!this.$details) return;
            this.checked();
            this.odDelete();
            this.numDecrease();
            this.numIncrease();
            this.numInput();
            this.checkOut();
            $(".j-totalPrice").text(this.getTotalPrice());
            var i=this.getCheckNum();
            if(i==0){
                $(this.checkOutId).parent().addClass("noClick");
            }else{
                $(this.checkOutId).parent().removeClass("noClick");
            }
        }
    };
    new DHCart({
        odDetailsId:".j-orderDetails",
        errorId:".j-errorInfo",
        checkOutId:".j-checkOut",
        itemPriceUrl:"/updatecartitemnum.do",
        delItemUrl:"/removecartitem.do"
    });
});