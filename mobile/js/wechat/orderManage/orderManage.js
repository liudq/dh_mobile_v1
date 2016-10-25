/* 动画 */
function Aniamtion(Layyer,LayyerIframe,Html,state,scrollHeight){
    if(Layyer.attr('hasload')!='yes'){
        Layyer.html('');
        Layyer.append(Html);
        Layyer.attr('hasload','yes');
    }
    Layyer.show();

    if(state==1){

        var iHeight = Layyer.height();
        LayyerIframe.show();
        LayyerIframe.height($(window).height());

        setTimeout(function(){
             Layyer.animate({translateY : '-'+iHeight+'px',translate3d: '0,0,0'},300, 'ease-out', function(){
              //$(document.body).height($(window).height()).css('overflow','hidden');
               //window.scrollTo(0, scrollHeight);
              
            });
        },0);
    }else{
      
        LayyerIframe.hide();
        Layyer.animate({translateY : '0',translate3d: '0,0,0'},300, 'ease-out', function(){ 
            
            //$(document.body).height('').css('overflow',''); 

            // window.scrollTo(0,scrollHeight);
         },10);
    }
}
/* 分页选择select框 */
var PageSelect = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.page)[0]) {
        return;
    }
    this.proManSelect = $('.' + this.options.proManSelect);
    this.page = $('#' + this.options.page);
    this.Init();
};
/* 完全发货弹层 */
var CompleteDeliver = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.layyerCon)[0]) {
        return;
    }
    this.layyerCon = $('#' + this.options.layyerCon);
    this.layyerConIframe = $('#' + this.options.layyerConIframe);
    this.comDeliverBtn = $('.' + this.options.comDeliverBtn);
    this.init();
};
CompleteDeliver.prototype = {
    setOptions: function(options){
        this.options = {
            comDeliverBtn:'j-comDeliverBtn',
            layyerConIframe:'J_layyerConIframe',
             layyerCon:'J_layyerCon'
        };
        $.extend(this.options, options || {});
    },
    init:function(){
        var _this = this;
        var deliverHtml = '<p>是否确认请完全发货？</p>\
        <div class="lay-confirmo" id="shipID"><input type="button" value="完全发货"/></div>\
        <div class="lay-cancel"><input type="button" value="取消"/></div>';
        

       this.comDeliverBtn.click(function(){
    	   if(validateInfo()){
	            _this.scrollHeight = $(window).scrollTop();
	           
	            Aniamtion(_this.layyerCon,_this.layyerConIframe,deliverHtml,'1',_this.scrollHeight);
    	   }
       });
       this.layyerCon.delegate('.lay-cancel','click',function(){

             Aniamtion(_this.layyerCon,_this.layyerConIframe,'','0',_this.scrollHeight);
       });
       
       this.layyerCon.delegate('#shipID','click',function(){
				//$('.lay-cancel').trigger('click');
    	   		/**确认发货*/
    	   		diliverOrd();
    	   		
       });
       
    }
};
/* 请款弹层 */
var Requests = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.layyerCon)[0]) {
        return;
    }
    this.layyerCon = $('#' + this.options.layyerCon);
    this.layyerConIframe = $('#' + this.options.layyerConIframe);
    this.requestBtn = $('.' + this.options.requestBtn);
    this.allRequest = $('.' + this.options.allRequest);
    this.init();
};
Requests.prototype = {
    setOptions: function(options){
        this.options = {
            requestBtn:'j-requestBtn',
            allRequest:'j-allRequest',
            layyerConIframe:'J_layyerConIframe',
             layyerCon:'J_layyerCon'
        };
        $.extend(this.options, options || {});
    },
    init:function(){
        var _this = this;
        var LayyeroneHtml = '<p>确认对该订单进行请款？确认后该订单将会列到“已入账”的列表中。</p>\
        <div class="lay-confirmo" id="requestID"><input type="button" value="确认请款" /></div>\
        <div class="lay-cancel"><input type="button" value="取消" /></div>';
        var LayyerAllHtml = '<p>确认对所有订单进行请款？确认后订单将会列到“已请款”的列表中。</p>\
        <div class="lay-confirmo"><input type="button" value="确认请款" /></div>\
        <div class="lay-cancel j-requestCancel"><input type="button" value="取消" /></div>';
       this.requestBtn.click(function(){
    	   	$("#orderNo").val($(this).attr("orderNo"));
         	if(!_this.layyerConIframe.attr('hasoneOrder')){
                _this.layyerConIframe.removeAttr('hasClick'); 
                _this.layyerCon.removeAttr('hasload'); 
                LayyerHtml = LayyeroneHtml
            }
            _this.scrollHone = $(window).scrollTop();
            Aniamtion(_this.layyerCon,_this.layyerConIframe,LayyerHtml,'1',_this.scrollHone );
            _this.layyerConIframe.attr('hasoneOrder','oneyes')
       });
        this.allRequest.click(function(){
            _this.scrollHtwo = $(window).scrollTop();
            if(!_this.layyerConIframe.attr('hasClick')){
                _this.layyerConIframe.removeAttr('hasoneOrder'); 
                _this.layyerCon.removeAttr('hasload'); 
                LayyerHtml=LayyerAllHtml;
            }
            
            Aniamtion(_this.layyerCon,_this.layyerConIframe,LayyerHtml,'1',_this.scrollHtwo );
            _this.layyerConIframe.attr('hasClick','yes')
       });
       this.layyerCon.delegate('.j-requestCancel input','click',function(){
             Aniamtion(_this.layyerCon,_this.layyerConIframe,'','0');
       });
       this.layyerCon.delegate('#requestID','click',function(){
				//$('.lay-cancel').trigger('click');
    	   		/**确认请款*/
    	   		requestOrder();
    	   		
       });
    }
};

