(function(self, $){
    var AddToFav,
   		tools = self.DETAIL.tools,
   		tmpl = tools.tmpl,
   		// dataErrorLog = new tools.DataErrorLog({
	    //     flag: true,
	    //     url: '/mobileApiWeb/biz-FeedBack-log.do'
	    // }),
		tip = new tools.Tip();
		
   		tools.AddToFav = AddToFav = function(options){
	        this.SetOptions(options);
	        this.$dRoot = $(this.options.$dRoot);
	        this.$dAddToFav = $(this.options.$dAddToFav);
	        this.$cLoadingWarp = $(this.options.$cLoadingWarp);
	        this.$popupWarp = $(this.options.$popupWarp);
	       	this.addToFavUrl = this.options.addToFavUrl;
	       	this.cancelToFavUrl = this.options.cancelToFavUrl;
	       	this.tofavStyle = this.options.tofavStyle;
	       	this.hasfavorite = this.options.hasfavorite;
	        this.InitEvent();
	        
   		};

   		AddToFav.prototype = {
   			SetOptions: function (options) {
	            this.options = {
	            	$dRoot:'#J_list',
	            	$dAddToFav:'.j-favorite',
	            	$cLoadingWarp:'.j-loading-warp',
	            	$popupWarp:'j-popup-warp',
	            	//addToFavUrl:'http://css.dhresource.com/mobile/css/detail/20150108/html/favorite-Favorite-favorite.do',
	            	addToFavUrl:'/mobileApiWeb/favorite-Favorite-favorite.do',
	            	//cancelToFavUrl:'http://css.dhresource.com/mobile/css/detail/20150108/html/favorite-Favorite-unFavorite.do',
	            	cancelToFavUrl:'/mobileApiWeb/favorite-Favorite-unFavorite.do',
	            	tofavStyle:'tofavStyle',
	            	hasfavorite:'icon-hasfavorite',
	                set_timer: null
	            };
	            $.extend(this.options, options || {})
	        },
	        InitEvent: function() {
				this.$dRoot.delegate(this.$dAddToFav, 'click', $.proxy(this.changeToFav, this));
	        },
	        setOpenstate:function(){
	        	this.$cLoadingWarp.find('.j-mask').hide();
	      		this.$cLoadingWarp.addClass(this.tofavStyle);
	      		//开启loading
                this.$cLoadingWarp.trigger('popupTip:loading', true);
	        },
	        //切换添加收藏和取消收藏
	        changeToFav:function(e){
	        	var target = $(e.currentTarget),hasfavorite = target.find('var').hasClass(this.hasfavorite);
	        	try{
        			ga('send', 'event', 'Searchlist', 'Favorite');
        		}catch (e){}
	        	//处理一个请求还未完成时，多次点击发一堆请求的bug
	        	if(!target.attr('isLoading')){
	        		target.attr('isLoading','1');
	        	}else{
	        		return;
	        	}
	        	//设置打开的时候的样式
	      		this.setOpenstate();
	      		
      			if(!hasfavorite){
	      			this.addToFav(target);
	      		}else{
		      		this.cancelToFav(target);
	      		}
	      		
	        },
	        //获取参数
	        getParams:function(target){
	        	var obj = {};
	        		obj.pageType = target.attr('data-pageType');
	        		obj.itemCode = target.attr('data-itemCode');
	        		obj.client = 'wap';

	        	return obj;
	        },
	        //添加收藏
	      	addToFav:function(target){
	      		var self = this;
	      		$.ajax({
	                type: 'GET',
	                url: self.addToFavUrl,
	                async: true,
	                cache: false,
	                dataType: 'json',
	                data:self.getParams(target),
	                context: this,
	                success: function(res){
	                  self.addToFavRes(res,self,target);
	                },
	                error: function(){
	                   throw('success(): data is wrong');
	                }
	            });
	        },
	        //取消收藏
	        cancelToFav:function(target){
	        	var self = this;
	      		//开启loading
                this.$cLoadingWarp.trigger('popupTip:loading', true);
				$.ajax({
	                type: 'GET',
	                url: self.cancelToFavUrl,
	                async: true,
	                cache: false,
	                dataType: 'json',
	                data:{'itemCodes':self.getParams(target).itemCode,'client':'wap'},
	                context: this,
	                success: function(res){
	                  self.cancelToFavRes(res,self,target);
	                },
	                error: function(){
	                   target.removeAttr('isLoading');
	                   //关闭loading
                	   self.$cLoadingWarp.trigger('popupTip:loading', false);
	                   throw('success(): data is wrong');
	                }
	            });
	        },
	        //添加成功处理
	        addToFavRes:function(data,scope,target){
	        	//移除isLoading
	        	target.removeAttr('isLoading');
	        	//关闭loading
                scope.$cLoadingWarp.trigger('popupTip:loading', false);
				//数据异常，关闭loading0x0016 0x0000
				if(data.state==='0x0000'){
					//setTimeout(function(){
					target.find('var').addClass(scope.hasfavorite);
					//},2000);
					
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
			//取消收藏成功处理
			cancelToFavRes:function(data,scope,target){
				//移除isLoading
	        	target.removeAttr('isLoading');
	        	//关闭loading
                scope.$cLoadingWarp.trigger('popupTip:loading', false);
				
				if(data.state==='0x0000'){
					//setTimeout(function(){
					target.find('var').removeClass(scope.hasfavorite);
					
					//},2000);
					
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
			}
			
   		}; 

})(window, Zepto);