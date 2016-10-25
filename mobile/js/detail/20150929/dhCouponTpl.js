//dhCoupon列表
(function(self, $){
	 if (self.DETAIL) {
	        detail = self.DETAIL;
	        
	        if (!detail.template) {
	            detail.template = {};
	        }
	        
	        if (!detail.template.dhCouponTpl) {
	            detail.template.dhCouponTpl = {};
	        }
	        
	        template = DETAIL.template.dhCouponTpl;
		     $.extend(template, {
	            warp: [
	            	'<% var data = obj;%>',
	                '<% for (var i = 0; i < data.length;i++){ %>',
			           '<li>',
			               '<p class="j-couponExpires couponExpires">CouponExpires<br/><span class="data j-data"><%=data[i].endDateFormat%></span></p>',
			               '<span class="j-amount amount">$<%=data[i].amount%> OFF </span><span class="orderAmo j-orderAmo">$<%=data[i].orderAmo%>+</span>',
			           '</li>',
			        '<% } %>'
	            ]
	        });
	 }

})(window, Zepto);