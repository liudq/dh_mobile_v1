(function(self, $){
   var Shipto,
   		tools = self.DETAIL.tools,
   		tmpl = tools.tmpl,
   		template = self.DETAIL.template,
   		shiptotpl = template.shiptotpl,
   		stockintpl = template.stockintpl,
   		shipmethod = template.shipmethod;

   		tools.Shipto = Shipto = function(options){
	        this.SetOptions(options);
	        this.$dRoot = $(this.options.$dRoot);
	        this.shiptoBtn = $(this.options.shiptoBtn);
	        this.closeBtn = $(this.options.closeBtn);
	        this.shiplayer = $(this.options.shiplayer);
	        this.choosemethodLayyer = $(this.options.choosemethodLayyer);
	        this.masklayer = $(this.options.masklayer);
	        this.bigbanner = $(this.options.bigbanner);
	        this.countrylayyer = $(this.options.countrylayyer);
	        this.stocklayer = $(this.options.stocklayer);
	        //价格
	        this.shipcost = $(this.options.shipcost);
	        //目的地
	        this.shipcountry = $(this.options.shipcountry);
	        //运输方式
	        this.shipway = $(this.options.shipway);
	         //到货时间
	        this.deliverytm = $(this.options.deliverytm);
	         //运输时间
	        this.shipwithin = $(this.options.shipwithin);
	        this.stockcountry = $(this.options.stockcountry);
	        this.quantity = $(this.options.quantity);
	        this.stockinbtn = $(this.options.stockinbtn);
	        this.sku = $(this.options.sku);
	        this.from = $(this.options.from);
	        this.canship = $(this.options.canship);
	        this.notcanship = $(this.options.notcanship);
	        this.cache = {};
	        this.itemcode =window.location.pathname.match(/(\d+).html/)[1];
	        
	        //this.Init();
   		};
   		Shipto.prototype = {
   			SetOptions: function (options) {
	            this.options = {
	            	$dRoot:'body',
	                shiptoBtn: '.j-shiptobtn',
	                closeBtn:'.js-shipclose',
	                shiplayer:'#shiptolayyer',
	                choosemethodLayyer:'#choosemethodLayyer',
	                masklayer:'.mask-layer',
	                bigbanner:".dhm-detail",
	                countrylayyer:'#countrylayyer',
	                stocklayer:'#stocklayer',
	                shipcost:'.j-shipcost',
	               	shipcountry:'.j-shipcountry',
	               	shipway:'.j-shipway',
	               	deliverytm:'.js-deliverytm',
	               	shipwithin:'.js-shipwithin',
	               	stockcountry:'.js-stockcountry',
	               	quantity:'#J_quantity',
	               	sku:'#J_sku',
	               	stockinbtn:'.js-stockinbtn',
	               	from:'.j-from',
	               	canship:'.js-canship',
	               	notcanship:'.js-notcanship'
	            };
	            $.extend(this.options, options || {})
	        },
	        Init:function(minOrder){
	        	this.minOrder = minOrder;

	        	if(!this.sku.attr('vquantity')){

	        		var vquantity = this.minOrder;
	        	}else{
	        		vquantity = this.sku.attr('vquantity');
	        	}
	        	
	        	$.ajax({
	                type: 'GET',
	                url: '/mobileApiWeb/item-Item-defaultShip.do',
	                async: true,
	                cache: false,
	                dataType: 'json',
	                data: {'client':'wap','itemcode':this.itemcode,'quantity':vquantity},
	                context: this,
	                success: function(res){

	                    if (res.data && res.state === '0x0000') {
	                    	if(res.data.shipCostAndWay==''){
	                    		this.shipcost.hide();
	                    		this.canship.hide();
	                    		this.shipcost.hide();
	                    		$('.re-via').hide();
	                    		$('.re-delivery').hide();

	                    		if($('.j-shiptobtn').attr('issold')!=0 && !$('.addCart').hasClass('disableAddCart')){
	                    			$('.addCart').addClass('disableAddCart');
	                    		}
	                    		this.shipcountry.html(res.data.whitherCountryName);
	                    		this.shipcountry.attr('vname',res.data.whitherCountry);
	                    		this.notcanship.html('<p class="notship">This item cannot be shipped to <span vname'+res.data.whitherCountry+'>'+res.data.whitherCountryName+'</span></p><p>Please contact seller to resolve this,or select other countries</p>').show();
		                	}else{
		                		this.shipcost.show();
	                    		this.canship.show();
	                    		this.notcanship.hide();
	                    		this.shipcost.show();
	                    		$('.re-via').show();
	                    		$('.re-delivery').show();
	                    		
		                		this.renderdefault(res.data);
		                	}
		                	this.Init.hasload = true;
	                    } else {
	                        console.log(res.message);
	                    }
	                }
	            });
				
	           if(!this.Init.hasload){
		           	this.display=this.getDiv();
		        	//this.$dRoot.delegate(this.shiptoBtn, 'click', $.proxy(this.shipmethod, this));
		        	this.$dRoot.delegate(this.shiptoBtn, 'click', $.proxy(this.shiptoLayyer, this));

		        	// this.$dRoot.delegate(this.shiptoBtn, 'click', $.proxy(this.stockin, this));
		        	this.$dRoot.delegate('.js-allcountrybtn', 'click', $.proxy(this.allcountry, this));
		        	this.$dRoot.delegate('.js-shipclose', 'click', $.proxy(this.closelayyer, this));
		        	this.countrylayyer.delegate('li', 'click', $.proxy(this.selectShipto, this));
		        	this.$dRoot.delegate('.js-stockinbtn', 'click', $.proxy(this.stockinEnter, this));
		        	//this.stocklayer.delegate('li', 'click', $.proxy(this.selectStockin, this));
		        	this.choosemethodLayyer.delegate('li','click',$.proxy(this.methodList, this));
	           }
	            
	        },
	        //绘制默认运输方式
	        renderdefault:function(data){
	        	
    		   if(data.shipCostAndWay.shipcost==0){
            		this.shipcost.html('<span>Free</span>shipping');
            		this.shipcost.removeClass('hasprice');
            	}else{
            		this.shipcost.addClass('hasprice');
            		this.shipcost.html('<span>$'+data.shipCostAndWay.shipcost+'</span>shipping');
            	}
            	this.shipcountry.html(data.whitherCountryName);
            	this.shipcountry.attr('vname',data.whitherCountry);
            	this.shipway.html(data.shipCostAndWay.expressType);
            	this.deliverytm.html(data.shipCostAndWay.lowerDate+ '&nbsp;and&nbsp;'+ data.shipCostAndWay.upperDate);
            	this.shipwithin.html(data.shipCostAndWay.leadingTime);
            	this.shiptoBtn.attr('defaultstock',data.shipCostAndWay.stockCountryId);
            	
            	
	        },
	        //点击运费列表
	        methodList:function(evt){
	        	
	        	var target = $(evt.currentTarget);
	        	target.addClass('active').siblings('li').removeClass('active');
	        	this.passVal();
	        },
	        //点击进入stockin国家选择
	        stockinEnter:function(){
	        	this.stocklayer.css({'display':'block'});

	        	this.translateX(this.stocklayer,0,true);

	        },
	        //点击选择的stockin国家
	        selectStockin:function(evt){
	        	var target = $(evt.currentTarget);
	        	var val= target.html();
	        	this.selectShipmethod(target,val,'stock');
	        },
	        stockinParam:function(){
	        	var skuId = this.sku.attr('skuid'),dataParams = {};
	        	
	        	if(!skuId){
	        		dataParams={
		        		"client":"wap",
		        		"itemcode":this.itemcode
		        	};
	        	}else{
	        		dataParams={
		        		"client":"wap",
		        		"itemcode":this.itemcode,
		        		"skuId":this.sku.attr('skuid'),
		        		"skuMd5":this.sku.attr('skumd5')
		        	};	
	        	}
	        	return dataParams;
	        },
	        //stockin 初始化
	        stockin:function(flag){

	        	var _self = this;
	        
	        	
	        		$.ajax({
		                type: 'GET',
		                url: '/mobileApiWeb/item-Item-stockCountry.do',
		                async: true,
		                cache: false,
		                dataType: 'json',
		                data: this.stockinParam(),
		                context: this,
		                success: function(res){
		                	
		                    if (res.data.length && res.state === '0x0000') {
	                    		this.stockinbtn.show();
		                    	this.from.show();
		                    	this.stockcountry.show();
		                    	

		                    	this.stockcountry.html(res.data[0].countryName);
		                    	this.shipcountry.attr('vstockname',res.data[0].countryId)
		                    	this.renderstockin(res.data);
		                    	this.stockin.hasload=true;
		                    	$('.j-shiptobtn').attr('defaultstock',res.data[0].countryId);
		                    	this.shipmethod(flag);
		                    } else {
		                        this.stockinbtn.hide();
		                       	this.stockcountry.html('China');
		                       	this.shipcountry.attr('vstockname','CN')
		                       	this.shipmethod(flag);
		                    }
		                    
		                }
		            });
	        	

	        	
	           
	        },
	        //进入页面物流属性弹层
	        shiptoLayyer:function(evt){
	        	
	        	var _self = this,target = $(evt.currentTarget),top = document.body.scrollTop,toCart=evt.data&&evt.data.toCart||false;
	        	target.attr('vtop',top);
	        	this.stockin(toCart);
	        	//this.shipmethod();
	        	$('.j-fixedAdd ').css('display','none');
	        	
	        },
	         //点击物流列表
	        selectShipto:function(evt){
	        	var target = $(evt.currentTarget);
	        	var val= target.html();
	        	this.selectShipmethod(target,val,'ship');
	        	
	        },
	        //选择目的地国家
	        allcountry:function(){

	        	if(!this.allcountry.isonload){
		        	$.ajax({
		                type: 'GET',
		                url: '/mobileApiWeb/item-Item-whitherCountry.do',
		                async: true,
		                cache: false,
		                dataType: 'json',
		                data: {"client":"wap"},
		                context: this,
		                success: function(res){
		                    if (res.data && res.state === '0x0000') {
		                    	this.renderallcountry(res.data);
		                    } else {
		                        console.log(res.message);
		                    }
		                    this.allcountry.isonload=true;
		                }
		            });
	        	 }else{

	        	 	this.translateX(this.countrylayyer,0,true);
	        	 }
	        },
	        //绘制目的地国家
	        renderallcountry:function(data){

	        	var item,warp,self = this;
	            //模板初始化
	            warp = shiptotpl.warp.join('');
	            item = shiptotpl.item.join('');
	           	//this.translateX(this.countrylayyer,0,true);
	           	 
	            //数据拼装
	            data = warp.replace(/\{\{item\}\}/, tmpl(item, data));

	            this.countrylayyer.css({'display':'block'});
	            this.countrylayyer.append(data);
	            var vname = this.shipcountry.attr('vname');
	        
	        	$('.popular-country li').each(function(index){
	        		
	        		if($(this).attr('vname')==vname){
	        			$(this).addClass('active').siblings().removeClass('active');
	        			self.shipcountry.attr('isVal','hastrue');
	        		}

	        	});
	        	
	        	if(self.shipcountry.attr('isVal')!='hastrue'){
	        		
	        		$('.popular-country li').removeClass('active');
	        		$("<li vname="+vname+" class='active' >"+self.shipcountry.html()+"</li>").insertBefore($('.popular-country li:first-child').get(0));
	        	}
	            this.translateX(this.countrylayyer,0,true);
	        },
	         //初始化调用物流列表
	        shipmethod:function(flag){
	        	//alert(target && !target.isonload)
	        	//if(target && !target.isonload){
	        	var _self = this,skuid = this.sku.attr('skuid');
	        	if(!flag){
	        		this.masklayer.css({'display':'block;'});
					this.shiplayer.css({'display':'block;'});
	        	}else{
	        		this.masklayer.css({'display':'none;'});
					this.shiplayer.css({'display':'none;'});
	        	}
	        	
				if(!this.sku.attr('vquantity')){
	        		var vquantity = this.minOrder;
	        	}else{
	        		vquantity = this.sku.attr('vquantity');
	        	}
				if(!skuid){
					var dataParams={
		        		"client":"wap",
		        		"itemcode":this.itemcode,
		        		"quantity":vquantity,
		        		"country":this.shipcountry.attr('vname'),
		        		"stockCountry":this.shipcountry.attr('vstockname')
		        	};
				}else{
					var dataParams={
		        		"client":"wap",
		        		"itemcode":this.itemcode,
		        		"skuId":this.sku.attr('skuid'),
		        		"skuMd5":this.sku.attr('skumd5'),
		        		"quantity":vquantity,
		        		"country":this.shipcountry.attr('vname'),
		        		"stockCountry":this.shipcountry.attr('vstockname')
		        	};
				}
	        	
	        		this.choosemethodLayyer.find('.js-loading').show();
	        		$.ajax({
		                type: 'GET',
		                url: '/mobileApiWeb/item-Item-shipCostAndWay.do',
		                async: true,
		                cache: false,
		                dataType: 'json',
		                data: dataParams,
		                context: this,
		                success: function(res){
		                	this.choosemethodLayyer.find('.js-loading').remove();
		                    if (res.data.length && res.state === '0x0000') {
		                    	
		                    	this.canship.show();
		                    	this.notcanship.hide();
		                    	//this.rendershipmethod();
		                    	warp = shipmethod.warp.join('');
					            item = shipmethod.item.join('');
					            //数据拼装
					            data = warp.replace(/\{\{item\}\}/, tmpl(item, res.data));
					            
				            	this.choosemethodLayyer.html(data);

		                    	//this.shipmethod.hasload =true;
		 						this.choosemethodLayyer.find('li').each(function(i){
		 							if($(this).find('.js-m-shipway').html()==_self.shipway.html()){
		 								$(this).addClass('active').siblings('li').removeClass('active');
		 							}
		 						});

		 						//如果是非用户click触发，则在这里手动选择运费方式
		 						if (flag) {
		 							this.choosemethodLayyer.find('li.active').trigger('click');
		 						}

					             setTimeout(function(){
									var h=$(window).height();
									_self.shiplayer.css({"height":h-100});
									_self.choosemethodLayyer.css({"height":h-262});
									_self.choosemethodLayyer.find('ul').css({"height":h-295,'overflow-y':'auto'});

									_self.choosemethodLayyer.attr('vheight',h-295);	
									
								 },80);
								if($('.j-shiptobtn').attr('issold')!=0 && $('.addCart').hasClass('disableAddCart')){
		                    		$('.addCart').removeClass('disableAddCart');
		                    	}
					            
		                    } else {
		                    	if($('.j-shiptobtn').attr('issold')!=0 && !$('.addCart').hasClass('disableAddCart')){
		                    		$('.addCart').addClass('disableAddCart');
		                    	}
		                    	
		                    	this.canship.hide();
		                       	this.choosemethodLayyer.html('<div class="cannot">This item cannot be shipped to <span>'+this.shipcountry.html()+'</span>, Please contact seller to resolve this,or select other countries.</div>');
		                    	this.notcanship.html('<p class="notship">This item cannot be shipped to <span>'+this.shipcountry.html()+'</span></p><p>Please contact seller to resolve this,or select other countries</p>').show();
		                    }
		                     
		                }
		            });
		          
		        	//}else{
		        		
		        	//}
		        if(this.choosemethodLayyer.attr('vheight')!=''){
		        	//alert(_self.choosemethodLayyer.css("height"))
		        	
						var h=$(window).height();

						
						
						
					
		        	this.choosemethodLayyer.find('ul').css({"height":this.choosemethodLayyer.attr('vheight')+'px','overflow-y':'auto'});
		        }

	            //trigger触发则不显示UI(非用户点击)
		        if (!flag) {
					this.translateY(this.shiplayer,0,true);
				}
	           
	        },
	        //选择运输信息
	        selectShipmethod:function(target,val,index){
	        	
	        	var _self = this;
	        	
	        	this.setCahceKey(this.getParams, target, index);

	        	this.countrylayyer.find('li').removeClass('active');
	        	target.addClass('active');

	        	this.choosemethodLayyer.find('.js-loading').show();
	  
	        	if (!this.getCache()) {
	        		$.ajax({
		                type: 'GET',
		                url: '/mobileApiWeb/item-Item-shipCostAndWay.do',
		                async: true,
		                cache: false,
		                dataType: 'json',
		                data: this.getParams(target,index),
		                context: this,
		                success: function(res){
		                	this.choosemethodLayyer.find('.js-loading').remove();


		                    if (res.data && res.state === '0x0000') {
		                    	if(res.data.length==0){
					         		this.shipcost .hide();
					         		$('.re-via').hide();
					         		$('.re-delivery').hide();
					         		
			                		if($('.j-shiptobtn').attr('issold')!=0 && !$('.addCart').hasClass('disableAddCart')){
		                    			$('.addCart').addClass('disableAddCart')
		                    		}
				                	
					         		
					         	}else{
					         		this.shipcost.show();
					         		$('.re-via').show();
					         		$('.re-delivery').show();
					         		if($('.j-shiptobtn').attr('issold')!=0 && $('.addCart').hasClass('disableAddCart')){
		                    			$('.addCart').removeClass('disableAddCart')
		                    		}
					         	}
		                    	this.rendershipmethod(res.data);
		                    	this.canship.show();
		                    	this.notcanship.hide()
		                    	
		                    } 
		                    if(index=='ship'){

	                    		this.shipcountry.html(val);
	                    		this.shipcountry.attr('vname',target.attr('vname'))
	                    		this.translateX(this.countrylayyer,'100%',false);
	                    	}else{
	                    		this.stockcountry.html(val);
	                    		this.translateX(this.stocklayer,'100%',false);
	                    	}
	                    	$('.cannot').find('span').html(val);
	                    	
		                }

			        	
			        	
	            	});
					
	        	} else {

	        		this.rendershipmethod();

	        		if($('.cannot').length){
	        				this.shipcost .hide();
	        				this.notcanship.show();
			         		$('.re-via').hide();
			         		$('.re-delivery').hide();
			         		if($('.j-shiptobtn').attr('issold')!=0 && !$('.addCart').hasClass('disableAddCart')){
                    			$('.addCart').addClass('disableAddCart')
                    		}
			         	}else{
			         		
			         		this.shipcost .show();
			         		this.notcanship.hide();
			         		$('.re-via').show();
			         		$('.re-delivery').show();
			         		if($('.j-shiptobtn').attr('issold')!=0){
		                		if($('.j-shiptobtn').attr('issold')!=0 && $('.addCart').hasClass('disableAddCart')){
	                    			$('.addCart').removeClass('disableAddCart')
	                    		}
		                	}
			         		
			         	}

	        		if(index=='ship'){
                		this.shipcountry.html(val);
                		this.shipcountry.attr('vname',target.attr('vname'));
                		this.translateX(this.countrylayyer,'100%',false);
                	}else{
                		this.stockcountry.html(val);
                		this.translateX(this.stocklayer,'100%',false);
                	}
                	$('.cannot').find('span').html(val);

	        	}

	        	
	        },
	        //初始化备货地
	        renderstockin:function(data){
				var item;
	            //模板初始化
	            warp = stockintpl.warp.join('');
	            item = stockintpl.item.join('');
	            //数据拼装
	            data = warp.replace(/\{\{item\}\}/, tmpl(item, data));
	            //stocklayer.show();
	            // this.stocklayer.css({'display':'block;'});
	           
	            //this.stocklayer.html('');
	            this.stocklayer.html(data);

	        },
	        getParams: function(target,index){
	        	var param = {},itemcode = this.itemcode,vname = target.attr('vname'),skuId = this.sku.attr('skuid');
	        	if(!this.sku.attr('vquantity')){
	        		var vquantity = this.minOrder;
	        	}else{
	        		vquantity = this.sku.attr('vquantity');
	        	}
	        	if(index=='ship'){
	        		if(!skuId){
	        			param={
		        			"client":"wap",
			        		"itemcode":itemcode,
		        			"quantity":vquantity,
			        		"country":vname,
			        		'stockCountry':this.shipcountry.attr('vstockname')
		        		}
	        		}else{
	        			param={
		        			"client":"wap",
			        		"itemcode":itemcode,
			        		"skuId":this.sku.attr('skuid'),
		        			"skuMd5":this.sku.attr('skumd5'),
		        			"quantity":vquantity,
			        		"country":vname,
			        		'stockCountry':this.shipcountry.attr('vstockname')
		        		}
	        		}
	        		
	        	}else{
	        		param={
	        			"client":"wap",
		        		"itemcode":this.itemcode,
		        		"skuId":this.sku.attr('skuid'),
		        		"skuMd5":this.sku.attr('skumd5'),
		        		"quantity":vquantity,
		        		"country":this.shipcountry.attr('vname'),
		        		"stockCountry":vname
	        		}
	        	}
	        	return param;
	
	        },
	        getCacheKey: function(){
	        	return $.param(this.cacheParam);
	        },
	        setCahceKey: function(callback){
	        	this.cacheParam = callback.apply(this, Array.prototype.slice.call(arguments, 1));
	        },
	        setCache: function(data){
	        	
	        	this.cache[this.getCacheKey()] = data;
	        },
	        getCache: function(){
	        	
	        	return this.cache[this.getCacheKey()];
	        },
	        //绘制物流列表信息
	        rendershipmethod:function(data){
	        	var item,vheight =this.choosemethodLayyer.attr('vheight'),
	        		cache = this.getCache(),_self = this;

	            //this.setCache(cache);
	            //if(data.length==0){
	           	// this.canship.hide();
	            // this.choosemethodLayyer.html('<div class="cannot">This item cannot be shipped to <span></span>, Please contact seller to resolve this,or select other countries.</div>');
	            // this.notcanship.html('<p class="notship">This item cannot be shipped to <span></span></p><p>Please contact seller to resolve this,or select other countries</p>').show();  
		        // }else{
		         	//没有命中缓存

		         	
	        	if (!cache) {
	        	
				        	//模板初始化
			            warp = shipmethod.warp.join('');
			            item = shipmethod.item.join('');
			             
			            //数据拼装
			            data = warp.replace(/\{\{item\}\}/, tmpl(item, data));
			          
			            this.setCache(data);
			         
		            	this.choosemethodLayyer.html(data);
			

	            //有缓存
	        	} else {
	        		
		            //if(cache.length==0){
		            	// 	this.canship.hide();
			           	// this.setCache(data);
			            // this.choosemethodLayyer.html('<div class="cannot">This item cannot be shipped to <span></span>, Please contact seller to resolve this,or select other countries.</div>');
			            // this.notcanship.html('<p class="notship">This item cannot be shipped to <span></span></p><p>Please contact seller to resolve this,or select other countries</p>').show();
			              
		         
		            	this.choosemethodLayyer.html(cache);
		          
	            	
	        	}
		       //  }
		        setTimeout(function(){
					_self.choosemethodLayyer.find('ul').css({'height':vheight+'px','overflow-y':'auto'});			
				 },80);
	        	//this.choosemethodLayyer.find('ul').css({'height':vheight+'px','overflow-y':'auto'});
	            this.passVal();
	        },
	        passVal:function(){
	        	//赋值
	        	var activeLi = this.choosemethodLayyer.find('li.active'),mcost = activeLi.find('.js-m-cost'),
	            	vcost = mcost.attr('vcost');
	            if(vcost=='0'){
            		this.shipcost.html('<span>Free</span>shipping');
            		this.shipcost.removeClass('hasprice');
            	}else{
            		this.shipcost.addClass('hasprice');
            		this.shipcost.html('<span>'+mcost.html()+'</span>shipping');
            	}
            	
	            this.shipway.html(activeLi.find('.js-m-shipway').html());
	        	this.shipwithin.html(activeLi.attr('data-leadtm'));
	        	this.deliverytm.html(activeLi.attr('data-deliverytm'));
	        },
	        //关闭层
	        closelayyer:function(evt){
	        	var target = $(evt.currentTarget),vtop = this.shiptoBtn.attr('vtop');
	        	
	        	this.masklayer.hide();
	        	
	        	if(target.parent('.shipto-layyer').length){
	        		this.shiplayer.css({'display':'block;'});
	        		this.translateY(this.shiplayer,'100%',false);
	        		
	        		
	        		$('.j-fixedAdd').hide();
	        	if($('.cannot').length){
	        		
	        		this.canship.hide();
	        		this.notcanship.html('<p class="notship">This item cannot be shipped to <span>'+this.shipcountry.html()+'</span></p><p>Please contact seller to resolve this,or select other countries</p>').show();
	        	}else{
	        		this.canship.show();
	        	}
	        		window.scroll(0,vtop);
	        	}else if(target.closest('#countrylayyer').length){
	        		this.countrylayyer.css({'display':'block;'});
	        		this.translateX(this.countrylayyer,'100%',false);
	        		this.shiplayer.css({'display':'block;'});
	        	}else if(target.closest('#stocklayer').length){
	        		this.countrylayyer.css({'display':'block;'});
	        		this.translateX(this.stocklayer,'100%',false);
	        		this.shiplayer.css({'display':'block;'});
	        	}
	        	
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
	        translateY:function($ele,y,flag){
				var self= this;
				var style=$ele.get(0).style;

				style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration = '500ms';
				style.webkitTransform=style.transform=style.MozTransform='translateY('+y+')';
				if(flag){			
					setTimeout(function(){
						window.scroll(0,0);
						self.ifShow(true,$ele);  //所有元素都隐藏
						var h=Math.max($ele.height(),$(window).height());
						$("body").css({height:h,'overflow-y':'hidden'});
						$ele.css({"position":"absolute","height":h-100});
					},800);
					$('.j-fixedAdd').css("display","none !important");
					$('.rp-items').css("display","none !important");
					this.masklayer.css("display","block !important");
					this.bigbanner.css("display","block !important");
					this.stocklayer.css("display","block !important");
					this.countrylayyer.css("display","block !important");

				}else{
					//$ele.undelegate($ele,DetailUtil.ev);
					this.ifShow(false,this.shiplayer);  //所有元素显示
					$('.j-fixedAdd').css("display","block !important");
					$('.rp-items').css("display","block !important");
					this.masklayer.css("display","none !important");
					$("body").css({height:"auto",'overflow-y':'visible'});
					$ele.css({"position":"fixed","height":"100%","display":"block"});
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
						var h=Math.max($ele.height(),$(window).height());
						//$("body").css({height:h});
						//var h=$(window).height();
						// $("body").css({height:h});
						
						$ele.css({"position":"absolute","height":h+100,'overflow-y':'auto'});
					},800);
					//this.masklayer.css("display","block !important");
					//this.bigbanner.css("display","block !important");

				}else{
					//$ele.undelegate($ele,DetailUtil.ev);
					
					//this.masklayer.css("display","none !important");
					
					$ele.css({"position":"fixed","height":"100%"});
				}
				
			}
   		};

   		
    

})(window, Zepto);
