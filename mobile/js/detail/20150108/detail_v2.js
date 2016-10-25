/**
 * Created by zhaojing11 on 2014/12/22.
 */
Zepto(function($){
	//引入调用入口
	var detailconfig = window.DETAIL,
		tools = detailconfig.tools,
		Priceonapp = tools.Priceonapp,
		DataErrorLog = tools.DataErrorLog,
		Tip = tools.Tip,
		AddToFav = tools.AddToFav;

	var paramInfo={
		returnURL:window.location.href,
		proid:$("#J_proInfo").data("proid"),
		itemCode:$("#J_proInfo").data("itemcode"),
		cateDispId:$("#J_proInfo").attr("data-cateDispId"),
		quantity:$("#J_quantity").val(),
		shippingCost:null,
		ctyId:$("#J_shippingLayer").find("select").val(),
		ctyName:null,
		skuObj:null
	};
	var DetailUtil={
		init:function(){
			DHM.Init.logoSummary();
			DHM.Init.loginState();
			var _self=DetailUtil;
			_self.$layer=null;
			_self.hash=DetailUtil.getHashObj();
			_self.display=DetailUtil.getDiv();
			_self.ev=DetailUtil.getEv();
			_self.mOnLoad();
			_self.countdown();
			_self.hashChange();
			_self.getSkuObj();
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
		getSkuId:function(){
			var skuInfo=[];
			$(".j-skuSelect li.active").each(function(i,e){
				var $e=$(e);
				skuInfo.push($e.attr("attrvalid")+"-"+$e.attr("attrid"));
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
		getSkuObj:function(){
			var obj={};
			$(".j-skuid").each(function(i,e){
				var $e=$(e);
				var $child=$e.children("input");
				var len=$child.length;
				var attr=[];
				for(var i=0;i<len;i++){
					var input=$child[i];
					attr.push(input.value);
				}
				obj[attr.join("_")]=$e.attr("skuId")+"_"+$e.attr("skumd5")+"_"+$e.attr("inventory");
			});
			paramInfo.skuObj=obj;
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
			var index = $("#J_shippingLayer").find("select").get(0).selectedIndex;
			var country = $("#J_shippingLayer").find("select").children('option').eq(index).html();
			paramInfo.ctyName=country;
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
				urlHash:'#Viewcoupcon',
				$dom:exist("#J_coupon"),
				$layer:exist("#J_couponLayer")
			},{
				urlHash:'#ViewAttr',
				$dom:exist("#J_sku"),
				$layer:exist("#J_skuLayer")
			},{
				urlHash:'#Viewcshipment',
				$dom:exist("#J_shipping"),
				$layer:exist("#J_shippingLayer")
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
			var style=$d.get(0).style;
			style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration = '500ms';
			style.webkitTransform=style.transform=style.MozTransform='translateX('+dist+')';
			if(dist==0){
				if(!flag){
					DetailUtil.$layer=$d;
				}
				if(flag){
					DetailUtil.$layer.hide();
				}
				setTimeout(function(){
					window.scroll(0,0);
					DetailUtil.ifShow(true);
					if(window.location.hash=="#ViewAttr"){
						$("#J_cartBuy").show();
					}else{
						$("#J_cartBuy").hide();
					}
					
					var h=Math.max($d.height(),$(window).height());
					$("body").css({'background':'#ebebeb',height:h});
					$d.css({"position":"absolute","height":h,"overflow":"scroll"});
				},800);		
			}else{
				$d.undelegate($d,DetailUtil.ev);
				if(!flag){
					DetailUtil.$layer=null;
					DetailUtil.ifShow(false);
					$("#J_cartBuy").show();
					$("#J_cartBuy").css("zIndex","90");
				}
				if(flag&&f1){
					DetailUtil.$layer.show();
				}
				$("body").css({'background':'#ebebeb',height:"auto"});
				$d.css({"position":"fixed","height":"100%"});
			}
		},
		countdown:function(){
			DHM.Countdown({
			   id:"#J_countdown"
			  ,endTime:new Date($("#J_countdown").data("endtime")).getTime()
			});
		},
		hashChange:function(){
			var _self=DetailUtil;
			$(window).bind('hashchange', function(){
				var hash=['#viewpic','#Viewsdr','#ViewAttr','#Viewcshipment','#Viewcoupcon'];
				if(hash.indexOf(window.location.hash)==-1&&_self.$layer){
					if(_self.$layer.hasClass("img-layer")){
						_self.ifShow(false,_self.$layer);
						_self.$layer=null;
					}else{
						_self.translate(_self.$layer,"100%");
					}
				}else{

				}
			});
		}
	};
	DetailUtil.init();

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
				if($e.data("src")){
					$e.attr("src", $e.data("src"));
				}
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
//			add slide page
			var $li=$con.find("li");
			self.layer.total=$li.length;
			var $page=self._getPage($li,self.layer.total);
			$img.append($page);

//			引入slide
			var slide=DHMSlide({
				element:$img,
				con:self.imgOpt.conId,
				page:$page,
				width:300,
				speed:600
			});
			
//			点击图片进行的操作
			$img.delegate("li",self.clickEvent,function(e){
				javascript:ga('send','event','Checkout-product','Photo',paramInfo.cateDispId + '-'+paramInfo.itemcode);
				self.layer.index=$(this).index();
				self.imgLiOpr($con,slide,self);
				DetailUtil.$layer=self.layer.$layer;
				DetailUtil.setHash(self.urlHash.urlHash.substr(1));
				self.layer.$num.text(self.layer.index+1);
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
					'<div class="img-layer-con"><ul class="j-imgLayerCon">',
					$con.html(),
					'</ul></div>',
					'<div class="img-page"><span class="img-pre no-pre"></span><span class="img-num"><b></b> / ',self.layer.total,'</span><span class="img-next"></span></div>',
					'</section>'
				];
				var $layer=$(html.join(''));
				$("body").append($layer);
				$layer.delegate(".d-back a",self.clickEvent,function(){
					DetailUtil.freshHash();
					DetailUtil.$layer=null;
					slide.toPoint(self.layer.index);
					DetailUtil.ifShow(false,$layer);
				});
				self.layer.$layer=$layer;
				self.layer.$next=$layer.find(".img-next");
				self.layer.$pre=$layer.find(".img-pre");
				self.layer.$num=$layer.find("b");
			}
			return self.layer.$layer;
		},
		imgLiOpr:function($con,slide,scope){
			var self=scope;
			var $layer=self.getImgLayer($con,slide,self);
			var imgLayer=DHMSlide({
				element:$layer,
				con:'.j-imgLayerCon',
				width:300,
				speed:800
			});
			imgLayer.toPoint(self.layer.index);
			imgLayer.endFn=function(){
				var layerInfo=self.layer;
				var total=layerInfo.total;
				self.layer.index=imgLayer.index;
				layerInfo.$num.text(self.layer.index+1);
				if(self.layer.index==(total-1)){
					layerInfo.$next.addClass("no-next");
				}else if(self.layer.index==0){
					layerInfo.$pre.addClass("no-pre");
				}else{
					layerInfo.$next.removeClass("no-next");
					layerInfo.$pre.removeClass("no-pre");
				}
			};
			self.layerToPre(imgLayer,self);
			self.layerToNext(imgLayer,self);
		},
		layerToPre:function(imgLayer,scope){
			var self=scope
			var layerInfo=self.layer;
			layerInfo.$pre.bind(self.clickEvent,function(){
				self.layer.index--;
				if(self.layer.index<0){
					self.layer.index=0;
				}
				layerInfo.$num.text(self.layer.index+1);
				imgLayer.toPre();
				if(self.layer.index==0){
					$(this).addClass("no-pre");
				}else{
					$(this).removeClass("no-pre");
				}
				layerInfo.$next.removeClass("no-next");
			});
		},
		layerToNext:function(imgLayer,scope){
			var self=scope;
			var layerInfo=self.layer;
			layerInfo.$next.bind(self.clickEvent,function(){
				self.layer.index++;
				var t=self.layer.total-1;
				if(self.layer.index>=t){
					self.layer.index=t;
				}
				layerInfo.$num.text(self.layer.index+1);
				imgLayer.toNext();
				if(self.layer.index==t){
					$(this).addClass("no-next");
				}else{
					$(this).removeClass("no-next");
				}
				layerInfo.$pre.removeClass("no-pre");
			});
		},
		init:function(){
			var self=this;
			self.slideImg();
		}
	};

//	add to fav
	// function AddToFav(){
	// 	this.$fav=DHM.Common.domExist("#J_addToFav");
	// 	if(!this.$fav) return;
	// 	this.url=DHM.Common.mobileHost+"addfav.do?fromnew=true&proid="+paramInfo.proid;
	// 	this.init();
	// }
	// AddToFav.prototype={
	// 	constructor:AddToFav,
	// 	getFav:function(){
	// 		var self=this;
	// 		this.$fav.click(function(evt){
	// 			javascript:ga('send','event','Checkout-product','Favorite',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
	// 			DHM.Common.request({
	// 				url:self.url,
	// 				type:"GET",
	// 				fn:self.favRes,
	// 				scope:self
	// 			});
	// 		});
	// 	},
	// 	favRes:function(data,scope){
	// 		var self=scope;
	// 		if(!data) return;
	// 		var fav=data.resultabc;
	// 		if("0"==fav){
	// 			window.location.href = "/login.do?returnURL="+paramInfo.returnURL;
	// 		}else{
	// 			self.$fav.find('span').toggleClass('fav-span')
	// 		}
	// 	},
	// 	init:function(){
	// 		this.getFav();
	// 	}
	// };

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
				if(o.urlHash=='#viewpic') return;
				var $d= o.$dom;
				var $l= o.$layer;
				if(!$d||!$l) return;
				var h= o.urlHash;
				$d.click(function(e){
					DetailUtil.translate($l,0);
					DetailUtil.setHash(h);
					if(h=="#Viewsdr"){
						self.sdrOpr(self,$(this).attr("id"),$l);
					}
					if(h=="#ViewAttr"){
						$(this).attr("turn","1");
						$("#J_cartBuy").css("z-index","130");
					}else{
						$("#J_cartBuy").css("z-index","90");
					}
					e.preventDefault();
					e.stopPropagation();
				});
				$l.delegate("nav .j-back","click",function(){
					DetailUtil.translate($l,"100%");
					DetailUtil.freshHash();
					if(h=="#ViewAttr"){
						var text=["Selection:"];
						$(".j-skuSelect li.active").each(function(i,ele){
							if($(ele).find("img").get(0)){
								text.push(["[",$(ele).find("img").attr("title"),"]"].join(""));
							}else{
								text.push(["[",$(ele).text(),"]"].join(""));
							}
						});
						$("#J_skuSel").text(text.join(""));
						self.changeShip()
					}
				});
			});
		},
		changeShip:function(){
			var param=$("#J_proInfo").get(0).dataset;
			$.ajax({
//				url: "/modifyFreightBychgProperty.do",
				url: "/loadShipList.do",
				data: {
					minSaleSize: param.minsale,
					minOrderSize:param.minorder,
					countryid:paramInfo.ctyId,
					quantity:paramInfo.quantity,
					proid:paramInfo.proid,
					itemcode:paramInfo.itemCode,
					skuid:DetailUtil.getSkuId().split("_")[0],
					catePubId:param.catepubid,
					isProm:param.isprom,
					shiptype:$("#J_shippingLayer").find("li.choactive span").eq(0).text(),
					isinventory:$("#isinventory").val(),
					stockin:$("#stockin").val(),
					func:"changeprop"
				},
				type: 'GET',
				cache: true,
				dataType: 'html',
				success: function(data){
					if(data == null || data == undefined){
								return;
							}
							$("#J_shippingLayer").find("dd").html(data);
							if(!$("#J_shippingLayer").find("dd li").get(0)){
								return;
							};
							var $choose=$("#J_shippingLayer").find("dd li.choactive span");
							var cost=$choose.eq(1).text();
							var oSpan=$choose.eq(0).text();
							var shipPrice =parseFloat(cost.substring(cost.indexOf('$')+1));
							$("#J_shippingCost").html((shipPrice==0)?("<em>"+msgObj['free_shipping']+" </em>"):("US $"+shipPrice+" "));
							var index = $("#J_shippingLayer").find("select").get(0).selectedIndex;
							var country = $("#J_shippingLayer").find("select").children('option').eq(index).html();
							if(oSpan.length>0){
								$("#J_shippingCty").text(country+' Via '+oSpan);
								if($("#J_shippingError").get(0)){
									$("#J_shippingError").css({display:"none"});
						}
					}
					paramInfo.shippingCost=shipPrice;
					paramInfo.ctyId=$("#J_shippingLayer").find("select").val();
					paramInfo.ctyName=country;
				}
			});
		},
		sdrOpr:function(scope,id){
			var $nav=$("#J_sdrNav");
			$nav.find("a").eq(0).click(function(){
				javascript:ga('send','event','Checkout-product','Specification',paramInfo.cateDispId + '-'+paramInfo.itemcode);	
			});
			switch(id){
				case "J_des":
					$nav.find("a[name='d']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_descriptionLayer");
					$d.show();
					$d.siblings("article").hide();
					break;
				case "J_reviews":
					$nav.find("a[name='r']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_reviewLayer");
					$d.show();
					$d.siblings("article").hide();
					break;
				default:
					$nav.find("a[name='s']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_specificsLayer");
					$d.show();
					$d.siblings("article").hide();
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
				$e.addClass("active");
				$e.siblings().removeClass("active");
				var sku=DetailUtil.getSkuId().split("_");
				var skuid=sku[0];
				var $dd=$("#J_skuLayer").find("dd");
				var $ddv=$("#J_skuLayer").find("dd[vhidden='"+skuid+"']");
				$dd.hide();
				$ddv.show();
				var num=sku[2];
				if(parseInt(num)){
					$("#J_stock").text(parseInt(num));
				}
				$dd.removeClass("active");
				$ddv.eq(0).addClass("active");
				self.$quantity.val(parseInt(self.$quantity.attr("init-value")));
				$("#J_numError").hide();
				if(!$ddv.length){
					$("#J_buyNow").addClass("sold-out");
					$("#J_addToCart").addClass("sold-out");
				}else{
					$("#J_buyNow").removeClass("sold-out");
					$("#J_addToCart").removeClass("sold-out");
				}
			});
		},
		setQuantity:function(){
			var min=parseInt(this.$quantity.attr("init-value"));
			var self=this;
			self.$quantity.focus(function(){
				$(this).val('');
				$("#J_numError").hide();
			}).blur(function(){
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
					var $e=$(e),mi,$p=$e.parent().parent();
					if($p.get(0).style.display=="none"){
						return;
					}
					if($e.siblings("var").get(0)){
						mi=parseInt($e.siblings("var").text());
					}
					var mm=parseInt($e.text().split(" +")[0]);
					if(mi){
						if(paramInfo.quantity>=mi&&paramInfo.quantity<=mm){
							$p.addClass("active").siblings().removeClass("active");
						}
					}else{
						if(paramInfo.quantity>=mm){
							$p.addClass("active").siblings().removeClass("active");
						}
					}
				});
				$("#J_skuQut").text("["+paramInfo.quantity + " "+ self.$quantity.next().text()+"]")
			});
		},
		init:function(){
			var self=this;
			self.sku();
			self.setQuantity();
		}
	};

