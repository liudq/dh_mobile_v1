(function(self, $){
	
    var AddToFav,
   		tools = self.DETAIL.tools,
   		tmpl = tools.tmpl,
   		dataErrorLog = new tools.DataErrorLog({
	        flag: true,
	        url: '/mobileApiWeb/biz-FeedBack-log.do'
	    }),
		tip = new tools.Tip();
   		tools.AddToFav = AddToFav = function(options){
	        this.SetOptions(options);
	        this.$dRoot = $(this.options.$dRoot);
	        this.$dAddToFav = $(this.options.$dAddToFav);
	        this.$cLoadingWarp = $(this.options.$cLoadingWarp);
	        this.$popupWarp = $(this.options.$popupWarp);
	       	this.addToFavUrl = this.options.addToFavUrl;
	       	this.cancelToFavUrl = this.options.cancelToFavUrl;
	       	this.isAddToFavUrl = this.options.isAddToFavUrl;
	       	this.tofavStyle = this.options.tofavStyle;
	       	this.hasfavorite = this.options.hasfavorite;
	       	this.paramInfo = this.options.paramInfo;
	        this.InitEvent();
	        
   		};

   		AddToFav.prototype = {
   			SetOptions: function (options) {
	            this.options = {
	            	$dRoot:'body',
	            	$dAddToFav:'#J_addToFav',
	            	$cLoadingWarp:'.j-loading-warp',
	            	$popupWarp:'j-popup-warp',
	            	//addToFavUrl:'http://css.dhresource.com/mobile/css/detail/20150108/html/favorite-Favorite-favorite.do',
	            	addToFavUrl:'/mobileApiWeb/favorite-Favorite-favorite.do',
	            	//cancelToFavUrl:'http://css.dhresource.com/mobile/css/detail/20150108/html/favorite-Favorite-unFavorite.do',
	            	cancelToFavUrl:'/mobileApiWeb/favorite-Favorite-unFavorite.do',
	            	isAddToFavUrl:'/mobileApiWeb/favorite-Favorite-exists.do',
	            	tofavStyle:'tofavStyle',
	            	hasfavorite:'icon-hasfavorite',
	            	paramInfo:{
	            		cateDispId:$("#J_proInfo").attr("data-cateDispId"),
	            		itemCode:$("#J_proInfo").data("itemcode")
	            	},
	                set_timer: null
	            };
	            $.extend(this.options, options || {})
	        },
	        InitEvent: function() {
	        	var self = this;
				this.isAddToFav();
				this.$dAddToFav.click(function(){
					self.changeToFav(self);
				});
				
	        },
	        isAddToFav:function(){
	        	var self = this,
	        		productId = $('#J_proInfo').attr('data-proid');
	      		DHM.Common.request({
					url:self.isAddToFavUrl,
					type:"GET",
					dataType:'json',
					data:{client:"wap",productId:productId},
					scope:self,
					fn:self.isAddToFavRes,
					fnError:self.fnError
				});
	        },
	        isAddToFavRes:function(data,scope){
	        	if(data.state==='0x0000'){
	        		if(data.data.favorite==='1'){
	        			scope.$dAddToFav.find('span').addClass(scope.hasfavorite);
	        		}else{
	        			scope.$dAddToFav.find('span').removeClass(scope.hasfavorite);
	        		}
	        		scope.$dAddToFav.find('var').text(data.data.count);
	        	}else{
	        		 //捕获异常
	                try {
	                    throw('success(): data is wrong');
	                } catch(e) {
	                    //异常数据收集
	                    // dataErrorLog.$el.trigger('save:dataErrorLog', {
	                    //     message: e,
	                    //     url:scope.addToFavUrl,
	                    //     params:{}
	                    // });
	                }
	        	}
	        },
	        setOpenstate:function(){
	        	this.$cLoadingWarp.find('.j-mask').hide();
	      		this.$cLoadingWarp.addClass(this.tofavStyle);
	      		//开启loading
                this.$cLoadingWarp.trigger('popupTip:loading', true);
	        },
	        changeToFav:function(self){
	        	
	        	var hasfavorite = self.$dAddToFav.find('span').hasClass(self.hasfavorite);

	        	try{
        			javascript:ga('send','event','Checkout-product','Favorite',this.paramInfo.cateDispId+ '-'+this.paramInfo.itemCode);
        		}catch (e){}
        		if(!self.$dAddToFav.attr('isLoading')){
	        		self.$dAddToFav.attr('isLoading','1');
	        	}else{
	        		return;
	        	}
	        	//设置打开的时候的样式
	      		self.setOpenstate();
	      		if(!hasfavorite){
	      			self.addToFav();
	      		}else{
	      			self.cancelToFav();
	      		}
	        },
	        getParams:function(){
	        	var obj = {};
	        		obj.pageType = "1";
	        		obj.itemCode = this.paramInfo.itemCode;
	        		obj.client = 'wap';

	        	return obj;
	        },
	        //添加收藏
	      	addToFav:function(){
	      		var self = this;
	      		DHM.Common.request({
					url:self.addToFavUrl,
					type:"GET",
					dataType:'json',
					data:self.getParams(),
					scope:self,
					fn:self.addToFavRes,
					fnError:self.fnError
				});
	      		
	        },
	        //取消收藏
	        cancelToFav:function(){
	        	var self = this;
	      		//开启loading
                this.$cLoadingWarp.trigger('popupTip:loading', true);
	      		DHM.Common.request({
					url:self.cancelToFavUrl,
					type:"GET",
					dataType:'json',
					data:{'itemCodes':self.getParams().itemCode,'client':'wap'},
					scope:self,
					fn:self.cancelToFavRes,
					fnError:self.fnError
				});
	        },
	        calNum:function(scope,symbol){

	        	if(!$('#changeNum').length){
	        		scope.$dAddToFav.append('<div id="changeNum"><b>'+symbol+'1<\/b></\div>');
	        	}

	        	var top = -20,
	        		changeNum = $('#changeNum');

	        	changeNum.animate({
		            top: top-10
		        },{
				    duration: 'slow',
				    complete: function() {
				      changeNum.remove();
				      var favVal = scope.$dAddToFav.find('var').text();
				      if(favVal===''){favVal='0';}
				      var Num = parseInt(favVal)
				      symbol==='+'?Num++:Num--;
				      if(Num<=0){
				      	scope.$dAddToFav.find('var').text("");
				      }else{
				      	scope.$dAddToFav.find('var').text(Num);
				      }
			          
				    }
			  });
	        },
	        addToFavRes:function(data,scope){
	        	//移除isLoading
	        	scope.$dAddToFav.removeAttr('isLoading');
	        	//关闭loading
                scope.$cLoadingWarp.trigger('popupTip:loading', false);
				//数据异常，关闭loading0x0016 0x0000
				if(data.state==='0x0000'){
					//setTimeout(function(){
					scope.calNum(scope,'+');
					scope.$dAddToFav.find('span').addClass(scope.hasfavorite);
					
					//},1000);
					
				}else{
	                //捕获异常
	                try {
	                    throw('success(): data is wrong');
	                } catch(e) {
	                    //异常数据收集
	                    // dataErrorLog.$el.trigger('save:dataErrorLog', {
	                    //     message: e,
	                    //     url:scope.addToFavUrl,
	                    //     params:{}
	                    // });
	                }
				}
			},
			cancelToFavRes:function(data,scope){
				//移除isLoading
	        	scope.$dAddToFav.removeAttr('isLoading');
	        	//关闭loading
				scope.$cLoadingWarp.trigger('popupTip:loading', false);

				if(data.state==='0x0000'){
					//setTimeout(function(){
						
					scope.calNum(scope,'-');
					scope.$dAddToFav.find('span').removeClass(scope.hasfavorite);
					scope.$dAddToFav.removeAttr('isLoading');
					//},1000);
					
				}else{
	                //捕获异常
	                try {
	                    throw('success(): data is wrong');
	                } catch(e) {
	                    // //异常数据收集
	                    // dataErrorLog.$el.trigger('save:dataErrorLog', {
	                    //     message: e,
	                    //     url:scope.cancelToFavUrl,
	                    //     params:{}
	                    // });
	                }
				}
			},
			fnError:function(url,scope,params){
				//移除isLoading
	        	scope.$dAddToFav.removeAttr('isLoading');
	        	//关闭loading
				scope.$cLoadingWarp.trigger('popupTip:loading', false);
	            //捕获异常
	            try {
	                throw('success(): data is wrong');
	            } catch(e) {
	                // //异常数据收集
	                // dataErrorLog.$el.trigger('save:dataErrorLog', {
	                //     message: e,
	                //     url:url,
	                //     params:params
	                // });
	            }
			},
			
   		}; 

})(window, Zepto);