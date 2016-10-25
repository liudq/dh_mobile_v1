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
	//引入调用入口
	var detailconfig = window.DETAIL,
		tools = detailconfig.tools,
		Shipto = tools.Shipto;
	/*var canonicalURL ="";
	var lastDispName ="";
	var oriImgList="";*/
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
			DHM.Init.logoSummary();
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
		getPrice:function(callback){
			var self = this;
			//var _self =DetailUtil; 
			var apiSet ={
				priceUrl : '/mobileApiWeb/item-Item-getItemBaseInfo.do?'
			}
			$.ajax({
				url: apiSet.priceUrl,
				//url: '/api.php?jsApiUrl=' + 'http://m.dhgate.com//mobileApiWeb/item-Item-getItemBaseInfo.do',
				data: {
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
								measureName = dataJson.measureName,
								lot = dataJson.lot,
								skuAttrNameList = dataJson.skuAttrNameList,
								promEndDate = dataJson.promEndDate,
								specification = dataJson.specification,
								defInventoryQty = dataJson.defInventoryQty,
								istate = dataJson.istate;
								thumbList = dataJson.thumbList;  //单个原图地址
								minPrice = dataJson.minPrice;
								productName = dataJson.productName;
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
								/*canonicalURL = dataJson.itemMetaSeo.canonicalURL;
								lastDispName = dataJson.itemMetaSeo.lastDispName;
								oriImgList = dataJson.oriImgList;*/

								self.TrackingD();
								self.trackingGoogle();
								self.trackingNerverBlueRemark();
								self.getReview();
							//获取头部seo
							/*var htmlStr=['<meta name="keywords" content="'+lastDispName+'"/>',
							'<meta name="description" content="Wholesale cheap '+lastDispName+' online - Find best '+productName+' at discount prices from Chinese '+lastDispName+' on m.dhgate.com." />',
							'<meta property="og:url" content="http://m.dhgate.com/'+canonicalURL+'"/>',
							'<meta property="og:description" content="Wholesale cheap '+lastDispName+' online - Find best '+productName+' at discount prices from Chinese '+lastDispName+' on m.dhgate.com."/>',
							'<meta property="og:image" content="'+oriImgList[0]+'"/>',
    						'<meta property="og:title" content="Online Shopping '+productName+' '+minPrice+' | m.dhgate.com"/>'];
							$('head').append(htmlStr.join(""));*/
							//设置min-order
							//$('.j-shiptobtn').attr('minOrder',min_order);
							//$('.j-shiptobtn').attr('hasajax',true);

							callback && callback(min_order);



							document.title='Online Shopping '+productName+' '+minPrice+' | m.dhgate.com';
							//截取商品名称字符串
							if (productName.length >=80) {
				            	productNameStr = productName .substring(0,75)+"..."
				            	$('#J_proInfo').html(productNameStr);
			            	}else{
			            		promNameStr = productName.substring(0);
								$('#J_proInfo').html(promNameStr);
			            	}
			            	if(!searchUrl){
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
			            	}
							if(!searchUrl){
								for(var i=0;i<specification.length;i++){
									var html =['<p>','<span>',specification[i].targetName+':','</span>','<var>',specification[i].targetValue,'</var>','</p>'];
									$('#J_specificsLayer').append(html.join(""));
								}
							}else{
								$('#J_recommendItems').hide();
							}
							var $cm = $('#J_specificsLayer p var').eq(4).html();
								$('#J_specificsLayer p var').eq(4).html($cm + '(cm)');
							var $kg =$('#J_specificsLayer p var').eq(5).html();
								$('#J_specificsLayer p var').eq(5).html($kg + '(kg)');
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
									$('.commonPrice,.sku_price').html('<strong>US '+'$'+dataJson.itemVipDto.minVipPrice+'- '+dataJson.itemVipDto.maxVipPrice+'</strong> / <span class="smallPrice">Lot</span>');
									$('.lineThrough,#line_price').html('US&nbsp;' +'$'+dataJson.minPrice + '-' + dataJson.maxPrice + '&nbsp;/'  +'Lot');
									$("#J_quantity").val(dataJson.minOrder)	;
									$("#Piece_sku").html(lot+dataJson.plural);
								}else{
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' + dataJson.plural);
									}else{
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;'+ measureName);
									}
									$('.commonPrice,.sku_price').html('<strong>US '+'$'+dataJson.itemVipDto.minVipPrice+'- '+dataJson.itemVipDto.maxVipPrice+'</strong> /<span class="smallPrice">'+measureName+'</span>');
									$('.lineThrough,#line_price').html('US&nbsp;' +'$'+dataJson.minPrice + '-' + dataJson.maxPrice + '&nbsp;/'  +measureName);	
									$('#sku_lot').css('display','none')
								}
								if(dataJson.promoDto.promoTypeId=="0"){
									$('.give-ico').show();
									$('.give-ico').html(Math.round((1- promoDtoDiscountRate)*100));
								}else{
									$('.give-ico').addClass('reduction-ico');
									$('.give-ico').html('$'+Math.round(promoDtoDiscountRate));
									$('.left-bg').addClass('down-left-bg');
									$('.dis-text').addClass('down-dis-text');
									$('#dis-icon').addClass('down-dis-icon');
								}
								$('#salesVolume').html("VIP Plus");
								$('#salesVolume').addClass('salesVip');
							}else if(value ==1 && dataJson.itemVipDto!=null){  //如果是vip买家，即是vip商品显示vip价格 如果是promo商品显示促销价，否则显示原价。
								itemVipDto = dataJson.itemVipDto;
								if(lot >1){
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lots');
									}else{
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lot');
									}
									if(itemVipDto.minVipPrice ==  itemVipDto.maxVipPrice && minPrice ==maxPrice){
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+'</strong> / <span class="smallPrice">Lot</span>');
										$('.lineThrough,#line_price').html('US&nbsp;' +'$'+minPrice +  '&nbsp;/'  +'Lot');
									}else{
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+'- '+itemVipDto.maxVipPrice+'</strong> / <span class="smallPrice">Lot</span>');
										$('.lineThrough,#line_price').html('US&nbsp;' +'$'+minPrice + '-' + maxPrice + '&nbsp;/'  +'Lot');
									}
									$("#J_quantity").val(dataJson.minOrder)	;
									$("#Piece_sku").html(lot+dataJson.plural);

								}else{
									if(dataJson.minOrder >1){
										$('#MinOrder,#MinOrder_sku').html(dataJson.minOrder+ '&nbsp;' + dataJson.plural);
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;'+ dataJson.plural);
									}else{
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;'+ measureName);
									}	
									if(itemVipDto.minVipPrice ==  itemVipDto.maxVipPrice && minPrice ==maxPrice){
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+'</strong> /<span class="smallPrice">'+measureName+'</span>');
										$('.lineThrough,#line_price').html('US&nbsp;' +'$'+minPrice + '&nbsp;/'  +measureName);
									}else{
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+itemVipDto.minVipPrice+'- '+itemVipDto.maxVipPrice+'</strong> /<span class="smallPrice">'+measureName+'</span>');
										$('.lineThrough,#line_price').html('US&nbsp;' +'$'+minPrice + '-' + maxPrice + '&nbsp;/'  +measureName);
									}
								$('#sku_lot').css('display','none')
								}
								$('#salesVolume').html('VIP');
								$('#salesVolume').addClass('salesVip');
							}
							else if(data && dataJson.promoDto !=undefined){
								promoDto =dataJson.promoDto;
								var promName = dataJson.promoDto.promName,
									promoDtoDiscountRate =dataJson.promoDto.discountRate,
									promoMinPrice = dataJson.promoDto.promoMinPrice,
									promoMaxPrice = dataJson.promoDto.promoMaxPrice,
									promEndDate = dataJson.promoDto.promEndDate,
									serverTime = data.serverTime;
							        //倒计时
							        function checkTime(n){
										if(n < 10 && n >1){
											return n="0" + n
										}
										  return n
									}
									var interval = 1000;
							        setInterval(function(){
							        	var  now=new Date();
								        var	$promEndDate=new Date(promEndDate);
								        var $systemTime=new Date(serverTime);
								        //var mtimes =$promEndDate.getTime() - $systemTime.getTime();
								        var mtimes =$promEndDate.getTime() - now.getTime();
								        //console.log($systemTime);
								        var d = Math.floor(mtimes / 1000 / 60 / 60 / 24);
									    var h = Math.floor(mtimes / 1000 / 60 / 60 % 24);
									    var m = Math.floor(mtimes / 1000 / 60 % 60);
									    var s = Math.floor(mtimes / 1000 % 60);
							        	$('#J_countdown').html('<span>'+checkTime(d)+'d</span><span>'+checkTime(h) +'h</span><span>'+checkTime(m)+'m</span><span>'+checkTime(s) +'s</span>');	
							        },interval);
								$('.daily-deals').show();
								if (promName.length >=16) {
					            	promNameStr = promName .substring(0,16)+"..."
					            	$('.dis-text').html(promNameStr);
				            	}else{
				            		promNameStr = promName .substring(0);
									$('.dis-text').html(promNameStr);
				            	}
				            	if(dataJson.promoDto.dynamicType ==0){
				            		$('.give-ico').addClass('sale');
				            	}else{
				            		if(dataJson.promoDto.promoTypeId=="0"){
										$('.give-ico').show();
										$('.give-ico').html(Math.round((1- promoDtoDiscountRate)*100));
									}else{
											$('.give-ico').addClass('reduction-ico');
											$('.give-ico').html('$'+Math.round(promoDtoDiscountRate));
											$('.left-bg').addClass('down-left-bg');
											$('.dis-text').addClass('down-dis-text');
											$('#dis-icon').addClass('down-dis-icon');
									}	
				            	}
								if(lot > 1){
									if(dataJson.minOrder>1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lots');
									}else{
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lot');
									}
									if(minPrice ==maxPrice && promoMinPrice == promoMaxPrice){
										$('.lineThrough,#line_price').html('US &nbsp;' + '$'+minPrice + '&nbsp;/'  +'Lot');
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+promoMinPrice+'</strong> /<span class="smallPrice">Lot</span>');
									}else{
										$('.lineThrough,#line_price').html('US &nbsp;' + '$'+minPrice + '-' + maxPrice + '&nbsp;/'  +'Lot');
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+promoMinPrice+'- '+promoMaxPrice+'</strong> /<span class="smallPrice">Lot</span>');
									}
									$("#J_quantity").val(dataJson.minOrder)	;
									$("#Piece_sku").html(lot+dataJson.plural);
								}else{
									if(minPrice ==maxPrice && promoMinPrice == promoMaxPrice){
										$('.lineThrough,#line_price').html('<span>US </span>$'+minPrice+' / '+measureName+'')
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+promoMinPrice+'</strong> /<span class="smallPrice">'+measureName+'</span>');	
									}else{
										$('.lineThrough,#line_price').html('<span>US </span>$'+minPrice+'-  '+maxPrice+' / '+measureName+'')
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+promoMinPrice+'- '+promoMaxPrice+'</strong> /<span class="smallPrice">'+measureName+'</span>');
									}
									if(dataJson.minOrder > 1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' + dataJson.plural);
									}else{
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' + measureName);
									}
									$('#sku_lot').css('display','none')	
								}
								$('#salesVolume,#salesVolume_sku').html((defInventoryQty >=9999)?(9999 + '+&nbsp;in Stock'):defInventoryQty + '&nbsp;in Stock');

							}else{
								if(lot > 1){
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder+ '&nbsp;' +'Lots');
									}else{
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;' +'Lot');
									}
									if(minPrice == maxPrice){
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+minPrice+'</strong> /<span class="smallPrice">Lot</span>');
									}else{
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+minPrice+'- '+maxPrice+'</strong> /<span class="smallPrice">Lot</span>');
									}
									$("#J_quantity").val(dataJson.minOrder)	;
									$("#Piece_sku").html(lot+dataJson.plural);
								}else{
									if(dataJson.minOrder >1){
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;' + dataJson.plural+'');	
									}else{
										$('#MinOrder').html(dataJson.minOrder + '&nbsp;' + measureName);
									}
									if(minPrice == maxPrice){
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+minPrice+'</strong> /<span class="smallPrice">'+measureName+'</span>');
									}else{
										$('.commonPrice,.sku_price').html('<strong>US '+'$'+minPrice+'- '+maxPrice+'</strong> /<span class="smallPrice">'+measureName+'</span>');
									}
								$('#sku_lot').css('display','none')
								}
								$('.lineThrough').hide();
								$('#salesVolume,#salesVolume_sku').html((defInventoryQty >=9999)?(9999 + '+&nbsp;in Stock'):defInventoryQty + '&nbsp;in Stock');
								$('.give-ico').hide();
							}
							if(istate ==false){
								$('.detail-price').find('.addCart').text('Add to Cart');
								$('.addCart').addClass('disableAddCart');
								$('.done').addClass('sold-out');
								$('.buyNow_confirm').addClass('sold-out');
								$('.istateShow').show();
								$('.soldOut').show();
								$('.j-shiptobtn').attr('issold',0)
							}else{
								$('.addCart').addClass('');
								$('.istateShow').hide();
								$('.soldOut').hide();
								$('.j-shiptobtn').attr('issold',1)
							}
				            $('#selectAttr').html(skuAttrNameList.join(","));
				           if(dataJson.isfreeShipping == true){
								$(".freeShip").show();
								$('#J_shippingCost').html('<strong itemcode='+dataJson.itemCode+' htmlurl='+dataJson.htmlurl+' productId='+dataJson.productId+' cateDispId='+dataJson.cateDispId+' prodLineId='+dataJson.prodLineId+' ntalkerSellerid ='+dataJson.ntalker.ntalker_sellerid+'  ntalker_js_url='+dataJson.ntalker.ntalker_js_url+'>Free shipping to '+dataJson.visitCty+'</strong>');
							}else{
								$(".freeShip").hide();
								 $('#J_shippingCost').html('<strong itemcode='+dataJson.itemCode+' htmlurl='+dataJson.htmlurl+' productId='+dataJson.productId+' cateDispId='+dataJson.cateDispId+' prodLineId='+dataJson.prodLineId+' ntalkerSellerid ='+dataJson.ntalker.ntalker_sellerid+'  ntalker_js_url='+dataJson.ntalker.ntalker_js_url+'>Ship to '+dataJson.visitCty+'</strong>');
							}
							//Supplier
							var $supplier = $('.detail-supplier');
							var html =['<div>Supplier:'+dataJson.supplierInfo.suppliername+'</div>','<div><span><b>'+dataJson.supplierInfo.showpercentum+'%</b> Positive Feedback</span><span class="dhm-rt"><b>'+dataJson.supplierInfo.cofirmorderAccumulated+'</b> Transactions</span></div>'];
							$supplier.html(html.join(""));
							if(dataJson.ntalker.isonLine==false){
								$('.detail-message').html('<a  href="javascript:;"><span class="notonline"></span>Offline</a><a id="J_dhMsg" href="/sendmsg.do?mty=3&amp;proid='+dataJson.productId+'&amp;productname='+dataJson.productName+'&amp;spid='+dataJson.supplierInfo.systemuserid+'"><span class="msg"></span>Message</a>');

							}else{
								$('.detail-message').html('<a href="javascript:;" id="J_dhChat" ntalker_buyerid ='+dataJson.ntalker.ntalker_buyerid+' ><span class="chat"></span>Chat</a><a id="J_dhMsg" href="/sendmsg.do?mty=3&amp;proid='+dataJson.productId+'&amp;productname='+dataJson.productName+'&amp;spid='+dataJson.supplierInfo.systemuserid+'"><span class="msg"></span>Message</a>');
							}
							new DetailSlide();
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
				'layer': 'iframe',
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
			var Cookieitemcode=DHM.Cookie.getCookie("item_recentvisit");
			if (Cookieitemcode==null || Cookieitemcode==""){
				DHM.Cookie.setCookie("item_recentvisit",itemcode,{path :'/',expires: 7});
			}else{
				var CookieitemcodeArry=Cookieitemcode.split(",");
				if(CookieitemcodeArry.length>=10){
					var delArry = CookieitemcodeArry.pop();
					CookieitemcodeArry.unshift(itemcode);
					//DHM.Cookie.setCookie("item_recentvisit",CookieitemcodeArry,{path :'/'});
					DHM.Cookie.setCookie("item_recentvisit",CookieitemcodeArry,{path :'/',expires: 7});
				}else{
					CookieitemcodeArry.unshift(itemcode);
					DHM.Cookie.setCookie("item_recentvisit",CookieitemcodeArry,{path :'/',expires: 7});
				}
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
				//getSkuallmatch(firstsku,skuInfonumvalue);


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
			}];
			return obj;
		},
		getDiv:function(){
			var $div=$("body").children("div,header,footer");
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
			$(window).scroll(function(){
				if ($(window).scrollTop()>100){
					$('.ui-gotop').css("display","block");
				}else if(window.location.hash=="#Viewsdr"){
					$('.ui-gotop').css("display","none");
				}
				else{
					$('.ui-gotop').css("display","none");
					$('.addBtn').css({"position":"static"});
				}
				//判断底部显示buy it now Add to Cart按钮
				var	windowHeight=$(window).height();
				if(windowHeight = 667){
					var docHeight =parseInt($('#detail-share-pop').offset().top+55);
				}else if(windowHeight=736){
					var docHeight =parseInt($('#detail-share-pop').offset().top+95);
				}else if(windowHeight=480){
					var docHeight =parseInt($('#detail-share-pop').offset().top-150);
				}
				else{
					var docHeight =parseInt($('#detail-share-pop').offset().top-55);
				}
				content = $(window).scrollTop() >= docHeight - windowHeight;
				if(content){
					$('.j-fixedAdd').css({"position":"fixed","display":"block","z-index":"100"});
				}
				else{
					$('.addBtn').css({"position":"static","display":"block","z-index":"100"});
					$('.j-fixedAdd').hide();
				}

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
					$("body").css({'background':'#ebebeb',height:h});
					$d.css({"position":"absolute","height":h});
				},800);
			}else{
				$d.undelegate($d,DetailUtil.ev);
				if(!flag){
					DetailUtil.$layer=null;
					DetailUtil.ifShow(false);
					$(".addBtn").show();
				}
				if(flag&&f1){
					DetailUtil.$layer.show();
				}
				$("body").css({'background':'#ebebeb',height:"auto"});
				$d.css({"position":"fixed","height":"100%"});
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
		Skuevent: function () {
			var that = this;
			/*$('.j-back').click(function(){
				$('.sdr').css("top","100px");
			})*/
			$('body').on('click','.jiak',function(){
				var quantity = parseInt($("#J_quantity").val())+1;
				$("#J_quantity").val(quantity);
				if(quantity>min_order){
					$(".jian").removeClass("jianb").addClass("jiank");

				}
				if(quantity>=max_order&&max_order!==""){
					$(".jia").removeClass("jiak").addClass("jiab");
				
				}
				if(quantity>=10000){
					$(".jia").removeClass("jiak").addClass("jiab")

				}
				$("#J_skuLayer").find(".j-maxvalue").each(function(i,e){
					var $e=$(e),mi,$p=$e.parent().parent();
					
					//console.log($p);
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
							$("#line_price").html(line_Price+'/ '+line_pricep)
						}
						if(	$($("dd")[z]).find(".promDiscountPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".promDiscountPrice").html();
							var line_Price =$($("dd")[z]).find(".Price").html();
							$('.commonPrice  strong').html(rel_Price);
							$(".sku_price  strong").html(rel_Price);
							$("#line_price").html(line_Price+'/ '+line_pricep)
						}

					}
				}
			});
			$('body').on('click','.jiank',function(){
				var quantity = parseInt($("#J_quantity").val())-1;
				$("#J_quantity").val(quantity);
				if(quantity<=min_order){
					$(".jian").removeClass("jiank").addClass("jianb");

				}
				if(quantity<=max_order){
					$(".jia").removeClass("jiab").addClass("jiak");
				}
				$("#J_skuLayer").find(".j-maxvalue").each(function(i,e){
					var $e=$(e),mi,$p=$e.parent().parent();
					
					//console.log($p);
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
							$("#line_price").html(line_Price+'/ '+line_pricep)
						}
						if(	$($("dd")[z]).find(".promDiscountPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".promDiscountPrice").html();
							var line_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice strong').html(rel_Price);
							$(".sku_price strong").html(rel_Price);
							$("#line_price").html(line_Price+'/ '+line_pricep)
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
				skuInfonumvaluestate=true
				$('.sku_loading').hide();
				$('.show-more').css('display','none');
			};
			var apiSet = {
				url: 'http://m.dhgate.com/mobileApiWeb/item-Item-getDetailItemDto.do?client=wap'

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
				max_order = itemAttrListSku[0].inventoryNum;
		  var qtyRangeList = itemSkuRelAttr[0].wholesaleQtyRangeList;
			for(var p = 0;p<qtyRangeList.length;p++){
				skuWholeRangeLists +='<dd><span><var class="j-minvalue">'+qtyRangeList[p].startQty+'</var> +<var class="j-maxvalue">'+qtyRangeList[p].endQty+'</var>' +
					'</span> <span class="originalPrice">US $'+qtyRangeList[p].originalPrice+'</span><span class="Price">US $'+qtyRangeList[p].originalPrice+'</span>  <span class="vipPrice">US $'+qtyRangeList[p].vipPrice+'</span><span class="promDiscountPrice">US $'+qtyRangeList[p].promDiscountPrice+'</span> </dd>'
			}
			$('#J_quantity').val(min_order);
			var monad = $('.smallPrice').html();
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
									in_stock = itemAttrListSku[j].inventoryNum;
								if(in_stock==min_order){
									$(".jia").removeClass("jiak").addClass("jiab");

								}else if(in_stock>min_order){
									$(".jia").removeClass("jiab").addClass("jiak");
								}
									if(in_stock>=10000){
										$("#salesVolume_sku").html("9999+ in Stock");
									}else{
										$("#salesVolume_sku").html(in_stock +" in Stock");
									}
									max_order = in_stock;
									var skuWholeRangeLists = "";
									var qtyRangeList = itemAttrListSku[j].wholesaleQtyRangeList;
									for(var p = 0;p<qtyRangeList.length;p++){
										skuWholeRangeLists +='<dd><span><var class="j-minvalue">'+qtyRangeList[p].startQty+'</var>+  <var class="j-maxvalue">'+qtyRangeList[p].endQty+'</var>' +
											'</span> <span class="originalPrice">US $'+qtyRangeList[p].originalPrice+'</span><span class="Price">US $'+qtyRangeList[p].originalPrice+'</span>  <span class="vipPrice">US $'+qtyRangeList[p].vipPrice+'</span><span class="promDiscountPrice">US $'+qtyRangeList[p].promDiscountPrice+'</span> </dd>'
									};
									$("dd").remove();
									$(".sku-wprice").find("dt").after(skuWholeRangeLists);
									if(!promoDto==""){

										if(b2b_buyer_lv==1 &&itemVipDto!=null){
											$('.promDiscountPrice').css('display','none');
											$('.Price').css('display','none')
										}else{

											$('.vipPrice').css('display','none');
											$('.Price').css('display','none')
										}
									}
									else	if(b2b_buyer_lv==1 &&itemVipDto!=null){
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
										//var lastdd = '<span><var class="j-minvalue">'+maxvalue+'+</var>';
										//$('dd').last().find('span').eq(0).html(lastdd);
										$('.j-maxvalue').last().text(maxvalue+'+')

									}
								}
						}
						if(test_sku==itemSkuRelAttrall){
							if(skuSaleStatus==1) {
								state = true;
							}
							else{
								$($($('.j-skuSelect')[a[a.length-1]]).find("li")[k]).css("background-color","rgb(204, 204, 204)")
								$($($('.j-skuSelect')[a[a.length-1]]).find("li")[k]).removeClass('active')
							}
						}
						itemSkuRelAttrall =""	;
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
						$("#line_price").html(line_Price+'/ '+line_pricep)

					}
					if(	$($("dd")[z]).find(".vipPrice").css("display")=='inline-block'){
						var rel_Price =	$($("dd")[z]).find(".vipPrice").html();
						var line_Price =	$($("dd")[z]).find(".Price").html();
						$('.commonPrice strong').html(rel_Price);
						$(".sku_price strong").html(rel_Price);
						$("#line_price").html(line_Price+'/ '+line_pricep)
					}

				}
			}
			$('#J_quantity').val(min_order);
		},
	};
	$('#J_specifics').click(function(){
		$('#J_sdrLayer').css('display','block');
		javascript:ga('send','event','Checkout-product','Specification',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
	});
	$('#J_sku').click(function(){
		javascript:ga('send','event','Checkout-product','SelectOptions',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
		$('#J_skuLayer').css({'display':'block',"z-index":"102"});
		if(skuInfonumvaluestate==false){
			new ShowSku().init();
		}
		setTimeout(function(){
					var h=$(window).height();
					$('#J_skuLayer').css({"height":h-100});	
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
		javascript:ga('send','event','Checkout-product','SelectOptions',cateDispId + '-'+itemcode);
	});
	$(".J_addToCart").click(function(){
		if($('.addCart').hasClass("disableAddCart")) return;
		$('#J_sku').click();
		$('.done').html("done");
		$('.done').attr('id','J_done');
		$('.done').removeClass('buyNow_confirm');
		javascript:ga('send','event','Checkout-product','AddToCart',cateDispId + '-'+itemcode);
	});
	$(".J_buyNow").click(function(){
		if($('.addCart').hasClass("disableAddCart")) return;
		$('#J_sku').click();
		$('.done').addClass('buyNow_confirm');
		$('.buyNow_confirm').html("Confirm");
		$('.done').attr('id','buyNow_confirm');
		javascript:ga('send','event','Checkout-product','Buy it now',cateDispId + '-'+itemcode);
	});
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
	//	add to fav
	function AddToFav(){
		this.$fav=DHM.Common.domExist("#J_addToFav");
		if(!this.$fav) return;
		this.url = DHM.Common.mobileHost+"mobileApiWeb/item-Item-addOrRemoveFav.do";
		this.init();
	}
	AddToFav.prototype={
		constructor:AddToFav,
		getFav:function(){
			var self=this;
			this.$fav.click(function(evt){
				var fav= $("#J_addToFav").find('span').hasClass('fav-span');
				if(!fav){
					fav =true;
					$('.favorite').show();
					$('.favoriteTxt').removeClass('favoriteTxtCancel');
					$('.favoriteTxt').html('Added to your favorite')
				}else{
					$('.favorite').show();
					fav=false;
					$('.favoriteTxt').addClass('favoriteTxtCancel');
					$('.favoriteTxt').html('Removed from your favorite')
				}
				DHM.Common.request({
					url:self.url,
					type:"GET",
					data:{
	                    client:"wap",
	                    isadd:fav,
	                    itemcode:itemcode
                	},
					fn:self.favRes,
					scope:self
				});
			});
		},
		favRes:function(data,scope){
			var self=scope;
			if(data.state ="0x0000"){
				var dt =data.data;islogin=dt.islogin,favSuccess=dt.isadd;
				//var dataFav= $("#J_addToFav").attr("data");
				if(favSuccess == true){
					//if(dataFav =="1"){
						$('.favoriteTxt').show();
						setTimeout(function(){
							$('.favorite').hide();
						},3000);
					//}
					//$("#J_addToFav").attr("data","2");
				}
				if(islogin==true){
					javascript:ga('send','event','Checkout-product','Favorite',cateDispId + '-'+itemcode);
				}else{
					javascript:ga('send','event','Checkout-product','NotlogFavorite',cateDispId + '-'+itemcode);
				}
			}
			self.$fav.find('span').toggleClass('fav-span');

		},
		init:function(){
			this.getFav();
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
				$d.click(function(e){
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
					$('.j-fixedAdd').removeClass('j-ifShow');
					$('#J_recommendItems').css('display','block');
					$('.ui-gotop').css("display","none");
					DetailUtil.translate($l,"100%");
					DetailUtil.freshHash();
					if(h=="#ViewAttr"){
						var ifShow = $('.j-fixedAdd').attr("ifShow");
						if(ifShow=="true"){
							DetailUtil.ifShow(true);
							$('.j-fixedAdd').css("display","block");
						}
						//$(".j-fixedAdd").removeAttr("ifShow");
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
						var selectValue=$('.j-skuSelect li').hasClass("active");
						if(selectValue){
							$(".detail-skuCont").text(text.join(""));
							var quantity =$('#J_quantity').val();
							$('#J_sku .gary').html("Quantity:"+quantity);
						}
						var vquantity =$('#J_quantity').val();
						$('#J_sku').attr('vquantity',vquantity);
						$('.j-shiptobtn').trigger('click', {toCart: true});
					}else if(h=="#Viewsdr"){
						$(".j-fixedAdd").removeAttr("ifShow");
					}
				});
			});
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
					break;
				case "J_reviews":
					$nav.find("a[name='r']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_reviewLayer");
					$d.show();
					$d.siblings("article").hide();
					$('.rp-items').hide();
					break;
				default:
					$nav.find("a[name='s']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_specificsLayer");
					$d.show();
					$d.siblings("article").hide();
					$('.rp-items').hide();
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
			//	$dd.hide();
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
		setQuantity:function(){
			var min=parseInt(this.$quantity.attr("init-value"));
			var self=this;
			self.$quantity.focus(function(){
				$(this).val('');
				$("#J_numError").hide();
			}).blur(function(){
			    if(max_order>=10000){
					if($("#J_quantity").val()>=10000){
						$('#J_quantity').val(10000);	
						$(".jia").removeClass("jiak").addClass("jiab");
					    $(".jian").removeClass("jianb").addClass("jiank");	
					}else if($("#J_quantity").val()>max_order||$("#J_quantity").val()<min_order){
					$('#opacityLayer').html("Invalid Quantity, Please Select a valid Quantity").show();
					$('#J_quantity').val(min_order);
					$(".jian").removeClass("jiank").addClass("jianb");
					$(".jia").removeClass("jiab").addClass("jiak");	
					$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
					setTimeout(function(){
						$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
					},3000);
				}else if($("#J_quantity").val()==max_order){
					$(".jia").removeClass("jiak").addClass("jiab");
					$(".jian").removeClass("jianb").addClass("jiank");

				}else if($("#J_quantity").val()==min_order){
					$(".jian").removeClass("jiank").addClass("jianb");
					$(".jia").removeClass("jiab").addClass("jiak");
				}else{
					$(".jian").removeClass("jianb").addClass("jiank");	
					$(".jia").removeClass("jiab").addClass("jiak");	
				}
			     }else {
					if(in_stock==min_order){
						$(".jia").removeClass("jiak").addClass("jiab");
						$('#J_quantity').val(min_order);
					}else	 if($("#J_quantity").val()>max_order||$("#J_quantity").val()<min_order){
					$('#opacityLayer').html("Invalid Quantity, Please Select a valid Quantity").show();
					$('#J_quantity').val(min_order);
					$(".jian").removeClass("jiank").addClass("jianb");
					$(".jia").removeClass("jiab").addClass("jiak");	
					$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
					setTimeout(function(){
						$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
					},3000);
				}else if($("#J_quantity").val()==max_order){
					$(".jia").removeClass("jiak").addClass("jiab");
					$(".jian").removeClass("jianb").addClass("jiank");

				}else if($("#J_quantity").val()==min_order){
					$(".jian").removeClass("jiank").addClass("jianb");
					$(".jia").removeClass("jiab").addClass("jiak");
				}else{
					$(".jian").removeClass("jianb").addClass("jiank");	
					$(".jia").removeClass("jiab").addClass("jiak");	
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
					$(this).addClass('red-error');
					$(this).val(min);
					paramInfo.quantity=min;
				}else if(val<min){
					$(this).removeClass('red-error');
					$(this).val(min);
					paramInfo.quantity=min;
					$("#J_numError").html(msgObj['DETAIL_quntity_mininum_MOrder']+" <span>"+min+"</span>)").show();
				}else if(max&&val>max){
					$(this).removeClass('red-error');
					$(this).val(max);
					paramInfo.quantity=max;
					$("#J_numError").html(msgObj['DETAIL_quntity_mininum_MSstock']+" <span>"+max+"</span>)").show();
				}else if(re.test(val)){
					$(this).removeClass('red-error');
					$(this).val(min);
					paramInfo.quantity=min;
					$("#J_numError").html(msgObj['DETAIL_quntity_mininum_MOrder']+" <span>"+min+"</span>)").show();
				}else{
					$(this).removeClass('red-error');
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
							$("#line_price").html(line_Price+'/ '+line_pricep)
						}
						if(	$($("dd")[z]).find(".promDiscountPrice").css("display")=='inline-block'){
							var rel_Price =	$($("dd")[z]).find(".promDiscountPrice").html();
							var line_Price =	$($("dd")[z]).find(".Price").html();
							$('.commonPrice strong').html(rel_Price);
							$(".sku_price strong").html(rel_Price);
							$("#line_price").html(line_Price+'/ '+line_pricep)
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
		self.$toCart=DHM.Common.domExist("#J_done");
		self.buyUrl='/buynow.do';
		self.cartUrl='/addCart.do';
		self.init();
	}
	CartBuy.prototype={
		constructor:CartBuy,
		buyNow:function(){
			var self=this;
			var $buy=$('.buyNow_confirm');
			if(!$buy) return;
			$("body").on("click",".buyNow_confirm",function(e){
			//$('div').delegate($buy,'click',function(e){
				if($buy.hasClass("sold-out")) return;
						buyerId=DHM.Cookie.getCookie("b2b_buyerid"),
						value = DHM.Cookie.getCookie("B2BCookie");
					var productid =$("#J_shippingCost strong").attr("productid");
				if(itemAttrListSkulenght==undefined){
					var skuid = itemAttrListSku[0].skuId
					var skumd5 = itemAttrListSku[0].skuMd5;

				}else{
					var skuid = skulastvalue.skuId;
					var skumd5 = skulastvalue.skuMd5;
				}
				if(skumd5==undefined){
						$('#opacityLayer').html("Please Select Option").show();
						$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
						setTimeout(function(){
							$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
						},3000);

						return
					}
				var quantity = $("#J_quantity").val();
				if(quantity<min_order||quantity>max_order){
					$('#opacityLayer').html("Invalid Quantity, Please Select a valid Quantity").show();
					$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
					setTimeout(function(){
						$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
					},3000);
					return;
				}
				DHM.Common.request({
					url:self.buyUrl,
					type:"GET",
					dataType:'json',
					data:{
						quantity:quantity,
						proid:productid,
						skuid:skuid,
						skumd5:skumd5,
						'shipTo':$('.j-shipcountry').attr('vname'),
						'shipType':$('.j-shipway').html(),
						'stockIn':$('.j-shiptobtn').attr('defaultstock'),
						itemcode:itemcode
					},
					scope:self,
					fn:self.buyNowRes
				});
				e.stopPropagation();e.preventDefault();
			});
		},
		buyNowRes:function(data,scope){
            window.location.href=data.urlabc+"?mbh=&returnURL="+paramInfo.returnURL;
		},
		toCart:function(){
			var self=this;
			var $toCart=$('#J_done');
			if(!$toCart) return;
			$toCart.delegate('#J_done','click',function(e){
				
				if($toCart.hasClass("sold-out")) return;
						buyerId=DHM.Cookie.getCookie("b2b_buyerid"),
						value = DHM.Cookie.getCookie("B2BCookie");
					var productid =$("#J_shippingCost strong").attr("productid");
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

					
				var quantity = $("#J_quantity").val();
				$('#J_sku').attr('vquantity',quantity);


				$('.j-shiptobtn').trigger('click', {toCart: true});



				if(quantity<min_order||quantity>max_order){
					$('#opacityLayer').html("Invalid Quantity, Please Select a valid Quantity").show();
					$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
					setTimeout(function(){
						$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
					},3000);
					return;
				}
				
				$('.sku_loading').show()

				DHM.Common.request({
					//url:'/mobileApiWeb/item-Item-addOrRemoveFav.do',
					url:self.cartUrl,
					data:{
						quantity:quantity,
						proid:productid,
						skuid:skuid,
						skumd5:skumd5,
						'shipTo':$('.j-shipcountry').attr('vname'),
						'shipType':$('.j-shipway').html(),
						'stockIn':$('.j-shiptobtn').attr('defaultstock'),
						itemcode:itemcode
					},
					async:false,
					dataType:'none',
					scope:self,
					fn:self.toCartRes   //回调函数
				});
				e.stopPropagation();e.preventDefault();
			});
		},
		toCartRes:function(){
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
				var selectValue=$('.j-skuSelect li').hasClass("active");
				if(selectValue){
					$(".detail-skuCont").html('<span>'+text.join("")+'</span>');
					var quantity =$('#J_quantity').val();
					$('#J_sku .gary').html("Quantity:"+quantity);
				}
			}
			$('#opacityLayer').html(msgObj['DETAIL_add_to_cart']).show();
			$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
			setTimeout(function(){
				$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
			},3000);
			$(".ceng").click();
			$('.sku_loading').hide()
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
//	may Interest
	function MayInterest(){
		this.id="#J_mayInterest";
		this.url=DHM.Common.mobileHost+"promoproduct.do";
		//this.url =DHM.Common.mobileHost+"20150608/html/like.html";
		this.init();
	}
	MayInterest.prototype={
		constructor:MayInterest,
		getInterest:function(){
			var self=this;
			var $mi=DHM.Common.domExist(self.id);
			if(!$mi) return;
			var param=$mi.get(0).dataset;
			var pass =true;
			$(window).scroll(function(){
			    var docHeight = $("#J_mayInterest").offset().top;
			        content = $(window).scrollTop() >= docHeight - $(window).height();
			    if (content && pass){
			    	pass = false;
				    DHM.Common.request({
						url:self.url,
						//data:{pp:param.pp,itemcode:param.itemcode},
						data:{client:"wap",pp:"d",itemcode:itemcode},
						type:"GET",
						dataType:"html",
						scope:self,
						fn:self.responseMI,
						fnParam:$mi
					});
			    }
			})

		},
		responseMI:function(data,scope,param){
			var self=scope,$mi=param;
			$mi.html(data);
			var len=$mi.find("li").length;
			var w=125;
			var pass =true;
			$(window).scroll(function(){
				var slideHeight = $('#J_mayInterest').offset().top;
				var scrollHeight = $(window).scrollTop();
				var winHeight = $(window).height();
				content = scrollHeight >= slideHeight - winHeight;
				if (content && pass){
					pass = false;
					var slideL = $('#J_mayInterest').find('ul').find('li').find('a.ls-mlimg');
					 var imglen = slideL.find('img').length;
					 if(imglen>0) return;
					 for(var i=0;i<slideL.length;i++){
					 var imgUrl = slideL.eq(i).attr('data-src');
					 slideL.eq(i).append('<img src=' + imgUrl + '>')
					 }
				}
			});
			DHMSlide({
				element:$mi[0],
				con:"ul",
				totalWidth: w * len + 10,
				width:$(window).width(),
				speed:500,
				autoRun: false, //是否自动运行
				loop: false,
				distance:250
			});
		},	
		init:function(){
			this.getInterest();
		}
	};
//个性化推荐
	function RecommendItem(){
		this.init();
	}
	RecommendItem.prototype ={
		constructor:MayInterest,
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
		                    //cateDispId:"002002001"
		                    category:cateDispId
		                },
		                success: function(data){
		                $('.rp-items').find('.con').removeClass('detail-img-con');
		                    if(!data) return;
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
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec','><img src=',dd.imgUrl,' alt=',dd.seoName,'></a>',
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
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec','><img src=',dd.imgUrl,'  alt=',dd.seoName,'></a>',
		                                        '</div>',
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec',' class="list-cont">',
		                                        '<span class="price">$',dd.discountPrice,'</span>',
		                                        '</a>',
		                                        '</li>'];
		                                } else{
		                                    html=['<li>',
		                                        '<div class="list-img">',
		                                        '<a href=',url,'/' + dd.seoName + '/',dd.itemCode,'.html','#dhm150513-',i+1,'-rec','><img src=',dd.imgUrl,'  alt=',dd.seoName,'></a>',
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
//导航点击多语言切换
	function ChangeLanguage (){
		this.language();	
	}
	ChangeLanguage.prototype ={
		constructor:ChangeLanguage,
		language:function(){
			var url = window.location.pathname;
			var html=['<div id="J_shadow" class="shadow"></div>',
					'<div id="J_languageCont" class="language">',
					    '<ul>',
					        '<li class="tit">Select a Language</li>',
					        '<li class="active"><a href="http://m.dhgate.com'+url+'">English (EN)</a></li>',
					        '<li><a href="http://m.es.dhgate.com'+url+'">Español (ES)</a></li>',
					        '<li><a href="http://m.pt.dhgate.com'+url+'">Português (PT)</a></li>',
					        '<li><a href="http://m.ru.dhgate.com'+url+'">Русский (RU)</a></li>',
					        '<li><a href="http://m.fr.dhgate.com'+url+'">Français (FR)</a></li>',
					        '<li><a href="http://m.de.dhgate.com'+url+'">Deutsch (DE)</a></li>',
					        '<li><a href="http://m.it.dhgate.com'+url+'">Italiano (IT)</a></li>',
					    '</ul>',
					    '<a class="j-languageCancel" href="javascript:;">Cancel</a>',
					'</div>'
			]
			$('footer').after(html.join(""));

			$("#J_language").click(function(){
				$("#J_shadow").show();
				$("#J_languageCont").show();
			});
			$(".j-languageCancel").click(function(){
				$("#J_shadow").hide();
				$("#J_languageCont").hide();
			});
			$("#J_languageCont").find("li").click(function(){
				if($(this).hasClass("tit")){
					return;
				}
				$(this).addClass("active").siblings().removeClass("active");
			});
		}
	}
//ChangeLanguage
	new ChangeLanguage();
//	add to fav
	new AddToFav();
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
//	may Interest
	new MayInterest();
	new DetailSKU();
	new DetailSdr();
	new CartBuy();

	if($('.j-shiptobtn').length){
		var shipto  = new Shipto();
	}
	
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
		})
	}
	tracking();
});