//	shipping操作
	function DetailShipping(){
		var self=this;
		var $con=self.$con=DHM.Common.domExist("#J_shippingLayer");
		if(!$con) return;
//		self.url=DHM.Common.mobileHost+"priceShipment.do?&req"
		self.url=DHM.Common.mobileHost+"loadShipList.do?&req"
		self.$select=$con.find("select");
		self.$dl=$con.find("dl");
		self.$cost=$("#J_shippingCost");
		self.$cty=$("#J_shippingCty");
		self.param={};
		self.init();
	}
	DetailShipping.prototype={
		constructor:DetailShipping,
		changeCty:function(){
			var self=this;
			self.$con.delegate('select','change',function(){
				var val = $(this).val();
				var skuInfo=DetailUtil.getSkuId().split("_");
				var param=$("#J_proInfo").get(0).dataset;
				
				$('#J_shippingLayer').find('dd').find('ul').hide();
				if($('#J_shippingLayer').find('dd').find(".shipping-loading").length==0){
					$('#J_shippingLayer').find('dd').append('<img src="http://css.dhresource.com/mobile/detail/20150108/image/loading2.gif" class="shipping-loading">')
				}
				$('.shipping-loading').css('margin','0 auto');
				DHM.Common.request({
					url : self.url,
					type: 'GET',
					data: {
//						countryid:val,
//						itemcode : paramInfo.itemCode,
//						quantity : paramInfo.quantity,
//						skuid : skuInfo[0],
//						isSecondReq : "true"
						minSaleSize:param.minsale,
						minOrderSize:param.minorder,
						countryid:val,
						quantity:paramInfo.quantity,
						proid:paramInfo.proid,
						itemcode:paramInfo.itemCode,
						skuid:skuInfo[0],
						catePubId:param.catepubid,
						isProm:param.isprom,
						stockin:$("#stockin").val(),
						isinventory:$("#isinventory").val(),
						shiptype:$("#J_shippingLayer").find("li.choactive span").eq(0).text(),
						func:"changecty"
					},
					dataType : 'html',
					fn : self.changeRes,
					scope : self
				});
			});
		},
		changeRes:function(data,scope){
			$('#J_shippingLayer').find('dd').find('ul').show();
			$('#J_shippingLayer').find('img').remove();
			if(!data) return;
			scope.$dl.find("dd").html(data);
		},
		selectCost:function(){
			this.$dl.delegate("li",'click',function(){
				$(this).addClass("choactive").siblings("li").removeClass("choactive");
			});
		},
		submit:function(){
			var self=this;
			self.$con.delegate("input",'click',function(e){
				if(!self.$dl.find("li").get(0)){
					self.$con.find(".j-back").trigger("click");
					return;
				};
				var $choose=self.$dl.find("li.choactive span");
				var cost=$choose.eq(1).text();
				var oSpan=$choose.eq(0).text();
				var shipPrice =parseFloat(cost.substring(cost.indexOf('$')+1));
				self.$cost.html((shipPrice==0)?("<em>"+msgObj['free_shipping']+" </em>"):("US $"+shipPrice+" "));
				var index = self.$select.get(0).selectedIndex;
				var country = self.$select.children('option').eq(index).html();
				if(oSpan.length>0){
					self.$cty.text(country+' Via '+oSpan);
					if($("#J_shippingError").get(0)){
						$("#J_shippingError").css({display:"none"});
					}
				}
				paramInfo.shippingCost=shipPrice;
				paramInfo.ctyId=self.$select.val();
				paramInfo.ctyName=country;
				self.$con.find(".j-back").trigger("click");
				e.stopPropagation();e.preventDefault();
			});
		},
		init:function(){
			this.submit();
			this.changeCty();
			this.selectCost();
		}
	};

