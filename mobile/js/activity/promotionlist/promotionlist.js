/**
 * Created by luhongtao on 2015/03/17.
 */

Zepto(function($){
	DHM.Init.logoSummary();
	DHM.Init.loginState();

    DHM.curpage = 0;
	var inRequest = false;
	var pageList = {};
	DHM.promotionlist ={};

	//获取浏览器URL参数方法
	DHM.promotionlist.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return "";
	}
	
	var bigCategoryId = DHM.promotionlist.getQueryString("cid");
	var promoId = DHM.promotionlist.getQueryString("promoid");
	
	//请求成功要执行的方法
	DHM.promotionlist.requestSuccess = function(data){
		if(!data){
			hideMore();
			return;
		}
		inRequest =false;
		setDailyItems(data);
	}
	function hideMore(){
		$('#j-more').hide();
	}
	function setDailyItems(data){
		if(!data) return;
		var len=data.length;
		var $daily=$("#J_dailyItems");
		for(var i=0;i<len;i++){
			var dd=data[i];
			var url=dd.productShowUrl.replace("www.dhgate.com","m.dhgate.com");
			var html=['<li>',
				'<div class="list-img">',
					/*'<span class="off-icon">',parseInt(100-(dd.discountRate*100)),'</span>',*/
					'<a href=',url,'#lp_284081_1_wap_',dd.itemcode,'><img src=',dd.imageShowUrl,' /></a>',
				'</div>',
				'<a href=',url,'#lp_284081_1_wap_',dd.itemcode,' class="list-cont">',
					'<span class="text-black">',dd.productname,'</span>',
					'<span class="now-price">$',dd.discountPrice,' / Piece</span>',
					'<span class="prev-price">$',dd.price,'</span>',
				'</a>',
				'</li>'];
			$daily.append(html.join(""));
		}
		
	}

	//防止多次重复请求方法
	DHM.promotionlist.toPage = function(page){
		DHM.curpage =page;
		inRequest = true;
		if(pageList[page]){
			console.log('page in use');
			return ;
		}else{
			pageList[page] = true;
		}
		DHM.Common.request({
			url:"http://cms.dhgate.com/cmsapi/clearancesale/get_products_ajax.do?isblank=true&callback=?&sitse=m&language=en&sortField=itemsSold&sortType=desc&pageNo="+page+"&promoid="+promoId+"&bigCategoryId="+bigCategoryId,
			type:"GET",
			dataType:"json",
			fn:DHM.promotionlist.requestSuccess//成功后的方法
		});
	}
	$('#j-more').click(function(){
		if(inRequest){
			//console.log('error');
			return;
		}
		DHM.curpage = DHM.curpage+1;
		DHM.promotionlist.toPage(DHM.curpage);

	});
	//初始化调用 （初始化加载第几页，或跳转到第几页）
	DHM.promotionlist.toPage(1);
});