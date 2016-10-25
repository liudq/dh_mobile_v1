//shipto物流方式
(function(self, $){
	 if (self.DETAIL) {
	        detail = self.DETAIL;
	        
	        if (!detail.template) {
	            detail.template = {};
	        }
	        
	        if (!detail.template.shiptotpl) {
	            detail.template.shiptotpl = {};
	        }
	        
	        template = DETAIL.template.shiptotpl;
		     $.extend(template, {
	            warp: [
	            '<div class="allcountrycon">',
			        '<div class="back"><a href="javascript:;" class="js-shipclose"></a>Country</div>',
			        '<div class="popular-country">',
			            '<h3 class="pop-tit">Popular</h3>',
			            '<ul>',
			                '<li class="active" vname="US">United States</li>',
			                '<li vname="RF">Russian Federation</li>',
			                '<li vname="BR">Brazil</li>',
			                '<li vname="AU">Australia</li>',
			                '<li vname="UK">United Kingdom</li>',
			                '<li vname="ES">Spain</li>',
			                '<li vname="FR">France</li>',
			                '<li vname="CA">Canada</li>',
			                '<li vname="PL">Poland</li>',
			                '<li vname="TR">Turkey</li>',
			                '<li vname="SE">Sweden</li>',
			                '<li vname="IL">Israel</li>',
			                '<li vname="IT">Italy</li>',
			                '<li vname="NZ">New Zealand</li>',
			                '<li vname="DE">Germany</li>',
			            '</ul>',
			        '</div>',
			        '<div class="all-countrylist">',
			            '{{item}}',
			        '</div>',
			    '</div>'
	            ],
	            item: [
	                '<% var data = obj;%>',
	                '<% for (var i in data) { %>',
	                	'<div class="countrylist-module">',
			                '<h3 class="coun-moduletit"><%=i%></h3>',
			                '<ul>',
			                '<% for (var j = 0, len = data[i].length; j < len; j++) { console.log(data[i][j]);%>',
			                        '<li vname="<%=data[i][j].countryId%>"><%=data[i][j].countryName%></li>',
			                  '<% } %>',  
	                    	'</ul>',
			            '</div>',
	                '<% } %>'
	            ]
	        });
	 }

})(window, Zepto);
//shipto物流方式

	


(function(self, $){
	 if (self.DETAIL) {
	        detail = self.DETAIL;
	        
	        if (!detail.template) {
	            detail.template = {};
	        }
	        
	        if (!detail.template.shipmethod) {
	            detail.template.shipmethod = {};
	        }
	        
	        template = DETAIL.template.shipmethod;
	        $.extend(template, {
	            warp: [
	                
            		'<div class="choose-method-tit">Choose Shipping Method:</div>',
	            	'<div class="choose-methodcon">',
	                	
	                    '{{item}}',
	                	
            		'</div>'
	            ],
	            item: [
	                '<% var data = obj; %>',
	                 '<% if (data.length==0) { %>',
	                 '<div class="cannot">This item cannot be shipped to <span></span>, Please contact seller to resolve this,or select other countries.</div>',
	                 '<% } else { %>',
	                 '<ul>',
		                '<% for (var i = 0, len = data.length; i < len; i++) { %>',
			                '<% if (i==0) { %>',
		                        '<li class="active" data-leadtm="<%=data[i].leadingTime%>" data-deliverytm="<%=data[i].lowerDate%>&nbsp;and&nbsp;<%=data[i].upperDate%>">',
			                       '<% if (data[i].shipcost==0) { %>',
			                       '<div class="method-cost js-m-cost" vcost="0">Free shipping</div>',
			                       '<% } else { %>',
			                       '<div class="method-cost js-m-cost">$<%=data[i].shipcost%></div>',
			                       '<% } %>',
			                       '<div class="method-type clearfix"><var class="method-deliveryway js-m-shipway"><%=data[i].expressType%></var><span class="method-deliverytm">delivery time: <span><%=data[i].deliveryTime%>days</span> to ship</span></li>',
			                    '</li>',
		                    '<% } else { %>',
		                        '<li data-leadtm="<%=data[i].leadingTime%>" data-deliverytm="<%=data[i].lowerDate%>&nbsp;and&nbsp;<%=data[i].upperDate%>">',
			                       '<% if (data[i].shipcost==0) { %>',
			                       '<div class="method-cost js-m-cost" vcost="0">Free shipping</div>',
			                       '<% } else { %>',
			                       '<div class="method-cost js-m-cost">$<%=data[i].shipcost%></div>',
			                       '<% } %>',
			                       '<div class="method-type clearfix"><var class="method-deliveryway js-m-shipway"><%=data[i].expressType%></var><span class="method-deliverytm">delivery time: <span><%=data[i].deliveryTime%>days</span> to ship</span></li>',
			                    '</li>',
		                    '<% } %>',
		                	
		                '<% } %>',
		                '</ul>',
	              '<% } %>'
	            ]
	        });
	 }

})(window, Zepto);









//shipto物流方式
(function(self, $){
	 if (self.DETAIL) {
	        detail = self.DETAIL;
	        
	        if (!detail.template) {
	            detail.template = {};
	        }
	        
	        if (!detail.template.stockintpl) {
	            detail.template.stockintpl = {};
	        }
	        
	        template = DETAIL.template.stockintpl;

	         
		    $.extend(template, {
	            warp: [
	            '<div class="allcountrycon">',
			        '<div class="back"><a href="javascript:;" class="js-shipclose" ></a>Stock in</div>',
			        '<div class="all-countrylist">',
			            '<div class="countrylist-module">',
			                
			                '<ul>',
			                    '{{item}}',
			                '</ul>',
			            '</div>',
			        '</div>',
			    '</div>'
	                
	            ],
	            item: [
	                '<% var data = obj; %>',
	                '<% for (var i = 0, len = data.length; i < len; i++) { %>',
		                '<% if (i==0) { %>',
	                        '<li class="active" vname="<%=data[i].countryId%>"><%=data[i].countryName%></li>',
	                    '<% } else { %>',
	                        '<li vname="<%=data[i].countryId%>"><%=data[i].countryName%></li>',
	                    '<% } %>',
	                	
	                '<% } %>'
	            ]
	        });
	 }

})(window, Zepto);
