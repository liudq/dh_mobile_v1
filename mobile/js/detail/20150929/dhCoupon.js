(function(self, $) {
	var DhCoupon,
		tools = self.DETAIL.tools,
		tmpl = tools.tmpl,
		template = self.DETAIL.template,
		dhCouponTpl = template.dhCouponTpl,
		dataErrorLog = new tools.DataErrorLog({
			flag: true,
			url: '/mobileApiWeb/biz-FeedBack-log.do'
		});


	tools.DhCoupon = DhCoupon = function(options) {
		this.SetOptions(options);
		this.$dRoot = $(this.options.$dRoot);
		this.$cHtml = $(this.options.$cHtml);
		this.cDhmHtmlOverflow = this.options.cDhmHtmlOverflow,
		this.$cJDhCouponWarpList = $(this.options.$cJDhCouponWarpList),
		this.$cJDhCouponPop = $(this.options.$cJDhCouponPop),
		this.cJDhCouponPopOpen = this.options.cJDhCouponPopOpen,
		this.$cJMenuClose = $(this.options.$cJMenuClose),
		this.$dhCoupon = $(this.options.$dhCoupon),
		this.$cJStoreCoupon = $(this.options.$cJStoreCoupon),
		this.InitEvent();

	};

	DhCoupon.prototype = {
		SetOptions: function(options) {
			this.options = {
				$dRoot: 'body',
				$cHtml: 'html',
				cDhmHtmlOverflow: 'dhm-htmlOverflow',
				//DHCoupon外层包裹容器
				$cJDhCouponWarpList:'.j-dhCouponWarpList',
				//DHCoupon浮层外层包裹容器
				$cJDhCouponPop: '.j-dhCouponPop',
				//DhCoupon打开弹窗外层包裹容器
				cJDhCouponPopOpen: 'dhCouponPop-open',
				//DhCoupon关闭弹窗按钮
				$cJMenuClose: '.j-menu-close',
				$dhCoupon: '.j-dhCoupon',
				//StoreCoupon外层包裹容器
				$cJStoreCoupon:'.j-storeCoupon'
			};
			$.extend(this.options, options || {})
		},
		InitEvent: function() {
			var self = this;
			self.dhCouponInfo();
			self.dhCouponLayerClosedOpen();
		},
		//打开弹层
		dhCouponLayerClosedOpen: function() {
			var self = this,
				$cHtml = this.$cHtml,
				cDhmHtmlOverflow = this.cDhmHtmlOverflow,
				$dhCoupon = this.$dhCoupon,
				$cJDhCouponPop = this.$cJDhCouponPop,
				cJDhCouponPopOpen = this.cJDhCouponPopOpen;
			$dhCoupon.click(function() {
				$cHtml.addClass(cDhmHtmlOverflow);
				$cJDhCouponPop.addClass(cJDhCouponPopOpen);
				var hei= $(window).height();
				$('.j-dhCouponWarpList').css({"height":hei-180});
			});
			$('.j-menu-close,.j-menu-arrow').click(function() {
				self.dhCouponLayerClosed();
			})
		},
		//关闭弹层
		dhCouponLayerClosed: function() {
			var self = this,
				$cHtml = this.$cHtml,
				cDhmHtmlOverflow = this.cDhmHtmlOverflow,
				$cJDhCouponPop = this.$cJDhCouponPop,
				cJDhCouponPopOpen = this.cJDhCouponPopOpen;
			$cHtml.removeClass(cDhmHtmlOverflow);
			$cJDhCouponPop.removeClass(cJDhCouponPopOpen);
		},
		dhCouponInfo: function() {
			var wwwURL = (/https/i.test(location.protocol)===false?'http://':'https://') + location.hostname,
				//多语言站点语言列表
		        countrys = {
		            'en': 'English (EN)',
		            'es': 'Español (ES)',
		            'pt': 'Português (PT)',
		            'ru': 'Русский (RU)',
		            'fr': 'Français (FR)',
		            'de': 'Deutsch (DE)',
		            'it': 'Italiano (IT)',
		            'tr': 'Türk (TR)'
		        },
		        //根据站点域名来判断当前站点国家
		        countryCur = wwwURL.match(/.+\.(es|pt|ru|fr|de|it)\..+/i)||'en',
				cateDispId = $('#J_shippingCost strong').attr('catedispid'),
				itemcode =window.location.pathname.match(/(\d+).html/)[1];
				//当前站点国家（国家缩写，语言列表中的key）
        		countryCur: $.isArray(countryCur)?countryCur[1]:countryCur,
			$.ajax({
				type: 'GET',
				url: '/mobileApiWeb/coupon-Coupon-getAvailableDHCouponList.do',
				async: true,
				cache: false,
				dataType: 'json',
				data: {
					'category':cateDispId,
					"itemID":itemcode,
					'client': 'wap',
					'language': countryCur
				},
				context: this,
				success: function(res) {
					var data = res.data,
						$dhCoupon = this.$dhCoupon,
						$cJStoreCoupon = this.$cJStoreCoupon;
					if (res.data && res.state === '0x0000') {
						if(data.length == 0){
							$dhCoupon.hide();
							$cJStoreCoupon.addClass('noDhcoupon');
						}else{
							$dhCoupon.show();
							$cJStoreCoupon.removeClass('noDhcoupon');
						}
						this.render(this.dhCouponList(res.data));
					}else{
						$dhCoupon.remove();
						$cJStoreCoupon.addClass('noDhcoupon');
					}
				}
			})
		},
		dhCouponList: function(data) {
			var self = this,
				template = self.template,
				tpl = this.tpl,
				warp = dhCouponTpl.warp.join('');
			data = tmpl(warp, data);
			return data;
		},
		render: function(str) {
			this.$cJDhCouponWarpList.html(str);
		}
	};

})(window, Zepto);