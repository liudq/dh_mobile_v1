(function(self, $){
   var Appopen,
   		tools = self.DETAIL.tools,
   		tmpl = tools.tmpl;

   		tools.Appopen = Appopen = function(options){
	        this.SetOptions(options);
	        this.$dRoot = $(this.options.$dRoot);
	    	this.$openappBtn = $(this.options.$openappBtn);
	  		this.itemcode = window.location.pathname.match(/(\d+).html/)[1];
	  		this.set_timer = this.options.set_timer;
	  		this.iOS = this.options.iOS;
	  		this.android = this.options.android;
	  		this.downloadUrl = this.options.downloadUrl;
	  		this.schemeUrl = this.options.schemeUrl;
	  		this.des = this.options.des;
	  		this.params='{"des":"'+this.des+'","itemcode":"'+this.itemcode+'"}';
	        this.Init();
   		};
   		Appopen.prototype = {
   			SetOptions: function (options) {
	            this.options = {
	            	$dRoot:'body',
	                $openappBtn: '.j-openNewApp',
	                des:'itemDetail',
	                set_timer: null,
	                iOS:{
				            appId: "905869418",
				            appName: "DHgate",
				            storeUrl:'https://app.appsflyer.com/id905869418?pid=WAP-top'
				        },
				    android:{
				            appId: "com.dhgate.buyer",
				            appName: "DHgate"
				        },
				    downloadUrl:'http://download.dhgate.com/mobile/dhgate_buyer3.4.2.apk',
				    schemeUrl : 'DHgate.Buyer://virtual'

	            };
	            $.extend(this.options, options || {})
	        },
	        Init:function(){
	        	var self = this;
	        	this.$dRoot.delegate(this.$openappBtn, 'click', $.proxy(this.AppopenEvent, this));
	        },
	        AppopenEvent:function(){
				this.Deeplink(); 
	        },
	        Deeplink:function(){
	        	var startTime = Date.now(),_self = this,config;
	        	if (deeplink.isIOS()) {
	        		config = {
				        iOS:this.iOS
				    };
	        	} else if (deeplink.isAndroid()) {
	        		config = {
				        android: this.android,
				        fallback:false
				    }
				    this.set_timer =  setTimeout(function(){
				    	var endTime = Date.now();
				    	if (!startTime || endTime - startTime < 2000 + 200) { 
				    		window.location = _self.downloadUrl;
				    	}
			        }, 2000);
	        	 	window.onblur = function() {
                       clearTimeout(_self.set_timer);
                       self.set_timer = null;
                    }
	        	}
	        	
	        	deeplink.setup(config);
	        	if(this.params.length){
	        		this.schemeUrl +='?params='+this.params;
	        	}
	        	alert(this.schemeUrl)
			    deeplink.open(this.schemeUrl);

		        return false;
	        }
			
   		}; 

})(window, Zepto);