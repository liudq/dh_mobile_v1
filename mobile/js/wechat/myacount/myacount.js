

$(function(){
	/**为了缩短首页响应时间 改为异步获取四类订单总数*/
	getUnpaidOrderCount();
	getShipOrderCount();
	getRequestOrderCount();
 	getRequestedOrderCount();
 	getBotherOrderCount();

});

/**获取未支付订单总数**/
function getUnpaidOrderCount(){
	$.ajax({
        url: "/order/unpaidOrderCount.do",
        type: 'GET',
        async: false,
        success: function(data){
			if(data.size == "0"){
				$("#unpaidOrderCount").html(data.size);
				$("#unpaidOrderCount").closest("a")[0].href="#";
			}else{
        		$("#unpaidOrderCount").html(data.size);
			}
		}
    });
}
/**获取待发货订单总数**/
function getShipOrderCount(){
	$.ajax({
        url: "/order/shipOrderCount.do",
        type: 'GET',
        async: false,
        success: function(data){
			if(data.size == "0"){
				$("#shipOrderCount").html(data.size);
				$("#shipOrderCount").closest("a")[0].href="#";
			}else{
        		$("#shipOrderCount").html(data.size);
			}
		}
    });
}
/**获取可请款订单总数**/
function getRequestOrderCount(){
	$.ajax({
        url: "/order/requestOrderCount.do",
        type: 'GET',
        async: false,
        success: function(data){
			if(data.size == "0"){
				$("#requestOrderCount").html(data.size);
				$("#requestOrderCount").closest("a")[0].href="#";
			}else{
	        	$("#requestOrderCount").html(data.size);
			}
		}
    });
}
/**获取已入账订单总数**/
function getRequestedOrderCount(){
	$.ajax({
        url: "/order/requestedOrderCount.do",
        type: 'GET',
        async: false,
        success: function(data){
			if(data.size == "0"){
				$("#requestedOrderCount").html(data.size);
				$("#requestedOrderCount").closest("a")[0].href="#";
			}else{
   	     		$("#requestedOrderCount").html(data.size);
			}
		}
    });
}

/**获取纠纷订单总数**/
function getBotherOrderCount(){
	$.ajax({
        url: "/order/botherOrderCount.do",
        type: 'GET',
        async: false,
        success: function(data){
			if(data.size == "0"){
				$("#botherOrderBtn")[0].href="#";
			}
		}
    });
}