//	sdr 操作
	function DetailSdr(){
		var self=this;
		var exist=DHM.Common.domExist;
		self.$reviewLayer=exist("#J_reviewLayer");
		self.goodId=".j-good";
		self.badId=".j-bad";
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
		goodClick:function($d,scope){
			var self=scope;
			DHM.Common.request({
				url:DHM.Common.mobileHost+"addReviewHelpful.do",
				data:{reviewId:$d.parents(".j-reviewInfo")[0].dataset.reviewid},
				fn:self.goodRes,
				scope:self,
				fnParam:$d
			});
		},
		goodRes:function(data,scope,param){
			var $d=param;
			if(!$d.siblings().eq(0).hasClass("bad-active")){
				$d.addClass("good-active");
			}
			if(data.succ){
				var num=parseInt($d.find("em").text());
				var c=$d.find("em").attr("class");
				$("."+c).text(num+1);
			}
			if(data.login){
				window.location.href = "/login.do?returnURL="+paramInfo.returnURL;
			}
			if(data.msg){
				var $p=$d.parent().parent();
				var $s=$p.children("span");
				if(!$s.get(0)){
					$p.append('<span>'+data.msg+'</span>');
				}else{
					$s.html('<span>'+data.msg+'</span>');
				}
			}
		},
		badClick:function($d,scope){
			var self=scope;
			DHM.Common.request({
				url:DHM.Common.mobileHost+"addReviewHelpless.do",
				data:{"reviewId":$d.parents(".j-reviewInfo")[0].dataset.reviewid},
				fn:self.badRes,
				scope:self,
				fnParam:$d
			});
		},
		badRes:function(data,scope,param){
			var $d=param;
			if(!$d.siblings().eq(0).hasClass("good-active")){
				$d.addClass("bad-active");
			}
			if(data.succ){
				var num=parseInt($d.find("em").text());
				var c=$d.find("em").attr("class");
				$("."+c).text(num+1);
			}
			if(data.login){
				window.location.href = "/login.do?returnURL="+paramInfo.returnURL;
			}
			if(data.msg){
				var $p=$d.parent().parent();
				var $s=$p.children("span");
				if(!$s.get(0)){
					$p.append('<span>'+data.msg+'</span>');
				}else{
					$s.html('<span>'+data.msg+'</span>');
				}
			}
		},
		showMoreR:function(){
            var self=this;
            self.showMoreRNum=2;
            self.$reviewLayer.delegate('#J_showMoreR','click',function(e){
               DHM.Common.request({
                   url:DHM.Common.mobileHost+"loadReviews.do",
                   data:{
                       "proid":paramInfo.proid,
                       "ReviewPageNum":self.showMoreRNum
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
                    '<div class="good-click"><span class="j-good good-ico"><em class="jg_',d.reviewid,'">',d.helpfulcount,'</em></span>',
                    '<span class="j-bad bad-ico"><em class="jb_',d.reviewid,'">',d.helplesscount,'</em></span>',
                    '<a href="/loadReportReview.do?proid=',paramInfo.proid,'&url=',paramInfo.returnURL,'&reviewid=',d.reviewid,'" class="dhm-rt">',msgObj['DETAIL_report_review'],'</a></div></div></div>'
                ];
                $con.append(html.join(''));
            }
			if((self.showMoreRNum-2)*10+len>=data.pageBean.count){
				$("#J_showMoreR").remove();
			}
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
        showMoreI:function($d,scope){
            var self=scope;
            DHM.Common.request({
                url:DHM.Common.mobileHost+"loadReviews.do",
                data:{
                    "proid":paramInfo.proid,
                    "ReviewPageNum":self.showMoreINum,
                    "ReviewType":1
                },
                fn:self.showMoreIRes,
                scope:self
            });
        },
        showMoreIRes:function(data,scope){
            var self=scope;
            self.showMoreINum++;
            var $con=self.$rImgLayer.find("ul");
			var iData=data.result;
            var len=iData.length;
            for(var i=0;i<len;i++){
                var html=['<li id="r_',iData[i].reviewid,'"><img src="',iData[i].tdAttachDto.imageUrl,'" /></li>'];
                self.imgInfo[""+iData[i].reviewid]=iData[i];
                $con.append(html.join(""));
            }
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
				html.push('</div><div class="good-click">');
				html.push($d.siblings(".good-click").html());
				html.push('</div></div></div></div>');
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
				self.$singleLayer.delegate(self.goodId,'click',function(e){
					self.goodClick($(this),self);
					e.stopPropagation();e.preventDefault();
				});
				self.$singleLayer.delegate(self.badId,'click',function(e){
					self.badClick($(this),self);
					e.stopPropagation();e.preventDefault();
				});
				self.$singleLayer.delegate('.j-back','click',function(){
					if($(this).attr("name")=="mysingle"){
						DetailUtil.translate(self.$singleLayer,'100%',true,true);
					}else{
						DetailUtil.translate(self.$singleLayer,'100%',true);
					}
				});
			}
			return self.$singleLayer;
		},
		getSingleR:function($d,scope){
			var self=scope;
			var id= $d.attr("id").split("_")[1];
			var data=self.imgInfo[id];
			var $singleLayer=self.getSingle(self);
			var html=['<h3><a href="javascript:;" class="j-back img-back"></a><span class="tit detail-arrow-left">',msgObj['reviews'],'</span></h3><div class="r-single-img"><ul>'];
			var img=data.tdAttachDto.imgMap;
			var str=(data.responseDTO)?('<div class="response"><h4>'+msgObj['DETAIL_seller_res']+':</h4><p>'+data.responseDTO.content+'</p></div>'):'';
			for(var k in img){
				html.push('<li><img src="',img[k],'" /></li>');
			}
			html.push('</ul></div><div class="j-reviewInfo rc-info" data-reviewid="',id,'"><div class="tit">');
			html.push('<div class="tit-star dhm-lt"><div class="dh-star-g"><div class="dh-star-y" style="width:',data.score*20,'%"></div></div></div>')
			html.push('<span class="review-from">',msgObj['DETAIL_by'],':',data.buyerNickname,'</span><span class="review-time">',data.createdDateText,'</span>');
			html.push('</div><div class="con">');
			html.push('<p>',data.content,'</p>',str);
			html.push('<div class="good-click">');
			html.push('<span class="j-good good-ico"><em class="jg_',id,'">',data.helpfulcount,'</em></span>');
			html.push('<span class="j-bad bad-ico"><em class="jb_',id,'">',data.helplesscount,'</em></span>');
			html.push('<a href="/loadReportReview.do?proid=',paramInfo.proid,'&url=',paramInfo.returnURL,'&reviewid=',data.reviewid,'" class="dhm-rt">',msgObj['DETAIL_report_review'],'</a></div></div></div>');
			$singleLayer.html(html.join(''));
			DHMSlide({
				element:$singleLayer,
				con:'ul',
				width:320,
				speed:600
			});
			DetailUtil.translate($singleLayer,0,true);
		},
		reviewImg:function(){
			var self=this;
			self.$reviewLayer.delegate(self.rImgId,'click',function(e){
				DHM.Common.request({
					url:DHM.Common.mobileHost+"loadReviews.do",
					data:{
						"proid":paramInfo.proid,
						"ReviewPageNum":1,
						"ReviewType":1
					},
					fn:self.reviewImgRes,
					scope:self
				});
				e.stopPropagation();e.preventDefault();
			});
		},
		reviewImgRes:function(data,scope,param){
			var self=scope;
			var $l =self.getrImgLayer(self,data);
			DetailUtil.translate($l,0,true);
		},
		init:function(){
			var self=this;
			self.sdrTab();
			self.$reviewLayer.delegate(self.goodId,'click',function(e){
				self.goodClick($(this),self);
				e.stopPropagation();e.preventDefault();
			});
			self.$reviewLayer.delegate(self.badId,'click',function(e){
				self.badClick($(this),self);
				e.stopPropagation();e.preventDefault();
			});
			self.reviewImg();
			self.showMoreR();
			self.rSingle();
		}
	};

//	cart buy
	function CartBuy(){
		var self=this;
		self.$buy=DHM.Common.domExist("#J_buyNow");
		self.$toCart=DHM.Common.domExist("#J_addToCart");
		self.buyUrl='/buynow.do';
		self.cartUrl='/addCart.do';
		self.init();
	}
	CartBuy.prototype={
		constructor:CartBuy,
		noShipTo:function(){
			if($('#J_shippingError').get(0) && $("#J_shippingError").css("display")!="none"){
				$('#opacityLayer').html(msgObj['DETAIL_cannot_shipping_toL']+paramInfo.ctyName).show();
				$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
				setTimeout(function(){
					$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
				},3000);
				return false;
			}
			return true;
		},
		addTracking:function(){
			if($("#J_skuLayer").css("position")=='fixed'){
				try{
					javascript:ga('send','event','Checkout-product','buyitnow',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
				}catch (e){}
			}else{
				try{
					javascript:ga('send','event','Checkout-product','buyitnow',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
				}catch (e){}
			}
		},
		ifFirstTurn:function(){
			var turn=$("#J_sku").attr("turn");
			if(turn!=1){
				$("#J_sku").trigger('click');
				return false;
			}
			return true;
		},
		getParam:function(){
			var self=this;
			var skuInfo=DetailUtil.getSkuId().split("_");
			if(!$("#J_skuLayer").find("dd[vhidden='"+skuInfo[0]+"']").length){
				return false;
			}
			var data=["quantity=",paramInfo.quantity,
				"&itemcode=",paramInfo.itemCode,
				"&proid=",paramInfo.proid,
				"&skuid=",skuInfo[0],
				"&skumd5=",skuInfo[1]];
			return data.join("");
		},
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
			var self=this;
			var $buy=self.$buy;
			if(!$buy) return;
			$buy.delegate($buy,'click',function(e){
				if($buy.hasClass("sold-out")) return;
				if(!self.ifCanSale(self)) return;
				if(!self.noShipTo()) return;
				if(!self.ifFirstTurn()) return;
				var param=self.getParam();
				if(!param) return;
                if(!self.isSkuSelected()) return;
				DHM.Common.request({
					url:self.buyUrl,
					type:"GET",
					dataType:'json',
					data:param,
					scope:self,
					fn:self.buyNowRes
				});
				self.addTracking();
				e.stopPropagation();e.preventDefault();
			});
		},
		buyNowRes:function(data,scope){
            window.location.href=data.urlabc+"?mbh=&returnURL="+paramInfo.returnURL;
		},
		toCart:function(){
			var self=this;
			var $toCart=self.$toCart;
			if(!$toCart) return;
			$toCart.delegate($toCart,'click',function(e){
				if($toCart.hasClass("sold-out")) return;
				if(!self.ifCanSale(self)) return;
				if(!self.noShipTo()) return;
				if(!self.ifFirstTurn()) return;
				var param=self.getParam();
				if(!param) return;
                if(!self.isSkuSelected()) return;
				DHM.Common.request({
					url:self.cartUrl,
					data:param,
					async:false,
					dataType:'html',
					scope:self,
					fn:self.toCartRes
				});
				self.addTracking();
				e.stopPropagation();e.preventDefault();
			});
		},
		toCartRes:function(){
			DHM.Init.logoSummary();
			$('#opacityLayer').html(msgObj['DETAIL_add_to_cart']).show();
			$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
			setTimeout(function(){
				$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
			},3000);
		},
        //查看所有的sku类型是否都有选中项
        isSkuSelected: function() {
            var flag = true,
                skus = $('.j-skuSelect');
                
            $.each(skus, function(i, sku){
                //一旦有未选择的属性则跳出
                if (flag === false) {
                    return;
                }
                //查找是否有未选择的sku
                if ($(sku).find("li[class*='active']").length === 0) {
                    //修改状态
                    flag = false;
                    
                    //展示错误提示
                    $('#opacityLayer').html(msgObj['DETAIL_error1']).show();
                    $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                    setTimeout(function(){
                        $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                    },3000);
                }
            });
            
            return flag;
        },
		init:function(){
			this.buyNow();
			this.toCart();
		}
	};

//	share
	function Share(){
		this.id="#J_share";
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
			var self=this;
			var $share=DHM.Common.domExist(self.id);
			if(!$share) return;
			var obj=self.getOpt();
			$share.delegate("a",DHM.Common.eType(),function(){
				var $e=$(this);
				var name=$e.data("name");
				window.open(obj[name], "bookmarkWindow");
					javascript:ga('send','event','Checkout-product','Share',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
			});
		},
		init:function(){
			this.operate();
		}
	};

//	may Interest
	function MayInterest(){
		this.id="#J_mayInterest";
		this.url=DHM.Common.mobileHost+"promoproduct.do";
		this.init();
	}
	MayInterest.prototype={
		constructor:MayInterest,
		getInterest:function(){
			var self=this;
			var $mi=DHM.Common.domExist(self.id);
			if(!$mi) return;
			var param=$mi.get(0).dataset;
			DHM.Common.request({
				url:self.url,
				data:{pp:param.pp,itemcode:param.itemcode},
				type:"GET",
				dataType:"html",
				scope:self,
				fn:self.responseMI,
				fnParam:$mi
			});
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
				element:$mi,
				con:"ul",
				distance:250,
				totalWidth:w*len+10,
				width:$(window).width(),
				speed:600
			});
		},
		init:function(){
			this.getInterest();
		}
	};

//	seo word
	function SeoWord(){
		this.$seo=DHM.Common.domExist("#J_seoWord");
		this.init();
	}
	SeoWord.prototype={
		constructor:SeoWord,
		opr:function(){
			var $seo=this.$seo;
			if(!$seo) return;
			$seo.delegate("h3",DHM.Common.eType(),function(){
				$seo.toggleClass("active");
			});
		},
		init:function(){
			var self=this;
			self.opr();
		}
	};
	//Ntalk 
	function Ntalk(){
		this.init();
	}
	Ntalk.prototype={
		constructor:Ntalk,
		chat:function(){
			var url = DHM.Common.mobileHost+'isSellerOnline.do',
				$J_dhChat = $('#J_dhChat'),
				$J_dhOffline = $('#J_notonline'),
				supplierid=$('#J_dhChat').attr("data-supplierid");
			$.ajax({
				url: url,
				type: 'GET',
				cache: false,
				dataType: 'json',
				data:{
					version : 3.3,
					client:"wap",
					supplierid:supplierid
				},
				success: function(data){
					if(data != undefined && data.isonline==true){
						$J_dhChat.show();
						$J_dhOffline.hide();
					}else{
						$J_dhChat.hide();
						$J_dhOffline.show();
					}
				}
			});
		},
		init:function(){
			var self =this;
			self.chat();
		}
	}
//	轮播图 urlHash='#viewpic'
	new DetailSlide();
//	add to fav
	//new AddToFav();
//  getCoupon
	new ShowLayer();
//	share
	new Share();
//	Ntalk
	new Ntalk();
//	may Interest
    /**
     * 推荐优化三期上线后此功能下线
     * new MayInterest();
    **/
	new SeoWord();
	new DetailShipping();
	new DetailSKU();
	new DetailSdr();
	new CartBuy();
	new loadShipList();
	new getRecommendItem(1);
	new openGroup();
	
//	tracking
	function tracking(){
		$("#cartnum").click(function(){
			javascript:ga('send','event','Checkout-product','cart',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
		});
		$("#J_dhMsg").click(function(){
			javascript:ga('send','event','Checkout-product','message',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
		});
		$('.go-back').click(function(){
			javascript:ga('send','event','Checkout-product','Top',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
		})
		$('#J_sku').click(function(){
			javascript:ga('send','event','Checkout-product','SelectOptions',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
		});
		$('#J_specifics,[name=s]').click(function(){
			javascript:ga('send','event','Checkout-product','Specification',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
		});
		$('#J_des,[name=d]').click(function(){
			javascript:ga('send','event','Checkout-product','Description',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
		});
		$('#J_reviews,[name=r]').click(function(){
			javascript:ga('send','event','Checkout-product','Reviews',paramInfo.cateDispId+ '-'+paramInfo.itemCode);
		});
	}
	tracking();
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
	
	function loadShipList(){
		var param=$("#J_proInfo").get(0).dataset;
		$.ajax({
			url: "/loadShipList.do",
			data: {
				minSaleSize: param.minsale,
				minOrderSize:param.minorder,
				countryid:paramInfo.ctyId,
				quantity:paramInfo.quantity,
				proid:paramInfo.proid,
				itemcode:paramInfo.itemCode,
				skuid:DetailUtil.getSkuId().split("_")[0],
				catePubId:param.catepubid,
				isProm:param.isprom,
				isinventory:$("#isinventory").val(),
				stockin:$("#stockin").val(),
				shiptype:$("#J_shippingLayer").find("li.choactive span").eq(0).text(),
				func:"ajaxloadship"
			},
			type: 'GET',
			cache: true,
			dataType: 'html',
			beforeSend:function(data){
				$('#J_shipping').hide();
				$('#J_sku').after('<div id="ship-loading"><img src="http://css.dhresource.com/mobile/detail/20150108/image/ship_loading.gif"></div>');
				$('#ship-loading').css('background','#fff').css('border-bottom','1px solid #ddd');
				$('#ship-loading').find('img').css('margin','0 auto');
			},
			complete:function(data){
				$('#J_shipping').show();
				$('#ship-loading').hide();
			},
			success: function(data){
				if(data == null || data == undefined){
					return;
				}
				$("#J_shippingLayer").find("dd").html(data);
				if(!$("#J_shippingLayer").find("dd li").get(0)){
					return;
				};
				var $choose=$("#J_shippingLayer").find("dd li.choactive span");
				var cost=$choose.eq(1).text();
				var oSpan=$choose.eq(0).text();
				var shipPrice =parseFloat(cost.substring(cost.indexOf('$')+1));
				$("#J_shippingCost").html((shipPrice==0)?("<em>"+msgObj['free_shipping']+" </em>"):("US $"+shipPrice+" "));
				var index = $("#J_shippingLayer").find("select").get(0).selectedIndex;
				var country = $("#J_shippingLayer").find("select").children('option').eq(index).html();
				if(oSpan.length>0){
					$("#J_shippingCty").text(country+' Via '+oSpan);
					if($("#J_shippingError").get(0)){
						$("#J_shippingError").css({display:"none"});
					}
				}
				paramInfo.shippingCost=shipPrice;
				paramInfo.ctyId=$("#J_shippingLayer").find("select").val();
				paramInfo.ctyName=country;
			}
		});
	}
	//个性化推荐item
	function getRecommendItem(pageNum){
		var language = $('#J_language').html();
		//var language = 'FR';
		var urlpath = "/mobileApiWeb/search-Product-getItems.do";
		$.ajax({
			url: urlpath,
			//url: '/api.php?jsApiUrl=' + 'http://m.fr.dhgate.com/mobileApiWeb/search-Product-getItems.do',
			type: 'GET',
			cache: false,
			dataType: 'json',
			data:{
				version : 3.3,
				client:"wap",
				pageSize:16,
				type:2,
				source:1,
				itemID:paramInfo.itemCode,
				pageNum:pageNum,
				category:paramInfo.cateDispId,
                pageType:"Item",
				language:language
			},
			success: function(data){
				/*$('.rp-items').show();*/
				if(!data) return;
				var len=data.data.resultList.length;
				var state=data.state;
				var $recommend=$("#J_recommendItems");
				$('.rp-items').find('.tit').html(msgObj['Recommended_products']);
				$('.rp-items').find('.show-more').html(msgObj['Show_more']);
				// 动态添加推荐商品
				var tmpl = {
					warp:'<li>{{image}}{{price}}</li>',
					image:'<div class="list-img">{{promo}}{{pro}}</div>',
					promo:'<span class={{icon}}>{{discountRate}}</span>',
					pro:'<a  href={{url}}/{{seoName}}/{{itemCode}}.html#cppd-{{index}}-9|null:01><img src={{imgUrl}} alt={{altName}}></a>',
					price:'<a href={{url}}/{{seoName}}/{{itemCode}}.html#cppd-{{index}}-9|null:01 class="list-cont"><span class="price"><b class="mobile-deals"></b>{{currencyText}}{{discountPrice}}</span></a>'
				}
				if(language == 'RU'){
					tmpl = {
						warp:'<li>{{image}}{{price}}</li>',
						image:'<div class="list-img">{{promo}}{{pro}}</div>',
						promo:'<span class={{icon}}>{{discountRate}}</span>',
						pro:'<a  href={{url}}/{{seoName}}/{{itemCode}}.html#cppd-{{index}}-9|null:01><img src={{imgUrl}} alt={{altName}}></a>',
						price:'<a href={{url}}/{{seoName}}/{{itemCode}}.html#cppd-{{index}}-9|null:01 class="list-cont"><span class="price"><b class="mobile-deals"></b>{{discountPrice}}{{currencyText}}</span></a>'
					}
				}
				if(state=="0x0000"){
					if(len>0){
						for(var i=0;i<len;i++){
							var dd=data.data.resultList[i];
							var url="http://" + location.host + "/product";
							var html;
							var promo, pro, price,img,warps;
							if (dd.promoType=="0") { //折扣
								promo = tmpl.promo.replace(/\{\{icon\}\}/, 'off-icon').replace(/\{\{discountRate\}\}/,parseInt(dd.discountRate));
								price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.discountPrice);
							} else if(dd.promoType==='50' || dd.promoType==='70'){
								if(dd.discountRate!==''){
									promo = tmpl.promo.replace(/\{\{icon\}\}/, 'off-icon').replace(/\{\{discountRate\}\}/,parseInt(dd.discountRate));
									price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.discountPrice);	
								}else{
									promo = tmpl.promo.replace(/\<span class=\{\{icon\}\}\>\{\{discountRate\}\}\<\/span\>/ , '');
									price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.maxPrice);
								}
							}else if(dd.promoType==='60'||dd.promoType==='80'){
								promo = tmpl.promo.replace(/\{\{icon\}\}/, 'reduction-ico').replace(/\{\{discountRate\}\}/,parseInt(dd.discountRate));
								price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.discountPrice);
							}
							else if (dd.promoType=="10") { //直降
								promo = tmpl.promo.replace(/\{\{icon\}\}/, 'reduction-ico').replace(/\{\{discountRate\}\}/,parseInt(dd.discountRate));
								price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.discountPrice);
							} else {
								promo = tmpl.promo.replace(/\<span class=\{\{icon\}\}\>\{\{discountRate\}\}\<\/span\>/ , '');
								price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.maxPrice);
							}
							pro = tmpl.pro.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{imgUrl\}\}/,dd.imgUrl).replace(/\{\{altName\}\}/,dd.seoName);
							img = tmpl.image.replace(/\{\{promo\}\}/, promo).replace(/\{\{pro\}\}/, pro);
							warps = tmpl.warp.replace(/\{\{image\}\}/,img).replace(/\{\{price\}\}/,price);
							//移动专享价添加标识
							if (!(dd.promoType==='50' || dd.promoType==='60' || dd.promoType==='70' || dd.promoType==='80')) {
								warps = warps.replace(/\<b class="mobile\-deals"\>\<\/b\>/, '');
							}
							$recommend.append(warps);
						}
						for(var i=8;i<len;i++){
							var lia = $recommend.find('li').eq(i);
							lia.css('display','none');
						}
					} else {
						$('.show-more').hide();
					}
				}
			}
		});

	}
	// 团购收起关闭
	function openGroup(){
		var groupOpen = $('.group .dis-info');
		groupOpen.click(function(){
			var $this = $(this);
			if($this.parent('.group').hasClass('close')){
				$this.siblings('.dis-explain').css('display','block');
				$this.parent('.group').removeClass('close').addClass('open');
			}
			else if($this.parent('.group').hasClass('open')){
				$this.siblings('.dis-explain').css('display','none');
				$this.parent('.group').removeClass('open').addClass('close');
			}
		});
	}
	//点击more显示更多
	$('.show-more').click(function(){
		$("#J_recommendItems").find("li").css('display','block');
		$(this).hide();
	});
	// 推荐导航类目滑动
	/*DHMSlide({
		element: "#j-slideBox",
		con: "#j-slideBoxCon",
		page: null,
		width: 130,
		speed: 500,
		autoRun: false, //是否自动运行
		loop: false,
		distance: 0
	});*/
	if($('.js-open-app').length){
		var priceOnapp = new Priceonapp();
	}
	
	var addToFav = new AddToFav();
	
	
});