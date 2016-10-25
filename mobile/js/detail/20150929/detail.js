/**
 * Created by xiaonnannan on 2015/06/15.
 */
Zepto(function($){
	window.scroll(0,0);
	var basePath = document.domain;
	var skuInfonumvaluestate = false;
	var sku_List_hei = "";
	var min_order = "";
	var max_order = "";
	var in_stock = "";
	var promoDto="";
	var b2b_buyer_lv=DHM.Cookie.getCookie("b2b_buyer_lv");
	var skulastvalue = "";      //最后的skuvalue值
	var itemAttrListSkulenght = "";  //属性
	var promoLimitPurchaseNum ="";
	var minInventoryNumFlag = "";
	var measureName ="";
	var productId="";
	var itemVipDto="";
	var itemAttrListSku="";
	var skuInfonumvalue = "";
	var cateDispId ="";
	var supplierid ="";
	var catepubid ="";
	var productName ="";
	var minPrice ="";
	var thumbList ="";
	var firstCateName="";
	var secondCateName="";
	var thirdCateName="";
	var bid_sid_pid="";
	var ntalker_js_url="";
	var line_pricep = "";
	var islogin="";
	var defInventoryQty ="",
		defaultMinPurchaseNum="",
		typeId="",
		isinventory="",//是否为备货商品 
		istate="";//是否售空
	//引入调用入口
	var detailconfig = window.DETAIL,
		tools = detailconfig.tools,
		Appopen = tools.Appopen,
		Priceonapp = tools.Priceonapp,
		Shipto = tools.Shipto;
		DataErrorLog = tools.DataErrorLog,
		Tip = tools.Tip,
		AddToFav = tools.AddToFav,
		DhCoupon = tools.DhCoupon,
		StoreCoupon	= tools.Storecoupon,
		wwwURL = detailconfig.opts.wwwURL;
	var canonicalURL ="";
	var lastDispName ="";
	var oriImgList="";
	var item_recentvisit=[];
	var itemcode =window.location.pathname.match(/(\d+).html/)[1];
	var searchUrl =window.location.search;
	var paramInfo={
		returnURL:window.location.href,
		proid:$("#J_proInfo").data("proid"),
		itemCode:$("#J_proInfo").data("itemcode"),
		quantity:$("#J_quantity").val(),
		shippingCost:null,
		ctyName:null,
		skuObj:null
	};
	var DetailUtil={
		init:function(callback){
			DHM.Init.loginState();
			var _self=DetailUtil;
			_self.$layer=null;
			_self.hash=DetailUtil.getHashObj();
			_self.display=DetailUtil.getDiv();
			_self.ev=DetailUtil.getEv();
			_self.mOnLoad();
			_self.hashChange();
			_self.getPrice(callback);
			_self.goTop();
			_self.addCookie();
			if($('#opacityLayer').html()&&$.trim($('#opacityLayer').html())){
				$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
				setTimeout(function(){
					$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
				},3000);
			}
			var len=$("#J_skuLayer").find("dt span").length;
			if(len<3){
				$("#J_skuLayer").find("dd").each(function(i,e){
					$(e).find("span").eq(1).css("text-decoration","none");
				});
			}
		},
		checkTime:function(n){
			if(n < 10 && n >1){
				return n="0" + n
			}
	  		return n;
		},
		getPrice:function(callback){
			var self = this;
			//var _self =DetailUtil; 
			var apiSet ={
				priceUrl:'/mobileApiWeb/item-Item-getItemBaseInfo.do?'
				
			}
			$.ajax({
				url: apiSet.priceUrl,
			
				data:{
					client:"wap",
					itemcode:itemcode
				},
				type: 'GET',
				cache: true,
				dataType: 'json',
				success: function(data){
					if(data && data.state=="0x0000"){
						if(data.data!==""){
							var dataJson = data.data,
								itemcode = dataJson.itemCode,
								htmlurl = dataJson.htmlurl,
							    oriImgList = dataJson.oriImgList,
								maxPrice = dataJson.maxPrice,
								lot = dataJson.lot,
								skuAttrNameList = dataJson.skuAttrNameList,
								promEndDate = dataJson.promEndDate,
								serverTime = dataJson.serverTime,
								specification = dataJson.specification;
								
								//全局变量
								isinventory = dataJson.isinventory;
								defInventoryQty = dataJson.defInventoryQty;
								istate = dataJson.istate;
								thumbList = dataJson.thumbList;  //单个原图地址
								minPrice = dataJson.minPrice;
								productName = dataJson.productName;
								lastDispName = dataJson.itemMetaSeo.lastDispName;
								min_order = dataJson.minOrder;
								itemVipDto = dataJson.itemVipDto;
								cateDispId =dataJson.cateDispId;
								supplierid =dataJson.supplierInfo.supplierid;
								catepubid =dataJson.catePubId;
								firstCateName = dataJson.trackInfo.firstCateName;
								secondCateName = dataJson.trackInfo.secondCateName;
								thirdCateName = dataJson.trackInfo.thirdCateName;
								bid_sid_pid =dataJson.ntalker.bid_sid_pid;
								ntalker_js_url = dataJson.ntalker.ntalker_js_url;
								productId = dataJson.productId;
								measureName = dataJson.measureName;
							var	ntalkSellerId = dataJson.ntalker.ntalker_sellerid,
								ntalkBuyerId = dataJson.ntalker.ntalker_buyerid;
							var supplierJson = dataJson.supplierInfo,
								suppliername = supplierJson.suppliername,//卖家名称
								contactpersondomainname = supplierJson.contactpersondomainname,//期望显示名称
								servlevel = supplierJson.servlevel,
								levelId = supplierJson.levelId,
								showpercentum = supplierJson.showpercentum,//好评百分比
								cofirmorderAccumulated = supplierJson.cofirmorderAccumulated,//交易总量
								year = supplierJson.year,//seller建设年份，默认是1，新加的
								sponsor = supplierJson.sponsor;//是否是收费会员 A:金色，钻石礼包；B：蓝色，白金礼包；C：白色，黄金礼包，新加的?

								if(data && dataJson.promoDto !=undefined){
									typeId = dataJson.promoDto.typeId;
								}
								self.TrackingD();
								self.trackingGoogle();
								self.trackingNerverBlueRemark();
								self.getReview();
								//price on app唤起功能
								var isVip=DHM.Cookie.getCookie("b2b_buyer_lv");
								if(dataJson.mobileOnlyDto && dataJson.mobileOnlyDto.isMobileOnly){
									var hasVipPrice = dataJson.mobileOnlyDto.mobileOnlyMinVipPrice;
									if(isVip==1 && hasVipPrice && hasVipPrice!=''){
										priceOnapp.$dRoot.trigger('priceOnapp',[dataJson.mobileOnlyDto.mobileOnlyMinVipPrice, dataJson.mobileOnlyDto.mobileOnlyMaxVipPrice]);
									}else{
										priceOnapp.$dRoot.trigger('priceOnapp',[dataJson.mobileOnlyDto.mobileOnlyMinPrice, dataJson.mobileOnlyDto.mobileOnlyMaxPrice]);
									}
									
								}

							//获取头部seo
							var freeShipping = dataJson.isfreeShipping == true?"free shipping,":"";
							var htmlStr=[
									'<title>'+productName+'　from　'+suppliername+' $'+minPrice+'　|　DHgate Mobile</title>',
									'<meta name="keywords" content="wholesale'+lastDispName+'"/>',
									'<meta name="description" content="'+freeShipping+'Find best '+productName+'  at discount prices from Chinese '+lastDispName+' supplier - '+suppliername+'on m.dhgate.com." />'
    						];
    						var name= $($("meta[name$=ROBOTS]")[0]);
							name.before(htmlStr.join(""));
							
							callback && callback(min_order);

							var itemSaleNum = data.data.itemSaleNum;
							if(itemSaleNum ===undefined || itemSaleNum == 0){
								$('.j-ordersCont').hide();
							}else{
								$('.j-ordersCont').show();
							}
							itemSaleNum >1 ?$('.j-orders').html('<span class="saleNum">'+itemSaleNum+'</span> Orders'):$('.j-orders').html('<span class="saleNum">'+itemSaleNum+'</span> Order');
							
							//倒计时
							function countdown(){
								if(data && dataJson.promoDto !=undefined){
									var promoDto =dataJson.promoDto,
										$promEndDate=new Date(promoDto.promEndDate),
						        		$systemTime=new Date(serverTime),
										typeId = promoDto.typeId,
										now=new Date(),
							        	mtimes =$promEndDate.getTime() - now.getTime(),
							        	d = Math.floor(mtimes / 1000 / 60 / 60 / 24),
								    	h = Math.floor(mtimes / 1000 / 60 / 60 % 24),
								    	m = Math.floor(mtimes / 1000 / 60 % 60),
								    	s = Math.floor(mtimes / 1000 % 60),
								    	day = d > 1?"Days":"Day",
								    	hour = h > 1?"hours":"hour";	    	
								    if(d >= 1){
								    	$('#J_countdown').html('<span>'+self.checkTime(d)+day+'</span><span>'+self.checkTime(h)+hour+' left</span>');
								    }else{
								    	$('#J_countdown').html('<span>'+self.checkTime(h) +'h</span><span>'+self.checkTime(m)+'m</span><span>'+self.checkTime(s) +'s left</span>');
								    }
								    if(typeId ==2|| typeId ==3){//如果是dailydetails和店铺限时限量显示掉计时
										$('#J_countdown').show();
									}
								}
								
							}
			            	//商品名称
			            	$('#J_proInfo').html(productName);
			            	//if(!searchUrl){
			            		for(var i=0;i<thumbList.length;i++){
									if(i==0){
										var html =['<li>','<img src="'+thumbList[i]+'"  data-src='+thumbList[i]+' alt="'+productName+'" />','<div class="istateShow"></div>','<span class="soldOut"></span>','</li>']
									}else{
										var html =['<li>','<img src=""  data-src='+thumbList[i]+' alt="'+productName+'" />','<div class="istateShow"></div>','<span class="soldOut"></span>','</li>']
									}
									$('#J_detailImgCon').append(html.join(""));
								}
								$('.Sku_leadimg').attr('src',thumbList[0]);
								for(var i=0;i<oriImgList.length;i++){
									var html =['<li>','<img src=""  data-src='+oriImgList[i]+' alt="'+productName+'" />','</li>']
									$('#j-imgLayerCon').append(html.join(""));
								}
			            	//}
							/*if(!searchUrl){*/
								for(var i=0;i<specification.length;i++){
									var html =['<p>','<span>',specification[i].targetName+':','</span>','<var>',specification[i].targetValue,'</var>','</p>'];
									$('#J_specificsLayer').append(html.join(""));
								}
							/*}else{
								$('#J_recommendItems').hide();
							}*/
							var $cm = $('#J_specificsLayer p var').eq(5).html();
								$('#J_specificsLayer p var').eq(5).html($cm + '(cm)');
							var $kg =$('#J_specificsLayer p var').eq(6).html();
								$('#J_specificsLayer p var').eq(6).html($kg + '(kg)');
							var $h2 =$('#J_specificsLayer p var').eq(2).html();
								$('#J_specificsLayer p var').eq(2).html('<h2>'+$h2+'</h2>');
							var value=DHM.Cookie.getCookie("b2b_buyer_lv");//b2b_buyer_lv ==1代表是vip买家
							if(value ==1 && dataJson.itemVipDto!=null && dataJson.promoDto !=undefined){
								promoDto =dataJson.promoDto;
								promoDtoDiscountRate =dataJson.promoDto.discountRate;
								if(lot >1){
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lots');
									}else{
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lot');
									}
									$('.commonPrice,.sku_price').html('<strong>US '+'$'+dataJson.itemVipDto.minVipPrice+' - '+dataJson.itemVipDto.maxVipPrice+'</strong> / <span class="smallPrice" style="display:none;">Lot</span><span class="smallPrices">Lot&nbsp;&nbsp;('+lot+'&nbsp;'+dataJson.plural+' / Lot)</span>');
									$('.lineThrough,#line_price').html('US&nbsp;' +'$'+dataJson.minPrice + ' - ' + dataJson.maxPrice + ' / ' +'Lot');
									$("#J_quantity").val(dataJson.minOrder)	;
									$('.j-priceUnit').html(lot+'&nbsp;'+dataJson.plural+' / Lot');
									var quantityVal = $('#J_quantity').val() > 1?'Lots':"Lot";
										$('.j-companyInfo').html(quantityVal);
										$('.j-unitInfo').html('Limited to <span class="j-inventory">'+promoLimitPurchaseNum+'&nbsp;</span><span class="j-company dhm-hide"> Lots</span><span class="j-companyShow">'+quantityVal+ ' </span>per Buyer');
								}else{
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' + dataJson.plural);
									}else{
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;'+ measureName);
									}
									$('.commonPrice,.sku_price').html('<strong>US '+'$'+dataJson.itemVipDto.minVipPrice+' - '+dataJson.itemVipDto.maxVipPrice+'</strong> / <span class="smallPrice">'+measureName+'</span>');
									$('.lineThrough,#line_price').html('US&nbsp;' +'$'+dataJson.minPrice + ' - ' + dataJson.maxPrice + ' / '  +measureName);	
									$('#sku_lot').css('display','none')
								}
								if(dataJson.promoDto.promoTypeId=="0"){
									$('.give-ico').show();
									$('.give-ico').html(Math.round((1- promoDtoDiscountRate)*100)+'% Off on VIP Price');
								}else{
									$('.give-ico').html('$'+Math.round(promoDtoDiscountRate)+' Off on VIP Price');
								}
								var quantityVal = $('#J_quantity').val() > 1?dataJson.plural:measureName;
										$('.j-companyInfo').html(quantityVal);
										$('.j-unitInfo').html('Limited to <span class="j-inventory">'+promoLimitPurchaseNum+'</span><span class="j-company dhm-hide">'+dataJson.plural+'</span><span class="j-companyShow">&nbsp;'+quantityVal+'</span>&nbsp;per Buyer');
								//显示倒计时
								setInterval(countdown,1000);
							}else if(value ==1 && dataJson.itemVipDto!=null){  //如果是vip买家，即是vip商品显示vip价格 如果是promo商品显示促销价，否则显示原价。
								itemVipDto = dataJson.itemVipDto;
								if(lot >1){
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lots');
									}else{
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lot');
									}
									if(itemVipDto.minVipPrice ==  itemVipDto.maxVipPrice && minPrice ==maxPrice){
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+'</strong> / <span class="smallPrice" style="display:none;">Lot</span><span class="smallPrices">Lot&nbsp;&nbsp;('+lot+'&nbsp;'+dataJson.plural+' / Lot)</span>');
										$('.lineThrough,#line_price').html('US&nbsp;' +'$'+minPrice +  ' / '  +'Lot');
									}else{
										//$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+'- '+itemVipDto.maxVipPrice+'</strong> / <span class="smallPrice">Lot</span>');
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+' - '+itemVipDto.maxVipPrice+'</strong> / <span class="smallPrice" style="display:none;">Lot</span><span class="smallPrices">Lot&nbsp;&nbsp;('+lot+'&nbsp;'+dataJson.plural+' / Lot)</span>');
										$('.lineThrough,#line_price').html('US&nbsp;' +'$'+minPrice + ' - ' + maxPrice + ' / '  +'Lot');
									}
									$('.j-priceUnit').html(lot+'&nbsp;'+dataJson.plural+' / Lot');
									var quantityVal = $('#J_quantity').val() > 1?'Lots':"Lot";
										$('.j-companyInfo').html(quantityVal);
										$('.j-unitInfo').html('Limited to <span class="j-inventory">'+promoLimitPurchaseNum+'&nbsp;</span><span class="j-company dhm-hide"> Lots</span><span class="j-companyShow">'+quantityVal+ ' </span>per Buyer');
									$("#J_quantity").val(dataJson.minOrder)	;;

								}else{
									if(dataJson.minOrder >1){
										$('#MinOrder,#MinOrder_sku').html(dataJson.minOrder+ '&nbsp;' + dataJson.plural);
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;'+ dataJson.plural);
									}else{
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;'+ measureName);
									}	
									if(itemVipDto.minVipPrice ==  itemVipDto.maxVipPrice && minPrice ==maxPrice){
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+'</strong> / <span class="smallPrice">'+measureName+'</span>');
										$('.lineThrough,#line_price').html('US&nbsp;' +'$'+minPrice + ' / '  +measureName);
									}else{
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+' - '+itemVipDto.maxVipPrice+'</strong> / <span class="smallPrice">'+measureName+'</span>');
										$('.lineThrough,#line_price').html('US&nbsp;' +'$'+minPrice + ' - ' + maxPrice + ' / ' +measureName);
									}
									var quantityVal = $('#J_quantity').val() > 1?dataJson.plural:measureName;
										$('.j-companyInfo').html(quantityVal);
										$('.j-unitInfo').html('Limited to <span class="j-inventory">'+promoLimitPurchaseNum+'</span><span class="j-company dhm-hide">'+dataJson.plural+'</span><span class="j-companyShow">&nbsp;'+quantityVal+'</span>&nbsp;per Buyer');
								$('#sku_lot').css('display','none')
								}
								$('.give-ico').html('VIP Exclusive Price');
								$('.give-ico').addClass('vipExclusive');

							}
							else if(data && dataJson.promoDto !=undefined){
								promoDto =dataJson.promoDto;//全局变量SKU价格区间所用
								var promName = promoDto.promName,
									promoDtoDiscountRate =promoDto.discountRate,
									promoMinPrice = promoDto.promoMinPrice,
									promoMaxPrice = promoDto.promoMaxPrice;

						        //显示倒计时
								setInterval(countdown,1000);
								
				            	if(dataJson.promoDto.promoTypeId=="0"){
									$('.give-ico').show();
									$('.give-ico').html(Math.round((1- promoDtoDiscountRate)*100)+'% Off');
								}else if(dataJson.promoDto.promoTypeId=="10"){
									$('.give-ico').html('$'+Math.round(promoDtoDiscountRate) +'&nbsp;Off');
								}
								if(lot > 1){
									if(dataJson.minOrder>1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lots');
									}else{
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lot');
									}
									if(minPrice ==maxPrice && promoMinPrice == promoMaxPrice){
										$('.lineThrough,#line_price').html('US &nbsp;' + '$'+minPrice + ' / '+'Lot');
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+promoMinPrice+'</strong> / <span class="smallPrice" style="display:none;">Lot</span><span class="smallPrices">Lot&nbsp;&nbsp;('+lot+'&nbsp;'+dataJson.plural+' / Lot)</span>');
									}else{
										$('.lineThrough,#line_price').html('US ' + '$'+minPrice + ' - ' + maxPrice + ' / '  +'Lot');
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+promoMinPrice+' - '+promoMaxPrice+'</strong> / <span class="smallPrice" style="display:none;">Lot</span><span class="smallPrices">Lot &nbsp;&nbsp;('+lot+'&nbsp;'+dataJson.plural+' / Lot)</span>');
									}
									$('.j-priceUnit').html(lot+'&nbsp;'+dataJson.plural+' / Lot');
									var quantityVal = $('#J_quantity').val() > 1?'Lots':"Lot";
									$('.j-companyInfo').html(quantityVal);
									$('.j-unitInfo').html('Limited to <span class="j-inventory">'+promoLimitPurchaseNum+'&nbsp;</span><span class="j-company dhm-hide">Lots</span><span class="j-companyShow">'+quantityVal+'</span> per Buyer');
									$("#J_quantity").val(dataJson.minOrder)	;
								}else{
									if(minPrice ==maxPrice && promoMinPrice == promoMaxPrice){
										$('.lineThrough,#line_price').html('<span>US </span>$'+minPrice+' / '+measureName+'')
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+promoMinPrice+'</strong> / <span class="smallPrice">'+measureName+'</span>');	
									}else{
										$('.lineThrough,#line_price').html('<span>US </span>$'+minPrice+' - '+maxPrice+' / '+measureName+'')
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+promoMinPrice+' - '+promoMaxPrice+'</strong> / <span class="smallPrice">'+measureName+'</span>');
									}
									if(dataJson.minOrder > 1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' + dataJson.plural);
									}else{
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' + measureName);
									}
									var quantityVal = $('#J_quantity').val() > 1?dataJson.plural:measureName;
										$('.j-companyInfo').html(quantityVal);
										$('.j-unitInfo').html('Limited to <span class="j-inventory">'+promoLimitPurchaseNum+'</span><span class="j-company dhm-hide">'+dataJson.plural+'</span><span class="j-companyShow">&nbsp;'+quantityVal+'</span>&nbsp;per Buyer');
									$('#sku_lot').css('display','none');	
								}

							}else{
								if(lot > 1){
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lots');
									}else{
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;' +'Lot');
									}
									if(minPrice == maxPrice){
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+minPrice+'</strong> / <span class="smallPrice" style="display:none;">Lot</span><span class="smallPrices">Lot&nbsp;&nbsp;('+lot+'&nbsp;'+dataJson.plural+' / Lot)</span>');
									}else{
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+minPrice+' - '+maxPrice+'</strong> / <span class="smallPrice" style="display:none;">Lot</span><span class="smallPrices">Lot&nbsp;&nbsp;('+lot+'&nbsp;'+dataJson.plural+' / Lot)</span>');
										$('.j-priceUnit').html(lot+'&nbsp;'+dataJson.plural+' / Lot');
									}
									$("#J_quantity").val(dataJson.minOrder)	;
									var quantityVal = $('#J_quantity').val() > 1?'Lots':"Lot";
										$('.j-companyInfo').html(quantityVal);
										$('.j-unitInfo').html('Limited to <span class="j-inventory">'+promoLimitPurchaseNum+'&nbsp;</span><span class="j-company dhm-hide"> Lots</span><span class="j-companyShow">'+quantityVal+ ' </span>per Buyer');
								}else{
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;' + dataJson.plural+'');	
									}else{
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;' + measureName);
									}
									if(minPrice == maxPrice){
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+minPrice+'</strong> / <span class="smallPrice">'+measureName+'</span>');
									}else{
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+minPrice+' - '+maxPrice+'</strong> / <span class="smallPrice">'+measureName+'</span>');
									}
									var quantityVal = $('#J_quantity').val() > 1?dataJson.plural:measureName;
										$('.j-companyInfo').html(quantityVal);
										$('.j-unitInfo').html('Limited to <span class="j-inventory">'+promoLimitPurchaseNum+'</span><span class="j-company dhm-hide">'+dataJson.plural+'</span><span class="j-companyShow">&nbsp;'+quantityVal+'</span>&nbsp;per Buyer');
									$('#sku_lot').css('display','none');
								}
								$('.lineThrough').hide();
								$('.give-ico').hide();
							}
							if(istate ==false){
								$('.detail-price').find('.addCart').text('Add to Cart');
								$('.addCart').addClass('disableAddCart');
								$('.J_buyNow,.J_addToCart').addClass('noClick');
								$('.done').addClass('sold-out');
								$('.buyNow_confirm').addClass('sold-out');
								$('.istateShow').show();
								$('.soldOut').show();
								$('.j-shiptobtn').attr('issold',0)
							}else{
								$('.J_buyNow,.J_addToCart').removeClass('noClick');
								$('.addCart').addClass('');
								$('.istateShow').hide();
								$('.soldOut').hide();
								$('.j-shiptobtn').attr('issold',1)
							}
							if(skuAttrNameList.length > 0){
								$('#selectAttr').html("Please Select"+"&nbsp;" +skuAttrNameList.join(","));
							}
				           if(dataJson.isfreeShipping == true){
								$('#J_shippingCost').html('<strong itemcode='+dataJson.itemCode+' htmlurl='+dataJson.htmlurl+' productId='+dataJson.productId+' cateDispId='+dataJson.cateDispId+' prodLineId='+dataJson.prodLineId+' ntalkerSellerid ='+dataJson.ntalker.ntalker_sellerid+'  ntalker_js_url='+dataJson.ntalker.ntalker_js_url+'>Free Shipping to '+dataJson.visitCty+'</strong>');
							}else{
								 $('#J_shippingCost').html('<strong itemcode='+dataJson.itemCode+' htmlurl='+dataJson.htmlurl+' productId='+dataJson.productId+' cateDispId='+dataJson.cateDispId+' prodLineId='+dataJson.prodLineId+' ntalkerSellerid ='+dataJson.ntalker.ntalker_sellerid+'  ntalker_js_url='+dataJson.ntalker.ntalker_js_url+'>Ship to '+dataJson.visitCty+'</strong>');
							}

							//Supplier卖家店铺信息
							var $supplier = $('.detail-store');
							var $contactname = (contactpersondomainname) ?  contactpersondomainname : suppliername;//显示期望显示名称，没有的话显示卖家名称

							var $sponsor = "",
								activityType = dataJson.supplierInfo.activityType,
								supplierSeq= dataJson.supplierInfo.supplierSeq;
							if(sponsor == "22"){ //金色 钻石礼包
								$sponsor = "jsponsor";
							} else if(sponsor == "21"){//蓝色 白金礼包
								$sponsor = "lsponsor";
							} else if(sponsor == "20"){//白色 黄金礼包
								$sponsor = "hsponsor";
							}
							if(activityType == 2){
								$('.j-store-entrance').html('<a href="http://m.dhgate.com/store/'+supplierSeq+'#st-navigation-storehome-itemold"  ><span class="storeEnlf"></span><span class="midTxt"><var>Seller Discount</var></span><span class="storeEnRi"></span></a>').show();
							}else if(activityType ===undefined){
								$('.j-store-entrance').hide();
							}
							else{
								$('.j-store-entrance').html('<a href="http://m.dhgate.com/store/'+supplierSeq+'#st-navigation-storehome-itemold"  ><span class="storeEnlf"></span><span class="midTxt"><var>App-Exclusive Seller Discount</var></span><span class="storeEnRi"></span></a>').show();
							}
							var $levelStr = "";
							if(levelId == "P"){
								$levelStr = ['<div class="rt iconTxt">Premium Merchant<span class="levelP"></span></div>'];
							} else if(levelId == "T"){
								$levelStr = ['<div class="rt iconTxt">Top Merchant<span class="levelT"></span></div>'];
							}
							//var html =['<div class="sold-by">'+ $levelStr +'Seller:'+$contactname+'</div>','<div><span class='+ $sponsor +'></span></div><div class="ft"><b>'+ cofirmorderAccumulated + '</b> Transactions,<b>'+ showpercentum + '</b>% Positive Feedback</div>'];
							var html =['<div class="sold-by">'+ $levelStr +'Seller:'+$contactname+'</div>','<div class="ft"><b>'+ cofirmorderAccumulated + '</b> Transactions, <b>'+ showpercentum + '</b>% Positive Feedback</div>'];

							$supplier.html(html.join(""));

							if(dataJson.ntalker.isonLine == false){
								$('.message-entrance').html('<a id="J_dhMsg" class="detail-a" href="/sendmsg.do?mty=3&amp;proid=' + productId +
																'&amp;productname=' + dataJson.productName + '&amp;spid='+dataJson.supplierInfo.systemuserid+'"><var></var>Contact to Seller</a>');
							}else{

								$('.message-entrance').html('<a href="javascript:;" id="J_dhChat" ntalker_buyerid =' + ntalkBuyerId + ' class="detail-a"><var></var>Contact to Seller</a>');
							}
							var storeFont = 'http://m.dhgate.com/store/';
							var storeHref = storeFont + dataJson.supplierInfo.supplierSeq;
							if(dataJson.supplierInfo.ishaveStore == true){
								$('.storeshop-entrance').html('<a href="' + storeHref + '#st-navigation-storehome-itemnew" class="detail-a"><var></var>Visit Store</a>');
							}else{
								$('.storeshop-entrance').remove();
								$('.contactcon').addClass('nostore');
							}

							new DetailSlide();
							//添加收藏
							var addToFav = new AddToFav();

							//DhCoupon
							var dhCoupon = new DhCoupon();
							//sku弹层请求数据
							/*if(skuInfonumvaluestate==false){
								new ShowSku().init();
							}*/
						}else{
							window.location.href="/404.html";
						}
					}
					window.scroll(0,0);
				}
			});
		},
		//D1 Tracking
		TrackingD:function(){
			try{
		        var hash = location.hash;
		        var clkloc = "";     //站内位置#a-b-c  a部分
		        var pos = "";       //站内位置#a-b-c  b部分
		        var type= "";       //站内位置#a-b-c  c部分
		        //示例：主站产品最终页 (s1-2-7|756038726)，s1对应a部分，2对应b部//分，7|756038726对应c部分；
		        if (hash != '' && hash != null) {
		            hash = hash.substr(1);
		            var parts = hash.split("-");
		            clkloc = parts[0];    
		            pos = parts[1];     
		            type = parts[2];  
		        }
		        _dhq.push(["setVar", "pic",itemcode]);
		        _dhq.push(["setVar", "clkloc", clkloc]);
		        _dhq.push(["setVar", "pos", pos]);
		        _dhq.push(["setVar", "type", type]);
		        _dhq.push(["setVar", "cid",cateDispId]);
		        _dhq.push(["setVar", "supplierid",supplierid]);
		        _dhq.push(["setVar", "catepubid",catepubid]);
		        _dhq.push(["setVar", "pt","prodet"]);
		        _dhq.push(["event", "Item_U0001"]);
		        } catch(e){}
		},
		trackingGoogle:function(){
			var cDiv = document.createElement('div'),
			cImg = document.createElement('img'),
			RMKTParams = {
				ET: 'Item',PageType: 'product',ProdID:itemcode,Pname1:firstCateName,Pname:secondCateName,Pname2:thirdCateName},
			_random = '&random='+(new Date()).getTime(),
			_data='';
			
			for (i in RMKTParams) {
				_data +=i+'='+RMKTParams[i]+';';
			};
			_data = _data.replace(/\;*$/g,'')
			cDiv.style.display = 'inline';
			cImg.setAttribute('width','1px');
			cImg.setAttribute('height','1px');
			cImg.style.borderStyle = 'none';
			cImg.src = '//googleads.g.doubleclick.net/pagead/viewthroughconversion/972936895/?value=1.000000&label=3Q1ACNGm3gIQv633zwM&guid=ON&script=0&hl=en&bg=666666&fmt=3&url='+encodeURIComponent(location.href)+'&data='+encodeURIComponent(_data)+_random;
			cImg.onload = function(){return false;}
			cDiv.appendChild(cImg);
			document.getElementsByTagName('body')[0].appendChild(cDiv);
		},
		trackingNerverBlueRemark:function(){
			var trackproductName = productName;
			var reProductName = trackproductName.replace(/\s+/g,"-");
			rtgsettings ={
				'pdt_id':'itemcode',
				'pdt_sku': '',
				'pdt_name': 'productName',
				'pdt_price': 'minPrice',
				'pdt_amount': '',
				'pdt_currency': 'USD',
				'pdt_url': 'http://'+basePath+'/product/'+reProductName+'/'+itemcode+'.html',//不带参数的URL地址
				'pdt_photo': 'thumbList[0]',
				//'pdt_photo': "http://www.dhresource.com/${imageUrl?if_exists?replace('0x0/','600x600/')}",
				'pdt_instock': '1',
				'pdt_expdate': '',
				'pdt_category_list': 'http://'+basePath+'/wholesale/categories/c'+reProductName+'.html',
				'pdt_smalldescription': '', 
				'pagetype': 'product',
				'key': 'NB',
				'token': 'DHGate_US',
				'layer': 'iframe'
			};
			try{
				ThirdLabs.load("load",function(){
					(function(d) {
						var s = d.createElement('script'); s.async = true;s.id='madv2014rtg';s.type='text/javascript';
						s.src = (d.location.protocol == 'https:' ? 'https:' : 'http:') + '//www.mainadv.com/Visibility/Rtgnb2-min.js';
						var a = d.getElementsByTagName('script')[0]; a.parentNode.insertBefore(s, a);
					}(document));
				});
			}catch(e){
			}
		},
		addCookie:function(){
			if(location.hostname=="m.dhgate.com"){
				DHM.Cookie.setCookie("item_recentvisit",itemcode,{path :'/',expires: -1,domain:".m.dhgate.com"});
			}
			var Cookieitemcode=DHM.Cookie.getCookie("item_recentvisit");
			Cookieitemcode = typeof Cookieitemcode==='string'?Cookieitemcode.replace(/"/g, ''):Cookieitemcode;
			if (Cookieitemcode==null || Cookieitemcode==""){
				DHM.Cookie.setCookie("item_recentvisit",itemcode,{path :'/',expires: 7,domain:".dhgate.com"});
			}else{
				var CookieitemcodeArry=Cookieitemcode.split(",");
				
				CookieitemcodeArry.unshift(itemcode);
				var hash = {},newArr = [];
				for(var i = 0;i<CookieitemcodeArry.length;i++){
				  if (!hash[CookieitemcodeArry[i]])
			        {
			            newArr.push(CookieitemcodeArry[i]);
			            hash[CookieitemcodeArry[i]] = true;
			        }
			    }
				if(newArr.length>3){
					newArr.pop();
				}
				var stringNewArr = newArr.join(',');
				DHM.Cookie.setCookie("item_recentvisit",stringNewArr,{path :'/',expires: 7,domain:".dhgate.com"});
			}
		},
		getReview:function(){
			var apiSet ={
				//url : '/mobileApiWeb/item-Item-getReviewSummaryInfo.do?client=wap&productId=4aea47a643ce76670143d6b69fa0003c'
				url : '/mobileApiWeb/item-Item-getReviewSummaryInfo.do?'
			}
			var pass =true;
				    $.ajax({
						url : apiSet.url,
						data: {
							client:"wap",
							productId:productId
						},
						type: 'GET',
						cache: true,
						dataType: 'json',
						success: function(data){
							if(data && data.state=="0x0000"){
								var dataJson =data.data;
								$('.reviewCont').html('<div class="dh-star-g"><div class="dh-star-y" style="width: '+dataJson.widthAverageScore+'%"></div></div>(<h3>'+dataJson.reviewCount+' Reviews</h3>)');
								$('.dh-star-g').html('<div class="dh-star-y" style="width:'+dataJson.widthAverageScore+'%"></div>');
								$('.star-info span em').html('('+dataJson.reviewCount+' Ratings)');
								var html = ['<li><div class="dh-score-g"><div class="dh-score-y" style="width:100%"></div></div><span><em style="width:'+dataJson.widthFive+'%"></em></span><span class="zero">'+dataJson.reviewCountFive+'</span></li>',
									'<li><div class="dh-score-g"><div class="dh-score-y" style="width:80%"></div></div><span><em style="width:'+dataJson.widthFour+'%"></em></span><span class="zero">'+dataJson.reviewCountFour+'</span></li>',
									'<li><div class="dh-score-g"><div class="dh-score-y" style="width:60%"></div></div><span><em style="width:'+dataJson.widthThree+'%"></em></span><span class="zero">'+dataJson.reviewCountThree+'</span></li>',
									'<li><div class="dh-score-g"><div class="dh-score-y" style="width:40%"></div></div><span><em style="width:'+dataJson.widthTwo+'%"></em></span><span class="zero">'+dataJson.reviewCountTwo+'</span></li>',
									'<li><div class="dh-score-g"><div class="dh-score-y" style="width:20%"></div></div><span><em style="width:'+dataJson.widthOne+'%"></em></span><span class="zero">'+dataJson.reviewCountOne+'</span></li>'];
								$('#dhm-lt').html(html.join(""));
							}
						}

					});
		},
		getSkuId:function(){
			var skuInfo=[];
			$(".j-skuSelect li.active").each(function(i,e){
				var $e=$(e);
				//skuInfo.push($e.attr("attrvalid")+"-"+$e.attr("attrid"));
				var sku_item = $e.attr("attrvalid");
				var firstsku = sku_item.substring(0,1);
                //
				//aa.push(firstsku);
				var singlesku =sku_item.substring(1,sku_item.length);
				skuInfo.push(singlesku);                // skuInfo==[a,b,c]

				skuInfonumvalue = skuInfo.join('_'); // skuInfonumvalue=="a_b_c "
			});
			var obj=paramInfo.skuObj;
			var sku=$("#J_skuLayer").attr("defaultskuid")+"_";
			for(var k in obj){
				var ki= k.split("_");
				var len=ki.length;
				var flag=true;
				for(var i=0;i<len;i++){
					if(ki.indexOf(skuInfo[i])==-1){
						flag=false;
						continue;
					}
				}
				if(flag){
					sku=obj[k];
					return sku;
				}
			}
			return sku;
		},
		mOnLoad:function(){
			var hash=window.location.hash;
			var h=DetailUtil.hash;
			for(var k in h){
				if(hash== h[k].urlHash){
					DetailUtil.freshHash();
					return;
				}
			}
		},
		getHashObj:function(){
			var exist=DHM.Common.domExist;
			var obj=[{
				urlHash:'#viewpic',
				$layer:null
			},{
				urlHash:'#Viewsdr',
				$dom:exist(".j-sdr") ,
				$layer:exist("#J_sdrLayer")
			},{
				urlHash:'#ViewAttr',
				$dom:exist("#J_sku"),
				$layer:exist("#J_skuLayer")
			},{
				urlHash:'#ViewAttr',
				$dom:exist(".J_buyNow"),
				$layer:exist("#J_skuLayer")
			},{
				urlHash:'#ViewAttr',
				$dom:exist(".J_addToCart"),
				$layer:exist("#J_skuLayer")
			}];
			return obj;
		},
		getDiv:function(){
			var $div=$("body").children("div:not(.dhm-hides),header,footer");
			var opt={};
			$div.each(function(i,e){
				var s=e.style.display;
				opt[i+"-"+s]=e;
			});
			return [$div,opt];
		},
		ifShow:function(flag,$dom){
			if(flag){
				DetailUtil.display[0].hide()
				if($dom){
					$dom.show();
				}
			}else{
				for(var k in DetailUtil.display[1]){
					DetailUtil.display[1][k].style.display= k.split("-")[1];
				}
				if($dom){
					$dom.hide();
				}
			}
		},
		setHash:function(value){
			window.location.hash = value;
		},
		
		goTop:function(){
			var self = this,
				state =true;
			$(window).scroll(function(){
				if ($(window).scrollTop()>100){
					$('.ui-gotop').css("display","block");
				}else if(window.location.hash=="#Viewsdr"){
					$('.ui-gotop').css("display","none");
				}
				else{
					$('.ui-gotop').css("display","none");
					$('.j-addBtn').css({"position":"static"});
				}
				if(state===false){
					clearTimeout(timer);
				}
				timer= setTimeout(function(){
					//判断底部显示buy it now Add to Cart按钮
					var	docHeight = parseInt($('#J_specifics').offset().top);
					content = $(window).scrollTop() >= docHeight-30;
					if(content){
						state =false;
						$('.j-fixedAdd').css({"position":"fixed","display":"block","z-index":"100","bottom":"0px"});
					}else{
						$('.j-addBtn').css({"position":"static","display":"block","z-index":"100"});
						$('.j-fixedAdd').hide();
					}	
				},500);
				
			});
		},
		freshHash:function(){
			window.history.go(-1);
			return false;
		},
		getEv:function(){
			var style=$("body")[0].style;
			var transEndEventNames = {
				'WebkitTransition' : 'webkitTransitionEnd',
				'MozTransition'    : 'transitionend',
				'OTransition'      : 'oTransitionEnd otransitionend',
				'transition'       : 'transitionend'
			};
			for (var name in transEndEventNames){
				if (style[name] !== undefined) {
					return transEndEventNames[name];
				}
			}
		},
		translate:function($d,dist,flag,f1){
			var self= this;
			sku_List_hei = Math.max($d.height(),$(window).height());
			$('#sku_List').height(sku_List_hei*0.8-140);
			var style=$d.get(0).style;
			style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration = '500ms';
			style.webkitTransform=style.transform=style.MozTransform='translateY('+dist+')';
			if(dist==0){
				if(!flag){
					DetailUtil.$layer=$d;
				}
				if(flag){
					DetailUtil.$layer.hide();
				}
				$('.sdr').css("top","0px");
				setTimeout(function(){
					window.scroll(0,0);
					DetailUtil.ifShow(true);  //所有元素都隐藏
					var h=Math.max($d.height(),$(window).height());
					$("body").css({'background':'#ebebeb',height:h-100});
					$d.css({"position":"absolute","height":h-100});
				},800);
				$(".Sku_leadimg").css({"top":"-25px"});
			}else{
				$d.undelegate($d,DetailUtil.ev);
				if(!flag){
					DetailUtil.$layer=null;
					DetailUtil.ifShow(false);
					$(".j-addBtn").show();
				}
				if(flag&&f1){
					DetailUtil.$layer.show();
				}
				$("body").css({'background':'#ebebeb',height:"auto"});
				$d.css({"position":"fixed","height":"100%"});
				$(".Sku_leadimg").css({"top":"0px"});
				
			}
		},
		hashChange:function(){
			var _self=DetailUtil;
			$(window).bind('hashchange', function(){
				var hash=['#viewpic','#Viewsdr','#ViewAttr'];
				if(hash.indexOf(window.location.hash)==-1&&_self.$layer){
					if(_self.$layer.hasClass("img-layer")){
						_self.ifShow(false,_self.$layer);
						_self.$layer=null;
					}else{
						_self.translate(_self.$layer,"100%");
					}
				}
			});
		}
	};
	DetailUtil.init(function(min_order){
		shipto.Init(min_order);
	});

	//sku页面
	var ShowSku = function () {

	};
	ShowSku.prototype = {
		init: function () {
			line_pricep = $('.smallPrice').html();
			var self = this;
			$('.sku_loading').show();
			self.loadSku();
			self.Skuevent();
			var $con=self.$con=DHM.Common.domExist("#J_skuLayer");
			self.$con.delegate('.j-skuSelect li','click',function() {
				self.getSelect();

			})
		},
		//单位取单复数方法
		company:function(){
			var quantityVal = $("#J_quantity").val(),
				company=$('.j-company').html(),
				companyStr =company.substring(0,company.length-1);
			quantityVal > 1?$('.j-companyInfo').html(company):$('.j-companyInfo').html(companyStr);
		},
		Skuevent: function () {
			var that = this;
			$('body').on('click','.jiak',function(){
				var quantity = parseInt($("#J_quantity").val())+1;
				$("#J_quantity").val(quantity);
				if(quantity > min_order){
					that.company();
					$(".jian").removeClass("jianb").addClass("jiank");
				}
				if(quantity >= max_order&&max_order!==""){
					that.company();
					$(".jia").removeClass("jiak").addClass("jiab");
				
				}
				if(quantity>=10000){
					that.company();
					$(".jia").removeClass("jiak").addClass("jiab")

				}
				$("#J_skuLayer").find(".j-maxvalue").each(function(i,e){
					var $e=$(e),mi,$p=$e.parent().parent();
					
					if($p.get(0).style.display=="none"){
						return;
					}
					if($e.siblings("var").get(0)){
						mi=parseInt($e.siblings("var").text());
					}
					var mm=parseInt($e.text().split(" +")[0]);
					
					if(mi){
						if(quantity>=mi&&quantity<=mm){
							$p.addClass("active").siblings().removeClass("active");
						}
					}else{
						if(quantity>=mm){
							$p.addClass("active").siblings().removeClass("active");
						}
					}
				});
				var ddlenght =$("dd");
				for(var z = 0;z<ddlenght.length;z++){
					if($(ddlenght[z]).hasClass("active")==true)
					{
						if(	$($("dd")[z]).find(".Price").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice  strong').html(rel_Price);
							$(".sku_price  strong").html(rel_Price)
						}

						if(	$($("dd")[z]).find(".vipPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".vipPrice").html();
							var line_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice  strong').html(rel_Price);
							$(".sku_price  strong").html(rel_Price);
							$("#line_price,.lineThrough").html(line_Price+' / '+line_pricep)
						}
						if(	$($("dd")[z]).find(".promDiscountPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".promDiscountPrice").html();
							var line_Price =$($("dd")[z]).find(".Price").html();
							$('.commonPrice  strong').html(rel_Price);
							$(".sku_price  strong").html(rel_Price);
							$("#line_price,.lineThrough").html(line_Price+' / '+line_pricep)
						}

					}
				}
			});
			$('body').on('click','.jiank',function(){
				var quantity = parseInt($("#J_quantity").val())-1;
				$("#J_quantity").val(quantity);
				if(quantity<=min_order){
					that.company();
					$(".jian").removeClass("jiank").addClass("jianb");

				}
				if(quantity<=max_order){
					that.company();
					$(".jia").removeClass("jiab").addClass("jiak");
				}
				$("#J_skuLayer").find(".j-maxvalue").each(function(i,e){
					var $e=$(e),mi,$p=$e.parent().parent();
					if($p.get(0).style.display=="none"){
						return;
					}
					if($e.siblings("var").get(0)){
						mi=parseInt($e.siblings("var").text());
					}
					var mm=parseInt($e.text().split(" +")[0]);
					
					if(mi!==mm){
						if(quantity>=mi&&quantity<=mm){
							$p.addClass("active").siblings().removeClass("active");
						}
					}else{
						if(quantity>=mm){
							$p.addClass("active").siblings().removeClass("active");
						}
					}
				});
				var ddlenght =$("dd");
				for(var z = 0;z<ddlenght.length;z++){
					if($(ddlenght[z]).hasClass("active")==true)
					{
						if(	$($("dd")[z]).find(".Price").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice strong').html(rel_Price);
							$(".sku_price strong").html(rel_Price)
						}

						if(	$($("dd")[z]).find(".vipPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".vipPrice").html();
							var line_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice strong').html(rel_Price);
							$(".sku_price strong").html(rel_Price);
							$("#line_price,.lineThrough").html(line_Price+' / '+line_pricep)
						}
						if(	$($("dd")[z]).find(".promDiscountPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".promDiscountPrice").html();
							var line_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice strong').html(rel_Price);
							$(".sku_price strong").html(rel_Price);
							$("#line_price,.lineThrough").html(line_Price+' / '+line_pricep)
						}

					}
				}
			});


		},
		getSelect:function(){
			var skuInfo=[];
			var skuitemcode = [];
			var self = this;
			var $e ="";
			$(".j-skuSelect li.active").each(function(i,e){
				 $e=$(e);
				var sku_item = $e.attr("attrvalid");
				var firstsku = sku_item.substring(0,1);
				skuitemcode.push(firstsku);
				var singlesku =sku_item.substring(1,sku_item.length);
				skuInfo.push(singlesku);                // skuInfo==[a,b,c]
				skuInfonumvalue = skuInfo.join('_'); // skuInfonumvalue=="a_b_c "
			});
			self.getSkuallmatch(skuitemcode,skuInfonumvalue,$e);
		},
		loadSku: function () {
			var that = this;
			var func = function (res) {

				that.loadedSku(res);
				that.noSku();
				skuInfonumvaluestate=true
				$('.sku_loading').hide();
				$('.show-more').css('display','none');
			};
			var apiSet = {
				url: 'http://m.dhgate.com/mobileApiWeb/item-Item-getDetailItemDto.do?client=wap'
				//url: 'http://m.dhgate.com/sku.json?client=wap'
			};

			$.ajax({
				url: apiSet.url,
				data: {itemcode:itemcode},
				type: 'get',
				dataType: 'json',
				success: func,
				error: function () {
					//
				}
			});
			func = null;
			return this;
		},
		//默认无SKUdaily deal 和限时限量活动时,显示个人 可购买 限时限量活动 剩余数量
		noSku:function(){
			if(typeId == 2 || typeId == 3){
				$('.j-unitInfo').show();
			}
			
		},
		loadedSku: function (res) {
			var that = this;
			var itemAttrList = res.data.itemAttrList;
			var itemSkuRelAttr = res.data.itemSkuRelAttr;
			itemAttrListSkulenght = res.data.itemAttrList;
			itemAttrListSku =  res.data.itemSkuRelAttr;
			var itemAttrLists = "";
			var itemAttrvalList = "";
			var skuWholeRangeLists = "";
			if(!itemAttrListSkulenght==""){
				for (var i = 0; i < itemAttrList.length; i++){
					var items = itemAttrList[i].itemAttrvalList;
					for (var j = 0; j < items.length; j++) {
						if(items[j].picUrl==undefined){
							itemAttrvalList += '<li attrid="' + items[j].attrId + '" attrValName="' + items[j].attrValName + '" attrvalid="' +i+ items[j].attrValueId + '" customSize="' + items[j].customSize + '">' + items[j].attrValName + '</li>'
						}else{
							itemAttrvalList += '<li attrid="' + items[j].attrId + '" attrValName="' + items[j].attrValName + '" attrvalid="' +i+ items[j].attrValueId + '" customSize="' + items[j].customSize + '" ><img src="'+items[j].picUrl+'" alt="'+items[j].attrValName+'" width="28" height="28" title="'+items[j].attrValName+'"></li>'
						}
					}
					itemAttrLists += '  <h4> ' + itemAttrList[i].attrName + ' :</h4><ul class="j-skuSelect">'+itemAttrvalList+'</ul>'
					itemAttrvalList = "";
				}
			}
			$("#sku_item_list").css('border','none');
			minInventoryNumFlag =itemAttrListSku[0].minInventoryNumFlag;//默认无sku属性
			defaultMinPurchaseNum = itemAttrListSku[0].minPurchaseNum;//默认无sku属性个人可购买限时限量活动剩余量
			defaultInventoryNum =itemAttrListSku[0].inventoryNum;//SKU备货数量
			defaultPromoLimitNum = itemAttrListSku[0].promoLimitNum; //限时限量 活动 数量
			if(typeId == 2 || typeId == 3){//无sku属性默认展示库存量
				if(defaultPromoLimitNum && defaultPromoLimitNum > 0){					
					inStock = defaultInventoryNum > defaultPromoLimitNum?defaultPromoLimitNum:defaultInventoryNum; //库存量=限时限量 活动 数量与SKU备货量取两者中最小值
					max_order = defaultMinPurchaseNum;//时限限量三者中最小值
				}
			}else{				
				inStock = defaultInventoryNum ;	
				max_order = defaultInventoryNum;//时限限量三者中最小值			
			}
			if(istate ==false ||  max_order == 0 || defaultMinPurchaseNum < min_order || max_order < min_order){//商品不可售、商品不能运达该国家、最大起定量为0、限时限量商品小于最小起定量 buy it now Add to Cart按钮置灰 
				$('.j-done').addClass('sold-out');
				$('.addCart').addClass('disableAddCart');
				$('.J_buyNow,.J_addToCart,.buyNow_confirm').addClass('noClick');
				$('#J_quantity').attr("disabled","disabled");
				$('#J_quantity').addClass('disabled');
				$('.jia').addClass('jiab').removeClass('jiak');
				$('.j-shiptobtn').attr('issold',0);
			}else{
				$('.j-done').removeClass('sold-out');
				$('.addCart').removeClass('disableAddCart');
				$('.J_buyNow,.J_addToCart,.buyNow_confirm').removeClass('noClick');
				$('#J_quantity').removeAttr("disabled");
				$('#J_quantity').removeClass('disabled');
				$('.j-shiptobtn').attr('issold',1);
			}
			$('#salesVolume_sku').html(inStock+' in Stock');
			var quantity= $('#J_quantity').val();
			if(quantity == defaultMinPurchaseNum || defaultMinPurchaseNum == 0){
				$('.jia').removeClass('jiak').addClass('jiab');
				$('#J_quantity').attr("disabled","disabled");
				$('#J_quantity').addClass('disabled');
			}
		  var qtyRangeList = itemSkuRelAttr[0].wholesaleQtyRangeList;
			for(var p = 0;p<qtyRangeList.length;p++){
				skuWholeRangeLists +='<dd><span><var class="j-minvalue">'+qtyRangeList[p].startQty+'</var> +<var class="j-maxvalue">'+qtyRangeList[p].endQty+'</var>' +
					'</span> <span class="originalPrice">US $'+qtyRangeList[p].originalPrice+'</span><span class="Price">US $'+qtyRangeList[p].originalPrice+'</span>  <span class="vipPrice">US $'+qtyRangeList[p].vipPrice+'</span><span class="promDiscountPrice">US $'+qtyRangeList[p].promDiscountPrice+'</span> </dd>'
			}
			$('#J_quantity').val(min_order);

			var monad = $('.smallPrice').html(),
				minOrderVal = $('#J_quantity').val(),
				company = $('.j-company').html(),
				companyStr =company.substring(0,company.length-1);
			minOrderVal > 1?$('.j-companyInfo').html(company):$('.j-companyInfo').html(companyStr);
			if(typeId == 2 ||typeId == 3){
				var	limit = defaultMinPurchaseNum > 1?company:companyStr;
				$('.j-inventory').html(defaultMinPurchaseNum );
				$('.j-companyShow').html('&nbsp'+limit);

			}
			$('.Price').first().append(' /'+monad);
			$('.originalPrice').first().append(' /'+monad);
			$('.promDiscountPrice').first().append(' /'+monad);
			$('.vipPrice').first().append(' /'+monad);
			$("#sku_item_list").html(itemAttrLists);
			$(".sku-wprice").find("dt").after(skuWholeRangeLists);
			var minvalue = $('#MinOrder').html();
		    $('#skuMinOrder').html('(Min.Order:'+minvalue+')');
			$("dl>dd").first().addClass("active");
			if($('.j-maxvalue').last().text()>10000){
				var maxvalue =	$('.j-minvalue').last().text();
				$('.j-maxvalue').last().text(maxvalue+'+')

			}
			if(!promoDto==""){
				if(b2b_buyer_lv==1&&itemVipDto!=null){
					$('.promDiscountPrice').css('display','none');
					$('.Price').css('display','none')
				}else{

					$('.vipPrice').css('display','none');
					$('.Price').css('display','none')
				}
			}
			else	if(b2b_buyer_lv==1&&itemVipDto!=null){
				$('.promDiscountPrice').css('display','none');
				$('.Price').css('display','none')
			}else{
				$('.originalPrice').css('display','none');
				$('.promDiscountPrice').css('display','none');
				$('.vipPrice').css('display','none');
			}

		},
		getSkuallmatch:function(a,b,$e){    //当页面初始化时，，遍历第一个属性。
			$(".jian").removeClass("jiank").addClass("jianb");
			var state=false;
			var position_i =[];
			var attrValueIdsingle="";
			var itemSkuRelAttrall = "";
			var test_sku = "";
				var length= itemAttrListSkulenght[a[a.length-1]].itemAttrvalList;  //第几个属性有几个属性值
				for( var k=0 ;k<length.length;k++){  //属性下面有几个就遍历即便
					attrValueIdsingle = length[k].attrValueId;
					if(a.length==1){
						test_sku = attrValueIdsingle;
					}else{
						var mm=	b.split("_");
						var aa=[];
						for(var kk=0; kk<mm.length-1;kk++){
							aa[kk]=mm[kk];
						}
						test_sku =aa.join("_");
						test_sku=test_sku+'_'+attrValueIdsingle;
					}
					for(var j = 0 ;j<itemAttrListSku.length;j++){
						var itemSkuRelAttrsingle =	itemAttrListSku[j].skuAttrVals.split("_");
						var skuSaleStatus =	itemAttrListSku[j].skuSaleStatus;

						for(var m= 0;m< a.length;m++){
							if(a.length==1){
								itemSkuRelAttrall = itemSkuRelAttrsingle[a[m]];
							}
							else{
								position_i.push(itemSkuRelAttrsingle[a[m]]);
								itemSkuRelAttrall=	position_i.join('_');
							}
						}
						if(b==itemSkuRelAttrall){
							 //如果第一个属性的值跟后台传来的能匹配   那么要看看可售状态是不是  1
							if(itemAttrListSkulenght.length== a.length){
									skulastvalue= itemAttrListSku[j];
									in_stock = itemAttrListSku[j].inventoryNum;//SKU备货数量
									stockCountry = itemAttrListSku[j].inventoryLocation;
									minPurchaseNum = itemAttrListSku[j].minPurchaseNum;//三个值的最小值
									minInventoryNumFlag = itemAttrListSku[j].minInventoryNumFlag;//默认为1:库存量； 2:活动商品数量； 3：每人限买数量，inventoryNum是取得三个值中的最小值，本字段指出最小值是哪个值
									promoLimitNum = itemAttrListSku[j].promoLimitNum;//限时限量活动数量
									promoLimitPurchaseNum = itemAttrListSku[j].promoLimitPurchaseNum;//个人可购买限量限量活动剩余数量

									if(promoLimitNum && promoLimitNum > 0){
										in_stock = in_stock > promoLimitNum?promoLimitNum:in_stock;
										max_order = minPurchaseNum;
										$('.j-unitInfo').show();
									}else if(promoLimitPurchaseNum && promoLimitPurchaseNum > 0){
										max_order = minPurchaseNum;
									}else{
										max_order = in_stock;
									}
									if(isinventory == true){
										$('#J_sku').attr('stockCountry',stockCountry);
									}

									if(in_stock == min_order){
										$(".jia").removeClass("jiak").addClass("jiab");

									}else if(in_stock > min_order){
										$(".jia").removeClass("jiab").addClass("jiak");
									}
									$("#salesVolume_sku").html(in_stock+" in Stock");
									$(".j-inventory").html(minPurchaseNum+'&nbsp');
									var skuWholeRangeLists = "";
									var qtyRangeList = itemAttrListSku[j].wholesaleQtyRangeList;
									for(var p = 0;p<qtyRangeList.length;p++){
										skuWholeRangeLists +='<dd><span><var class="j-minvalue">'+qtyRangeList[p].startQty+'</var>+  <var class="j-maxvalue">'+qtyRangeList[p].endQty+'</var>' +
											'</span> <span class="originalPrice">US $'+qtyRangeList[p].originalPrice+'</span><span class="Price">US $'+qtyRangeList[p].originalPrice+'</span>  <span class="vipPrice">US $'+qtyRangeList[p].vipPrice+'</span><span class="promDiscountPrice">US $'+qtyRangeList[p].promDiscountPrice+'</span> </dd>'
									};
									$("dd").remove();
									$(".sku-wprice").find("dt").after(skuWholeRangeLists);
									if(!promoDto==""){
										if(b2b_buyer_lv==1 &&itemVipDto!=null){//即是vip用户也是vip商品
											$('.promDiscountPrice').css('display','none');
											$('.Price').css('display','none')
										}else{
											$('.vipPrice').css('display','none');
											$('.Price').css('display','none')
										}
									}else if(b2b_buyer_lv==1 &&itemVipDto!=null){
										$('.promDiscountPrice').css('display','none');
										$('.Price').css('display','none')
									}else{
										$('.originalPrice').css('display','none');
										$('.promDiscountPrice').css('display','none');
										$('.vipPrice').css('display','none');
									}
									$("dl>dd").first().addClass("active");
									if($('.j-maxvalue').last().text()>10000){
										var maxvalue =	$('.j-minvalue').last().text();
										$('.j-maxvalue').last().text(maxvalue+'+')

									}
							}else{
								skulastvalue= itemAttrListSku[j];
								in_stock = itemAttrListSku[j].inventoryNum;//SKU备货数量
								stockCountry = itemAttrListSku[j].inventoryLocation;
								minPurchaseNum = itemAttrListSku[j].minPurchaseNum;//三个值的最小值
								minInventoryNumFlag = itemAttrListSku[j].minInventoryNumFlag;//默认为1:库存量； 2:活动商品数量； 3：每人限买数量，inventoryNum是取得三个值中的最小值，本字段指出最小值是哪个值
								promoLimitNum = itemAttrListSku[j].promoLimitNum;//限时限量活动数量
								promoLimitPurchaseNum = itemAttrListSku[j].promoLimitPurchaseNum;//个人可购买限量限量活动剩余数量

								if(promoLimitNum && promoLimitNum > 0){
										in_stock = in_stock > promoLimitNum?promoLimitNum:in_stock;
										max_order = minPurchaseNum;
										$('.j-unitInfo').show();
									}else if(promoLimitPurchaseNum && promoLimitPurchaseNum > 0){
										max_order = minPurchaseNum;
									}else{
										max_order = in_stock;
									}

								//$("#salesVolume_sku").html(in_stock+" in Stock");
							}
						}
						if(test_sku==itemSkuRelAttrall){
							if(skuSaleStatus==1) {
								state = true;
							}
							else{
								$($($('.j-skuSelect')[a[a.length-1]]).find("li")[k]).css("background-color","rgb(204, 204, 204)");
								$($($('.j-skuSelect')[a[a.length-1]]).find("li")[k]).removeClass('active');
							}
						}
						itemSkuRelAttrall ="";
						position_i =[];
					}

					if(state==true){
						$($($('.j-skuSelect')[a[a.length-1]]).find("li")[k]).css("background-color","rgb(255, 255, 255)");
						if($($($('.j-skuSelect')[a[a.length-1]]).find("li")[k]).html()==$e.html()){
							$e.addClass('active')
						}
					}
					state = false;
				}

			if(a.length==itemAttrListSkulenght.length-1){
				var sku_num="";
				for(var g=0;g<itemAttrListSkulenght.length;g++){
					var sku_active=	$($(".j-skuSelect")[g]).find('li').hasClass('active');
					if(sku_active==false){
						sku_num=g;
					}
				}
				var lastnumlenght=itemAttrListSkulenght[sku_num].itemAttrvalList;
				for(var t=0; t<lastnumlenght.length;t++){
				var lastSku=lastnumlenght[t].attrValueId;
					test_sku=b+'_'+lastSku;
					for(var j = 0 ;j<itemAttrListSku.length;j++){
						var itemSkuRelAttrsingle =	itemAttrListSku[j].skuAttrVals.split("_");
						var skuSaleStatus =	itemAttrListSku[j].skuSaleStatus;

						for(var m= 0;m< a.length;m++){

								position_i.push(itemSkuRelAttrsingle[a[m]]);
						}
						position_i.push(itemSkuRelAttrsingle[sku_num]);
						itemSkuRelAttrall=	position_i.join('_');
						if(test_sku==itemSkuRelAttrall){
							if(skuSaleStatus==1) {
								state = true;
							}
							else{
								$($($('.j-skuSelect')[sku_num]).find("li")[t]).css("background-color","rgb(204, 204, 204)");
							}
						}
						itemSkuRelAttrall =""	;
						position_i =[];
					}
					if(state==true){
						$($($('.j-skuSelect')[sku_num]).find("li")[t]).css("background-color","rgb(255, 255, 255)");

					}
					state = false;
				}
			}else{
				var noshipto= $('.js-notcanship').attr("noshipto");//标记不如运达属性
					//noBtn =$('.addCart').hasClass('disableAddCart');
				if(istate ==false ||  max_order == 0 || noshipto =="true" || defaultMinPurchaseNum < min_order || max_order < min_order){//商品不可售、商品不能运达该国家、最大起定量为0、限时限量商品小于最小起定量 buy it now Add to Cart按钮置灰 
				$('.j-done').addClass('sold-out');
				$('.addCart').addClass('disableAddCart');
				$('.J_buyNow,.J_addToCart,.buyNow_confirm').addClass('noClick');
				$('#J_quantity').attr("disabled","disabled");
				$('#J_quantity').addClass('disabled');
				$('.jia').addClass('jiab').removeClass('jiak');
				$('.j-shiptobtn').attr('issold',0);
			}else{
				$('.j-done').removeClass('sold-out');
				$('.addCart').removeClass('disableAddCart');
				$('.J_buyNow,.J_addToCart,.buyNow_confirm').removeClass('noClick');
				$('#J_quantity').removeAttr("disabled");
				$('#J_quantity').removeClass('disabled');
				$('.j-shiptobtn').attr('issold',1);
			}
				var quantity= $('#J_quantity').val();
				if(quantity == defaultMinPurchaseNum || defaultMinPurchaseNum == 0){
					$('.jia').removeClass('jiak').addClass('jiab');
					$('#J_quantity').attr("disabled","disabled");
					$('#J_quantity').addClass('disabled');
				}
			}
			if(a.length==itemAttrListSkulenght.length){
				var test_sku =""	;	
				var position_i =[];
				var newskuitem = '';
                for(var h=0;h< a.length;h++){
                	position_i = b.split("_")
				   var allskuitem =itemAttrListSkulenght[h].itemAttrvalList;
					for(var l=0;l<allskuitem.length;l++){
						newskuitem = allskuitem[l].attrValueId    //更新的sku值
						position_i[h] = newskuitem
						test_sku = position_i.join('_');
						for(var j = 0 ;j<itemAttrListSku.length;j++){
							var itemSkuRelAttrsingle =	itemAttrListSku[j].skuAttrVals;
							var skuSaleStatus =	itemAttrListSku[j].skuSaleStatus;
					
							if(test_sku==itemSkuRelAttrsingle){
								if(skuSaleStatus==1) {
									state = true;
								}
								else{
									$($($('.j-skuSelect')[h]).find("li")[l]).css("background-color","rgb(204, 204, 204)");
								}
							}
							itemSkuRelAttrsingle =""	;
							if(state==true){
								$($($('.j-skuSelect')[h]).find("li")[l]).css("background-color","rgb(255, 255, 255)");
							}
							state = false;
						}		
					}
				}
				
				if(minPurchaseNum == 0 || minPurchaseNum == 1){
					if(typeId == 2 ||typeId == 3){
						var company = $('.j-company').html(),
							companyStr =company.substring(0,company.length-1);
							limit = minPurchaseNum > 1?company:companyStr;
						$('.j-inventory').html(minPurchaseNum+'&nbsp');
						$('.j-companyShow').html(limit);
					}
				}
			}
			var ddlenght =$("dd");
			for(var z = 0;z<ddlenght.length;z++){
				if($(ddlenght[z]).hasClass("active")==true)
				{
					if(	$($("dd")[z]).find(".Price").css("display")=='inline-block'){
						var rel_Price =	$($("dd")[z]).find(".Price").html();
						$('.commonPrice strong').html(rel_Price);
						$(".sku_price strong").html(rel_Price)
					}
					if(	$($("dd")[z]).find(".promDiscountPrice").css("display")=='inline-block'){
						var rel_Price =	$($("dd")[z]).find(".promDiscountPrice").html();
						var line_Price =	$($("dd")[z]).find(".Price").html();
						$('.commonPrice strong').html(rel_Price);
						$(".sku_price strong").html(rel_Price);
						$("#line_price,.lineThrough").html(line_Price+' / '+line_pricep)

					}
					if(	$($("dd")[z]).find(".vipPrice").css("display")=='inline-block'){
						var rel_Price =	$($("dd")[z]).find(".vipPrice").html();
						var line_Price =	$($("dd")[z]).find(".Price").html();
						$('.commonPrice strong').html(rel_Price);
						$(".sku_price strong").html(rel_Price);
						$("#line_price,.lineThrough").html(line_Price+' / '+line_pricep)
					}

				}
			}

			$('#J_quantity').val(min_order);
			var quantityVal =$('#J_quantity').val(), 
				company=$('.j-company').html(),
				companyStr =company.substring(0,company.length-1);
			quantityVal > 1?$('.j-companyInfo').html(company):$('.j-companyInfo').html(companyStr);

			var quantity= $('#J_quantity').val();
				if(quantity == defaultMinPurchaseNum || defaultMinPurchaseNum == 0){
					$('.jia').removeClass('jiak').addClass('jiab');
					$('#J_quantity').attr("disabled","disabled");
					$('#J_quantity').addClass('disabled');
				}else{
					$('#J_quantity').removeAttr("disabled");
					$('#J_quantity').removeClass('disabled');
				}
		}
	};
//	轮播图 urlHash='#viewpic'
	function DetailSlide(){
		var self=this;
		self.clickEvent='click';
		self.urlHash=DetailUtil.hash[0];
		self.imgOpt={
			id:"#J_detailImg",
			conId:"#J_detailImgCon"
		};
		self.layer={
			total:0,
			index:0,
			$layer:null,
			$next:null,
			$pre:null,
			$num:null
		};
		self.init();
	}
	DetailSlide.prototype={
		constructor:DetailSlide,
		_getPage:function($d,len){
			var html=['<ul id="J_detailImgPage" class="detail-page">'];
			for(var i=0;i<len;i++){
				var $e=$d.eq(i).find("img");
				/*if($e.data("src")){
					$e.attr("src", $e.data("src"));
				}*/

				if(i==0){
					html.push('<li class="current"></li>');
				}else{
					html.push('<li></li>');
				}
			}
			html.push('</ul>');
			var $page=$(html.join(''));
			return $page;
		},
		slideImg:function(){
			var self=this,domExist=DHM.Common.domExist;
			var $img=domExist(self.imgOpt.id),$con=domExist(self.imgOpt.conId);
			if(!$img) return;
			//add slide page
			var $li=$con.find("li");
			self.layer.total=$li.length;
			var $page=self._getPage($li,self.layer.total);
			$img.append($page);
			//引入slide
			var slide=DHMSlide({
				element:$img,
				con:self.imgOpt.conId,
				page:$page,
				width:300,
				speed:600
			});
			//点击图片进行的操作
			$img.delegate("li",self.clickEvent,function(e){
				javascript:ga('send','event','Checkout-product','Photo',cateDispId + '-'+itemcode);
				self.layer.index=$(this).index();
				self.imgLiOpr($con,slide,self);
				DetailUtil.$layer=self.layer.$layer;
				DetailUtil.setHash(self.urlHash.urlHash.substr(1));
				DetailUtil.ifShow(true,self.layer.$layer);
				e.stopPropagation();
				e.preventDefault();
			});
		},
		getImgLayer:function($con,slide,scope){
			var self=scope;
			if(!self.layer.$layer){
				var html=['<section class="img-layer" style="display:none">',
					'<nav class="d-back"><a href="javascript:;"></a><span></span></nav>',
					'<div class="img-layer-con" id="img-layer-con"><ul class="j-imgLayerCon">',
					$('#j-imgLayerCon').html(),
					'</ul></div>',
					'</section>'
				];
				var $layer=$(html.join(''));
				$("body").append($layer);
				$layer.delegate(".d-back a,.img-layer",self.clickEvent,function(){
					$('#J_detailImgLayperPage').remove();
					DetailUtil.freshHash();
					DetailUtil.$layer=null;
					DetailUtil.ifShow(false,$layer);
				});
				self.layer.$layer=$layer;
			}
			return self.layer.$layer;
		},
		_getImgLayperPage:function($d,len){
			var html=['<ul id="J_detailImgLayperPage">'];
			for(var i=0;i<len;i++){
				var imgLayer=$('.j-imgLayerCon li').eq(i).find("img");
				var imgLayerSrc  = imgLayer.attr("src");
				/*if($e.data("src")){
					$e.attr("src", $e.data("src"));
				}*/
				var dataSrc= $(imgLayer[i]).attr("data-src");
				$(imgLayer[i]).attr("src",dataSrc);
				if(i==0){
					html.push('<li class="current"></li>');
				}else{
					html.push('<li></li>');
				}
			}
			html.push('</ul>');
			var $page=$(html.join(''));
			return $page;
		},
		imgLiOpr:function($con,slide,scope){
			var self=scope;
			var $layer=self.getImgLayer($con,slide,self);
			var $imgLayerCon=$('.img-layer-con');
			if(!$imgLayerCon) return;
			var $li=$('#j-imgLayerCon').find("li");
			self.layer.total=$li.length;
			var $page = self._getImgLayperPage($li,self.layer.total);
			$(".img-layer-con").append($page);
			var imgLayer=DHMSlide({
				element:$layer,
				con:'.j-imgLayerCon',
				page:$page,
				width:300,
				speed:800
			});
			imgLayer.toPoint(self.layer.index);
		},

		init:function(){
			var self=this;
			setTimeout(function(){
				self.slideImg();
			},50)
		}
	};

	//	点击Description
	function Description(){
		this.$J_des=DHM.Common.domExist("#J_des");
		this.$J_desLayer=DHM.Common.domExist("#J_descriptionLayer");
		if(!this.$J_des) return;
		this.url = DHM.Common.mobileHost+"mobileApiWeb/item-Item-getDescription.do";
		this.init();
	}
	Description.prototype={
		constructor:Description,
		getDes:function(){
			var self=this;
			var pass = true;
			$("#nav_desLayer,#J_des").click(function(evt){
				$('#J_sdrLayer').show();
				var itemcode =$("#J_shippingCost strong").attr("itemcode");
				var htmlurl =$("#J_shippingCost strong").attr("htmlurl");
				var cateDispId =$("#J_shippingCost strong").attr("cateDispId");
				var prodLineId =$("#J_shippingCost strong").attr("prodLineId");
				if(pass == true){
					pass = false;
					DHM.Common.request({
						url:self.url,
						type:"GET",
						data:{
		                    client:"wap",
		                    itemcode:itemcode,
		                    htmlurl:htmlurl,
		                    cateDispId:cateDispId,
		                    prodLineId:prodLineId,
		                    siteId:"EN",
							productName:productName
	                	},
						fn:self.desRes,
						scope:self
					});
				}
				javascript:ga('send','event','Checkout-product','Description',cateDispId + '-'+itemcode);
			});
		},
		desRes:function(data,scope){
			var self=scope;
			if(data.state ="0x0000"){
				self.$J_desLayer.html(data.data);
			}
		},
		init:function(){
			this.getDes();
		}
	};
//  getCoupon #Viewcoupcon、sku #ViewAttr、shipping #Viewcshipment
	function ShowLayer(){
		this.init();
	}
	ShowLayer.prototype={
		constructor:ShowLayer,
		getObj:function(){
			return DetailUtil.hash;
		},
		show:function(){
			var self=this;
			var obj=self.getObj();
			$.each(obj,function(i,o){
				var $d= o.$dom;
				var $l= o.$layer;
				if(!$d||!$l) return;
				var h= o.urlHash;
				self.isSkuSelected();

				$d.click(function(e){
					$('.sku-con').show();
					$('.rp-items').hide();
					var $target = $(e.target),
						noClick =$target.hasClass('noClick');
						$parent = ($(e.target).parent()),
						noshippend =  $parent.hasClass('disableAddCart');
					if(noshippend == true || noClick == true){return} //如里不能运达Buy it now 和Add to Cart按钮不可点
					var clickType = $d.attr("clicktype");
					//判断SKU属性是否选中，己选中直接添加购物车
					if(self.isSkuSelected() === false){
						if(clickType ==="Cart"){ //判断点击Add TO Cart还是Buy it Now按钮
							CartBuy.toCartAjax();
							DetailUtil.translate($l,0);
							return;
						}else if(clickType ==="Buy"){
							CartBuy.buyNowAjax();
							return;
						}
					};
					DetailUtil.translate($l,0);
					DetailUtil.setHash(h);
					if(h=="#Viewsdr"){
						self.sdrOpr(self,$(this).attr("id"),$l);
						$('.j-fixedAdd').addClass('j-ifShow');  //添加j-ifShow判断浮层元素隐藏
						$('.j-ifShow').click(function(){
							ifShow = $('.j-ifShow').attr("ifShow","true");
						});
					}
					e.preventDefault();
					e.stopPropagation();
				});
				$l.delegate("nav .j-back","click",function(){
					$('.j-quantity').html('<span class="done j-done" id="J_done">Confirm</span>');
					$('.j-done').removeClass('SelectOptionsDone');
					$('.j-fixedAdd').removeClass('j-ifShow');
					$('#J_recommendItems').css('display','block');
					$('.ui-gotop,.sdr').css("display","none");
					DetailUtil.translate($l,"100%");
					//DetailUtil.freshHash();
					if(h=="#ViewAttr"){
						var ifShow = $('.j-fixedAdd').attr("ifShow");
						if(ifShow=="true"){
							DetailUtil.ifShow(true);
							$('.j-fixedAdd').css("display","block");
						}
						if(itemAttrListSkulenght==undefined){
							var skuid = itemAttrListSku[0].skuId
							var skumd5 = itemAttrListSku[0].skuMd5;
							$("#J_sku").attr("skuid",skuid);
							$("#J_sku").attr("skumd5",skumd5);
						}else{
							var skuid = skulastvalue.skuId;
							var skumd5 = skulastvalue.skuMd5;
							$("#J_sku").attr("skuid",skuid);
							$("#J_sku").attr("skumd5",skumd5);
						}
						var text=["Selection:"];
						$(".j-skuSelect li.active").each(function(i,ele){
							if($(ele).find("img").get(0)){
								text.push(["[",$(ele).find("img").attr("title"),"]"].join(""));
							}else{
								text.push(["[",$(ele).text(),"]"].join(""));
							}
						});
						var selectValue=$('.j-skuSelect li').hasClass("active"),
							quantity =$('#J_quantity').val();
						if(selectValue){
							$(".detail-skuCont").text(text.join(""));
						}
						$('.j-quantityVal').html(":"+quantity);
						$('#J_sku').attr('vquantity',quantity);
						$('.j-shiptobtn').trigger('click', {toCart: true});
					}else if(h=="#Viewsdr"){
						$(".j-fixedAdd").removeAttr("ifShow");
					}
				});
			});
		},
		//查看所有的sku类型是否都有选中项
        isSkuSelected: function() {
            var flag = true, //标记未选中
                skus = $('.j-skuSelect');
                
                
            $.each(skus, function(i, sku){
                //查找是否有未选择的sku
                if ($(sku).find("li[class*='active']").length === 0) {
                    //修改状态
                    flag = true;
                }else{
                	flag = false;
                }
            });
            return flag;
        },
		sdrOpr:function(scope,id){
			var $nav=$("#J_sdrNav");
			$nav.find("a").eq(0).click(function(){
				javascript:ga('send','event','Checkout-product','Specification',cateDispId + '-'+itemcode);	
			});
			switch(id){
				case "J_des":
					$nav.find("a[name='d']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_descriptionLayer");
					$d.show();
					$d.siblings("article").hide();
					$('.rp-items').hide();
					$('.sku-con').hide();
					break;
				case "J_reviews":
					$nav.find("a[name='r']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_reviewLayer");
					$d.show();
					$d.siblings("article").hide();
					$('.rp-items').hide();
					$('.sku-con').hide();
					break;
				default:
					$nav.find("a[name='s']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_specificsLayer");
					$d.show();
					$d.siblings("article").hide();
					$('.rp-items').hide();
					$('.sku-con').hide();
			}
		},
		init:function(){
			var self=this;
			self.show();
		}
	};

//	sku操作
	function DetailSKU(){
		var self=this;
		var $con=self.$con=DHM.Common.domExist("#J_skuLayer");
		if(!$con) return;
		self.$quantity=$("#J_quantity");
		self.skuVal=[];
		self.init();
	}
	DetailSKU.prototype={
		constructor:DetailSKU,
		sku:function(){
			var self=this;
			self.$con.delegate('.j-skuSelect li','click',function(){
				var $e=$(this);
				if($e.hasClass("active")) return;
				if($e.css("background-color")=="rgb(204, 204, 204)") return;
				$e.addClass("active");
				$e.siblings().removeClass("active");
				var sku=DetailUtil.getSkuId().split("_");
				var skuid=sku[0];
				var $dd=$("#J_skuLayer").find("dd");
				var $ddv=$("#J_skuLayer").find("dd[vhidden='"+skuid+"']");
				$ddv.show();
				var num=sku[2];
				if(parseInt(num)){
					$("#J_stock").text(parseInt(num));
				}
				$dd.removeClass("active");
				$ddv.eq(0).addClass("active");
				self.$quantity.val(parseInt(self.$quantity.attr("init-value")));
				$("#J_numError").hide();
			});
		},
		company:function(){
			var quantityVal = $("#J_quantity").val(),
				company=$('.j-company').html(),
				companyStr =company.substring(0,company.length-1);
			quantityVal > 1?$('.j-companyInfo').html(company):$('.j-companyInfo').html(companyStr);
		},
		setQuantity:function(){
			var min=parseInt(this.$quantity.attr("init-value")),
				self=this;
			self.$quantity.focus(function(){
				$(this).val('');
				$("#J_numError").hide();
			}).blur(function(){
				var quantityVal = $("#J_quantity").val(),
					inventory= $('.j-inventory').html();
			    if(max_order >=100000){//无备货最大库存量为99999
					if(quantityVal < min_order){
						$('#opacityLayer').html("Min order &nbsp;"+min_order).show();
						$('#J_quantity').val(min_order);
						$(".jian").removeClass("jiank").addClass("jianb");
						$(".jia").removeClass("jiab").addClass("jiak");	
						$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
						setTimeout(function(){
							$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
						},3000);
						self.company();
					}else if(quantityVal > max_order){
						$('.j-companyInfo').html(val);
						if(typeId ==2 || typeId == 3){
							$('#opacityLayer').html(max_order+"&nbsp;at most per customer").show();
							$('#J_quantity').val(max_order);
							$(".jian").removeClass("jianb").addClass("jiank");
							$(".jia").removeClass("jiak").addClass('jiab');
						}else{
							$('#opacityLayer').html("Max Stock &nbsp;"+max_order).show();
							$('#J_quantity').val(max_order);
							$(".jia").removeClass("jiak").addClass("jiab");
							$(".jian").removeClass("jianb").addClass("jiank");
						}
						$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
						setTimeout(function(){
							$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
						},3000);
						self.company();
					}else if(quantityVal==max_order){
						$(".jia").removeClass("jiak").addClass("jiab");
						$(".jian").removeClass("jianb").addClass("jiank");
						self.company();
					}else if(quantityVal==min_order){
						var company=$('.j-companyInfo').html(),
							str =company.substring(0,company.length-1);
						$(".jian").removeClass("jiank").addClass("jianb");
						$(".jia").removeClass("jiab").addClass("jiak");
						$('.j-companyInfo').html(str);
					}else{
						$(".jian").removeClass("jianb").addClass("jiank");	
						$(".jia").removeClass("jiab").addClass("jiak");
						self.company();
					}
			     }else {
					if(quantityVal > max_order){
						if(typeId ==2 || typeId == 3){
							if(inventory ==min_order){
								$(".jian").removeClass("jiank").addClass("jianb");
							}else{
								$(".jian").removeClass("jianb").addClass("jiank");
								$(".jia").removeClass("jiak").addClass('jiab');
							}
							$('#opacityLayer').html(max_order+"&nbsp;at most per customer").show();
							$('#J_quantity').val(max_order);
						}else{
							$('#opacityLayer').html("Max Stock &nbsp;"+max_order).show();
							$('#J_quantity').val(max_order);
							$(".jian").removeClass("jianb").addClass("jiank");
							$(".jia").removeClass("jiak").addClass("jiab");
						}
						$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
						setTimeout(function(){
							$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
						},3000);
						self.company();
				}else if(quantityVal < min_order){
					if(typeId ==2 || typeId == 3){
						if(inventory ==min_order){
							$(".jian").removeClass("jiank").addClass("jianb");
						}else if(quantityVal == ""){//如果input为空时
							$(".jian").removeClass("jiank").addClass("jianb");
							$(".jia").removeClass("jiab").addClass('jiak');
						}else{
							$(".jian").removeClass("jianb").addClass("jiank");
							$(".jia").removeClass("jiak").addClass('jiab');
						}
						$('#opacityLayer').html(max_order+"&nbsp;at most per customer").show();
						$('#J_quantity').val(min_order);
					}else{
						if(quantityVal == ""){//如果input为空时
							$(".jian").removeClass("jiank").addClass("jianb");
							$(".jia").removeClass("jiab").addClass('jiak');
						}
						$('#opacityLayer').html("Min Order &nbsp;"+min_order).show();
						$('#J_quantity').val(min_order);	
					}
						$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
						setTimeout(function(){
							$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
						},3000);
						self.company();
				}
				else if(quantityVal == max_order){
					$(".jia").removeClass("jiak").addClass("jiab");
					$(".jian").removeClass("jianb").addClass("jiank");
					self.company();
				}else if(quantityVal == min_order){
					$(".jian").removeClass("jiank").addClass("jianb");
					$(".jia").removeClass("jiab").addClass("jiak");
					self.company();
				}else{
					$(".jian").removeClass("jianb").addClass("jiank");	
					$(".jia").removeClass("jiab").addClass("jiak");
					self.company();
				}
			   }
				var max=parseInt($("#J_stock").text());
				if(max==0||min > max){
					$("#qtynote").show();
					$("#J_cartBuy").find("a").addClass("sold-out");
					self.$quantity.attr("disable","disable");
					return;
				}
				var $d=$(this),re = /\D/;
				var val= parseInt($.trim($d.val()));
				$("#J_numError").hide();
				if(val==''){
					$(this).val(min);
					paramInfo.quantity=min;
				}else if(val<min){
					$(this).val(min);
					paramInfo.quantity=min;
					$("#J_numError").html(msgObj['DETAIL_quntity_mininum_MOrder']+" <span>"+min+"</span>)").show();
				}else if(max&&val>max){
					$(this).val(max);
					paramInfo.quantity=max;
					$("#J_numError").html(msgObj['DETAIL_quntity_mininum_MSstock']+" <span>"+max+"</span>)").show();
				}else if(re.test(val)){
					$(this).val(min);
					paramInfo.quantity=min;
					$("#J_numError").html(msgObj['DETAIL_quntity_mininum_MOrder']+" <span>"+min+"</span>)").show();
				}else{
					paramInfo.quantity=val;
					$("#J_numError").hide();
				}
				$("#J_skuLayer").find(".j-maxvalue").each(function(i,e){
					var quantity = parseInt($("#J_quantity").val())
					var $e=$(e),mi,$p=$e.parent().parent();
					if($p.get(0).style.display=="none"){
						return;
					}
					if($e.siblings("var").get(0)){
						mi=parseInt($e.siblings("var").text());
					}
					var mm=parseInt($e.text().split(" +")[0]);
					
					if(mi!==mm){
						if(quantity>=mi&&quantity<=mm){
							$p.addClass("active").siblings().removeClass("active");
						}
					}else{
						if(quantity>=mm){
							$p.addClass("active").siblings().removeClass("active");
						}
					}
				});
				var ddlenght =$("dd");
				for(var z = 0;z<ddlenght.length;z++){
					if($(ddlenght[z]).hasClass("active")==true)
					{
						if(	$($("dd")[z]).find(".Price").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice strong').html(rel_Price);
							$(".sku_price strong").html(rel_Price)
						}

						if(	$($("dd")[z]).find(".vipPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".vipPrice").html();
							var line_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice strong').html(rel_Price);
							$(".sku_price strong").html(rel_Price);
							$("#line_price,.lineThrough").html(line_Price+' / '+line_pricep)
						}
						if(	$($("dd")[z]).find(".promDiscountPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".promDiscountPrice").html();
							var line_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice strong').html(rel_Price);
							$(".sku_price strong").html(rel_Price);
							$("#line_price,.lineThrough").html(line_Price+' / '+line_pricep)
						}

					}
				}
				$("#J_skuQut").text("["+paramInfo.quantity + " "+ self.$quantity.next().text()+"]")
			});
		},
		init:function(){
			var self=this;
			self.sku();
			self.setQuantity();
		}
	};
//	sdr 操作
	function DetailSdr(){
		var self=this;
		var exist=DHM.Common.domExist;
		self.$reviewLayer=exist("#J_reviewLayer");
		self.$nav=exist("#J_sdrNav");
		self.rImgId="#J_reviewImg";
		self.imgInfo={};
		self.init();
	}
	DetailSdr.prototype={
		constructor:DetailSdr,
		sdrTab:function(){
			var self=this;
			var $nav=self.$nav;
			$nav.delegate("a",'click',function(e){
				var $a=$(this);
				switch($a.attr("name")){
					case "d":
						$a.addClass("active").siblings().removeClass("active");
						var $d=$("#J_descriptionLayer");
						$d.show();
						$d.siblings("article").hide();
						break;
					case "r":
						$a.addClass("active").siblings().removeClass("active");
						var $d=$("#J_reviewLayer");
						$d.show();
						$d.siblings("article").hide();
						break;
					default:
						$a.addClass("active").siblings().removeClass("active");
						var $d=$("#J_specificsLayer");
						$d.show();
						$d.siblings("article").hide();
				}
				e.stopPropagation();e.preventDefault();
			});
		},
		getReviewList:function(pageNum){
			var self=this;
			var pass =true;
			$('#J_reviews,#nav_reviews').click(function(){
				$('.rp-items').hide();
				$('#J_sdrLayer').show();
				var productId = $('#J_shippingCost strong').attr('productid');
				var apiSet ={
					url : '/mobileApiWeb/item-Item-loadReviewPage.do?'
				}
				if(pass == true){
					pass=false;
					$.ajax({
						url : apiSet.url,
						data: {
							client:"wap",
							pageNum:pageNum || 1,
							productId:productId
						},
						type: 'GET',
						cache: true,
						dataType: 'json',
						success: function(data){
							if(data && data.state=="0x0000"){
								pass=false;
								var $con=$(".review-con");
					            var data=data.data;
								var res=data.result;
					            var len=res.length;
					            if(!searchUrl){
									for(var i=0;i<len;i++){
						                var d=res[i];
						                var str=(d.responseDTO)?('<div class="response"><h4>'+msgObj['DETAIL_seller_res']+':</h4><p>'+d.responseDTO.content+'</p></div>'):'';
						                var image=[];
										if(res[i].tdAttachDto){
											image.push('<ul class="j-single">');
											var imgs=res[i].tdAttachDto.imgMap;
											for(var k in imgs){
												image.push('<li><img src="',imgs[k],'" /></li>');
											}
											image.push('</ul>');
										}
										var html=['<div class="j-reviewInfo rc-info" data-reviewid="',d.reviewid,'"><div class="tit">',
						                    '<div class="tit-star dhstar-y dhm-lt"><div class="dh-star-g"><div class="dh-star-y" style="width:',d.score*20,'%"></div></div></div>',
						                    '<span class="review-from">',msgObj['DETAIL_by'],':',d.buyerNickname,'</span><span class="review-time">',d.createdDateText,'</span></div>',
						                    '<div class="con">',image.join(""),
											'<p class="p-res">',d.content,'</p>',str,
						                    '</div></div></div>'
						                ];
						                $con.append(html.join(''));
						            }
						            $('#J_recommendItems').hide();
								}
					            if(data.pageBean.count ==0){
									$("#J_showMoreR").remove();
									$('.review-con').hide();
									$('.dh-review-more').hide();
								}else if(data.pageBean.count <10){
									$("#J_showMoreR").remove();
								}
								self.rSingle();
							}
						}
					});
				}
				javascript:ga('send','event','Checkout-product','Reviews',cateDispId + '-'+itemcode);	
			})
		},
		showMoreR:function(){
            var self=this;
            self.showMoreRNum=2;
            self.$reviewLayer.delegate('#J_showMoreR','click',function(e){
            var productId = $('#J_shippingCost strong').attr('productid');
               DHM.Common.request({
                   url:DHM.Common.mobileHost+"mobileApiWeb/item-Item-loadReviewPage.do",
                   data:{
                   		client:"wap",
                       productId:productId,
                       pageNum:self.showMoreRNum
                   },
                   fn:self.showMoreRRes,
                   scope:self
               });
            });
		},
        showMoreRRes:function(data,scope){
            var self=scope;
            self.showMoreRNum++;
            var $con=self.$reviewLayer.find(".review-con");
            var data=data.data;
			var res=data.result;
            var len=res.length;
            for(var i=0;i<len;i++){
                var d=res[i];
                var str=(d.responseDTO)?('<div class="response"><h4>'+msgObj['DETAIL_seller_res']+':</h4><p>'+d.responseDTO.content+'</p></div>'):'';
                var image=[];
				if(res[i].tdAttachDto){
					image.push('<ul class="j-single">');
					var imgs=res[i].tdAttachDto.imgMap;
					for(var k in imgs){
						image.push('<li><img src="',imgs[k],'" /></li>');
					}
					image.push('</ul>');
				}
				var html=['<div class="j-reviewInfo rc-info" data-reviewid="',d.reviewid,'"><div class="tit">',
                    '<div class="tit-star dhstar-y dhm-lt"><div class="dh-star-g"><div class="dh-star-y" style="width:',d.score*20,'%"></div></div></div>',
                    '<span class="review-from">',msgObj['DETAIL_by'],':',d.buyerNickname,'</span><span class="review-time">',d.createdDateText,'</span></div>',
                    '<div class="con">',image.join(""),
					'<p class="p-res">',d.content,'</p>',str,
                    '</div></div></div>'
                ];
                $con.append(html.join(''));
            }
			if((self.showMoreRNum-2)*10+len>=data.pageBean.count){
				$("#J_showMoreR").remove();
			}
			self.rSingle();
        },
		getrImgLayer:function(scope,data){
			var self=scope;
			if(!self.$rImgLayer){
				var res=data.result;
				var len=res.length;
				var html=['<section class="r-all-img dh-layer">',
					'<h3><a href="javascript:;" class="j-back img-back"></a><span class="tit detail-arrow-left">',msgObj['reviews'],'</span></h3>',
					'<ul>'];
				for(var i=0;i<len;i++){
					html.push('<li id="r_',res[i].reviewid,'"><img src="',res[i].tdAttachDto.imageUrl,'" /></li>');
					self.imgInfo[""+res[i].reviewid]=res[i];
				}
				html.push('</ul>');
				if(len==10){
					html.push('<div class="dh-review-more"><a id="J_showMoreI" href="javascript:;">',msgObj['DETAIL_Show_more_photos'],'<span></span></a></div>');
				}
				html.push('</section>');
				self.$rImgLayer=$(html.join(''));
				$("body").append(self.$rImgLayer);
				self.$rImgLayer.delegate('.j-back','click',function(){
					DetailUtil.translate(self.$rImgLayer,'100%',true,true);
				});
				self.$rImgLayer.delegate("li",'click',function(){	
					self.getSingleR($(this),self);
				});
                self.showMoreINum=2;
                self.$rImgLayer.delegate("#J_showMoreI",'click',function(){
                    self.showMoreI($(this),self);
                });
			}
			return self.$rImgLayer;
		},
		rSingle:function(){
			var self=this;
			$(".j-single").each(function(i,e){
				var $e=$(e);
				DHMSlide({
					element:$e.parent(),
					con:'ul',
					width:$(window).width(),
					speed:600,
					distance:250,
					totalWidth:$e.find("li").length*125
				});
			});
			self.$reviewLayer.delegate(".j-single","click",function(){	
				$('.r-single').css("top","0px");
				var $d=$(this);
				var $p=$d.parent();
				var $pp=$p.parent();
				var $singleLayer=self.getSingle(self);
				var html=['<h3><a href="javascript:;" name="mysingle" class="j-back img-back"></a><span class="tit detail-arrow-left">',msgObj['reviews'],'</span></h3><div class="r-single-img"><ul>'];
				html.push($d.html());
				html.push('</ul></div><div class="j-reviewInfo rc-info" data-reviewid="',$pp[0].dataset.reviewid,'"><div class="tit">');
				html.push($pp.find(".tit").html());
				html.push('</div><div class="con"><p>');
				html.push($d.siblings("p").html());
				html.push('</p><div class="response">');
				html.push($d.siblings(".response").html());
				html.push('</div></div></div>');
				$singleLayer.html(html.join(''));
				DHMSlide({
					element:$singleLayer,
					con:'ul',
					width:320,
					speed:600
				});
				DetailUtil.translate($singleLayer,0,true);
			});
		},
		getSingle:function(scope){
			var self=scope;
			if(!self.$singleLayer){
				var html=['<section class="r-single dh-layer"></section>'];
				self.$singleLayer=$(html.join(''));
				$("body").append(self.$singleLayer);
				self.$singleLayer.delegate('.j-back','click',function(){
					$('.r-single').css("top","200px");
					if($(this).attr("name")=="mysingle"){
						DetailUtil.translate(self.$singleLayer,'100%',true,true);
					}else{
						DetailUtil.translate(self.$singleLayer,'100%',true);
					}
				});
			}
			return self.$singleLayer;
		},
		init:function(){
			var self=this;
			self.sdrTab();
			self.getReviewList();
			//self.rSingle();
			self.showMoreR();
		}
	};

//	cart buy
	function CartBuy(){
		var self=this;
		self.$buy=DHM.Common.domExist("#buyNow_confirm");
		self.$toCart=DHM.Common.domExist(".j-done");
		self.buyUrl='/mobileApiWeb/order-Order-buyItNow.do';
		self.cartUrl='/mobileApiWeb/cart-Cart-addToCart.do';
		self.init();
	}
	CartBuy.prototype={
		constructor:CartBuy,
		//查看所有的sku类型是否都有选中项
        isSkuSelected: function() {
            var flag = true, //标记未选中
                skus = $('.j-skuSelect'),
                sku_item_list= $('#sku_item_list .j-skuSelect');
              if(sku_item_list.length===0){//标记无sku属性可添加购物车或buy it now
              	flag = false;
              	return;
              }
            $.each(skus, function(i, sku){
                //查找是否有未选择的sku
                if ($(sku).find("li[class*='active']").length === 0) {
                    //修改状态
                    flag = true;
                    return false;
                }else{
                	flag = false;
                }
            });
            return flag;
        },
		buyNowAjax:function(){
			$('.sku_loading').show();
			var self=this,
				$buy=$('.buyNow_confirm'),
				buyerId=DHM.Cookie.getCookie("b2b_buyerid"),
				value = DHM.Cookie.getCookie("B2BCookie"),
				productid =$("#J_shippingCost strong").attr("productid"),
				quantity = $("#J_quantity").val();
			if($buy.hasClass("sold-out")) return;
			if(itemAttrListSkulenght==undefined){
				var skuid = itemAttrListSku[0].skuId
				var skumd5 = itemAttrListSku[0].skuMd5;
				$('#J_sku').attr("skuid",skuid);
				$('#J_sku').attr("skumd5",skumd5);

			}else{
				var skuid = skulastvalue.skuId;
				var skumd5 = skulastvalue.skuMd5;
				$('#J_sku').attr("skuid",skuid);
				$('#J_sku').attr("skumd5",skumd5);
			}
			if(skumd5==undefined){
				$('#opacityLayer').html("Please Select Option").show();
				$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
				setTimeout(function(){
					$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
					$(".ceng").css({"display":"none !important","z-index":"101"});
				},3000);

				return
			}
			if(quantity<min_order||quantity>max_order){
				$('#opacityLayer').html("Invalid Quantity, Please Select a valid Quantity").show();
				$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
				setTimeout(function(){
					$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
					$(".ceng").css({"display":"none !important","z-index":"101"});
				},3000);
				return;
			}
			$('.j-shiptobtn').trigger('click', {toCart: true, params:[{url:self.buyUrl,fn:self.buyNowRes,dataType:'json'},{quantity:quantity, productId:productid, skuid:skuid, skuMd5:skumd5, itemcode: itemcode,remark:''}], toCartRun: $.proxy(self.toCartAdd, self)});
		},
		getParam:function(){
			var stockcountry =  'CN';
			if(isinventory == true){
				stockcountry = $('#J_sku').attr('stockcountry');
			}
			var productid =$("#J_shippingCost strong").attr("productid"),
				skuMd5 = $('#J_sku').attr("skumd5"),
				skuid =$('#J_sku').attr("skuid"),
				shipToCountry = $('.j-shipcountry').attr('vname'),
				shipType = $('.j-shipway').html(),
				quantity = $('#J_quantity').val(),
				data = {
					quantity:quantity,
					productId:productid,
					skuMd5:skuMd5,
					supplierId:supplierid,
					itemcode:itemcode,
					unit:measureName,
					skuid:skuid,
					shipTypeId:shipType,
					stockIn:stockcountry,
					shipToCountry:shipToCountry,
					remark:'',
					client:'wap',
					version:'2.0'
				};

			return data
		},
		//是否sold out
		ifCanSale:function(scope){
			var self=scope;
			if($("#J_isProCanSale").val()==0){
				self.$buy.addClass("sold-out");
				self.$toCart.addClass("sold-out");
				return false;
			}
			return true;
		},
		buyNow:function(){
			var self=this,
				$buy=$('.buyNow_confirm'),
				$loadingWarp = $('.j-loading-warp');
			
			if(!$buy) return;
			$("body").on("click",".buyNow_confirm",function(e){
				var $addCart = $('.addCart').hasClass('disableAddCart');
				if($addCart == true) return;
				if(self.isSkuSelected() === true){
					$('#opacityLayer').html("Please Select Option").show();
					$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
					setTimeout(function(){
						$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
					},3000);
					return;
				}

				javascript:ga('send','event','Checkout-product','Buy it now-confirm',cateDispId + '-'+itemcode);
				self.buyNowAjax();
				e.stopPropagation();e.preventDefault();
			});
		},
		buyNowRes:function(data,scope){
			var $loadingWarp = $('.j-loading-warp'),
			$popupWarp = $('.j-popup-warp');
			  	$('.sku_loading').hide();
				//数据异常，关闭loading0x0016 0x0000
				if(data.state==='0x0000'){
					scope.isLogin(scope);
				}else{
					tip.events.trigger('popupTip:loading', false);
	                //展示数据接口错误信息【点击ok，跳转到首页】
	                tip.events.trigger('popupTip:dataErrorTip', {action:'close',message:data.message});
	                //捕获异常
	                try {
	                    throw('success(): data is wrong');
	                } catch(e) {
	                    //异常数据收集
	                    dataErrorLog.events.trigger('save:dataErrorLog', {
	                        message: e,
	                        url:scope.buyUrl,
	                        params:scope.getParam(),
                            result: data,
                            custom: {
                                vid: DHM.Cookie.getCookie('vid')||'none',
                                B2BCookie: DHM.Cookie.getCookie('B2BCookie')||'none',
                                userAgent: navigator&&navigator.userAgent
                            }
	                    });
	                }
				}
            //window.location.href=data.urlabc+"?mbh=&returnURL="+paramInfo.returnURL;
		},
		fnError:function(url,scope,params){
			var $loadingWarp = $('.j-loading-warp'),
			      $popupWarp = $('.j-popup-warp');
			      
			tip.events.trigger('popupTip:loading', false);
            //展示数据接口错误信息【点击ok，关闭层】
            tip.events.trigger('popupTip:dataErrorTip', {action:'close',message:'Network anomaly.'});
            //捕获异常
            try {
                throw('error(): request is wrong');
            } catch(e) {
                //异常数据收集
                dataErrorLog.events.trigger('save:dataErrorLog', {
                    message: e,
                    url:url,
                    params:params
                });
            }
		},
		//是否登录
		isLogin:function(scope){
			//http://m.dhgate.com/mobileApiWeb/user-User-auth.do?client=wap
			DHM.Common.request({
				url:'/mobileApiWeb/user-User-auth.do',
				type:"GET",
				dataType:'json',
				data:{
					client:'wap',
					version: '0.1'
				},
				scope:scope,
				fn:scope.isLoginRes,
				fnError:scope.fnError
			});
		},
		//登录跳到placeorder未登录跳到登录页
		isLoginRes:function(data){
			var $loadingWarp = $('.j-loading-warp');
			$loadingWarp.trigger('popupTip:loading', false),
			user = data.data.user;
			setTimeout(function(){
				$(".ceng").css({"display":"none !important","z-index":"101"});
			},1000);
			if(data.state==='0x0000'&&(data.data.isVisitor===true||user!==undefined)){
				window.location.href ='/placeorder/placeOrder.html';
			}else{
				window.location.href = '/login.do?returnURL='+wwwURL+'/placeorder/placeOrder.html';
			}
		},
		toCartAjax:function(){
			var self = this,
				$toCart=$('.j-done'),
				buyerId=DHM.Cookie.getCookie("b2b_buyerid"),
				value = DHM.Cookie.getCookie("B2BCookie"),
				productid =$("#J_shippingCost strong").attr("productid"),
				quantity = $("#J_quantity").val();
			if($toCart.hasClass("sold-out")) return;
						
			if(itemAttrListSkulenght==undefined){
				var skuid = itemAttrListSku[0].skuId;
				var skumd5 = itemAttrListSku[0].skuMd5;
				$('#J_sku').attr("skuid",skuid);
				$('#J_sku').attr("skumd5",skumd5);
			}else{
				var skuid = skulastvalue.skuId;
				var skumd5 = skulastvalue.skuMd5;
				$('#J_sku').attr("skuid",skuid);
				$('#J_sku').attr("skumd5",skumd5);
			}
			if(skumd5==undefined){
				$('#opacityLayer').html("Please Select Option").show();
				$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
				setTimeout(function(){
					$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
				},3000);

				return
			}
			$('#J_sku').attr('vquantity',quantity);

			if(quantity<min_order||quantity>max_order){
				$('#opacityLayer').html("Invalid Quantity, Please Select a valid Quantity").show();
				$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
				setTimeout(function(){
					$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
				},3000);
				return;
			}
			$('.sku_loading').show()
			$('.j-shiptobtn').trigger('click', {toCart: true, params:[{url:self.cartUrl,fn:self.toCartRes},{quantity:quantity, productId:productid, skuid:skuid, skuMd5:skumd5, itemcode: itemcode,remark:''}], toCartRun: $.proxy(self.toCartAdd, self)});
			$('.j-quantity').html('<span class="done j-done j-sku_confirm" id="J_done">Confirm</span>');
		},
		toCart:function(){
			var self=this;
			var $toCart=$('.j-done');
			if(!$toCart) return;
			$("body").on("click",'.j-done',function(e){
				var $addCart = $('.addCart').hasClass('disableAddCart');
				if($addCart == true) return;
				if(self.isSkuSelected() === true){
					$('#opacityLayer').html("Please Select Option").show();
					$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
					setTimeout(function(){
						$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
					},3000);
					return;
				}
				javascript:ga('send','event','Checkout-product','Add to Cart-confirm',cateDispId + '-'+itemcode);
				self.toCartAjax();
				e.stopPropagation();e.preventDefault();

			});
		},
		toCartAdd:function(params){
			var self = this;
				stockcountry =  'CN';
			if(isinventory == true){
				stockcountry = $('#J_sku').attr('stockcountry');
			}
			DHM.Common.request({
					//url:'/mobileApiWeb/item-Item-addOrRemoveFav.do',
					url:params[0].url,
					data:$.extend(true, {}, params[1], {
						'shipToCountry':$('.j-shipcountry').attr('vname'),
						'shipType':$('.j-shipway').html(),
						'stockIn':stockcountry,
						"supplierId":supplierid,
						"unit":measureName,
						"version": 3.3,
                        "client": 'wap'
					}),
					async:false,
					dataType:params[0].dataType,
					scope:self,
					fn:params[0].fn   //回调函数
				});
		},
		toCartRes:function(data,scope){
			var $popupWarp = $('.j-popup-warp');
			if(data.state==='0x0000'){
				DHM.Init.logoSummary();
				if(window.location.hash=="#ViewAttr"){
					var text=["Selection:"];
					$(".j-skuSelect li.active").each(function(i,ele){
						if($(ele).find("img").get(0)){
							text.push(["[",$(ele).find("img").attr("title"),"]"].join(""));
						}else{
							text.push(["[",$(ele).text(),"]"].join(""));
						}
					});
					var selectValue=$('.j-skuSelect li').hasClass("active"),
						quantity =$('#J_quantity').val();
					if(selectValue){
						$(".detail-skuCont").html('<span>'+text.join("")+'</span>');
						$('.j-quantityVal').html(":"+quantity);
					}else{
						$('.j-quantityVal').html(":"+quantity);
					}
				}
				$('#opacityLayer').html(msgObj['DETAIL_add_to_cart']).show();
				$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
				setTimeout(function(){
					$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
				},3000);
				//$(".ceng").click();
				$('.sku_loading').hide();
			}else{
				//关闭loadding
				$('.sku_loading').hide();
                //展示数据接口错误信息【点击ok，关闭层】
                tip.events.trigger('popupTip:dataErrorTip', {action:'close',message:data.message});
                //捕获异常
                try {
                    throw('success(): data is wrong');
                } catch(e) {
                    //异常数据收集
                    dataErrorLog.events.trigger('save:dataErrorLog', {
                        message: e,
                        url:scope.cartUrl,
                        params:scope.getParam(),
                        result: data,
                        custom: {
                            vid: DHM.Cookie.getCookie('vid')||'none',
                            B2BCookie: DHM.Cookie.getCookie('B2BCookie')||'none',
                            userAgent: navigator&&navigator.userAgent
                        }
                    });
                }
			}
			
		},
		init:function(){
			this.buyNow();
			this.toCart();
		}
	};

//	share
	function Share(){
		this.id="#J_share";
		this.sp = "#detail-share-pop";
		this.init();
	}
	Share.prototype={
		constructor:Share,
		getOpt:function(){
			var url = window.location.href;
			if(url.indexOf("#")>0){
				url = url.substring(0,url.indexOf("#"));
			}
			url=encodeURIComponent(url);
			var title=encodeURIComponent(document.title);
			return {
				"facebook":["http://m.facebook.com/sharer.php?&u=",url,"&t=",title].join(''),
				"twitter":["https://mobile.twitter.com/home?status=",title,"+-+",url].join(''),
				"google":["http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=",url,"&title=",title].join(''),
				"pinterest":["http://pinterest.com/pin/create/button/?url=",url,"&media=&description=",title].join(''),
				"vk":["http://vk.com/share.php?url=",url].join(''),
				"linkedin":["http://www.linkedin.com/cws/share?url=",url,"&title=",title].join(''),
				"mail":["mailto:?subject=Check out what I found on DHgate!&body=Hi! I found this on DHgate and thought you might like it! Check it out now:",url].join('')
			}
		},
		operate:function(){
			var self=this,
			   $share = DHM.Common.domExist(self.id);
			   $sharePop = DHM.Common.domExist(self.sp);
			if(!$sharePop) return;
			var obj=self.getOpt();
			$sharePop.delegate("li a",DHM.Common.eType(),function(){
				var $e=$(this);
				var name=$e.data("name");
				var itemCode = $('#J_shippingCost strong').attr('itemCode');
				javascript:ga('send','event','Checkout-product','Share',cateDispId+ '-'+itemCode);
				window.open(obj[name], "bookmarkWindow");
			});
		},
		init:function(){
			this.operate();
		}
	};
//Chat
	function Chat(){
		var NTKF_PARAM = {
	        siteid:'dh_1000',                 //平台基础id
	        sellerid:'dh_1013141342',    //商户id，商家页面必须此参数，平台页面不传
	        settingid:'dh_1013141342_9999',         //Ntalker分配的缺省客服组id
	        uid:'dh_',           //用户id  buyerid   hashcode的绝对值的字符串，前面加dh_
	        uname:'',         //用户名    nickname
	        userlevel:'0'       //用户级别，1为vip用户，0为普通用户
    	};
		this.init();

	}
	Chat.prototype ={
		constructor:Chat,
		nalk:function(){
		    $("body").on("click","#J_dhChat",function(){
		    	var ntalkerSellerid = $('#J_shippingCost strong').attr('ntalkerSellerid');
		    	var uname=DHM.Cookie.getCookie("b2b_nick_n");
		    	var ntalker_buyerid = $('#J_dhChat').attr('ntalker_buyerid');
				var ntalker_js_urlStr =ntalker_js_url.substring(0,ntalker_js_url.lastIndexOf("/"));
				var NTKF_PARAM = {
			        siteid:'dh_1000',                 //平台基础id
			        sellerid:'dh_'+ntalkerSellerid,    //商户id，商家页面必须此参数，平台页面不传
			        settingid:'dh_'+ntalkerSellerid+'_9999',         //Ntalker分配的缺省客服组id
			        uid:'dh_'+ntalker_buyerid+'',           //用户id  buyerid   hashcode的绝对值的字符串，前面加dh_
			        uname:uname,         //用户名    nickname获取cookie b2b_nick_n值
			        userlevel:'0'       //用户级别，1为vip用户，0为普通用户
		    	};
		    	var itemcode =$("#J_shippingCost strong").attr("itemcode");
		        //必须要请求一次后台判断用户是否登录，不能用页面上的参数，因为用户可能在另外一个页面已经退出了登录
		        var charwin = [];
		        $.ajax({
		            url: '/buyerislogin.do',
		            type: 'GET',
		            dataType:'text',
		            async: false,
		            error: function(){},
		            success: function(data){
		                if(data != undefined && data.trim()=="true"){//登录
		                	javascript:ga('send','event','Checkout-product','Chat',cateDispId + '-'+itemcode);
		                    //_gaq.push(['send', 'event','Checkout-product', 'Chat', 'cateDispId-itemcode']);
		                    charwin.push(""+ntalker_js_urlStr+"/mobilechat_en_us.html");//js地址
		                    charwin.push("#siteid="+NTKF_PARAM.siteid+"&settingid="+NTKF_PARAM.settingid);
		                    charwin.push("&destid="+NTKF_PARAM.sellerid+"_ISME9754_GT2D_embed_"+NTKF_PARAM.settingid+"_icon");
		                    charwin.push("&myuid="+NTKF_PARAM.uid+"&myuname="+NTKF_PARAM.uname+"&itemid="+productId+"");
		                    charwin.push("&single=0&userlevel="+NTKF_PARAM.userlevel+"&ref="+encodeURIComponent(document.location));
		                    charwin.push("&title=Wholesale"+encodeURIComponent("-"+productName+""));
		                    charwin.push("&itemparam="+bid_sid_pid+"");
		                }else{//未登录
		                	var href=window.location.href;
		                	location.href = 'http://m.dhgate.com/login.do?returnURL='+href;

		                }
		            }
		        });
		        if(charwin.length>0){
		            var p = "height=540,width=320,directories=no,"+ "location=no,menubar=no,resizable=yes,"+ " status=no,toolbar=no,top=100,left=200";
		            try {window.open(charwin.join(''),'chat',p);} catch(e) {}
		        }
		    });
		},
		init:function(){
			this.nalk();
		}
	}

//个性化推荐
	function RecommendItem(){
		this.init();
	}
	RecommendItem.prototype ={
		constructor:RecommendItem,
		getRecommendItem: function(pageNum){
			//$('#J_recommendItems').html("load....");
			$('.rp-items').find('.con').addClass('detail-img-con');
           var urlpath = "/mobileApiWeb/search-Recommend-getItems.do";
            var pass =true;
            $(window).scroll(function() {
            	var cateDispId =$("#J_shippingCost strong").attr("cateDispId");
            	var docHeight = $("#J_recommendItems").offset().top;
			    	content = $(window).scrollTop() >= docHeight - $(window).height();
			    if(content && pass){
			    	pass =false;
				    $.ajax({
		                url: urlpath,
						//url: '/api.php?jsApiUrl=' + 'http://m.dhgate.com/mobileApiWeb/search-Product-getItems.do',
		                type: 'GET',
		                cache: false,
		                dataType: 'json',
		                data:{
		                    version : 3.3,
		                    client:"wap",
		                    pageSize:16,
		                    type:2,
		                    source:1,
		                    itemID:itemcode,
		                    pageNum:pageNum,
		                    pageType:"Item",
		                    category:cateDispId
		                },
		                success: function(data){
		                $('.rp-items').find('.con').removeClass('detail-img-con');
		                    if(!data||data.data==='') return;
		                   
		                    var len=data.data.resultList.length;
		                    var state = data.state;
		                    var $recommend=$("#J_recommendItems");
		                    if(state=="0x0000"){
		                        if(len>0){
		                            for(var i=0;i<len;i++){
		                                var dd=data.data.resultList[i];
		                                var url="http://m.dhgate.com/product";
		                                var html;
		                                //折扣
		                                if(dd.promoType=="0"){
		                                    html=['<li>',
		                                        '<div class="list-img">',
		                                        '<span class="off-icon">',parseInt(dd.discountRate),'</span>',
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec','><img src=',dd.imgUrl,'  alt=',dd.seoName,'></a>',
		                                        '</div>',
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec',' class="list-cont">',
		                                        '<span class="price">$',dd.discountPrice,'</span>',
		                                        '</a>',
		                                        '</li>'];
		                                }
		                                //直降
		                               else if(dd.promoType=="10"){
		                                    html=['<li>',
		                                        '<div class="list-img">',
		                                        '<span class="reduction-ico">$',parseInt(dd.discountRate),'</span>',
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec','><img src=',dd.imgUrl,' alt=',dd.seoName,'></a>',
		                                        '</div>',
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec',' class="list-cont">',
		                                        '<span class="price">$',dd.discountPrice,'</span>',
		                                        '</a>',
		                                        '</li>'];
		                                } else{
		                                    html=['<li>',
		                                        '<div class="list-img">',
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec','><img src=',dd.imgUrl,' alt=',dd.seoName,'></a>',
		                                        '</div>',
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec',' class="list-cont">',
		                                        '<span class="price">$',dd.maxPrice,'</span>',
		                                        '</a>',
		                                        '</li>'];
		                                }
		                                $recommend.append(html.join(""));
		                                if(pageNum>1){
		                                    $('.show-more').hide();
		                                }
		                            }
		                            for(var i=8;i<len;i++){
		                                $recommend.find('li').eq(i).css('display','none');
		                            }
		                        }else{
		                            $('.rp-items').hide();
		                        }
		                    }

		                }
		            });
			    }
			})
        },
        init:function(){
            var self=this;
            self.getRecommendItem(1);
            $('.show-more').click(function(){
		        $("#J_recommendItems").find("li").css('display','block');
		        $(this).hide();
	    	});
        }
	}

//Chat
	new Chat();
//个性化推荐
    new RecommendItem();
//  getDes
	new Description();
//  ShowLayer
	new ShowLayer();
//	share
	new Share();
	new DetailSKU();
	new DetailSdr();
	var CartBuy = new CartBuy();
	if($('.j-shiptobtn').length){
		var shipto  = new Shipto();
	}
	DHM.Init.logoSummary();
	if($('.js-open-app').length){
		var priceOnapp = new Priceonapp();
	}
	if($('.j-store-coupons').length){
		var storecoupon = new StoreCoupon();
	}	//捕获异常函数
	var dataErrorLog = new DataErrorLog({
        flag: true,
        url: '/mobileApiWeb/biz-FeedBack-log.do'
    });
    //各种提示层
	var tip = new Tip();
//	tracking
	function tracking(){
		$("#cartnum").click(function(){
			javascript:ga('send','event','Checkout-product','cart',cateDispId + '-'+itemcode);
		});
		$("#J_dhMsg").click(function(){
			javascript:ga('send','event','Checkout-product','Message',cateDispId + '-'+itemcode);
		});
		$('.ui-gotop').click(function(){
			javascript:ga('send','event','Checkout-product','Top',cateDispId + '-'+itemcode);
		});
		$('.J_buyNow_inside').click(function(){//中间Buyt it now、Add to Cart按钮统计
			javascript:ga('send','event','Checkout-product','Buy it now','inside',cateDispId + '-'+itemcode);
		})
		$('.J_addToCart_inside').click(function(){
			javascript:ga('send','event','Checkout-product','Add to Cart','inside',cateDispId + '-'+itemcode);
		})
		$('.buyNow_confirm_layer').click(function(){//sku浮层Buyt it now、Add to Cart按钮统计
			javascript:ga('send','event','Checkout-product','Buy it now','layer',cateDispId + '-'+itemcode);
		});
		$('.addToCart_confirm_layer').click(function(){
			javascript:ga('send','event','Checkout-product','Add to Cart','layer',cateDispId + '-'+itemcode);
		});
		$('.f-buyNow').click(function(){//底部固定Buyt it now、Add to Cart按钮统计
			javascript:ga('send','event','Checkout-product','Buy it now','float',cateDispId + '-'+itemcode);
		});
		$('.f-addCart').click(function(){
			javascript:ga('send','event','Checkout-product','Add to Cart','float',cateDispId + '-'+itemcode);
		});
	}
	tracking();

	//sku弹层
	function skuLayer(){
		if(skuInfonumvaluestate==false){
			new ShowSku().init();
		}
		setTimeout(function(){
			$('.rp-items').hide();		
		},1000);
		$('#J_recommendItems').css('display','none');
		$('.rp-items').hide();	
        $('#J_skuLayer').css('top','100px');
		$(".dhm-detail").css("display","block !important");

		$(".ceng").css({"display":"block !important","z-index":"101"});
		$('body').on('click','.ceng',function(){
			DetailUtil.ifShow(false);
			var $l = $('#J_skuLayer');
			DetailUtil.translate($l,"100%");
			$('#J_recommendItems').css('display','block');
		$('.show-more').css('display','block');

		});
	}
	function addClass(){
		$('.j-done').addClass('sold-out');
		$('.addCart').addClass('disableAddCart');
		$('.J_buyNow,.J_addToCart,.buyNow_confirm').addClass('noClick');
		$('#J_quantity').attr("disabled","disabled");
		$('#J_quantity').addClass('disabled');
		$('.j-shiptobtn').attr('issold',0);
		$('.jia').removeClass('jiak').addClass('jiab');
	}
	function removeClass(){
		$('.j-done').removeClass('sold-out');
		$('.addCart').removeClass('disableAddCart');
		$('.J_buyNow,.J_addToCart,.buyNow_confirm').removeClass('noClick');
		$('#J_quantity').removeAttr("disabled");
		$('#J_quantity').removeClass('disabled');
		$('.j-shiptobtn').attr('issold',1);//是否可售
		$('.jia').removeClass('jiab').addClass('jiak');
	}
	//商品售空或商品不可运达该国家buy it now && add To Cart按钮不可点击
	function btnAvailable(){
		var quantity= $('#J_quantity').val(),
			noBtn = $('.addCart').hasClass('disableAddCart');
		if(istate ==false || noBtn ==true || max_order == 0 || defaultMinPurchaseNum < min_order || max_order < min_order){//sold out buy it now Add to Cart按钮置灰
			addClass();
		}else if(quantity == defaultMinPurchaseNum || defaultMinPurchaseNum == 0){
			$('.jia').removeClass('jiak').addClass('jiab');
			$('#J_quantity').attr("disabled","disabled");
			$('#J_quantity').addClass('disabled');
		}else{
	    	removeClass();
	    }
	}
	$('body').on('click','.j-done',function(){
		$('#J_skuLayer').css('top','100px');
	})
	$('#J_specifics').click(function(){
		$('#J_sdrLayer').css('display','block');
		javascript:ga('send','event','Checkout-product','Specification',cateDispId+ '-'+itemCode);
	});
	$('#J_sku').click(function(){
		skuLayer();
		$('.done').addClass("SelectOptionsDone");
		$('.j-quantity').html('<div class="addBtn  j-addBtn clearfix" style="position: static; display: block; z-index: 100;"><div class="addCart buyNow"><span title="Buy it Now" class="buyNow_confirm buyNow_confirm_layer">Buy it Now</span></div><div class="addCart"><span title="Add to Cart" class="done j-done addToCart_confirm_layer">Add to Cart</span></div></div>');
		//商品售空或商品不可运达该国家buy it now && add To Cart按钮不可点击
		btnAvailable();
		javascript:ga('send','event','Checkout-product','SelectOptions',cateDispId + '-'+itemcode);
	});
	$(".J_addToCart").click(function(){
		if($('.addCart').hasClass("disableAddCart")) return;
		skuLayer();
		//商品售空或商品不可运达该国家buy it now && add To Cart按钮不可点击
		btnAvailable();
		$('.done').removeClass("SelectOptionsDone");
		$('.done').attr('id','J_done');
		$('.done').removeClass('buyNow_confirm');
	});
	$(".J_buyNow").click(function(){
		if($('.addCart').hasClass("disableAddCart")) return;
		skuLayer();
		$('.done').removeClass("SelectOptionsDone");
		$('.done').removeClass("j-done");
		$('.done').addClass('buyNow_confirm');
		$('.done').attr('id','buyNow_confirm');
		//buy it now && add To Cart按钮不可点击
		btnAvailable();
	});
	
});