/* 修改价格 */
var ModifyPrice = function(options){
    this.setOptions(options);
    if (!$('.' + this.options.modifyCon)[0]) {
        return;
    }
    this.modifyCon = $('.' + this.options.modifyCon);
    this.modPriceBtn = $('.' + this.options.modPriceBtn);
    this.init();
};
ModifyPrice.prototype = {
    setOptions: function(options){
        this.options = {
            modifyCon:'j-modifyCon',
            modPriceBtn:'j-modPriceBtn'
            
        };
        $.extend(this.options, options || {});
    },
    init:function(){
        var _this = this;
        
        this.modifyCon.delegate('.j-mod-style a','click', function(evt){
            _this.radioTab(evt);
        });
         this.modifyCon.delegate('.j-modCancel input','click', function(evt){
            _this.modPriceBtn.show();
            _this.modifyCon.hide();
        });
        this.modPriceBtn.click(function(){
            $(this).hide();
            _this.modifyCon.show();
        });
    },
    radioTab:function(evt){
        var target = $(evt.currentTarget);
        if(target.hasClass('radioChecked')){
            target.removeClass('radioChecked');
        }else{
            target.addClass('radioChecked').parent().siblings('span').find('a').removeClass('radioChecked');
        }
    }
};
$(function(){
 
    /* 完全发货弹层 */
    var comDeliver = new CompleteDeliver();
    /* 请款弹层 */
    var request = new Requests();
     /* 修改价格 */
    var modPrice = new ModifyPrice();
});
/*提交发货信息*/
function diliverOrd(){
	var orderNo = $("#orderNo").val();
	var trankNo = $("#trankNo").val();
	var shippingType = $("#shippingType").val();
	
	$.ajax({
        url: "/order/doDiliverOrder.do",
        data: {
			orderNo: orderNo,
			trankNo:trankNo,
			shippingType:shippingType
		},
        type: 'GET',
        async: false,
        success: function(data){
			if(data.result == "SUCCESS"){
				/**发货成功页*/
				window.location="/order/doResult.do?viewType=1";
			}else if(data.result == "reShip"){
				/**重复发货*/
				window.location="/order/doResult.do?viewType=2";
			}else if(data.result == "sysErr"){
				/**系统异常*/
				window.location="/order/doResult.do?viewType=3";
			}else{
				/**开放平台返回错误信息*/
				$("#tip").html(data.result).show();
			}
        },
        error:function(){
        	alert("error");
        }
    });	
	
	//隐藏浮层
	$('.lay-cancel').trigger('click');
}

