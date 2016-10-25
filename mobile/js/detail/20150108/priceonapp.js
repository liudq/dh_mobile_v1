(function(self, $){
   var Priceonapp,
   		tools = self.DETAIL.tools,
   		tmpl = tools.tmpl;

   		tools.Priceonapp = Priceonapp = function(options){
	        this.SetOptions(options);
	        this.$dRoot = $(this.options.$dRoot);
	        this.$openappBtn = $(this.options.$openappBtn);
	        this.$openAppWarp = $(this.options.$openAppWarp);
	      	this.$topOpenApp = $(this.options.$topOpenApp);
	  		this.set_timer = this.options.set_timer;
	  		this.iOS = this.options.iOS;
	  		this.android = this.options.android;
	  		this.downloadUrl = this.options.downloadUrl;
	  		this.schemeUrl = this.options.schemeUrl;
	  		this.config = {};
	  		this.Deeplink = deeplink;

	  		//判断是不是最终页des 是最终页能获取des的值为：“itemDetail”
	  		if(this.$dRoot.attr('data-pagetype')==='itemDetail'){
	  			this.des = this.$dRoot.attr('data-pagetype');
		  		this.itemcode = window.location.pathname.match(/(\d+).html/)[1];
	  			this.params = JSON.stringify({
		  			des: this.des,
		  			itemcode: this.itemcode
		  		});
	  			this.schemeUrl = this.schemeUrl+'?params='+this.params;
	  		}
	        this.InitEvent();
	        
   		};

   		Priceonapp.prototype = {
   			SetOptions: function (options) {
	            this.options = {
	            	$dRoot:'body',
	            	$openAppWarp:'.js-open-app',
	            	$topOpenApp:'.j-openApp',
	                $openappBtn: '.js-open-app a',
	                set_timer: null,
	                iOS:{
				            appId: "905869418",
				            appName: "DHgate",
				            storeUrl:'https://app.appsflyer.com/id905869418?pid=WAP-pricetag'
				        },
				    android:{
				            appId: "com.dhgate.buyer",
				            appName: "DHgate",
					    storeUrl:'http://m.dhgate.com/common/download.html'
				        },
				    downloadUrl:'http://m.dhgate.com/common/download.html',
				    schemeUrl : 'DHgate.Buyer://virtual'

	            };
	            $.extend(this.options, options || {})
	        },
	        InitEvent: function() {
				
				this.$dRoot.delegate(this.$openappBtn, 'click', $.proxy(this.openAppMethod, this));
	        },
	        //ios和android配置一些基本信息
	       configParam:function(){
	        	if(this.Deeplink.isIOS()){
	        		return this.config = {
	 				        iOS:this.iOS
				    };
	        	}else if (this.Deeplink.isAndroid()){
	        		return this.config = {
					        android: this.android,
					       	fallback:true
					    }
	        	}
	        },
	        //android下面直接下载方法
	        directDowload:function(){
	        	var _self = this;
	        	if (this.Deeplink.isAndroid()) {
	        		this.set_timer = setTimeout(function(){
				    	var endTime = Date.now();
				    	if (!_self.startTime || endTime - _self.startTime < 1500 + 200) { 
				    		window.location = _self.downloadUrl;
				    	}
			        }, 1500);
		    	 	window.onblur = function() {
		               clearTimeout(_self.set_timer);
		               self.set_timer = null;
		            }
	        	}
	        },
		        //唤起app的方法
	      	openAppMethod:function(){
	     
		    	this.startTime = Date.now();
		    	this.configParam()
		    	this.directDowload();
		    	this.Deeplink.setup(this.config);
		    	//判读是否需要传入参数跳转到app中对应的页面。
		    
			    this.Deeplink.open(this.schemeUrl);
			   
		        return false;
	        }
			
   		}; 

})(window, Zepto);