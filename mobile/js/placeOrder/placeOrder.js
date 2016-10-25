/* placeOrder by zj */
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
                    alert('Ajax error!'+xhr);
                    return false;
                }
            });
        }
    };
    Util.loading();

    //  slect联动 切换国家
    function DHStateChange(opts){
        var opts = opts || {};
        this.id=opts.id||null;
        this.stateContentId=opts.stateContentId||null;
        this.url=opts.url||null;
        this.init();
    }
    DHStateChange.prototype={
        constructor:DHStateChange,
        getState:function(){
            var _self=this;
            var $state = Util.domExist(_self.id);
            if(!$state) return "找不到DOM";
            $state.change(function(){
                if(!$(this).val()){
                    $state.next().text(msgObj["PO_PAY_enter_State"]).show();
                    $state.addClass("color-f00");
                    return;
                }
                $state.next().text("").hide();
                $state.removeClass("color-f00");
                $("#vatNumber").parent().hide();
                $("#vatNumber").attr("disabled","disabled");
                Util.request({
                    url: _self.url,
                    data:"country="+$state.val(),
                    fn: _self.setOption,
                    type:"POST",
                    dataType:"json",
                    scope:_self
                });
                var country=["BR","EC","MX","AR","AO","LB","TR"];
                var len=country.length;
                for(var i=0;i<len;i++){
                    if(country[i]==$(this).val()){
                        $("#vatNumber").parent().show();
                        $("#vatNumber").removeAttr("disabled");
                    }
                }
            });
        },
        setOption:function(data,scope){
            var $content=$(scope.stateContentId);
            var $select=$content.find("select");
            var $input=$content.find("input");
            //            无数据时input框
            if(!data){
                $input.removeAttr("disabled").show();
                $input.next().show();
                $select.attr("disabled","disabled").hide();
                $select.next().hide();
                return;
            }
            //             有数据时select框
            $select.next().show();
            $select.removeAttr("disabled").show();
            $input.next().hide();
            $input.attr("disabled","disabled").hide();
            var len=data.length;
            if(len==0) return;
            var html=[];
            for(var i=0;i<len;i++){
                html.push("<option value='"+data[i].value+"'>"+data[i].text+"</option>");
            }
            $select.html(html.join(''));
            if(!$select.val()){
                $(this).removeClass("color-f00");
                $(this).next().text("").hide();
            }
        },
        init:function(){
            this.getState();
        }
    };
    new DHStateChange({
        id:".j-payState",
        stateContentId:".j-stateContent",
        url:"/getstatelist.do"
    });

    //    编辑地址
    function DHpOrderBill(opts){
        var opts=opts||{};
        this.billFormId=opts.billFormId||null;
        this.url=opts.url||null;
        this.init();
    }
    DHpOrderBill.prototype={
        constructor:DHpOrderBill,
        emptyErrorInfo:{
            "contactName":msgObj["PO_PAY_emptyError_contactName"],
            "lastName":msgObj["PO_PAY_emptyError_lastName"],
            "addressline1":msgObj["PO_PAY_emptyError_addressline1"],
            "state":msgObj["PO_PAY_enter_State"],
			"state1":msgObj["PO_PAY_enter_State"],
            "city":msgObj["PO_PAY_emptyError_city"],
            "postalcode":msgObj["PO_PAY_emptyError_postalcode"],
            "tel":msgObj["PO_PAY_emptyError_tel"],
            "country":msgObj["PO_PAY_emptyError_country"],
            "vatNumber":msgObj["PO_emptyError_vatNumber"]
        },
        lenErrorInfo:{
            "contactName":{
                reg:/^[\s\S]{0,30}$/,
                info:msgObj["PO_PAY_lenError_contactName"]
            },
            "lastName":{
                reg:/^[\s\S]{0,30}$/,
                info:msgObj["PO_PAY_lenError_lastName"]
            },
            "addressline1":{
                reg:/^[\s\S]{0,400}$/,
                info:msgObj["PO_PAY_lenError_addressline1"]
            },
            "addressline2":{
                reg:/^[\s\S]{0,400}$/,
                info:msgObj["PO_PAY_lenError_addressline2"]
            },
            "state1":{
                reg:/^[\s\S]{0,40}$/,
                info:msgObj["PO_PAY_lenError_state1"]
            },
            "city":{
                reg:/^[\s\S]{0,400}$/,
                info:msgObj["PO_PAY_lenError_city"]
            },
            "postalcode":{
                reg:/^[\s\S]{4,10}$/,
                info:msgObj["PO_PAY_lenError_postalcode"]
            },
            "tel":{
                reg:/^(\d*-)?\d{4,20}$/,
                info:msgObj["PO_lenError_tel"]
            }
        },
        resErrorInfo:{
            21:{id:"contactName",err:msgObj["PO_PAY_resError_contactName_21"]},
            23:{id:"lastName",err:msgObj["PO_PAY_resError_lastName_23"]},
            22:{id:"contactName",err:msgObj["PO_PAY_resError_contactName_22"]},
            24:{id:"lastName",err:msgObj["PO_PAY_resError_lastName_24"]},
            31:{id:"addressline1",err:msgObj["PO_PAY_resError_addressline1_31"]},
            32:{id:"addressline1",err:msgObj["PO_PAY_resError_addressline1_32"]},
            42:{id:"addressline2",err:msgObj["PO_PAY_resError_addressline2_42"]},
            51:{id:"city",err:msgObj["PO_PAY_resError_city_51"]},
            52:{id:"city",err:msgObj["PO_PAY_resError_city_52"]},
            61:{id:"state",err:msgObj["PO_PAY_resError_state_61"]},
            62:{id:"state",err:msgObj["PO_PAY_resError_state_62"]},
            71:{id:"country",err:msgObj["PO_PAY_resError_country_71"]},
            72:{id:"country",err:msgObj["PO_PAY_resError_country_72"]},
            81:{id:"postalcode",err:msgObj["PO_PAY_resError_postalcode_81"]},
            82:{id:"postalcode",err:msgObj["PO_PAY_resError_postalcode_82"]},
            91:{id:"tel",err:msgObj["PO_PAY_resError_tel_91"]},
            92:{id:"tel",err:msgObj["PO_PAY_resError_tel_92"]}
        },
        billValidate:function(scope,$d){
            var _self=scope,flag=true,emptyErrorInfo=_self.emptyErrorInfo,lenErrorInfo=_self.lenErrorInfo;
            var v=$d.val(),key=$d.attr("id");
            if(!v&&emptyErrorInfo[key]){
                $d.next().text(emptyErrorInfo[key]).show();
                $d.addClass("color-f00");
                flag=false;
            }
            if(v&&lenErrorInfo[key]&&!lenErrorInfo[key].reg.test(v)){
                $d.next().text(lenErrorInfo[key].info).show();
                $d.addClass("color-f00");
                flag=false;
            }
            return flag;
        },
        billBlur:function(){
            var _self=this;
            var $billForm = _self.billForm;
            var $inputs=$billForm.find("input[id]");
            $inputs.blur(function(){
                _self.billValidate(_self,$(this));
            }).focus(function(){
                $(this).removeClass("color-f00");
                $(this).next().text("").hide();
            });
        },
        billSubmit:function(){
            var _self=this;
            var $billForm = _self.billForm;
            $billForm.submit(function(){
                var $inputs=$billForm.find("input[id]"),$selects=$billForm.find("select");
                $inputs.removeClass("color-f00").next().text("").hide();
                $selects.removeClass("color-f00").next().text("").hide();
                var flag=true;
                $inputs.each(function(i,n){
                    if($(n).attr("disabled")=="disabled") return;
                    if(!_self.billValidate(_self,$(n))){
                        flag=false;
                    }
                });
                $selects.each(function(i,n){
                    if($(n).attr("disabled")=="disabled") return;
                    if(!_self.billValidate(_self,$(n))){
                        flag=false;
                    }
                });
                if(!flag) return false;
                Util.request({
                    url: _self.url,
                    fn: _self.billResponse,
                    data: $billForm.serialize(),
                    type:"POST",
                    dataType:"json",
                    scope:_self
                });
                return false;
            });
        },
        billResponse:function(data,scope){
            var _self=scope;
            if(!data) return;
            var success=data.success;
            if(success=="false"){
                if(data.url&&data.url!=""){
                    window.location.href=data.url;
                    return true;
                }else if(data.data&&data.data!=""){
                    var errorInfo=_self.resErrorInfo;
                    var info=data.data.split(",");
                    var len=info.length;
                    for(var i=0;i<len;i++){
                        var ii=info[i];
                        var e = errorInfo[ii];
                        if(ii==61||ii==62||ii=="61"||ii=="62"){
                            var $stat=$("#state"),$stat1=$("#state1");
                            if($stat.attr("disabled")=="disabled"){
                                $stat1.addClass("color-f00");
                                $stat1.next().text(e.err).show();
                            }else if($stat1.attr("disabled")=="disabled"){
                                $stat.addClass("color-f00");
                                $stat.next().text(e.err).show();
                            }
                        }else if(ii==4||ii=="4"){
                            $(".j-addrErr").show().text(msgObj["PO_cannot_shipping_to"]);
                        }else{
                            $("#"+e.id).addClass("color-f00");
                            $("#"+e.id).next().text(e.err).show();
                        }
                    }
                    return false;
                }
            }
        },
        init:function(){
            var _self=this;
            _self.billForm=Util.domExist(_self.billFormId);
            if(!_self.billForm) return;
            _self.billBlur();
            _self.billSubmit();
        }
    };
    new DHpOrderBill({
        billFormId:".j-billFrom",
        url:"/saveshipaddress.do"
    });

    //    选择地址
    function DHpOSelectAdr(opts){
        var opts=opts||{};
        this.shipAdrListId=opts.shipAdrListId||null;
        this.selectAdrId=opts.selectAdrId||null;
        this.url=opts.url||null;
        this.init();
    }
    DHpOSelectAdr.prototype={
        constructor:DHpOSelectAdr,
        selectAdr:function(){
            var _self=this;
            var $dom=Util.domExist(_self.selectAdrId);
            if(!$dom) return;
            $dom.delegate($dom,Util.events().end,function(){
                var $d=$(this);
                $(".j-errorInfo").hide().text("");
                Util.request({
                    url: _self.url,
                    data:"id="+$d.attr("id"),
                    fn: _self.setAddress,
                    type:"POST",
                    dataType:"json",
                    scope:[_self,$d]
                });
            });
        },
        setAddress:function(data,scope){
            var _self=scope[0],$d=scope[1];
            if(!data) return;
            if(data.success=="false"){
                if(data.url&&data.url!=""){
                    $(_self.selectAdrId).parent().removeClass("hasSelect");
                    $d.parent().addClass("hasSelect");
                    window.location.href=data.url;
                    return true;
                }else if(data.data&&data.data!=""){
                    if(data.data=="4"){
                        $d.next().show().text(msgObj["PO_cannot_shipping_to"]);
                    }
                    return false;
                }
            }
        },
        init:function(){
            this.$adrList=Util.domExist(this.shipAdrListId);
            if(!this.$adrList) return;
            this.selectAdr();
        }
    };
    new DHpOSelectAdr({
        selectAdrId:".j-selectAdr",
        shipAdrListId:".j-shipAdrList",
        url:"/selshipaddress.do"
    });

    //    下单
    function DHpOrder(opts){
        this.opts=opts||{};
        this.orderListId=opts.orderListId||null;
        this.errorId=opts.errorId||null;
        this.priceUrl=opts.priceUrl||null;
        this.shipCostUrl=opts.shipCostUrl||null;
        this.couponUrl=opts.couponUrl||null;
        this.addCouponUrl=opts.addCouponUrl||null;
        this.addRemarkUrl=opts.addRemarkUrl||null;
        this.pOrderUrl=opts.pOrderUrl||null;
        this.endEvent=Util.events().end;
        this.init();
    }
    DHpOrder.prototype={
        constructor:DHpOrder,
        resErrorInfo:{
            1:msgObj["PO_resError_1"],
            1002:msgObj["PO_resError_1002"],
            3:msgObj["PO_resError_3"],
            4:msgObj["PO_resError_4"]
        },
        numValid:function(i,$num,$error){
            $error.html("").hide();
            var min=$num.attr("min");
            var max=$num.attr("max");
            if(i<min){
                i=parseInt(min);
                $error.html(msgObj["PO_only"]+" "+min+msgObj["PO_to"]+max+" "+msgObj["PO_is_allow"]+".").show();
            }
            if(i>max){
                i=parseInt(max);
                $error.html(msgObj["PO_only"]+" "+min+" "+msgObj["PO_to"]+" "+max+" "+msgObj["PO_is_allow"]+".").show();
            }
            return i;
        },
        numDecrease:function(){
            var _self=this;
            var $decrease=$(".j-numDecrease");
            $decrease.delegate($decrease,_self.endEvent,function(){
                var $num=$(this).next();
                var $error=$(this).parent().next(_self.errorId);
                if(!$num.val()||isNaN($num.val())){
                    $error.text(msgObj["PO_number_allow"]).show();
                    return;
                }
                $num[0].numberValue=$num.val();
                var i=parseInt($num.val())-1;
                var rei=_self.numValid(i,$num,$error);
                if(rei==$num[0].numberValue) return;
                $num[0].numberValue=rei;
                $num.val(rei);
                var param=['['],flag;
                var len=$(".j-proList").length;
                $(".j-proList").each(function(i,n){
                    var $n=$(n);
                    param.push('{');
                    param.push('"proid":"'+$n.attr("proid"));
                    param.push('","num":"'+$n.find(".j-num").val());
                    param.push('","remark":"'+$n.find(".j-remark").val());
                    if($n.find(".j-num")[0]==$num[0]){
                        flag="true";
                    }else{
                        flag="false";
                    }
                    param.push('","sel":"'+flag);
                    if(i<(len-1)){param.push('"},');}else{param.push('"}');}
                });
                param.push(']');
                Util.request({
                    url: _self.priceUrl,
                    fn: _self.priceResponse,
                    data:"json="+param.join(""),
                    type:"POST",
                    dataType:"json",
                    scope:[_self,$error]
                });
            });
        },
        numIncrease:function(){
            var _self=this;
            var $decrease=$(".j-numIncrease");
            $decrease.delegate($decrease,_self.endEvent,function(){
                var $error=$(this).parent().next(_self.errorId);
                var $num=$(this).prev();
                if(!$num.val()||isNaN($num.val())){
                    $error.text(msgObj["PO_number_allow"]).show();
                    return;
                }
                $num[0].numberValue=$num.val();
                var i=parseInt($num.val())+1;
                var rei=_self.numValid(i,$num,$error);
                if(rei==$num[0].numberValue) return;
                $num[0].numberValue=rei;
                $num.val(rei);
                var param=['['],flag;
                var len=$(".j-proList").length;
                $(".j-proList").each(function(i,n){
                    var $n=$(n);
                    param.push('{');
                    param.push('"proid":"'+$n.attr("proid"));
                    param.push('","num":"'+$n.find(".j-num").val());
                    param.push('","remark":"'+$n.find(".j-remark").val());
                    if($n.find(".j-num")[0]==$num[0]){
                        flag="true";
                    }else{
                        flag="false";
                    }
                    param.push('","sel":"'+flag);
                    if(i<(len-1)){param.push('"},');}else{param.push('"}');}
                });
                param.push(']');
                Util.request({
                    url: _self.priceUrl,
                    fn: _self.priceResponse,
                    data:"json="+param.join(""),
                    type:"POST",
                    dataType:"json",
                    scope:[_self,$error]
                });
            });
        },
        numInput:function(){
            var _self=this,$num=$(".j-num");
            $num.blur(function(){
                var $error=$(this).parent().next(_self.errorId);
                var i=parseInt($(this).val());
                if(!i||isNaN(i)){
                    $error.text(msgObj["PO_number_allow"]).show();
                    return;
                }
                var rei=_self.numValid(i,$(this),$error);
                if(rei==this.numberValue) return;
                this.numberValue=rei;
                $(this).val(rei);
                var param=['['],flag,$num=$(this);
                var len=$(".j-proList").length;
                $(".j-proList").each(function(i,n){
                    var $n=$(n);
                    param.push('{');
                    param.push('"proid":"'+$n.attr("proid"));
                    param.push('","num":"'+$n.find(".j-num").val());
                    param.push('","remark":"'+$n.find(".j-remark").val());
                    if($n.find(".j-num")[0]==$num[0]){
                        flag="true";
                    }else{
                        flag="false";
                    }
                    param.push('","sel":"'+flag);
                    if(i<(len-1)){param.push('"},');}else{param.push('"}');}
                });
                param.push(']');
                Util.request({
                    url: _self.priceUrl,
                    fn: _self.priceResponse,
                    data:"json="+param.join(""),
                    type:"POST",
                    dataType:"json",
                    scope:[_self,$error]
                });
            }).focus(function(){
                this.numberValue=$(this).val();
                $(this).parent().next(_self.errorId).html("").hide();
            });
        },
        priceResponse:function(data,scope){
            if(!data) return;
            var success=data.success,_self=scope[0],$error=scope[1];
            if(success=="false"){
                if(data.url&&data.url!=""){
                    window.location.href=data.url;
                    return true;
                }else if(data.data&&data.data!=""){
                    var errInfo=_self.resErrorInfo;
                    $error.text(errInfo[data.data]).show();
                    return false;
                }
            }
        },
        shipCost:function(){
            var _self=this;
            $(".j-shipcost").change(function(){
                Util.request({
                    url: _self.shipCostUrl,
                    fn: _self.shipCostResponse,
                    data:"proid="+$(this).parents(".j-proList").attr("proid")+"&shipcostid="+$(this).val(),
                    type:"POST",
                    dataType:"json",
                    scope:[_self,$(this).next()]
                });
            });
        },
        shipCostResponse:function(data,scope){
            if(!data) return;
            var success=data.success,_self=scope[0],$error=scope[1];
            if(success=="false"){
                if(data.url&&data.url!=""){
                    window.location.href=data.url;
                    return true;
                }else if(data.data&&data.data!=""){
                    var errInfo=_self.resErrorInfo;
                    $error.text(errInfo[data.data]).show();
                    return false;
                }
            }
        },
        coupon:function(){
            var _self=this,$btn=$(".j-useCoupBtn");
            $btn.delegate($btn,_self.endEvent,function(){
                $(this).parent().toggleClass("openLayer");
                $(this).parent().next().toggle();
            });
            $(".j-selectCoupon").change(function(){
                var v=$(this).val();
                if(!v){
                    $(this).parent().next().hide();
                }
                if(v=="addCoupon"){
                    $(this).parent().next().show();
                    return;
                }
                var param=['['],flag,$sel=$(this);
                var len=$(".j-orderList").length;
                $(".j-orderList").each(function(i,n){
                    var $n=$(n);
                    param.push('{');
                    param.push('"orderid":"'+$n.attr("orderid"));
                    param.push('","couponid":"'+$n.find(".j-selectCoupon").val());
                    if($n.find(".j-selectCoupon")[0]==$sel[0]){
                        flag="true";
                    }else{
                        flag="false";
                    }
                    param.push('","sel":"'+flag);
                    if(i<(len-1)){param.push('"},');}else{param.push('"}');}
                });
                param.push(']');
                Util.request({
                    url: _self.couponUrl,
                    fn: _self.couponResponse,
                    data:"json="+param.join(""),
                    type:"POST",
                    dataType:"json",
                    scope:[_self,$(this).next()]
                });
            });
        },
        couponResponse:function(data,scope){
            if(!data) return;
            var success=data.success,_self=scope[0],$error=scope[1];
            if(success=="false"){
                if(data.url&&data.url!=""){
                    window.location.href=data.url;
                    return true;
                }else if(data.data&&data.data!=""){
                    var errInfo=_self.resErrorInfo;
                    $error.text(errInfo[data.data]).show();
                    return false;
                }
            }
        },
        addCoupon:function(){
            var _self=this;
            var $add=$(".j-addCoupon").find("input[type='button']");
            $add.delegate($add,_self.endEvent,function(){
                var $parent=$(this).parents(".j-addCoupon");
                var $error=$parent.find(_self.errorId);
                var v=$parent.find("input[type='text']").val();
                if(!v){
                    $error.text(msgObj["PO_enter_coupon"]).show();
                    return;
                };
                Util.request({
                    url: _self.addCouponUrl,
                    fn: _self.addCouponResponse,
                    data:"orderid="+$(this).parents(".j-orderList").attr("orderid")+"&coupon="+v,
                    type:"POST",
                    dataType:"json",
                    scope:[_self,$error]
                });
            });
        },
        addCouponResponse:function(data,scope){
            if(!data) return;
            var success=data.success,_self=scope[0],$error=scope[1];
            if(success=="false"){
                if(data.url&&data.url!=""){
                    window.location.href=data.url;
                    return true;
                }else if(data.data&&data.data!=""){
                    var errInfo=_self.resErrorInfo;
                    $error.text(errInfo[data.data]).show();
                    return false;
                }else if(data.addcouponmsg){
                    $error.text(data.addcouponmsg).show();
                    return false;
                }
            }
        },
        addRemark:function(){
            var _self=this;
            $(".j-remark").blur(function(){
                var v=$(this).val();
                if(!v) return;
                var param=['['];
                var len=$(".j-proList").length;
                $(".j-proList").each(function(i,n){
                    var $n=$(n);
                    param.push('{');
                    param.push('"proid":"'+$n.attr("proid"));
                    param.push('","remark":"'+$n.find(".j-remark").val());
                    if(i<(len-1)){param.push('"},');}else{param.push('"}');}
                });
                param.push(']');
                Util.request({
                    url: _self.addRemarkUrl,
                    fn: _self.addRemarkResponse,
                    data:"json="+param.join(""),
                    type:"POST",
                    dataType:"json",
                    scope:[_self,$(this).next()]
                });
            });
        },
        addRemarkResponse:function(data,scope){
            if(!data) return;
            var success=data.success,_self=scope[0],$error=scope[1];
            if(success=="false"){
                if(data.url&&data.url!=""){
                    window.location.href=data.url;
                    return true;
                }else if(data.data&&data.data!=""){
                    var errInfo=_self.resErrorInfo;
                    $error.text(errInfo[data.data]).show();
                    return false;
                }
            }
        },
        orderSubmit:function(){
            var _self=this;
            $(".j-pOrderForm").submit(function(){
                Util.request({
                    url: _self.pOrderUrl,
                    fn: _self.orderResponse,
                    type:"POST",
                    dataType:"json",
                    scope:_self
                });
                return false;
            });
        },
        orderResponse:function(data,scope){
            if(!data) return;
            var success=data.success,_self=scope;
            if(success=="false"){
                if(data.url&&data.url!=""){
                    window.location.href=data.url;
                    return true;
                }else if(data.data&&data.data!=""){
                    if(data.data=="4"){
                       $(".j-addressError").text(msgObj["PO_cannot_shipping_to"]).show();
                    }
                    return false;
                }else if(data.dailydeals){
                    var d = data.dailydeals;
                    var len=d.length;
                    for(var i=0;i<len;i++){
                        var proid=d[i].proid;
                        var info=d[i].reason;
                        $(".j-proList[proid='"+proid+"']").find(".j-num").parent().next(".j-errorInfo").text(info).show();
                    }
                }else if(data.placeordererr){
                    $(".j-placeordererr").text(data.placeordererr).show();
                }
            }
        },
        init:function(){
            this.$orderListId=Util.domExist(this.orderListId);
            if(!this.$orderListId) return;
            this.numDecrease();
            this.numIncrease();
            this.numInput();
            this.shipCost();//运费
            this.coupon();//优惠券
            this.addCoupon();//添加优惠券
            this.addRemark();//添加评论
            this.orderSubmit();
        }
    };
    new DHpOrder({
        orderListId:".j-orderList",
        errorId:".j-errorInfo",
        priceUrl:"/setitemnum.do",
        shipCostUrl:"/setshipcost.do",
        couponUrl:"/setcoupon.do",
        addCouponUrl:"/addcoupon.do",
        addRemarkUrl:"/addplaceorderremark.do",
        pOrderUrl:"/placeorder.do"
    });
});