function validateInfo(){
	var trankNo = $("#trankNo").val();
	var trankNoRgx = /^\d*\w*$/;
	if(trankNo == "" || !trankNoRgx.test(trankNo)){
		$("#tip").html("物流单号由数字和字母组成").show();
		return false;	
	}
	return true;
}
/**加载可用发货方式*/
function loadShipType(){
	$.ajax({
        url: "/shippingTypesGet.do",
        data: {},
        type: 'GET',
        async: false,
        success: function(data){
        	if(data.length>0){
    			var opts = "";
        		for(var i=0;i<data.length;i++){
        			opts += "<option value='"+data[i].name+"'>"+data[i].name+"</option>";
        		}
    			$("#shippingType").html(opts);
        	}
        },
        error:function(){
        	alert("系统异常");
        }
    });	
	
}

/**订单请款*/
function requestOrder(requestOrderNO){
	if(requestOrderNO == ""){
		return;
	}
	$.ajax({
        url: "/order/doRequestOrder.do",
        data: {
			orderNo:requestOrderNO
			},
        type: 'post',
        async: true,
        success: function(data){
			if(data.result == "4" || data.result == "3"){
				if(data.result == "4"){
					alert("请款成功！");
					window.location.reload();
				}else{
					alert("请款失败,稍后再试！");
				}
			}else if(data.result == "2"){
				alert("订单不符合请款条件");
			}else if(data.result == "1"){
				alert("没有这个订单！");
			}else{
				/**开放平台返回错误信息*/
				alert("系统异常,稍后再试！")
			}
        },
        error:function(){
        	alert("error");
        }
    });	
}

function getApplymoneytype(requestOrderNO){
	if(requestOrderNO == ""){
		return;
	}
	$.ajax({
        url: "/order/getApplymoneytype.do",
        data: {
			orderNo:requestOrderNO
			},
        type: 'post',
        async: true,
        success: function(data){
		/**未请款标志 -- 1 or null;已请款标志 --2; 拒绝请款标志 -- 3;buyer已请款标志 --4;seller , buyer都已请款标志 -- 5;新加**/
			var operateHtml = "";
			if(data.result == ""){
				/**未请款*/
				operateHtml += "<input type='submit' value='请款' class='w-submit' onclick='requestOrder("+requestOrderNO+");'/>";
			}else if(data.result == "2"){
				/**重复请款*/
				operateHtml += "<span class='w-submit'>已请款标志</span>";
			}else if(data.result == "3"){
				/**buyer已请款*/
				operateHtml += "<span class='w-submit'>buyer已请款</span>";
			}else if(data.result == "4"){
				/**seller,buyer已请款*/
				operateHtml += "<span class='w-submit'>seller,buyer已请款</span>";
			}else if(data.result == "5"){
				/**新加*/
				operateHtml += "<span class='w-submit'>新加</span>";
			}else{
				operateHtml += "<span class='w-submit'>未获取到请款标识</span>";
			}
			$("#operate").html(operateHtml);
        },
        error:function(){
        	alert("error");
        }
    });
}

function isRequestOrder(requestOrderNO){
	if(requestOrderNO == ""){
		return;
	}
	$.ajax({
        url: "/order/isRequestOrder.do",
        data: {
			orderNo:requestOrderNO
			},
        type: 'post',
        async: true,
        success: function(data){
		/**未请款标志 -- 1 or null;已请款标志 --2; 拒绝请款标志 -- 3;buyer已请款标志 --4;seller , buyer都已请款标志 -- 5;新加**/
			var operateHtml = "";
			if(data.result == true){
				/**可请款*/
				operateHtml += "<div class='w-loginbtn'><input type='submit' class='w-submit' value='请款' onclick='requestOrder("+requestOrderNO+");'></div>";
			}else{
				operateHtml += "<div class='w-modcancel'><input type='submit' class='w-submit' value='暂不能请款'></div>";
			}
			$("#operate").html(operateHtml);
        },
        error:function(){
        	alert("error");
        }
    });
}