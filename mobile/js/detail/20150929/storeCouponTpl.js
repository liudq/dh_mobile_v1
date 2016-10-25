//最终页中店铺coupon列表展示
(function(self, $){
	 if (self.DETAIL) {
	        detail = self.DETAIL;
	        
	        if (!detail.template) {
	            detail.template = {};
	        }
	        
	        if (!detail.template.detailStoreCouponTpl) {
	            detail.template.detailStoreCouponTpl = {};
	        }
	        
	        template = DETAIL.template.detailStoreCouponTpl;
		     $.extend(template, {
	            warp: [
					'<div class="dCouponList">',
						'{{title}}',

						'<div class="coupons">',
							'{{item}}',
						'</div>',
					'</div>'
	            ],
			 	title:[
					'<% var data = obj;%>',
						'<div class="coupon-title detail-arrow-right">Store Coupons <span>(<%=data.couponList.length%>)</span></div>',
			 	],
	            item: [
	                '<% var data = obj;%>',
					'<% var data1 = obj.couponList;%>',
					'<% for (var i = 0, len = data1.length; i < len; i++) { %>',
						'<% if(data1[i].totalNumber - data1[i].usedNumber === 0) { %>',
							'<a href="javascript:;" class="j-usableCoupon outOf" data-couponcode="<%=data1[i].couponCode%>">',
								'<% if(data1[i].platform === "3") { %>',
									'<span class="appCoupon">App Coupon</span>',
								'<% } %>',
								'<span class="c-discount"><b><%=data.currencyText%><%=data1[i].couponAmount%></b>  OFF <%=data.currencyText%><%=data1[i].minOrderAmount%>+</span>',
								'<span class="c-state">Out Of Coupons</span>',
							'</a>',
						'<% } else { %>',
							'<% if(data1[i].ifBuyerBind === false) { %>',
								 '<a href="javascript:;" class="j-usableCoupon usable" data-couponcode="<%=data1[i].couponCode%>">',
									'<% if(data1[i].platform === "3") { %>',
										'<span class="appCoupon">App Coupon</span>',
									'<% } %>',
									'<span class="c-discount"><b><%=data.currencyText%><%=data1[i].couponAmount%></b>  OFF <%=data.currencyText%><%=data1[i].minOrderAmount%>+</span>',
									'<span class="c-state">Get Now</span>',
								 '</a>',
							'<% } else if(data1[i].ifBuyerBind === true) { %>',
								'<a href="javascript:;" class="j-usableCoupon received" data-couponcode="<%=data1[i].couponCode%>">',
									'<% if(data1[i].platform === "3") { %>',
										'<span class="appCoupon">App Coupon</span>',
									'<% } %>',
									'<span class="c-discount"><b><%=data.currencyText%><%=data1[i].couponAmount%></b>  OFF <%=data.currencyText%><%=data1[i].minOrderAmount%>+</span>',
									'<span class="c-state">Received</span>',
								'</a>',
							'<% } %>',

						'<% } %>',
	                '<% } %>'
	            ]
	        });
	 }

})(window, Zepto);

//店铺coupon 弹窗
(function(self, $){
	if (self.DETAIL) {
		detail = self.DETAIL;

		if (!detail.template) {
			detail.template = {};
		}

		if (!detail.template.storeCouponTpl) {
			detail.template.storeCouponTpl = {};
		}

		template = DETAIL.template.storeCouponTpl;
		$.extend(template, {
			warp: [
				'<div class="allCoupons">',
					'<nav>',
						'<div id="J_sCouponNav" class="tit detail-arrow-left">',
							'<a href="javascript:;" class="j-back-left backLeft"></a>',
							'<a href="javascript:;">Store Coupons</a>',
							/*'<a href="javascript:;" class="j-back back"></a>',*/
						'</div>',
					'</nav>',
					'<article class="J_couponListLayer">',
						'{{item}}',
					'</article>',
					'<div class="note">Note: One coupin per single order, excluding shipping cost.</div>',
				'</div>'
			],
			item: [
				'<% var data = obj;%>',
				'<% var data1 = obj.couponList;%>',
				'<% for (var i = 0, len = data1.length; i < len; i++) { %>',
					'<% if(data1[i].totalNumber - data1[i].usedNumber === 0) { %>',
						'<a class="singleCoupon clearfix outOf" data-couponcode="<%=data1[i].couponCode%>">',
							'<span class="sCoupon-detail">',
								'<% if(data1[i].platform === "3") { %>',
									'<span class="sAppCoupon">App Coupon</span>',
								'<% } %>',
								'<p class="cOff"><b><%=data.currencyText%><%=data1[i].couponAmount%></b> OFF <%=data.currencyText%><%=data1[i].minOrderAmount%>+</p>',
								'<p>Coupon Expires:  <%=data1[i].expiresTime%></p>',
								'<p>Issued/Total: <b class="issued"><%=data1[i].usedNumber%></b>/<%=data1[i].totalNumber%></p>',
							'</span>',
							'<span class="sCoupon-btn">',
								'<p>Out of</p>',
								'<p>Coupons</p>',
							'</span>',
						'</a>',
					'<% } else { %>',
						'<% if(data1[i].ifBuyerBind === false) { %>',
							'<a class="singleCoupon clearfix usable" data-couponcode="<%=data1[i].couponCode%>">',
								'<span class="sCoupon-detail">',
									'<% if(data1[i].platform === "3") { %>',
										'<span class="sAppCoupon">App Coupon</span>',
									'<% } %>',
									'<p class="cOff"><b><%=data.currencyText%><%=data1[i].couponAmount%></b> OFF <%=data.currencyText%><%=data1[i].minOrderAmount%>+</p>',
									'<p>Coupon Expires:  <%=data1[i].expiresTime%></p>',
									'<p>Issued/Total: <b class="issued"><%=data1[i].usedNumber%></b>/<%=data1[i].totalNumber%></p>',
								'</span>',
								'<span class="sCoupon-btn">',
									'Get Now',
								'</span>',
							'</a>',
						'<% } else if(data1[i].ifBuyerBind === true) { %>',
							'<a class="singleCoupon clearfix received" data-couponcode="<%=data1[i].couponCode%>">',
								'<span class="sCoupon-detail">',
									'<% if(data1[i].platform === "3") { %>',
										'<span class="sAppCoupon">App Coupon</span>',
									'<% } %>',
									'<p class="cOff"><b><%=data.currencyText%><%=data1[i].couponAmount%></b> OFF <%=data.currencyText%><%=data1[i].minOrderAmount%>+</p>',
									'<p>Coupon Expires:  <%=data1[i].expiresTime%></p>',
									'<p>Issued/Total: <b class="issued"><%=data1[i].usedNumber%></b>/<%=data1[i].totalNumber%></p>',
								'</span>',
								'<span class="sCoupon-btn">',
								'</span>',
							'</a>',
						'<% } %>',

					'<% } %>',
				'<% } %>'
			]
		});
	}

})(window, Zepto);
