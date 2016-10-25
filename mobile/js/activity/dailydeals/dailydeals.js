/**
 * Created by zhaojing1 on 2014/12/15.
 */
Zepto(function($){
	DHM.Init.logoSummary();
	DHM.Init.loginState();
	DHM.Countdown({
		id:"#J_dailyCountDown"
		,format:"hms"
		,circle:true
		,fn:function(arry,dom){
			$(dom).html(arry.join(":"));
		}
	});
	DHM.Common.request({
		url:"http://cms.dhgate.com/cmsapi/edmdailydeals/get_products_ajax.do?isblank=true&callback=?",
		type:"GET",
		dataType:"json",
		fn:setDailyItems//成功后的方法
	});
	function setDailyItems(data){
		if(!data) return;
		var len=data.length;
		var $daily=$("#J_dailyItems");
		for(var i=0;i<len;i++){
			var dd=data[i];
			var url=dd.productShowUrl.replace("www.dhgate.com","m.dhgate.com");
			var html=['<li>',
				'<div class="list-img">',
					'<span class="off-icon">',parseInt(100-(dd.discountRate*100)),'</span>',
					'<a href=',url,'#dailyDeals-WAP-',dd.itemcode,'><img src=',dd.imageShowUrl,' /></a>',
				'</div>',
				'<a href=',url,'#dailyDeals-WAP-',dd.itemcode,' class="list-cont">',
					'<span class="text-black">',dd.productname,'</span>',
					'<span class="now-price">$',dd.discountPrice,' / Piece</span>',
					'<span class="prev-price">$',dd.price,'</span>',
				'</a>',
				'</li>'];
			$daily.append(html.join(""));
		}
	}
});