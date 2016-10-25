//silder
$(function(){
	var oBann = $('#J_bannerImg');
	var bannerList = $('#J_bannerList')
	var aLi = oBann.children('li');
	var len = aLi.length;
	var totalSpan = '';
	var timer = null;
	var iNum = -1;

	for(var i=0;i<aLi.length;i++){
		var oSpan = '<span></span>';
		totalSpan+=oSpan;
	}
	bannerList.append(totalSpan);
	var aSpan = bannerList.find('span');
	aSpan.eq(0).addClass('current');
	var oSpanWidth = 100/len;
	$.each(aSpan,function(index){
		$(this).css('width',oSpanWidth+"%");
	})
	totalWidth = (parseInt(aLi.eq(0).width()) * len);
    oBann.css('width', totalWidth + 'px');
    var flipsnap = Flipsnap(oBann.get(0), {
        distance: '320'
    });
	clearInterval(timer);
    flipsnap.element.addEventListener('fstouchstart', function(ev) {
	    clearInterval(timer);
	}, false);
	flipsnap.element.addEventListener('fspointmove', function(evt) {
		
		iNum= flipsnap.currentPoint;
		aSpan.filter('.current').removeClass('current');
	    aSpan.eq(flipsnap.currentPoint).addClass('current');
	}, false);
	flipsnap.element.addEventListener('fstouchend', function(evt) {
		timer=setInterval(autoTab,3000);
	}, false);
	timer=setInterval(autoTab,3000);
	function autoTab(){
		
		if(iNum>=len-1){
			iNum=0;
			//
		}else{
			iNum++;
		}
		flipsnap.currentPoint=iNum;	
		flipsnap.moveToPoint(iNum);			 
		aSpan.filter('.current').removeClass('current');
	    aSpan.eq(flipsnap.currentPoint).addClass('current');
	}
	
});
/* cart order message login  */
var CartOrderInterface = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.Init();
};
CartOrderInterface.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp'
        };
        $.extend(this.options, options || {});
    },
    Init: function(){
        var _this = this,
            cart = $('.j-cart'),
            message = $('.j-message'),
            order = $('.j-order'),
            login = $('.j-login');
         
        $.ajax({
            url: "http://m.dhgate.com/getbuyerlogodata.do",
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(da){
            
                cart.html(da.data.cartNum);
                message.html(da.data.messageNum);
                order.html(da.data.orderNum);
                if(da.data.islogin=='true'){
                    login.addClass('icon-logined');
                    var nickName = da.data.nickname;
                    $('#J_logined').html('Hello,'+nickName+' | <a href="http://m.dhgate.com/signout.do">Sign out</a>');
                    
                }else{
                    login.removeClass('icon-logined');
                }
            }
        });
    }
};
/* cart order message login  */
var RcentViewed = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.recentViewed = $('#' + this.options.recentViewed);
    this.Init();
};
RcentViewed.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp',
            recentViewed:'J_recentViewed'
        };
        $.extend(this.options, options || {});
    },
    Init: function(){
        var _this = this;

        this.recentViewed.delegate('.rv-tips-close','click',function(){
            localStorage.setItem("recentView",'hasViewd'); 
            _this.recentViewed.find('.rv-tips').remove();

        });
        $.ajax({
            url: "http://m.dhgate.com/getrecentkeyandcid.do",
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(da){
                if(da.data!=null){
                    _this.setHtml(da.data);
                    if(localStorage.getItem('recentView')=='hasViewd'){
                        _this.recentViewed.find('.rv-tips').remove();
                    }
                }
                
            }
        });
    },
    setHtml:function(data){
        var allHtml = '<h2 class="rv-title">Recently Viewed</h2><section class="rently-viewed-con clearfix"><ul>',
            ali1 ='';
            ali2 ='';
        for(var i=0;i<=data.length-1;i++){
            if(i<=1){
                ali1+='<li><a href='+data[i].url+'#whp >'+data[i].title+'</a></li>';
            }else{
                ali2+='<li><a href='+data[i].url+'#whp >'+data[i].title+'</a></li>';
            }
            
        }
        allHtml+=ali1+"</ul><ul>"+ali2+"</ul></section><div class='rv-tips'><a href='javascript:;' class='rv-tips-close'>X</a>The history of searching keywords and categories you recently browsed will displaied here</div>"; 
        this.recentViewed.append(allHtml);               
    }
};
/* selectcountry */
var SearchMain = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
  	}
   	this.warp = $('#' + this.options.warp);
    this.search = $('#' + this.options.search);
    this.searchBoxBtn = $('#' + this.options.searchBoxBtn);
    this.searchList = $('#' + this.options.searchList);
   // this.arr = [];
    this.Init();
    //this.key = 'sechData';
};
SearchMain.prototype = {
    setOptions: function(options){
        this.options = {
        	warp:'warp',
            searchBoxBtn: 'J_searchBoxBtn',
            search: 'J_search',
            searchList:'J_searchList'
        };
        $.extend(this.options, options || {});
    },
    Init: function(){
        var _this = this;
        //获取焦点
        this.searchBoxBtn.on('focus',function(){
         	_this.foucus();
        });
         //输入联想
        this.searchBoxBtn.on('keyup',function(){
         	_this.relatedSearches();
        });
        //cancel搜索层
        $('.hd-cancel').on('click',function(){
        	_this.display(0);
        });
        //close联想搜索层
         this.search.delegate('.j-searchlistClose','click',function(){
        	_this.searchList.hide();
        });
         //清除历史记录
         this.search.delegate('.j-historyClose','click',function(){
         	_this.clearSearchDataItem();
        	_this.searchList.hide();
        });
         //点击列表提交
         this.search.delegate('#J_searchList li','click',function(evt){
            _this.listSubmit(evt);
            
            
        });
         //del清除搜索内容
        $('.del-btn').on('click',function(){
        	_this.searchBoxBtn.val('');
        	_this.searchList.hide();
        	$(this).hide();
        });
        $('.j-submit').on('click',function(){
        	_this.submitFun();
        });
        $('#mobilesearcheader').on("submit", function() {
            if(_this.searchBoxBtn.val()==''){return false;}
            _this.submitFun();
        });
        $('.j-opacity-layer').css({ opacity: 0,zIndex:-2});
    },
    relatedSearches:function(){
    	var _this = this;
    	if(_this.searchBoxBtn.val()==''){this.foucus();return;}
        var thisVal = this.searchBoxBtn.val();
        var timestamp = + new Date();
    	$.ajax({
			url: "http://m.dhgate.com/suggest.do?q="+thisVal+"&limit=7&c=",
			type: 'GET',
			cache: false,
			dataType: 'text',
			success: function(da){
                if(da.length){
                    _this.setHtml(da,'inp');
                    $('.del-btn').show();
                    _this.searchList.removeClass('search-hot');
                }
				
			}
		});
    },
    foucus: function(thisBtn){
         $('.j-opacity-layer').css({ opacity: 0,zIndex:-2});
    	var _this = this;
    	this.searchBoxBtn.val('');
    	$('.del-btn').hide();
    	this.display(1);
       
    	var dataStr = this.getSearchDataItem();
        dataStr = this.unique(dataStr).slice(0, 7);
    	if(dataStr.length>0){
             _this.searchList.removeClass('search-hot');
    		this.setHtml(dataStr,'store');
    	}else{
        	 $.ajax({
				url: "http://m.dhgate.com/getrelatedsearchwords.do",
				type: 'GET',
				cache: false,
				dataType: 'json',
				success: function(data){
                    if(data.data.length){
                         _this.searchList.addClass('search-hot');
                        _this.setHtml(data.data,'hot');
                    }
				}
			});
	        
    	}    
    },
    setHtml:function(inData,n){
    	if(n=='hot'){

    		var allHtml = '<span class="search-title">Hot Searches</span><ul>';
			var ali ='';
	    	for(var i=0;i<=inData.length-1;i++){
	    		if(i<=2){
	    			ali +="<li><span>"+(i+1)+"</span><i class='sr-hotrangelist'>"+inData[i]+"</i></li>";
	    		}else{
	    			ali +="<li>"+inData[i]+"</li>";
	    		}
	    		
	    	}
	    	allHtml +=ali+'</ul>';
	    	this.searchList.html('');
	    	this.searchList.append(allHtml);
    	}
    	if(n=='inp'){
    		var list = inData.split('| '); 
    		
				list.pop();
			var ali ='';
			var allHtml = '<ul>';
	    	for(var i=0;i<=list.length-1;i++){
	    		ali +="<li>"+list[i]+"</li>";
	    	}
	    	allHtml += ali+'</ul><div class="searchlist-close"><a href="javascript:;" class="j-searchlistClose">Close</a></div>';
	    	this.searchList.html('');
	    	this.searchList.append(allHtml);
    	}
    	if(n=='store'){
    		var ali ='';
			var allHtml = '<ul>';
			//alert(inData.length)
    		for(var i=0;i<=inData.length-1;i++){
				ali +="<li>"+inData[i]+"</li>";
    		}
    		allHtml += ali+'</ul><div class="searchlist-close"><a href="javascript:;" class="j-historyClose">Clear history</a></div>';
    		this.searchList.html('');
	    	this.searchList.append(allHtml);
    	}
    	
    	
    },
    addSearchDataItem:function(val){
        var data=  localStorage.getItem('sechData'),arr = [];
        if(  !data ) { arr.unshift(val); } else{  arr =  val+'-'+data;  }
           localStorage.setItem("sechData",arr); 
        
    },
    getSearchDataItem:function(){
    	var data=  localStorage.getItem('sechData');
        
        return data?data.split('-'):[];
    },
    clearSearchDataItem:function(){
    	localStorage.setItem('sechData','');
    },
    unique : function(arr){
        for (var i = 0; i < arr.length; i++) {
            if (arr.indexOf(arr[i]) != i) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    },
    submitFun:function(){

    	var searchVal = this.searchBoxBtn.val();
       
    	if(searchVal!=''){
    		this.addSearchDataItem(searchVal);
           $('#mobilesearcheader').submit();
    	}else{

            var oDiv = $('.j-opacity-layer');
             timer = setTimeout(function(){
                $('.j-opacity-layer').animate({ opacity: 1,zIndex:999 },1000, 'ease-in');
            },500);
            
             timer = setTimeout(function(){
                $('.j-opacity-layer').animate({ opacity: 0, zIndex:-2},2000, 'ease-out');
            },3000);
            return false;
        }
       
  
    },
    listSubmit:function(evt){
       var target = $(evt.currentTarget);
       if(!target.find('.sr-hotrangelist').length){
            var targetVal = target.text();
       }else{
            var targetVal = target.find('.sr-hotrangelist').text();
       }
       this.searchBoxBtn.val(targetVal);
       this.addSearchDataItem(targetVal);
        $('#mobilesearcheader').submit();
    },
    display:function(state){
    	 var _this = this;
    	if(state==1){
    		_this.warp.hide();
    		_this.search.find('.home-header').addClass('showOff');
	     	_this.searchList.show();
	     	$('.hd-logo').hide();
	     	$('.hd-cancel').show();
	     }else{
	     	_this.warp.show();
         	_this.search.find('.home-header').removeClass('showOff');
         	_this.searchList.hide();
         	$('.hd-logo').show();
         	$('.hd-cancel').hide();
	     }
    	
    }    
};
$(function(){
	//搜索
	var searchMainCon = new SearchMain();
    //购物车订单数量 切换
    var cartOrderInterface= new CartOrderInterface();
    //recent viewed
    var recentViewed= new RcentViewed();
});

/**
 * daily deals 新增js by zhaojing
 */
Zepto(function($){
    var dailyDealHome={
        //  daily倒计时，记得conf里引入common文件夹中的DHMCountdown.js
        getEndTime:function(){
            var time=$("#J_dailyCountDown").data("countdown");
            if(time){
                return new Date(time).getTime();
            }
            var now=new Date();
            var year=now.getFullYear();
            var month=now.getMonth()+1;
            var date=now.getDate();
            var end=year+"/"+month+"/"+date+" 15:59:59";
            var nt=now.getTime();
            var et=new Date(end).getTime();
            if(nt<et){
                return end;
            }else{
                return et+24*60*60*1000;
            }
        },
        countdown:function(){
            var _self=this;
            DHM.Countdown({
                id:"#J_dailyCountDown"
                ,format:"hms"
                ,endTime:_self.getEndTime()
                ,circle:true
                ,fn:function(arry,dom){
                    var time=arry.join("");
                    $(dom).html(["<span>",time.charAt(0),"</span>\n",
                        "<span>",time.charAt(1),"</span>\n",
                        "<em>:</em>\n",
                        "<span>",time.charAt(2),"</span>\n",
                        "<span>",time.charAt(3),"</span>\n",
                        "<em>:</em>\n",
                        "<span>",time.charAt(4),"</span>\n",
                        "<span>",time.charAt(5),"</span>\n"
                    ].join(""));
                }
            });
        },
        //daily相关滑动门，需要flipsnap.js,conf中记得引入
        dailySlide:function(){
            var $slideBox,$ul,$li,$point,len,w,cur;
            $slideBox = $("#J_dailySlide");
            if(!$slideBox.get(0)) return;
            $ul=$slideBox.find("ul");
            if(!$ul.get(0)) return;
            $li=$ul.find("li");
            len = $li.length;
            if(!len) return;
            w=$li.eq(0).width();
            $ul.width(w*len);
            $point=$slideBox.find(".j-dailyPointer").find("span");
            var flip = Flipsnap($ul.get(0),{distance:w});
            flip.element.addEventListener('fspointmove', function(e) {
                cur= flip.currentPoint;
                $point.filter('.d-current').removeClass('d-current');
                $point.eq(cur).addClass('d-current');
            }, false);
        },
        init:function(){
            this.countdown();
            this.dailySlide();
        }
    };
    dailyDealHome.init();
});