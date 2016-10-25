(function(self, $){
	var Storecoupon,
		tools = self.DETAIL.tools,
		tmpl = tools.tmpl,
		template = self.DETAIL.template,
		detailStoreCoupon = template.detailStoreCouponTpl,
		storeCoupons = template.storeCouponTpl;
	tools.Storecoupon = Storecoupon = function(options){
		this.SetOptions(options);
		this.$dRoot = $(this.options.$dRoot);
		this.SCouponBtn = $(this.options.SCouponBtn);
		this.sCouponTitleBtn = $(this.options.sCouponTitleBtn);
		this.sCouponListWrap = $(this.options.sCouponListWrap);
		this.sCouponlayer = $(this.options.sCouponlayer);
		this.sCouponClose = $(this.options.sCouponClose);
		this.sCouponBack = $(this.options.sCouponBack);
		this.usable = $(this.options.usable);
		this.shiplayer = $(this.options.shiplayer);
		this.choosemethodLayyer = $(this.options.choosemethodLayyer);
		this.masklayer = $(this.options.masklayer);
		this.bigbanner = $(this.options.bigbanner);
		this.countrylayyer = $(this.options.countrylayyer);
		this.stocklayer = $(this.options.stocklayer);
		this.isLogin = this.options.isLogin;
		this.couponCode = this.options.couponCode;
		this.cache = {};
		this.itemcode = $('.j-shiptobtn').attr('itemcode')!==''?$('.j-shiptobtn').attr('itemcode'):window.location.pathname.match(/(\d+).html/)[1];
		//初始化调用入口
		this.Init();
		//初始化事件
		this.initEvent();
	};
	Storecoupon.prototype = {
		SetOptions: function (options) {
			this.options = {
				$dRoot:'body',
				SCouponBtn: '.j-storeCoupon',//store-coupon 入口1
				sCouponTitleBtn:'.coupon-title',//store-coupon 入口2
				sCouponListWrap:'.j-store-coupons',//最终页入口2中的coupon列表外层
				sCouponUsable:'.j-usableCoupon',//最终页中可用coupon
				sCouponlayer:'#J_sCouponLayer',//store coupon 弹窗
				sCouponBack:'.j-back-left',//back
				sCouponClose:'.j-back',//关闭
				usable:".usable",//可用的coupon
				masklayer:'.mask-layer',
				bigbanner:".dhm-detail",
				countrylayyer:'#countrylayyer',
				stocklayer:'#stocklayer',
				shipcost:'.j-shipcost',
				shipcountry:'.j-shipcountry',
				isLogin: false,//登录状态，默认为未登录
				couponCode:this.GetQueryString('couponCode')
			};
			$.extend(this.options, options || {})
		},
		Init:function(){
			var self = this;
			$.ajax({
				type: 'GET',
				//url: '/api.php?jsApiUrl=' + 'm.dhgate.com/mobileApiWeb/coupon-Coupon-getSellerCoupon.do',
				url: '/mobileApiWeb/coupon-Coupon-getSellerCoupon.do',
				async: true,
				cache: false,
				dataType: 'json',
				data: {'client':'wap','itemID':this.itemcode,language:'en'},
				context: this,
				success: function(res){
					if (res.data && res.state === '0x0000' && res.data.resultList!==undefined) {
						var obj = {},
							dItem,dTitle,dWarp,sWrap,sItem,dData,sData,
							_self = this;
						obj.currencyText = '';
						obj.couponList =[];
						obj.currencyText = String(res.data.currencyText).charAt(res.data.currencyText.length - 1);
						$.each(res.data.resultList, function (index, pro) {
							var __obj2 = {};
							__obj2.couponCode = pro.couponCode;
							__obj2.couponAmount = pro.couponAmount;
							__obj2.minOrderAmount = pro.minOrderAmount;
							__obj2.startDate = pro.startDate;
							__obj2.endDate = pro.endDate;
							__obj2.totalNumber = pro.totalNumber;
							__obj2.usedNumber = pro.usedNumber;
							__obj2.ifBuyerBind = pro.ifBuyerBind;
							__obj2.validday = pro.validday;
							__obj2.platform = pro.platform;
							__obj2.couponStartDate = pro.couponStartDate;
							__obj2.couponEndDate = pro.couponEndDate;
							__obj2.expiresTime = _self.expiresTime(pro.endDate,pro.validday);
							obj.couponList.push(__obj2);
						});
						$('.j-storeCoupon').css('display','inline-block');
						$('.j-store-coupons').css('display','block');
						//模板初始化
						dWarp = detailStoreCoupon.warp.join('');
						dItem = detailStoreCoupon.item.join('');
						dTitle = detailStoreCoupon.title.join('');
						sWrap = storeCoupons.warp.join('');
						sItem = storeCoupons.item.join('');
						//数据拼装
						dData = dWarp.replace(/\{\{item\}\}/, tmpl(dItem, obj)).replace(/\{\{title\}\}/, tmpl(dTitle, obj));
						sData = sWrap.replace(/\{\{item\}\}/, tmpl(sItem, obj));
						this.sCouponListWrap.append(dData);
						this.sCouponlayer.append(sData);
						this.Init.hasload = true;
						if(this.couponCode!== null){
							this.triggerBindCoupon();
						}
					} else {

					}
				}
			});

			if(!this.Init.hasload){
				this.display=this.getDiv();
			}
		},
		//事件初始化
		initEvent: function() {
			this.$dRoot.delegate('.usable', 'click', $.proxy(this.bindCoupon,this));
			this.$dRoot.delegate('.j-back-left', 'click', $.proxy(this.closelayer, this));
			this.$dRoot.delegate('.j-back', 'click', $.proxy(this.closelayer, this));
			this.$dRoot.delegate('.j-storeCoupon', 'click', $.proxy(this.openCouponLayer, this));
			this.$dRoot.delegate('.coupon-title', 'click', $.proxy(this.openCouponLayer, this));

		},
		//优惠券有效日期
		expiresTime:function(endtime,validity){
			//优惠券有效日期=活动结束日期+优惠券有效期xx天
			var time = endtime + validity*24*60*60*1000;
			var year = new Date(time).getFullYear();
			var month = new Date(time).getMonth();
			var day = new Date(time).getDate();
			var monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] ;
			var timeDetail = monthArray[month]+'  '+day+', '+year;
			return timeDetail;

		},
		//绑定领取coupon接口
		triggerBindCoupon:function(){
			this.bindCoupon(this.couponCode);
		},
		//获取url中参数
		GetQueryString:function(name) {
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null) return unescape(r[2]); return null;
		},
		//领取coupon
		bindCoupon:function(evt){
			var _self = this,
				tCouponCode = evt.currentTarget?$($(evt.currentTarget).closest('a')[0]).attr('data-couponcode'):evt;
			ga&&ga('send', 'event','MPU', 'SellerCoupon','click');
			//遮罩层打开
			this.masklayer.css("display","block !important");
			//已登录
			if (this.isLogin) {
				this.fetchBindCoupon({
					params: {
						client: 'wap',
						couponCode: tCouponCode,
						couponSource: 'WAP_ItemPage'
					},
					successCallback: $.proxy(function() {
						//变更状态
						this.changeCouponStatus(evt,true);
						//遮罩层关闭
						this.masklayer.css("display","none !important");
					}, this),
					doneCallback: $.proxy(function() {
						$('#opacityLayer').html("Sorry, we're currently out of coupons.").show();
						//变更状态
						this.changeCouponStatus(evt,false);
						$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
						setTimeout(function(){
							$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
						},3000);
						//遮罩层关闭
						this.masklayer.css("display","none !important");
					},this),
					alreadyCallback: $.proxy(function() {
						$('#opacityLayer').html("You already got this coupon.").show();
						//变更状态
						this.changeCouponStatus(evt,true);
						//遮罩层关闭
						this.masklayer.css("display","none !important");
					},this)
				});
			//未登录
			} else {
				this.getLoginStatus({
					successCallback: $.proxy(function() {
						this.isLogin = true;
						this.fetchBindCoupon({
							params: {
								client: 'wap',
								couponCode: tCouponCode,
								couponSource: 'WAP_ItemPage'
							},
							successCallback: $.proxy(function() {
								//变更状态
								this.changeCouponStatus(evt,true);
								//遮罩层关闭
								this.masklayer.css("display","none !important");
							}, this),
							doneCallback: $.proxy(function() {
								status = false;
								$('#opacityLayer').html("Sorry, we're currently out of coupons.").show();
								//变更状态
								this.changeCouponStatus(evt,false);
								$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
								setTimeout(function(){
									$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
								},3000);
								//遮罩层关闭
								this.masklayer.css("display","none !important");
							},this),
							alreadyCallback: $.proxy(function() {
								$('#opacityLayer').html("You already got this coupon.").show();
								//变更状态
								this.changeCouponStatus(evt,true);
								//遮罩层关闭
								this.masklayer.css("display","none !important");
							},this)
						});
					}, this)
				},tCouponCode);
			}
		},
		//执行coupon绑定操作
		fetchBindCoupon: function(options) {
			$.ajax({
				type: 'GET',
				url:'/mobileApiWeb/coupon-Coupon-bindCouponToBuyer.do',
				async: true,
				cache: false,
				dataType: 'json',
				data: options.params,
				context: this,
				success: function(res){
					if (res.data && res.state === '0x0000') {
						options.successCallback&&options.successCallback();
					} else if(res.state === '0x0511'){//已经领光了
						options.doneCallback&&options.doneCallback();
					} else if(res.state === '0x0505'){//用户已经存在该coupon
						options.alreadyCallback&&options.alreadyCallback();
					} else {//其他情况
						//遮罩层关闭
						this.masklayer.css("display","none !important");
						$('#opacityLayer').html("Something went wrong. Please try again.").show();
						$('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
						setTimeout(function(){
							$('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
						},3000);
					}
				}
			});
		},
		//变更对应选择的coupon状态
		changeCouponStatus:function(evt,status){
			var couponcode = evt.currentTarget?$(evt.currentTarget).closest('a').attr('data-couponcode'):evt,
				$eles = $("a[data-couponcode='" + couponcode+"']");
			$.each($eles, function(index, coupon){
				var $d = $(coupon);
				if ($d.hasClass('j-usableCoupon')) {
					// status 为false的时候 显示out of coupons
					if(status === false) {
						$d.find('.c-state').html("Out of Coupons");
						$d.removeClass('usable').addClass('outOf');
					} else {
						$d.find('.c-state').html("Received");
						$d.removeClass('usable').addClass('received');
					}
				} else if ($d.hasClass('singleCoupon')) {
					// status 为false的时候 显示out of coupons
					if(status === false){
						$d.removeClass('usable').addClass('outOf');
						$d.find('.sCoupon-btn').html('<p>Out of</p><p>Coupons</p>');
					} else {
						$d.removeClass('usable').addClass('received');
						$d.find('.sCoupon-btn').html('');
						$d.find('.issued').html(parseInt($d.find('.issued')[0].innerHTML)+1);
					}
				}
			});
		},
		//进入页面coupon弹层
		openCouponLayer:function(evt){
			var _self = this,
				target = $(evt.currentTarget),
				top = document.body.scrollTop;
			target.attr('vtop',top);
			_self.translateX(this.sCouponlayer,0,true);
		},
		//关闭层
		closelayer:function(evt){
			this.translateX(this.sCouponlayer,"100%",false);
		},
		//获取登录状态
		getLoginStatus:function(options,couponCode){
			var couponCode = couponCode;
			$.ajax({
				url:'/buyerislogin.do',
				type: 'GET',
				async: true,
				cache: false,
				dataType:'text',
				context: this,
				error: function(){},
				success: function(data){
					if(data != undefined && data.trim()==="true"){//登录
						options.successCallback&&options.successCallback();
					}else{//未登录
						var href=window.location.href.replace(window.location.hash,'').replace(window.location.search,'')+ '?couponCode=' + couponCode;
						location.href = 'http://m.dhgate.com/login.do?returnURL='+href;
					}
				}
			});
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
				this.display[0].hide()
				if($dom){
					$dom.show();
				}
			}else{
				for(var k in this.display[1]){
					this.display[1][k].style.display= k.split("-")[1];
				}
				if($dom){
					$dom.hide();
				}
			}
		},
		translateX:function($ele,x,flag){
			var self= this;
			var style=$ele.get(0).style;

			style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration = '500ms';
			style.webkitTransform=style.transform=style.MozTransform='translateX('+x+')';
			if(flag){
				setTimeout(function(){
					window.scroll(0,0);
					self.ifShow(true,$ele);  //所有元素都隐藏
					var h=Math.max($ele.height(),$(window).height());
					$("body").css({height:h,'overflow-y':'hidden'});
					$ele.css({"position":"absolute","height":h});
				},800);
				$('.j-fixedAdd').css("display","none !important");
				this.bigbanner.css("display","block !important");
				this.stocklayer.css("display","block !important");
				this.countrylayyer.css("display","block !important");

			}else{
				this.ifShow(false,this.sCouponlayer);  //所有元素显示
				$('.j-fixedAdd').css("display","block !important");
				$('.j-store-coupons').css("display","block !important");

				$("body").css({height:"auto",'overflow-y':'visible'});
				$ele.css({"position":"fixed","height":"100%","display":"block"});
			}

		}
	};
})(window, Zepto);
