/* pay by zj*/
Zepto(function($){
    //  util
    /*//阻止滚动
    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
     }, false);*/ 
    var payUtil={
        //      判断是否有touch事件
        events:function(){
            var isSupportTouch="ontouchend" in document?true:false;
            if(isSupportTouch){
                return {start:'touchstart',move:'touchmove',end:'touchend'};
            }else{
                return {start:'mousetart',move:'mousemove',end:'mouseup'};
            }
        },
        //      判断dom是否存在
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
            if(!obj.noShadow){
                $(".j-shadow").show();
            }
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
    }
    payUtil.loading();

    //    UI页面交互（不涉及到后台数据的交互）
    function DHPayUI(opts){
        var opts = opts || {};
        this.tabInfo=opts.tabInfo||null;
        this.toggleInfo=opts.toggleInfo||null;
        this.init();
    }
    DHPayUI.prototype={
        constructor:DHPayUI,
        payTab:function(){
            var _self = this;
            var $dom=payUtil.domExist(_self.tabInfo.id);
            if(!$dom) return "找不到DOM";
            var endEvent=payUtil.events().end;
            var $tab=$dom.find("div");
            $tab.delegate($tab,endEvent,function(){
                if(_self.tabInfo.cls){
                    $(this).addClass(_self.tabInfo.cls).siblings().removeClass(_self.tabInfo.cls);
                }
                var name = this.getAttribute("name");
                if(payUtil.domExist(_self.tabInfo.tabId)){
                    $(_self.tabInfo.tabId).val((name==".j-visaCon")?0:1);
                };
                $(name).show().siblings().hide();
            });
        },
        payToggle:function(){
            var _self = this;
            var $dom=payUtil.domExist(_self.toggleInfo.id);
            if(!$dom) return "找不到DOM";
            var endEvent=payUtil.events().end;
            $dom.delegate($dom,endEvent,function(){
                if(_self.toggleInfo.cls){
                    $(this).parent().toggleClass(_self.toggleInfo.cls);
                }
            });
        },
        successDialog:function(){
            var self=this;
            var $d=$('#J_paySuccDialog');
            if(!$d.get(0)) return;
            var a = navigator.userAgent,exp =/ip(hone|od|ad)/i,exp2 =/(A|a)ndroid/i;
            if(!exp.test(a)&&!exp2.test(a)) return;
            var csst="padding:10px;width:276px;height:220px;position:fixed;z-index:1000;top:50%;margin-top:-112px;left:50%;margin-left:-148px;border:1px solid #ccc;border-radius:3px;-webkit-box-shadow:inset 0 2px 3px rgba(80,80,80,0.20);-o-box-shadow:inset 0 2px 3px rgba(80,80,80,0.20);-moz-box-shadow:inset 0 2px 3px rgba(80,80,80,0.20);box-shadow:inset 0 2px 3px rgba(80,80,80,0.20);background:#fff;";
            $d.get(0).style.cssText=csst;
            var html=[
                '<a id="J_close" href="javascript:;" style="width:17px;height:17px;position:absolute;right:10px;background:url(http://css.dhresource.com/mobile/pay/image/close.png) no-repeat 0 0;background-size:17px 17px;"></a>',
                '<p style="padding:40px 10px;font-size:17px;line-height:20px">',msgObj["PAY_success_dialog"],'</p>',
                '<a id="J_open" style="display:block" href="javascript:;">',
                    '<img src="http://css.dhresource.com/mobile/pay/image/android-download-icon.png" width="230" height="45" style="margin:0 auto"/>',
                '</a>'];
            self.mySuccessDialog=$(html.join(''));
            var shadow=$("<div style='display:none;width:100%;height:100%;position:fixed;top:0;left:0;z-index:999;zoom:1;background:#999;opacity:0.5'></div>");
            $d.append(self.mySuccessDialog);
            $("body").append(shadow);
            if(exp.test(a)){
                $d.find("img").attr("src","http://css.dhresource.com/mobile/pay/image/ios-download-icon.png");
            }
            $d.show();
            shadow.show();
            $d.find("#J_close").on("click",function(e){
                $d.hide();
                shadow.hide();
                e.stopPropagation();
                e.preventDefault();
            });
            $d.find("#J_open").on("click",function(e){
                if(exp.test(a)){
                    window.location.href="DHgate://com.honestwalker.DHgate";
                    setTimeout(function(){
                        window.location.href="https://itunes.apple.com/us/app/dhgate-mobile-chinese-online/id905869418?l=zh&ls=1&mt=8";
                    },30);
                    try{
                        _gaq.push(['_trackEvent','appdownload', 'wappaysuccess']);
                    }catch(e){}
                }else if(exp2.test(a)){
                    window.location.href="https://play.google.com/store/apps/details?id=com.dhgate.buyer";
                    try{
                        _gaq.push(['_trackEvent','appdownload', 'wappaysuccess']);
                    }catch(e){}
                }else{
                    console.log("not ios and not android");
                }
                e.stopPropagation();
                e.preventDefault();
            });
        },
        init:function(){
            this.payTab();
            this.payToggle();
            this.successDialog();
        }
    };
    new DHPayUI({
        tabInfo:{
            id:".j-payTabs",
            tabId:"#payTabId",
            cls:"p-active"
        },
        toggleInfo:{
            id:".j-visaTipBtn",
            cls:"visa-active"
        }
    });

    //  bill 相关提交
    function DHPayBillFrom(opts){
        var opts = opts || {};
        this.billFormId=opts.billFormId||null;
        this.billBtnId=opts.billBtnId||null;
        this.cancelBtnId=opts.cancelBtnId||null;
        this.editConId=opts.editConId||null;
        this.saveConId=opts.saveConId||null;
        this.url=opts.url||null;
        this.init();
    }
    DHPayBillFrom.prototype={
        constructor:DHPayBillFrom,
        emptyErrorInfo:{
            "contactName":msgObj["PO_PAY_emptyError_contactName"],
            "lastName":msgObj["PO_PAY_emptyError_lastName"],
            "addressline1":msgObj["PO_PAY_emptyError_addressline1"],
            "state":msgObj["PO_PAY_enter_State"],
            "state1":msgObj["PO_PAY_enter_State"],
            "city":msgObj["PO_PAY_emptyError_city"],
            "postalcode":msgObj["PO_PAY_emptyError_postalcode"],
            "tel":msgObj["PO_PAY_emptyError_tel"],
            "country":msgObj["PO_PAY_emptyError_country"]
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
            "city":{
                reg:/^[\s\S]{0,400}$/,
                info:msgObj["PO_PAY_lenError_city"]
            },
            "state1":{
                reg:/^[\s\S]{0,40}$/,
                info:msgObj["PO_PAY_lenError_state1"]
            },
            "postalcode":{
                reg:/^[\s\S]{4,10}$/,
                info:msgObj["PO_PAY_lenError_postalcode"]
            }
//            ,"tel":{
//                reg:/^[\s\S]{4,20}$/,
//                info:"The length of Telephone must between 4 and 20."
//            }
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
        billEdit:function(){
            var _self = this;
            var $dom=payUtil.domExist(_self.billBtnId);
            if(!$dom) return "找不到DOM billBtn";
            var endEvent=payUtil.events().end;
            $dom.delegate($dom,endEvent,function(){
                var text=$(this).text();
                var str = text.replace(/[ ]/g,"");
                if(str==msgObj["PAY_edit"]){
                    $(this).text(msgObj["PAY_save"]);
                    $(_self.editConId).show();
                    $(_self.saveConId).hide();
                }else{
                    _self.billSubmit();
                }
            });
        },
        cancelEdit:function(){
            var _self = this;
            var $cancel=payUtil.domExist(_self.cancelBtnId);
            if(!$cancel) return "找不到DOM billBtn";
            var endEvent=payUtil.events().end;
            $cancel.delegate($cancel,endEvent,function(){
                $(_self.billBtnId).text(msgObj["PAY_edit"]);
                $(_self.editConId).hide();
                $(_self.saveConId).show();
            });
        },
        billBlur:function(){
            var _self=this;
            var $billForm = payUtil.domExist(_self.billFormId);
            if(!$billForm) return "找不到DOM";
            var $inputs=$billForm.find("input[id]");
            $inputs.blur(function(){
                _self.billValidate(_self,$(this));
            }).focus(function(){
                $(this).removeClass("color-f00");
                $(this).next().text("").hide();
            });
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
        billSubmit:function(){
            var _self=this;
            var $billForm = payUtil.domExist(_self.billFormId);
            if(!$billForm) return "找不到DOM billForm";
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
            payUtil.request({
                url: _self.url,
                fn: _self.billResponse,
                data: $billForm.serialize(),
                type:"POST",
                dataType:"json",
                scope:_self
            });
        },
        billResponse:function(data,scope){
            var _self=scope;
            if(!data) return;
            var $billFrom = payUtil.domExist(_self.billFormId);
            if(!$billFrom) return "找不到DOM";
            var success=data.success;
            if(success=="true"){
                var firstName=$("#contactName").val();
                var lastName=$("#lastName").val();
                var addressline1=$("#addressline1").val();
                var addressline2=$("#addressline2").val();
                var city=$("#city").val();
                var country=$("#country").val();
                var state=$("#state").val();
                var tel=$("#tel").val();
                var postalcode=$("#postalcode").val();
                var html=[];
                html.push("<p>"+firstName+"&nbsp;&nbsp;"+lastName+"</p>");
                html.push("<p>"+addressline1+"</p>");
                html.push("<p>"+addressline2+"</p>");
                html.push("<p>"+city+"</p>");
                html.push("<p>"+state+"</p>");
                html.push("<p>"+$("#country").find("option[value='"+country+"']").text()+"</p>");
                html.push("<p>"+postalcode+"</p>");
                html.push("<p>"+tel+"</p>");
                html.push('<div class="pay-btn"><input type="button" value="',msgObj["PAY_for_order"],'" class="payBtn"></div>');
                $(".j-billSave").html(html.join(""));
                $("#selgateFirstname").val(firstName);
                $("#selgateLastname").val(lastName);
                $("#selgateAddressline1").val(addressline1);
                $("#selgateAddressline2").val(addressline2);
                $("#selgateCity").val(city);
                $("#selgateState").val(state);
                $("#selgateCountry").val(country);
                $("#selgatePostalcode").val(postalcode);
                $("#selgateMobilephone").val(tel);
                $(_self.billBtnId).text(msgObj["PAY_edit"]);
                $(_self.editConId).hide();
                $(_self.saveConId).show();
                return true;
            }else{
                var errorInfo=_self.resErrorInfo;
                var info=data.data.split(",");
                var len=info.length;
                for(var i=0;i<len;i++){
                    var ii=info[i];
                    var e = errorInfo[ii];
                    if(ii==61||ii==62||ii=="61"||ii=="62"){
                        var $stat=$("#state");
                        var $stat1=$("#state1");
                        if($stat.attr("disabled")=="disabled"){
                            $stat1.addClass("color-f00");
                            $stat1.next().text(e.err).show();
                        }else if($stat1.attr("disabled")=="disabled"){
                            $stat.addClass("color-f00");
                            $stat.next().text(e.err).show();
                        }
                    }else{
                        $("#"+e.id).addClass("color-f00");
                        $("#"+e.id).next().text(e.err).show();
                    }

                }
                return false;
            }
        },
        init:function(){
            this.billEdit();
            this.cancelEdit();
            this.billBlur();
        }
    };
    new DHPayBillFrom({
        billFormId:".j-billForm",
        billBtnId:".j-editBillBtn",
        cancelBtnId:".j-billCancel",
        editConId:".j-billEdit",
        saveConId:".j-billSave",
        url:"/savepaybilladdress.do"
    });

    //  slect联动 切换国家
    function DHPayStateChange(opts){
        var opts = opts || {};
        this.id=opts.id||null;
        this.stateContentId=opts.stateContentId||null;
        this.url=opts.url||null;
        this.init();
    }
    DHPayStateChange.prototype={
        constructor:DHPayStateChange,
        getState:function(){
            var _self=this;
            var $state = payUtil.domExist(_self.id);
            if(!$state) return "找不到DOM";
            $state.change(function(){
                if(!$(this).val()){
                    $state.next().text(msgObj["PO_PAY_enter_State"]).show();
                    $state.addClass("color-f00");
                    return;
                }
                $state.next().text("").hide();
                $state.removeClass("color-f00");
                payUtil.request({
                    url: _self.url,
                    data:"country="+$state.val(),
                    fn: _self.setOption,
                    type:"POST",
                    dataType:"json",
                    scope:_self
                });
            });
        },
        setOption:function(data,scope){
            var $content=$(scope.stateContentId);
            var $select=$content.find("select");
            var $input=$content.find("input");
            if(!data){
                $input.removeAttr("disabled").show();
                $input.next().show();
                $select.attr("disabled","disabled").hide();
                $select.next().hide();
                return;
            }
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
        },
        init:function(){
            this.getState();
        }
    };
    new DHPayStateChange({
        id:".j-payState",
        stateContentId:".j-stateContent",
        url:"/getstatelist.do"
    });

    //    提交pay
    function DHPayForm(opts){
        var opts = opts || {};
        this.visaId=opts.visaId||null;
        this.dhId=opts.dhId||null;
        this.dhpayUrl=opts.dhpayUrl||null;
        this.gatepayUrl=opts.gatepayUrl||null;
        this.init();
    }
    DHPayForm.prototype={
        constructor:DHPayForm,
        errorInfo:{
            11:{
                reg:/^[\s\S]{6,20}$/,
                info:msgObj["PAY_error_11"]
            },
            21:msgObj["PAY_error_21"],
            22:{
                reg:/^[\s\S]{0,18}$/,
                info:msgObj["PAY_error_22"]
            },
            31:{
                reg:/^\d{3}$/,
                info:msgObj["PAY_error_31"]
            },
            32:{
                reg:/^\d{3,4}$/,
                info:msgObj["PAY_error_32"]
            },
            3:{id:".j-cardnumInput",err:msgObj["PAY_error_3"]},
            2:{id:".j-cscInput",err:msgObj["PAY_error_2"]}
        },
        payValit:function(scope,$d,num){
            var _self=scope;
            var errorInfo=_self.errorInfo[num];
            if(!errorInfo.info){
                $d.next().text(errorInfo).show();
                $d.addClass("color-f00");
                return false;
            }else{
                if(!errorInfo.reg.test($d.val())){
                    $d.next().text(errorInfo.info).show();
                    $d.addClass("color-f00");
                    return false;
                }
            }
            return true;
        },
        isNewCard:function(){
             var isflag = false;
             var ci = $(".j-cardnumInput").length;
             var cm = $(".j-cardMonth").length;
             var cy = $(".j-cardYear").length;
             if(ci > 0 && cm > 0 && cy > 0){
             	isflag = true;
             } else {
             	isflag = false;
             }
             return isflag;
        },
        addCard:function(_cardNo,_expireYear,_expireMonth){
            var that =this;
			var action = "/mobileApiWeb/pay-Card-add.do";
                var firstName=$("#contactName").val();
                var lastName=$("#lastName").val();
                var addressline1=$("#addressline1").val();
                var addressline2=$("#addressline2").val();
                var city=$("#city").val();
                var country=$("#country").val();
                var state=$("#state").val();
                var tel=$("#tel").val();
                var zipCode=$("#postalcode").val();

			var cardDate = {};
			$.ajax({
				url: action,
				type: "GET",
				dataType: "json",
				timeout: 12000,
				async:false,
				data: {
					version: 3.3,
					client: "wap",
					cardNo: _cardNo,
					expireYear: _expireYear,
					expireMonth: _expireMonth,
                    firstName: firstName,
                    lastName : lastName,
                    addressOne :addressline1,
                    addressTwo: addressline2,
                    country :country,
                    state: state,
                    zipCode:zipCode,
                    city :city,
                    telephone :tel,
                    mobilephone: tel

				},
				success: function(s) {
					if (s && s.state == "0x0000") {
						cardDate = s.data;
					} else {
						that.showError(s);
					}
				}
			})
			return cardDate;
		},
		showError:function(data){
			$(".loding-layer").hide();
            $(".mask").show();
            $(".pay-pop-up").show();
            $('.errorTxt').html('<span>'+data.message+'</span>');
            $('.pay_BtnBox').html('<span class="blue sure" id="errorSure">OK</span>');
            $('#errorSure').click(function(){
                $('.pay-pop-up').hide();
                $(".mask").hide();
                $('.j-cscInput').val("");
            })
		},
		cardPay:function(_cardId,_orderNo,_orderId,_token){
			var action = "/mobileApiWeb/pay-CardPay-pay.do";
			$.ajax({
                    url: action,
                    type: 'GET',
                    dataType: 'json',
                    timeout : 30000,  
                    data: {
                          version : 3.3,
                          client:"wap",
                          cardId:_cardId || defaultVal,
                          orderNo:_orderNo,
                          orderId:_orderId,
                          token:_token
                      },
                    success: function(data){
                         if(data && data.state=="0x0001"){
                            $(".loding-layer").hide();
                            $(".mask").show();
                            $(".pay-pop-up").show();
                            $('.errorTxt').html('<span>'+data.message+'</span>');
                            $('.pay_BtnBox').html('<span class="blue sure" id="errorSure">OK</span>');
                            $('#errorSure').click(function(){
                                $('.pay-pop-up').hide();
                                $(".mask").hide();
                                $('.j-cscInput').val("");
                            });
                         }else if(data && data.state=="0x0000"){
                            if( typeof data.data["3D"] != "undefined" && data.data["3D"] && data.data["url"]!==""){
                                window.location.href = data.data["url"];
                            }else{
                                var orderNo=$('#orderNo').attr("orderNo");
                                var amount =data.data.amount;
                                $(".loding-layer").hide();
                                $(".mask").show();
                                $(".pay-pop-up").show();
                                $(".error_icon").addClass("success");
                                $('.pay_BtnBox').html('<a href="/paysucc.do?rfxno='+orderNo+'&amount='+amount+'" title="" class="blue sure" id="scussSure">OK</a>');
                                $('.errorTxt').html('<span>'+data.message+'</span>');
                            }
                            
                         }
                        
                    },
                    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                       if(status=='timeout'){//超时,status还有success,error等值的情况
                       $(".mask").hide();
                            $('.loding-layer').hide();
                       }
                   }
                });
		},
        payOrder:function(){
            $(".j-cardnumInput").blur(function(){
                if(!$(this).val()){
                    _self.payValit(_self,$(this),21);
                    return;
                }
                _self.payValit(_self,$(this),22);
            }).focus(function(){
                $(this).next().text("").hide();
                $(this).removeClass("color-f00");
            });
            $(".j-cscInput").blur(function(){
                var numv="";
                if($(".j-cardnumInput").get(0)){
                    numv=$.trim($(".j-cardnumInput").val()).charAt(0);
                }
                if($(".j-cardnum").get(0)){
                    var sel=$(".j-cardnum").get(0);
                    numv=$.trim(sel.options[sel.selectedIndex].text).charAt(0);
                }
                if(numv=="3"){
                    _self.payValit(_self,$(this),32);
                }else{
                    _self.payValit(_self,$(this),31);
                }

            }).focus(function(){
                $(this).next().text("").hide();
                $(this).removeClass("color-f00");
            });
            var _self=this;
            var optionVal =null;

            
            $(".j-cardnum").change(function(){
             var sel=$(this).get(0);
             optionVal =$.trim(sel.options[sel.selectedIndex].value);
             //console.log(optionVal);
            });

             
            $("body").on("click",".payBtn",function(){
                $(".mask").show();
                $('.loding-layer').show();
                var flag=true;
                var defaultVal = $("select option").eq(0).val();
                var orderNo=$('#orderNo').attr("orderNo"),orderId=$('#orderId').attr("orderId");
                var $csc=$(".j-cscInput"),$carnum=$(".j-cardnumInput"),numv="";
                if($(".j-cardnumInput").get(0)){
                    numv=$.trim($(".j-cardnumInput").val()).charAt(0);
                }
                if($(".j-cardnum").get(0)){
                    var sel=$(".j-cardnum").get(0);
                    numv=$.trim(sel.options[sel.selectedIndex].text).charAt(0);
                }
                if(numv=="3"){
                    if(!_self.payValit(_self,$csc,32)){
                        flag=false;
                    }
                }else{
                    if(!_self.payValit(_self,$csc,31)){
                        flag=false;
                    }
                }
                if($carnum.get(0)){
                    if(!$carnum.val()){
                        _self.payValit(_self,$carnum,21);
                        flag=false;
                    }else{
                        if(!_self.payValit(_self,$carnum,22)){
                            flag=false;
                        }
                    }
                };
                if(!flag) {
	                $(".mask").hide();$('.loding-layer').hide();
                	return false;
                }
				/**now Start payment **/
				var token = $('.j-cscInput').val();
				var cardNo = $(".j-cardnumInput").val();
                if(_self.isNewCard()){ //  if new card
                	var ey_sel=$(".j-cardYear").get(0);
                    var ey=$.trim(ey_sel.options[ey_sel.selectedIndex].text);
                    var em_sel=$(".j-cardMonth").get(0);
                    var em=$.trim(em_sel.options[em_sel.selectedIndex].text);
                	var cardData = _self.addCard(cardNo,ey,em) ;
                	if(cardData.cardId && cardData.cardId.length > 0){
                		_self.cardPay(cardData.cardId,orderNo,orderId,token);
                	}
                } else { // Card already exists
                	var card_sel=$(".j-cardnum").get(0);
                	var cardId=$.trim(card_sel.options[card_sel.selectedIndex].value);
                    _self.cardPay(cardId,orderNo,orderId,token);
                }
            })
        },
        dhPaySubmit:function(){
            var _self=this,orderNo=$('#orderNo').attr("orderNo"),orderId=$('#orderId').attr("orderId");
            var $dhPayForm = payUtil.domExist(_self.dhId);
            if(!$dhPayForm) return "找不到DOM dhPayForm";
            $(".j-dhpayPsw").blur(function(){
                var info=_self.errorInfo[11];
                if(!info.reg.test($(this).val())){
                    $(this).next().text(info.info).show();
                    $(this).addClass("color-f00");
                }
            }).focus(function(){
                $(this).next().text("").hide();
                $(this).removeClass("color-f00");
            });
            $(".j-dhpayForm").click(function(){
                var info = _self.errorInfo[11],
                    dhPayUrl = '/mobileApiWeb/pay-WalletPay-pay.do';
                if(!info.reg.test($(".j-dhpayPsw").val())){
                    $(".j-dhpayPsw").next().text(info.info).show();
                    $(".j-dhpayPsw").addClass("color-f00");
                    return false;
                }
                $(".mask,.loding-layer").show();
                $.ajax({
                    url: dhPayUrl,
                    type: 'GET',
                    dataType: 'json',
                    data: {
                          version : 3.3,
                          client:"wap",
                          orderNo:orderNo,
                          orderId:orderId,
                          token:$('.j-dhpayPsw').val()
                      },
                    success: function(data){
                        //var data ={"state":"0x0000","message":"Action back message.",data:{Object:"Object date"}};
                         if(data && data.state=="0x0001"){
                            $(".loding-layer").hide();
                            $(".mask,.pay-pop-up").show();
                            $('.errorTxt').html('<span>'+data.message+'</span>');
                            $('.pay_BtnBox').html('<span class="blue sure" id="errorSure">OK</span>');
                            $('#errorSure').click(function(){
                                $('.pay-pop-up,.mask').hide();
                                $('.j-cscInput').val("");
                            })
                         }else if(data && data.state=="0x0000"){
                            var amount =data.data.amount;
                            $(".loding-layer").hide();
                            $(".mask,.pay-pop-up").show();
                            $(".error_icon").addClass("success");
                            $('.pay_BtnBox').html('<a href="/paysucc.do?rfxno='+orderNo+'&amount='+amount+'" title="" class="blue sure" id="scussSure">OK</a>');
                            $('.errorTxt').html('<span>'+data.message+'</span>');
                         }
                        
                    }
                });

            })
        },
        dhPayResponse:function(data,scope){
            if(!data) return;
            var success=data.success;
            if(success=="false"){
                var info=data.data;
                var len=info.length;
                for(var i=0;i<len;i++){
                    var infoi=info[i];
                    $(scope.dhId).find("input[name='"+infoi.name+"']").addClass("color-f00").next().text(infoi.info).show();
                }
                return false;
            }else{
                window.location.href=data.url;
                return true;
            }
        },
        visaPayResponse:function(data,scope){
            if(!data) return;
            var success=data.success;
            if(success=="false"){
                var errorInfo=scope.resErrorInfo;
                var info=data.data.split(",");
                var len=info.length;
                for(var i=0;i<len;i++){
                    var e = errorInfo[info[i]];
                    $("#"+e.id).addClass("color-f00");
                    $("#"+e.id).next().text(e.err).show();
                }
                return false;
            }else{
                window.location.href=data.url;
                return true;
            }
        },
        init:function(){
            this.dhPaySubmit();
            //this.visaPaySubmit();
            this.payOrder();
        }
    };
    new DHPayForm({
        visaId:".j-visapayForm",
        dhId:".j-dhpayForm",
        dhpayUrl:"/paywithdhpay.do",
        gatepayUrl:"/paywithgate.do"
    });

    //    切换卡号
    function DHPayChangeCard(opts){
        var opts = opts || {};
        this.id=opts.id||null;
        this.newCardUrl=opts.newCardUrl||null;
        this.expTimeId=opts.expTimeId||null;
        this.billBtnId=opts.billBtnId||null;
        this.init();
    }
    DHPayChangeCard.prototype={
        constructor:DHPayChangeCard,
        ifBlacklist:function(){
            var val=$("#isBlack").val();
            if(val==="false") return;
            $("#payTabId").val("1");
            var $visapay=$(".j-visacard");
            $(".j-payTabs").addClass("one-card");
            $visapay.hide();
            $('.j-payTabs,.pay-titile').hide();
            $($visapay.attr("name")).hide();
            $(".j-dhpay").addClass("p-active");
            //$(".j-dhpayCon").show();
        },
        ifChange:function(){
            var _self=this;
            var $cardNum=payUtil.domExist(_self.id);
            if(!$cardNum) return "找不到DOM changeCard";
            $(_self.billBtnId).hide();
            $(_self.expTimeId).parent().hide();
            $cardNum.change(function(){
                var v= $(this).val();
                if(v!="addNewCard"){
                    var info = $(this).find("option[value='"+v+"']").attr("info");
                    _self.changeCard(_self,info);
                    return;
                }
                 window.location.href=_self.newCardUrl + "?rfid=" + $('#orderId').val();
            });
        },
        changeCard:function(scope,info){
            var _self=scope;
            if(!info) return;
            var address=$.parseJSON(info)
            var html=[];
            html.push("<p>"+address.firstname+"&nbsp;&nbsp;"+address.lastname+"</p>");
            html.push("<p>"+address.addressline1+"</p>");
            html.push("<p>"+address.addressline2+"</p>");
            html.push("<p>"+address.city+"</p>");
            html.push("<p>"+address.state+"</p>");
            html.push("<p>"+address.countryname+"</p>");
            html.push("<p>"+address.postalcode+"</p>");
            html.push("<p>"+address.mobilephone+"</p>");
            html.push('<div class="pay-btn"><input type="button" value="'+msgObj["PAY_for_order"]+'" class="payBtn"></div>');
            $(".j-billSave").html(html.join(""));
            $("#selgateFirstname").val(address.firstname);
            $("#selgateLastname").val(address.lastname);
            $("#selgateAddressline1").val(address.addressline1);
            $("#selgateAddressline2").val(address.addressline2);
            $("#selgateCity").val(address.city);
            $("#selgateState").val(address.state);
            $("#selgateCountry").val(address.country);
            $("#selgatePostalcode").val(address.postalcode);
            $("#selgateMobilephone").val(address.mobilephone);
            /*new DHPayForm({
                visaId:".payBtn",
            });*/
        },
        init:function(){
            this.ifBlacklist();
            this.ifChange();
        }
    };
    new DHPayChangeCard({
        id:".j-cardnum",
        expTimeId:".j-expTime",
        billBtnId:".j-editBillBtn",
        newCardUrl:"/tonewcardpage.do"
    });


});