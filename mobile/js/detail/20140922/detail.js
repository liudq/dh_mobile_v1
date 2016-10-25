
/* cart order message login  */

var hashManager = {
	defaultHash:window.location.hash.replace("#", ""),
    init : function(){
        $(window).bind('hashchange', $.proxy(this.change, this));
        return this;
    },
    set : function(value){
        window.location.hash = value;
    },
    change : function(){

        var hash = window.location.hash.replace('#', '');
            this.callBack && this.callBack(hash);

    }
};

var Slider = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.detBanner = $('.' + this.options.detBanner);
    this.Init();
};
Slider.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp',
            detBanner:'j-detBanner'
        };
        $.extend(this.options, options || {});
    },
    Init: function(){
        var _this = this;
        this.setHtml();
        this.slideEvent();
        this.warp.delegate('.j-detBanner li','click',function(){
            _this.clickEvent();
        });
        $('#J_bannerback').bind('click',function(){
            _this.backEvent();
        });
        $('#J_bannerback').removeAttr("href");
        $('#J_bannerback').next().removeAttr("href");
        //this.backEvent();
    },
    backEvent:function(){
           
    	window.history.go(-1);
    	return false;
         //hashManager.set('');   
    },
    clickEvent:function(){
       
        hashManager.set('viewpic');
    },
    state:function(n){
        if(n==1){
            var html = $('.det-bannercon');
            this.warp.hide();
            $('.j-detBanNum').hide();
            $('#J_carBuy').hide();
            $('#detaisaleoff').hide();
            $('#J_silderCon').show();
            $('.j-PageNumChange').show();
            $('.j-favato').hide();
            $('body').addClass('fullscreen');
            $('body').append(html);
        }else{
            var html = $('.det-bannercon');
            $('#J_silderCon').hide();
            $('.j-favato').show();
            $('#J_carBuy').show();
            $('body').removeClass('fullscreen');
            $('.j-PageNumChange').hide();
            $('.j-detBanNum').show();
            $('#detaisaleoff').show();
            this.warp.show();
            this.warp.find('.j-banerArea').append(html);
        }
    },
    slideEvent:function(){
        var oBann = this.detBanner.find('ul');
        var bannerList = $('.j-detBanNum');
        var aLi = oBann.find('li');
        var len = aLi.length;
        var totalSpan = '';
        var timer = null;
        var iNum = -1;
        var leftBtn = $('#detLeftBtn'), rightBtn = $('#detRightBtn'),currPage = $('.j-currentPage');
        currPage.append('<b>1</b> / '+len);
        for(var i=0;i<aLi.length;i++){
            var oSpan = '<span></span>';
            totalSpan+=oSpan;
        }
        bannerList.append(totalSpan);
        var aSpan = bannerList.find('span');
        aSpan.eq(0).addClass('current');
        totalWidth = (parseInt(aLi.eq(0).width()) * len);
        oBann.css('width', totalWidth + 'px');
        var flipsnap = Flipsnap(oBann.get(0), {
            distance: '300'
        });
       
        flipsnap.element.addEventListener('fspointmove', function(evt) {
            var currentpoint = flipsnap.currentPoint;
            currPage.find('b').html(currentpoint + 1);
            aSpan.filter('.current').removeClass('current');
            aSpan.eq(flipsnap.currentPoint).addClass('current');
             if (!flipsnap.hasPrev()) {
                leftBtn.addClass('slibtnleftlast');
            }
            else {
                leftBtn.removeClass('slibtnleftlast');
                
            }
            if (!flipsnap.hasNext()) {
                rightBtn.addClass('slibtnrightlast');
            }
            else {
                rightBtn.removeClass('slibtnrightlast');
            }
        }, false);
       
        leftBtn.click(function(){
            flipsnap.toPrev();
        });
        rightBtn.click(function(){
            flipsnap.toNext();
        });
    },
    setHtml:function(){
        var list = SL.$CONFIGIMG['list'];
        var aLi = '';
        $.each(list[0].url, function(index){
            var oLi = "<li><img src=" + list[0].url[index] + " alt=" + list[0].alt[index] + " /></li>";
            aLi += oLi;
        });
        var oUl = "<ul>" + aLi + "</ul>";
        this.detBanner.find('div.popup-loading').remove();
        this.detBanner.append(oUl);            
    }
};

//分享连接地址
function loadPage(site, pageTitle, pageDescription) {
    if(site=="mail"){
        var a = "mailto:?subject=Check out what I found on DHgate!&body=Hi! I found this on DHgate and thought you might like it! Check it out now:"+document.URL;
        pageTitle.href=a;
        return;
    }
    var rawURL = window.location.href;
    var rawCanonicalURL = $('#canonicalUrl').attr('href');
    if(rawCanonicalURL == undefined){
        if(rawURL.indexOf("#") > 0){
            rawURL = rawURL.substring(0,rawURL.indexOf("#"));
        }
    }else{
        rawURL = rawCanonicalURL;
    }
    var media = "";
    if(site == "pinterest"){
        media = $('#firstBImage >span >img').attr("src");
    }
    var currentURL = encodeURIComponent(rawURL);
    var title = encodeURIComponent(pageTitle);
    var bodytext = encodeURIComponent(pageDescription);

    if(media != "" && media != undefined){
        media = encodeURIComponent(media);
    }
    var newURL;
    var go = true;
    switch (site) {
        case "del.icio.us":
            newURL = "https://delicious" + ".com/post?title="  + title+ "&url=" + currentURL;
            break;
        case "digg":
            newURL = "http://digg" + ".com/submit?phase=2&" + "url=" + currentURL
                + "&title=" + title + "&bodytext=" + bodytext
                + "&topic=tech_deals";
            break;
        case "reddit":
            newURL = "http://reddit" + ".com/submit?" + "url=" + currentURL
                + "&title=" + title;
            break;
        case "furl":
            newURL = "http://www.furl" + ".net/savedialog.jsp?" + "t=" + title
                + "&u=" + currentURL;
            break;
        case "rawsugar":
            newURL = "http://www.rawsugar" + ".com/home/extensiontagit/?turl="
                + currentURL + "&tttl=" + title;
            break;
        case "twitter":
            newURL = "https://mobile.twitter" + ".com/home?status=" + title + "+-+" + currentURL;
            break;
        case "stumbleupon":
            newURL = "http://www.stumbleupon" + ".com/submit?url=" + currentURL
                + "&title=" + title;
            break;
        case "blogmarks":
            break;
        case "facebook":
            newURL = "http://m.facebook" + ".com/sharer.php?" + "&u="
                + currentURL + "&t=" + title;
            break;
        case "technorati":
            newURL = "http://technorati" + ".com/faves?sub=favthis&add="
                + currentURL;
            break;
        case "spurl":
            newURL = "http://www.spurl" + ".net/spurl.php?v=3" + "&title=" + title
                + "&url=" + currentURL;
            break;
        case "simpy":
            newURL = "http://www.simpy" + ".com/simpy/LinkAdd.do?title=" + title
                + "&href=" + currentURL;
            break;
        case "ask":
            break;
        case "google":
            newURL = "http://www.google"
                + ".com/bookmarks/mark?op=edit&output=popup" + "&bkmk="
                + currentURL + "&title=" + title;
            break;
        case "netscape":
            newURL = "http://www.netscape" + ".com/submit/?U=" + currentURL + "&T="
                + title + "&C=" + bodytext;
            break;
        case "slashdot":
            newURL = "http://slashdot" + ".org/bookmark.pl?url=" + rawURL
                + "&title=" + title;
            break;
        case "backflip":
            newURL = "http://www.backflip.com/add_page_pop.ihtml?" + "title="
                + title + "&url=" + currentURL;
            break;
        case "bluedot":
            newURL = "http://bluedot" + ".us/Authoring.aspx?" + "u=" + currentURL;
            + "&t=" + title;
            break;
        case "kaboodle":
            newURL = "http://www.kaboodle"
                + ".com/za/selectpage?p_pop=false&pa=url" + "&u=" + currentURL;
            break;

        case "squidoo":
            newURL = "http://www.squidoo" + ".com/lensmaster/bookmark?"
                + currentURL;
            break;

        case "bluedot":
            newURL = "http://blinkbits" + ".com/bookmarklets/save.php?"
                + "v=1&source_url=" + currentURL + "&title=" + title;
            break;

        case "blinkList":
            newURL = "http://blinkbits" + ".com/bookmarklets/save.php?"
                + "v=1&source_url=" + currentURL + "&title=" + title;
            break;
        case "browser":
            bookmarksite(pageTitle, rawURL);
            go = false;
            break;
        case "pinterest":
            newURL = "http://pinterest" + ".com/pin/create/button/?url=" + currentURL + "&media=" + media + "&description=" + title ;
            break;
        case "vk":
            newURL = "http://vk" + ".com/share.php?url=" + rawURL;
            break;
        case "linkedin":
            newURL = "http://www.linkedin" + ".com/cws/share?url=" + currentURL + "&title=" + title;
            break;
    }
    if (go == true) {
        window.open(newURL, "bookmarkWindow");
    }
}

/* SeoWord  */
var SeoWord = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.toggleBtn = $('.' + this.options.toggleBtn);
    this.seoWordLayer = $('.' + this.options.seoWordLayer);
    this.Init();
};
SeoWord.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp',
            toggleBtn:'j-toggleBtn',
            seoWordLayer:'j-seoWordLayer'
        };
        $.extend(this.options, options || {});
    },
    Init: function(){
        var _this = this;
        this.toggleBtn.click(function(){
            if($(this).hasClass('narrUp')){
                $(this).removeClass('narrUp');
                _this.seoWordLayer.hide();
            }else{
                $(this).addClass('narrUp');
                _this.seoWordLayer.show();
            }
        });
       
    }
};

/* maylike and rencent history */
var youMayLike = function(options){
    this.SetOptions(options);
    if (!$('#' + this.options.recommond)[0]) {
        return;
    }
    this.recommond = $('#' + this.options.recommond);
    this.maylikeCon = $('.' + this.options.maylikeCon);
    this.mayLike = $('#' + this.options.mayLike);
    this.Init();
};
youMayLike.prototype = {
    SetOptions: function(options){
        this.options = {
            recommond: 'recommond',
            maylikeCon: 'ls-maylikecon',
            mayLike:'J_mayLike'
        };
        $.extend(this.options, options || {});
    },
    Init: function(){
        var _this = this;
        this.getDate();
       
    },
    getDate: function(){
        var _this = this;
        this.getDate.currActive = $('.ls-tuijiantitle span.active');
        var data = "" ;
        var ptype = $("#ptype").val();
        if("l" == ptype){
            var key = $("#prokeys").val();
            var cid = $("#cids").val();
            data = "pp=l&key="+key+"&cid="+cid;
        }else if("d" == ptype){
            var icode = $("#itemcode").val();
            data = "pp=d&itemcode="+icode;
        }
       
       var urlpath = "/promoproduct.do?"+data;
        $.ajax({
            url: urlpath,
            type: 'GET',
            cache: true,
            dataType: 'html',
            success: function(data){
                _this.mayLike.find('.isloading').remove();
                _this.mayLike.append(data);
               _this.eventBind(0);
            }
        });
        
    },
    eventBind: function(index){
        var _this = this;
        var item = this.maylikeCon.find('ul').eq(index).find('li');
        var totalWidth = (parseInt(item.eq(0).width())+10)*(item.length);
        this.maylikeCon.find('ul').eq(index).css("width",(totalWidth)+'px');
        var flipsnap= Flipsnap(_this.maylikeCon.find('ul').eq(index).get(0), {
            distance: 135
        });
        flipsnap.element.addEventListener('fspointmove', function(ev) {
            var clientWidth = document.documentElement.clientWidth,
            width = $(window).width()-15,
            len = $(flipsnap.element).find('li').length,
            maxLen = len*flipsnap.distance,
            dm=width-(maxLen-flipsnap.currentPoint*flipsnap.distance);
            if(dm>=0){
                var x =maxLen<width?0:width-maxLen;
                var i = maxLen<width?0:len;
                flipsnap._setX(x);
                flipsnap.currentPoint = i;
            
            }
                            
        }, false);
        
    }
};

//促销活动倒计时接口
var countDownInterface = function(){
    this.getServerTime();
};

//获取服务器时间
countDownInterface.prototype.getServerTime = function(){
    var _this = this;
    $.getJSON("http://www.dhgate.com/common/buyertime.do?callback=?", function(data){
        _this.serverTime = data.time * 1;
    });
};

//设置剩余时间
countDownInterface.prototype.setRemainingTime = function(serverTime, related, attr){
    var relatedValue, startTime, endTime;
    
    for (var i = 0, len = related.length; i < len; i++) {
        _related = related[i];
        $related = $(related[i]);
        
        relatedValue = $related.attr(attr).split('|');
        startTime = new Date(relatedValue[1]).getTime();
        endTime = new Date(relatedValue[2]).getTime();
        
        _related.discount = relatedValue[0];
            _related.cutting = relatedValue[3];
        if (serverTime < endTime) {
            //距离活动结束剩余时间
            _related.active = Math.floor((endTime - serverTime) / 1000);
        }
        else 
            if (serverTime < startTime) {
                //距离活动开始剩余时间
                _related.ready = Math.floor((startTime - serverTime) / 1000);
            }
            else 
                if (serverTime > endTime) {
                    //活动已结束
                    _related.end = true;
                }
    }
};

var DH_CountDownInterface = new countDownInterface();

function salesPromotionCountDown(tag, attr){
    if (salesPromotionCountDown.timer) {
        clearTimeout(salesPromotionCountDown.timer);
    }
    
    var serverTime, related;
    serverTime = DH_CountDownInterface.serverTime;
    
    if (serverTime) {
        related = $(tag + '[' + attr + ']');
        
        if (!related[0]) {
            return;
        }
        
        DH_CountDownInterface.setRemainingTime(serverTime, related, attr);
        
        for (var i = 0, len = related.length; i < len; i++) {
            salesPromotionCountDown.run(related[i]);
        }
        
        salesPromotionCountDown.sum = 0;
        salesPromotionCountDown.checkTime();
        
        if (DH_CountDownInterface.serverTime) {
            delete DH_CountDownInterface.serverTime;
            return;
        }
    }
    
    salesPromotionCountDown.timer = setTimeout(function(){
        salesPromotionCountDown(tag, attr);
    }, 300);
}

salesPromotionCountDown.run = function(ele){
    var curTimeout;
    ele.discount = ele.discount;
    ele.cutting = ele.cutting;
    if (ele.active) {
        ele.curTimeout = salesPromotionCountDown.createSingleTimeout(ele);
        ele.curTimeout();
    }
    else 
        if (ele.ready) {
        //...
        }
        else 
            if (ele.end) {
            //...
            }
};
salesPromotionCountDown.createSingleTimeout = function(ele){
    return function(){
        if (ele.timer) {
            clearTimeout(ele.timer);
        }
        
        var $ele = $(ele), timeString, day, hour, minute, second,saleoff;
        var cutting = $('.saleoff').attr('cutting');
        
        day = Math.floor(ele.active / 86400);
        hour = Math.floor((ele.active / 3600)) % 24;
        minute = Math.floor((ele.active / 60)) % 60;
        second = ele.active % 60;
        
        if (parseInt(day, 10) > 0) {
            timeString = '<span class="leftTime">' + day + 'd ' + hour + 'h</span>';
        }
        else 
            if (parseInt(hour, 10) > 0) {
                timeString = '<span class="leftTime">' + hour + 'h ' + minute + 'm</span>';
            }
            else 
                if (parseInt(minute, 10) > 0) {
                    timeString = '<span class="leftTime">' + minute + 'm ' + second + 's</span>';
                }
                else 
                    if (parseInt(second, 10) >= 0) {
                        timeString = '<span class="leftTime">' + second + 's</span>';
                    }
                    else {
                        //倒计时结束
                        return;
                    }
        ele.active--;
        if(ele.cutting){
            
            $ele.html('<span class="saleoffprice"><span class="left-discount">$' + ele.discount + ' off</span></span> <span class="saleoffprice"> only left : ' + timeString + '</span>');
        }else{
            $ele.html('<span class="saleoffprice"><span class="left-discount">' + ele.discount + '% off</span></span> <span class="saleoffprice"> only left : ' + timeString + '</span>');
        }
        ele.timer = setTimeout(function(){
            ele.curTimeout();
        }, 1000);
    };
};

salesPromotionCountDown.checkTime = function(){
    if (salesPromotionCountDown.sum == 180) {
        DH_CountDownInterface.getServerTime();
        salesPromotionCountDown('span', 'discountCountDown');
    }
    
    if (salesPromotionCountDown.time1) {
        clearTimeout(salesPromotionCountDown.time1);
    }
    
    salesPromotionCountDown.time1 = setTimeout(function(){
        salesPromotionCountDown.sum++;
        salesPromotionCountDown.checkTime();
    }, 1000);
};
/* SeoWord  */
var ItemDescri = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.tabTitle = $('#' + this.options.tabTitle);
    this.infcon = $('#' + this.options.infcon);
    this.init();
};
ItemDescri.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp',
            tabTitle:'J_inftitile',
            infcon:'J_infcon'
        };
        $.extend(this.options, options || {});
    },
    init: function(){
        var _this = this;
         this.warp.delegate('#J_inftitile a','click',function(evt){
            _this.tab(evt);
         });
       
    },
    tab:function(evt){
        var target = $(evt.currentTarget),
            index =target.index();
            if(index==1){
            	_gaq.push(['_trackEvent', 'detail', ' description']);
            }
            if(target.hasClass('active')){return;}
           target.addClass('active').siblings('a').removeClass('active');
           this.tabTitle.find('em').eq(index).addClass('d-block').siblings('em').removeClass('d-block');
           this.infcon.find('.tabcon').eq(index).show().siblings().hide();
          // if(index==1){
           // var ScollTop = $(window).scrollTop();
           //  this.infcon.find('.tabcon').eq(index).attr('scrollTop',ScollTop);
          // }
            
    }
};
/* SeoWord  */
var GetCoupon = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.couponBtn = $('#' + this.options.couponBtn);
    this.coupcon = $('#' + this.options.coupcon);
    this.init();
};
GetCoupon.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp',
            couponBtn:'J_getCoupon',
            coupcon:'J_couponCon'
        };
        $.extend(this.options, options || {});
    },
    init: function(){
        var _this = this;
         this.warp.delegate('#J_getCoupon a','click',function(evt){
            _this.clickEvent(evt);
         });
        this.coupcon.delegate('.j-couponBack','click',function(evt){
            _this.backEvent(evt);
         });
    },
    clickEvent:function(){
        
         hashManager.set('Viewcoupcon');
    },
    backEvent : function(){
    	window.history.go(-1);
    	return false;
         //hashManager.set('');
        
    },
    state:function(n){
        var _this = this;
        if(n==1){
            this.state.ScollTop = $(window).scrollTop();
            this.coupcon.show();
            $('#J_carBuy').hide();
           
		   this.coupcon.animate({left: '99.99%',translateX : '-99.99%',translate3d: '0,0,0'},300, 'ease-out', function(){
						
						window.scrollTo(0, 0);
						
						_this.warp.addClass('none');
						_this.coupcon.css('position','absolute');
						
						
				   }
			   );
        }else{
			
			this.warp.removeClass('none');
			$('#J_carBuy').show();
            this.coupcon.css('position','fixed');
			this.coupcon.animate({translateX: "100%",translate3d: '0,0,0'},300,'ease-out',function(){
					
                     window.scrollTo(0, _this.state.ScollTop);
                   
				 
			});

        }
       
    }
};

/* selectcountry */
var SelectCountry = function(options){
    this.setOptions(options);
   
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.chooseMethod = $('#' + this.options.chooseMethod);
    this.shipMentcon = $('#' + this.options.shipMentcon);
     this.selectBtn = $('#' + this.options.selectBtn);
     this.shipmentId = $('#' + this.options.shipmentId);
    this.init();
};
SelectCountry.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp',
            selectBtn: 'selectBtn',
            shipMentcon:'shipMentcon',
            shipmentId:'shipmentId',
            chooseMethod: 'chooseMethod'
        };

	    this.elBanerArea = $('.j-banerArea');
		this.elCarBuy = $('#J_carBuy');

	
        $.extend(this.options, options || {});
    },
    init: function(){
        var _this = this;
        this.warp.delegate('#shipMbtn','click',function(evt){
            _this.clickEvent(evt);
         });
        this.shipMentcon.delegate('.j-shipBack','click',function(evt){
            _this.backEvent(evt);
         });
        this.shipMentcon.delegate(this.shipmentId,'click',function(){
            _this.shipmSubmit();
        });
       
        this.initLoad();
        this.selectBtn.change(function(){
            var thisBtn = this;
            _this.Change(thisBtn);
        });
    },
    clickEvent:function(){
        
        
         hashManager.set('Viewcshipment');
    },
    backEvent : function(){
		window.history.go(-1);
		return false;
         // hashManager.set('');
    },
    state:function(n){
         var _this = this;
        if(n==1){
            this.state.ScollTop = $(window).scrollTop();
            this.shipMentcon.show();
			 
			   _this.elCarBuy.hide();
			    this.shipMentcon.animate({translateX: "-100%",translate3d: '0,0,0'},300, 'ease-out', function(){
						_this.elBanerArea.hide();
						
						
							window.scrollTo(0, 0);
							_this.warp.addClass('none');
							_this.shipMentcon.css('position','absolute');
						
						
				   }
			   );
			 
		   
		   
            
        }else{
			 
			_this.elBanerArea.show();
			this.warp.removeClass('none');
            this.shipMentcon.css('position','fixed');
			this.shipMentcon.animate({translateX: "100%",translate3d: '0,0,0'},300,'ease-out',function(){
					_this.elCarBuy.show();
				 window.scrollTo(0, _this.state.ScollTop);

			});
			
            
        }
       
    },
    initLoad: function(){
        var _this = this;
        var selVal = this.selectBtn.val();
        var index2 = this.selectBtn.get(0).selectedIndex;
        this.chooseMethod.delegate('.chosubcon li', 'click', function(evt){
            var target = $(evt.currentTarget);
            target.addClass('choactive').siblings().removeClass('choactive');   
        });
    },
    Change: function(thisBtn){
        var _this = this;
        var index = $(thisBtn).get(0).selectedIndex;
        var selVal = $(thisBtn).val();
        var itemcode = $("#itemcode").val();
        this.chooseMethod.find('div.chosubcon').html('<div class="popup-loading"></div>');
        var countryid = $("#selectBtn").val();
        
        var quantity = $("#quantity").val();
        var selectedSkuVal = $("#selectedSkuVal").val();
        $.ajax({
            url: "/priceShipment.do",
            data: {
                countryid: selVal,
                itemcode:itemcode,
                quantity:quantity,
                skuid:selectedSkuVal
            },
            type: 'GET',
            cache: true,
            dataType: 'html',
            success: function(data){
                _this.chooseMethod.find('div.chosubcon').find('div.popup-loading').remove();
                _this.chooseMethod.find('div.chosubcon').html('');
                _this.chooseMethod.find('div.chosubcon').append(data);
            }
        });
    },
    shipmSubmit:function(){
        this.backEvent();
        var shippingM = $('#shippingM'),chooseMethod = $('#chooseMethod'),chooLi = chooseMethod.find('li'),selectBtn = $('#selectBtn');
        var oSpan='';
        var oPrice='';
        chooLi.each(function(index){
            if($(this).hasClass('choactive')){
                oSpan = $(this).find('span').eq(0);
                oPrice = $(this).find('span').eq(1).html();
            }
        });
        var iNum = oPrice.indexOf('$')+1;
        var priceNum = parseFloat(oPrice.substring(iNum));
        var oShipWay = $('#shippingcostid');
        if(priceNum==0){
            oShipWay.html('');
            oShipWay.append('<em>Free shipping</em>');
        }else{
            oShipWay.html('');
            oShipWay.append(oPrice);
        }
        shippingM.html('');
        var index = selectBtn.get(0).selectedIndex;
        var country = selectBtn.children('option').eq(index).html();
        if(oSpan.length>0){
            shippingM.html(country+' Via '+oSpan.html());
            if($("#shippingMErr").length>0){
                $("#shippingMErr").css({display:"none"});
            }
            this.state(0);
        }
    }    
};
/* SeoWord  */
var AttrSelect = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.selectAttr = $('#' + this.options.selectAttr);
    this.selectColor = $('#' + this.options.selectColor);
    this.init();
};
AttrSelect.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp',
            selectAttr:'J_selectAttr',
            selectColor:'J_selectColor'
        };
        $.extend(this.options, options || {});
    },
    init: function(){
        var _this = this;
         this.warp.delegate('#J_selectAttr a','click',function(evt){
        	 $("#isturntoeditprop").val("1");
        	 var _disabled = $("#quantity").attr("disabled");
        	 if(_disabled=="disabled" && $("#isproductcansale").attr("defaultskucansale")!="0"){
        		 $('#canadd').addClass('detail-soldout');
                 $('#buyitnow').addClass('detail-soldout');
        	 }
        	 _this.clickEvent(evt);
         });
        this.selectColor.delegate('.j-attr-back','click',function(evt){
        	_gaq.push(['_trackEvent', 'detailoption', 'back']);
            _this.backEvent(evt);
         });
    },
    clickEvent:function(){
         hashManager.set('ViewAttr');
    },
    backEvent : function(){
	   window.history.go(-1);
		return false;
        // hashManager.set('');
         
    },
    state:function(n){
         var _this = this;
         
        if(n==1){
            this.state.ScollTop =$(window).scrollTop();
           
				this.selectColor.show();
				
			    this.selectColor.animate({left: '99.99%',translateX : '-99.99%',translate3d: '0,0,0'},300, 'ease-out', function(){
						
						window.scrollTo(0, 0);
						
						_this.warp.addClass('none');
						_this.selectColor.css('position','absolute');
						
						
				   }
			   );
           

        }else{
        	var _disabled = $("#quantity").attr("disabled");
        	if(_disabled != "disabled"){
                var attrcontent_1 = "";
                var attrcontent_2 = "";
                for(i = 1;i <= _buyAttrListSize;i++){
                    if($('#listBuy_'+i).length>0){
                        var colorSelect = $('#listBuy_'+i).find('li.color-selected').html();
                        attrcontent_1 += "<span>["+colorSelect+"]</span>";
                    }
                }
                if($('#customSize').length>0){
                    var sizeSelect = $('#customSize').find('li.color-selected').html();
                    attrcontent_1 += "<span>["+sizeSelect+"]</span>";
                }
                //if($("#iscontainwholesale").length>0 && $("#iscontainwholesale").val()=="1"){
                var unitVal = $(".de-unit").text();
                var lastwords = unitVal.substring(unitVal.length-1 , unitVal.length);
                var selquantity = $("#quantity").val();
                if(lastwords != "s" && selquantity > 1){
                    unitVal = unitVal.trim() + "s";
                }
                attrcontent_2 += "<span>["+selquantity +" "+unitVal+"]</span>";
                //}
                if($("#seloptionid").length>0 && attrcontent_1.length>0){
                    $("#seloptionid").html("Selection:"+attrcontent_1);
                }
                if($("#selquantityid").length>0 && attrcontent_2.length>0){
                    if(attrcontent_1.length == 0){
                        attrcontent_2 = "Selection:"+attrcontent_2;
                    }
                    $("#selquantityid").html(attrcontent_2);
                }
                //修改运费
                chgProperty();
                //修改运费结束
            }else{
                $("#isturntoeditprop").val("0");
        var _seloptionid = $("#seloptionid");
                var _selquantityid = $("#selquantityid");
                if(_seloptionid.length>0){
                    _seloptionid.html(_seloptionid.attr("label"));
                }
                if(_selquantityid.length>0){
                    _selquantityid.html(_selquantityid.attr("label"));
                }
                if($("#isproductcansale").attr("defaultskucansale")!="0"){
                $('#canadd').removeClass('detail-soldout');
                $('#buyitnow').removeClass('detail-soldout');
            }
        }
           	this.warp.removeClass('none');
            
            this.selectColor.css('position','fixed');
    		this.selectColor.animate({translateX: "100%",translate3d: '0,0,0'},300,'ease-out',function(){

    			window.scrollTo(0, _this.state.ScollTop);
                
            
                _this.selectColor.css('display','none');
    		});
        }
       
    }
};
/* SeoWord  */
var DescriptionUse = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.warp)[0]) {
        return;
    }
    this.warp = $('#' + this.options.warp);
    this.learnMoreBtn = $('#' + this.options.learnMoreBtn);
    this.descon = $('#' + this.options.descon);
    this.imgLayer = $('#' + this.options.imgLayer);
    this.init();
};
DescriptionUse.prototype = {
    setOptions: function(options){
        this.options = {
            warp:'warp',
            learnMoreBtn:'J_learnMore',
            imgLayer:'J_imgLayer',
            descon:'J_descon'
        };
        $.extend(this.options, options || {});
    },
    init: function(){
        var _this = this;
         this.warp.delegate('#J_learnMore a','click',function(){
            _this.clickMore();
         });
        
         this.warp.delegate('#J_descon img','click',function(evt){
            _this.clickImg(evt);
            
         });
         $('body').delegate('#J_imgLayer img','click',function(evt){
                _this.backEvent();
         });
         
        
        
           
    },
    clickImg:function(evt){
       
        var target = $(evt.currentTarget);
         
        hashManager.set('Viewimg');
        var img = this.VIEWIMG ="<img src="+target.attr('src')+" />";
            
          
    },
    state:function(n){
          var _this = this;
        if(n==1){
            this.state.ScollTop = $(window).scrollTop();
            this.warp.hide();
            $('body').addClass('fullscreen');
            this.imgLayer.show();
            $('#J_carBuy').hide();

            this.VIEWIMG && this.imgLayer.append(this.VIEWIMG);
           
        }else{
             this.imgLayer.html('');
            $('body').removeClass('fullscreen');
            this.warp.show();
            this.imgLayer.hide();
             $('#J_carBuy').show();
             //window.location.hash = '';
            setTimeout(function(){
             window.scrollTo(0, _this.state.ScollTop);
            }, 100);
            
        }
    },
    clickMore:function(){
        var _this = this;
        var iHeight = this.descon.attr('iHeight');
        var iChildHeight = $('.j-des-child').height();
         if(this.learnMoreBtn.hasClass('hideUp')){
             
           $('.j-des-child').css({'height':'960px','overflow':'hidden'});
            this.learnMoreBtn.find('a').html('Learn more<var></var>');

            this.learnMoreBtn.removeClass('hideUp');
            var scrollTop = $('#J_descon').attr('scrolltop');
            setTimeout(function(){
             window.scrollTo(0, scrollTop);
            }, 100);
           
        }else{
            var scrollT = $(window).scrollTop();
            $('#J_descon').attr('scrolltop',scrollT);
            $('.j-des-child').css({'height':''});
            this.learnMoreBtn.find('a').html('Hide up<var></var>');
            this.learnMoreBtn.addClass('hideUp');
        }
        
    },
    backEvent : function(){
      
       // hashManager.set('');
       window.history.go(-1);
		return false;
         
       
    }
};
function pageBack() {
	_gaq.push(['_trackEvent', 'detail', ' back']);//新的track
	if(document.referrer){
		var lasturl = $.trim(document.referrer).toLowerCase();
		var _boo = (lasturl.indexOf("http://m.dhgate.com") !=-1) || (lasturl.indexOf("m.dhgate.com")!=-1);
		if(_boo){
			window.history.go(-1);
		}else{
			window.location.href = $("#turntosearchid").val();
		}
	}else{
		window.location.href = $("#turntosearchid").val();
	}
}
function InitProperty() {
    if (_buyAttrListSize > 0) {
        if(_buyAttrCustomListSize > 0){
            DH_Product_Properties_Color_Object.colorList.push('customSize');
            DH_Product_Properties_Color_Object.colorListHiddenInput.push('hiddenBuycustomSize');    
        }
        for ( var i = 1; i <= _buyAttrListSize; i++ ) {
                DH_Product_Properties_Color_Object.colorList.push('listBuy_'+i);
                DH_Product_Properties_Color_Object.colorListHiddenInput.push('hiddenBuy_'+i);
            }
        for (var n = 0; n < DH_Product_Properties_Color_Object.colorList.length; n++) {
            if (!document.getElementById(DH_Product_Properties_Color_Object.colorList[n])) {
                DH_Product_Properties_Color_Object.colorList.splice(n, 1);
                DH_Product_Properties_Color_Object.colorListHiddenInput.splice(n, 1);
            }
        }
    }
}
/* colorSelect */
var colorSelect = function( options ){
    this.SetOptions( options );
    
    this.colorListItems = this.options.colorList;
    this.colorListHiddenInput = this.options.colorListHiddenInput;
//  console.log(this.colorListItems);
//  console.log(this.colorListHiddenInput);
    if ( this.colorListItems.length == 0 ) {
        return;
    }
    
    this.Init();
    
};

colorSelect.prototype = {
    SetOptions: function( options ) {
        this.options = {
            colorList: [],
            colorListHiddenInput: []
        };
        $.extend( this.options, options || {} );
    },
    Init: function() {
        this.colorListItemsArray = [], this.colorListHiddenInputArray = [], this.skuList = [];
        
        for ( var i = 0; i < this.colorListItems.length; i++ ) {

            if ( !$('#' + this.colorListItems[i])[0] ) {
                continue;
            }
            
            this.colorListItemsArray.push( $('#' + this.colorListItems[i] + ' > li'));
            this.colorListHiddenInputArray.push( $('#' + this.colorListHiddenInput[i]) );
            
            this.ClickItems( i );
            
            
            var skuObjectList = $("input[name='skuinfo']").map(function(index,item){
                return {skuId:$(item).attr("skuId"), attrId:$(item).attr("attrid"), attrValId: $(item).attr("attrValId"), inventory: $(item).attr("inventory")};
            });
            
            var mapResult = {};
            skuObjectList.each(function(index,item){
                if(mapResult[item["skuId"]]){
                    mapResult[item["skuId"]][item["attrId"]] = item["attrValId"];
                }
                else{
                    mapResult[item["skuId"]] = {"skuId": item["skuId"], "inventory": item["inventory"]};
                    mapResult[item["skuId"]][item["attrId"]] = item["attrValId"];
                }
            });
            var ArrayResult = $([]);
            $.each(mapResult,function(key,val){ArrayResult.push(val);});
            this.skuList = ArrayResult;
//          console.log(this.skuList);
        }
        
    },
    CheckAttrSlected: function(){
        var _this = this,buyAttrValIds = "";
        var _buyAttrList = DH_Product_Properties_Color_Object.colorListHiddenInput;
        var indexList = $([]);
        for ( var i = 0; i < _buyAttrList.length; i++ ) {
            var _buyHiddenId = _buyAttrList[i];
            if(_buyHiddenId.indexOf("hiddenBuy_") >=0){
                var _buyAttrShelfId = "listBuy_" + _buyHiddenId.split("_")[1];
                var _buyAttrShelfList = $("#" +  _buyAttrShelfId + " >li");
                if(_buyAttrShelfList.length > 0){
                    var attrList = $([]);
                    for(var j = 0; j < _buyAttrShelfList.length; j ++){
                            if($(_buyAttrShelfList[j]).children("i").html() == "selected"){
                                attrList.push($(_buyAttrShelfList[j]).attr("attrId"));
                                attrList.push($(_buyAttrShelfList[j]).attr("attrValId"));
                            }
                    }
                    if(attrList.length > 0){
                        indexList.push(attrList);
                    }
                }
            }else{
                var customList = $("#customSize >li");
                if(customList.length > 0){
                    var coustomAttrList = $([]);
                    var _customAttrId = $("#customSize").attr("vhidden");
                    for(var j=0 ;j < customList.length; j ++){
                        if($(customList[j]).children("i").html() == "selected"){
                            coustomAttrList.push($(customList[j]).attr("attrId"));
                            coustomAttrList.push($(customList[j]).attr("attrValId"));
                        }
                    }
                    if(coustomAttrList.length > 0){
                        indexList.push(coustomAttrList);
                    }
                }
            }
        }
        return indexList;
    },
    
    ChangePriceRangeAndInventory: function(){
    	if($("#isproductcansale").val()=="0"){
    		return;
    	}
        var _this = this;
        var skuTempList = _this.skuList;
        
        if(_buyAttrListSize > 0){
            var selectedList = _this.CheckAttrSlected();
            selectedList.each(function(index){
                skuTempList = _this.skuFilter.call(skuTempList,selectedList[index][0] , selectedList[index][1]);
            });
            var _priceList = $("li[name=priceRangeList]");
            var selectedSku = skuTempList;
            var selectedInventory = selectedSku[0]["inventory"];
            var skuid = selectedSku[0]['skuId'] ;
            var aliIndex = [];
            var arrVal = [];
            if(skuid != "" && skuid != undefined){
                //更换价格区间
                _priceList.each(function(idx){
                    if($(_priceList[idx]).attr("vHidden") != skuid){
                        $(this).css({display:'none',visibility: 'hidden'});
                    }else{
                        $(this).css({display:'block', visibility: 'visible' });
                        var maxVal = $(this).find('var.maxvalue').html();
                        var minVal = $(this).find('var.minvalue').html();
                        if( maxVal != null ){
                            arrVal.push(parseInt(maxVal));
                        }else{
                            arrVal.push(parseInt(minVal));
                        }
                        aliIndex.push($(this).index());
                    }
                });
                var initVal = $('#quantity').attr('init-value');
                //验证库存
                var inventoryQtyNum = $('#inventoryQtyNum');
                
                if(inventoryQtyNum.length <= 0){
                    $("#selectedSkuVal").val(skuid);
                }else if(parseInt(selectedInventory) >= parseInt(initVal) ){
                    $("#inventoryQtyNum").html(selectedInventory);
                    $("#tipinv").html(selectedInventory);
                    $("#selectedSkuVal").val(skuid);
                }else{
                    $("#inventoryQtyNum").html(0);
                    $("#tipinv").html(0);
                    $("#selectedSkuVal").val("");
                    //ui提供样式，输入框不可用
                    //ui提供样式，购物车按钮不可用
                }
                var quatiy = $('#quantity').val();
                $('#quantity').removeClass('rederrortip');
                var inv = $("#inventoryQtyNum").html();
                var _cur_maxordersize = $('#_cur_maxordersize');
                var initVal = $('#quantity').attr('init-value');
                if(inv != null){
                    if(parseInt(inv) == 0 || parseInt(initVal) > parseInt(inv) ){
                        $('#qtynote').css({display:"block"});
                        $('#quantity').attr("disabled","disabled");
                        $('#quantity').val("");
                        $('#canadd').addClass('detail-soldout');
                        $('#buyitnow').addClass('detail-soldout');
                        //$('#cannotadd').css({display:"block"});
                        $('#maxOrderError').css({display:"none"});
                    }else if(parseInt(quatiy) > parseInt(inv)){
                        $("#maxOrderError").html("");
                        $('#maxOrderError').css({display:"block"});
                        $('#quantity').removeAttr("disabled");
                        $('#canadd').removeClass('detail-soldout');
                        $('#buyitnow').removeClass('detail-soldout');
                        //$('#cannotadd').css({display:"none"});
                        $('#maxOrderError').html("The quantity can't exceed the maximum stock (Max. Stock =" +inv + ")");
                        $('#quantity').val(inv);
                    }else if(parseInt(quatiy) < parseInt(initVal)){
                        $("#maxOrderError").html("");
                        $('#maxOrderError').css({display:"block"});
                        $('#quantity').removeAttr("disabled");
                        $('#canadd').removeClass('detail-soldout');
                        $('#buyitnow').removeClass('detail-soldout');
                        //$('#cannotadd').css({display:"none"});
                        $('#maxOrderError').html("The quantity can't exceed the minimum order (Min. Order =" +initVal + ")");
                        $('#quantity').val(initVal);
                    }else{
                        $('#canadd').removeClass('detail-soldout');
                        $('#buyitnow').removeClass('detail-soldout');
                        //$('#cannotadd').css({display:"none"});
                        $('#qtynote').css({display:"none"});
                        $('#quantity').removeAttr("disabled");
                        $('#maxOrderError').css({display:"none"});
                        if(quatiy == '' || quatiy < minVal){
                            $('#quantity').val(initVal);
                        }
                    }
                }else if(_cur_maxordersize != null){
                    var maxsize = _cur_maxordersize.val();
                    if(parseInt(quatiy) > parseInt(maxsize)){
                        $("#maxOrderError").html("");
                        $('#maxOrderError').css({display:"block"});
                        $('#maxOrderError').html("The quantity can't exceed the maximum stock (Max. Stock =" +maxsize + ")");
                        $('#quantity').val(maxsize);
                    }else if(parseInt(quatiy) < parseInt(initVal)){
                        $("#maxOrderError").html("");
                        $('#maxOrderError').css({display:"block"});
                        $('#maxOrderError').html("The quantity can't exceed the minimum order (Min. Order =" +initVal + ")");
                        $('#quantity').val(initVal);
                    }else{
                        $('#canadd').removeClass('detail-soldout');
                        $('#buyitnow').removeClass('detail-soldout');
//                        $('#cannotadd').css({display:"none"});
                        $('#qtynote').css({display:"none"});
                        $('#quantity').removeAttr("disabled");
                        $('#maxOrderError').css({display:"none"});
                    }
                }
                var quatiynow = $('#quantity').val(); 
                var nowshowprice = '';//新版页面
                var _indexselectedli = 0;
                for(var j=0;j<arrVal.length;j++){
                	_indexselectedli = aliIndex[j];
                    if(parseInt(quatiynow)<=arrVal[j]){
                        _priceList.eq(_indexselectedli).addClass('active').siblings().removeClass('active');
                        break;
                    }else{
                        _priceList.eq(_indexselectedli).addClass('active').siblings().removeClass('active');
                    }
                }
                var minVal = parseInt(_priceList.eq(aliIndex[0]).find('var.minvalue').html());
                if(quatiynow==''){
                    //$('#quantity').val(minVal);
                    _priceList.eq(aliIndex[0]).addClass('active').siblings().removeClass('active');
                    _indexselectedli = aliIndex[0];
                }
                //修改当前属性产品的展示价格
                var selectedli = _priceList.eq(_indexselectedli).find("span");
                if(selectedli.length==2){
                	nowshowprice = $(selectedli[1]).html();
                }else if(selectedli.length==3){
                	nowshowprice = $(selectedli[2]).html();
                }
                if(nowshowprice.length>0){
                	$("div .current-price>span").html(nowshowprice);
                }
                
                if(quatiynow < minVal){
                    $('#quantity').val(minVal);
                }
                var sList = $("input[name='skuinfo']");
                var attrValNames = "";
                sList.each(function(index){
                    if($(sList[index]).attr("skuId") == skuid){
                        selectedList.each(function(ind){
                            if(selectedList[ind][1] ==$(sList[index]).attr("attrValId") ){
                                if(attrValNames == ""){
                                    attrValNames = $(sList[index]).attr("attrValName");
                                }else{
                                    attrValNames = attrValNames + "-"+$(sList[index]).attr("attrValName");
                                }
                                var skustatus = $(sList[index]).attr("skuStatus");
                                if(skustatus == 0){
                                    $('#qtynote').css({display:"block"});
                                    $('#quantity').attr("disabled","disabled");
                                    $('#quantity').val("");
                                    $('#canadd').addClass('detail-soldout');
                                    $('#buyitnow').addClass('detail-soldout');
//                                    $('#cannotadd').css({display:"block"});
                                    $('#maxOrderError').css({display:"none"});
                                }
                            }
                        });
                    }
                });
                var attrValNameList = attrValNames.split("-");
                var selectedAttrNames = "";//已选中的产品属性
                selectedList.each(function(index){
                    if(selectedAttrNames == ""){
                        selectedAttrNames = attrValNameList[index];
                    }else{
                        selectedAttrNames = selectedAttrNames + " , " + attrValNameList[index];
                    }
                });
                
            }
            
            //去除选择属性提示
            $('#selectError').css({display:"none"});
            $('#soldoutError').css({display:"none"});
        }
    },
    
    ClickItems: function( _index ) {
        var _this = this;
        
        this.ClickItems.__index = [];
        
        for ( var i = 0; i < this.colorListItemsArray[_index].length; i++ ) {
            (function(){
                var index = i;
                $(_this.colorListItemsArray[_index][index]).click(function(){
                    if($(this).attr("class") == "color-fail"){
                        return
                    }
                    
                    _this.colorListHiddenInputArray[_index].val($(this).attr('vHidden'));
                    $(_this.colorListItemsArray[_index]).removeClass('color-selected').children('i').remove();
                    $(this).addClass('color-selected').append('<i>selected</i>');
                    _this.ChangePriceRangeAndInventory();
                    _this.ClickItems.__index[_index] = index;
                });
            })();
        }
        
    },
    //过滤sku方法
    skuFilter : function (attrId,attrValueId){
        var $this = this;
         var result = $.map($this,function(item,index){
            if(item[attrId] && item[attrId] == attrValueId ){
                return item;
            }
        });
        
        return result;
    }
};
/* only number */
function onlyNumber(inputBox){
    var inputBox = $("." + inputBox);
    var itv;
    var defalutVal = parseInt(inputBox.val());
    var oUl = $('#whoseLi'),aLi = oUl.find('li'),arr2 = [],aLiIndex2 = [];
    $('.d-decrease').click(function(){
    	var _quantity = $("#quantity");
    	if(_quantity.length>0 && _quantity.attr("disabled")=="disabled"){
    		return;
    	}
        var inpVal = parseInt(_quantity.val());
        var iNum = inpVal-1;
        if(iNum==defalutVal){
        	_quantity.val(defalutVal)
        }else{
        	_quantity.val(iNum);
        }
        
        inputBox.trigger('blur');
    });
    $('.d-increase').click(function(){
    	var _quantity = $("#quantity");
    	if(_quantity.length>0 && _quantity.attr("disabled")=="disabled"){
    		return;
    	}
        var inpVal = parseInt($('#quantity').val());
        var iNum = inpVal+1;
       
        _quantity.val(iNum);
        
        
        inputBox.trigger('blur');
    });
    inputBox.focus(function(){
        //$('#quantity').get(0).focus();
        var Val = $(this).val();
         var _this = this;
        $(this).val('');
        setTimeout(function(){$(_this).val(Val);}, 0);

    });
    
    inputBox.blur(function(){
        var nowVal = $('#quantity').val();
        clearTimeout(itv);
        itv = setTimeout($.proxy(function(){
            var minorder = $(this).val().trim();
            var re = /\D/;
            var iNum = minorder.substring(0).search(re);
            if(minorder==''){
                $(this).addClass('rederrortip');
                $(this).val('');
            }else{
                $(this).removeClass('rederrortip');
                if(minorder <= defalutVal){
                    $(this).val(defalutVal);
                }
            }
            if (iNum != -1) {

                var result = minorder.substring(0, iNum);
                var re = /^[0-9]+.?[0-9]*$/;  
                if(!re.test(result)){
                    $(this).val(defalutVal);
                }else{
                    $(this).val(result);
                }
                
            }
            /*if (nowVal > 1) {
               // if(minorder > 1){
                   // var lastwords = unitVal.substring(unitVal.length-1 , unitVal.length);
                    //if(lastwords != "s" && $(this).val() > 1){
                       // unit.html(unitVal.trim() + "s");
                   // }
                //}
            }else {
                $(this).val(defalutVal);
               // unit.html(unitVal);
            }*/
            if(nowVal <= 1){
                $(this).val(defalutVal);
            }
            var oUl = $('#whoseLi'),aLi = oUl.find('li'),arr = [],specialVal='',speciaIndex='',aLiIndex = [];
            aLi.each(function(i){       
                if($(this).css('visibility')=='visible'){
                    var varVal = $(this).find('var.maxvalue').html();
                    var index = $(this).index();
                    if(varVal==null){
                        var min = $(this).find('var.minvalue').html();
                        varVal = min;
                    }
                    var maxVal = parseInt(varVal);
                    
                    arr.push(maxVal);
                    aLiIndex.push(index);   
                    
                }
            });
            
            var inv = $("#inventoryQtyNum").html();
            var initVal = $('#quantity').attr('init-value');
            var _cur_maxordersize = $('#_cur_maxordersize');
            if(inv != null){
                if(nowVal <= 0){
                    $("#maxOrderError").html("");
                    $('#maxOrderError').css({display:"block"});
                    $('#maxOrderError').html("The quantity can't exceed the minimum order (Min. Order =" +initVal + ")");
                    $('#quantity').val(initVal);
                }else if(parseInt(nowVal) > parseInt(inv)){
                    $("#maxOrderError").html("");
                    $('#maxOrderError').css({display:"block"});
                    $('#maxOrderError').html("The quantity can't exceed the maximum stock (Max. Stock =" +inv + ")");
                    $('#quantity').val(inv);
                }else if(parseInt(nowVal) < parseInt(initVal)){
                    $("#maxOrderError").html("");
                    $('#maxOrderError').css({display:"block"});
                    $('#maxOrderError').html("The quantity can't exceed the minimum order (Min. Order =" +initVal + ")");
                    $('#quantity').val(initVal);
                }else{
                    $('#maxOrderError').css({display:"none"});
                }
            }else if(_cur_maxordersize != null){
                var maxsize = _cur_maxordersize.val();
                if(nowVal <= 0){
                    $("#maxOrderError").html("");
                    $('#maxOrderError').css({display:"block"});
                    $('#maxOrderError').html("The quantity can't exceed the minimum order (Min. Order =" +initVal + ")");
                    $('#quantity').val(initVal);
                }else if(parseInt(nowVal) > parseInt(maxsize)){
                    $("#maxOrderError").html("");
                    $('#maxOrderError').css({display:"block"});
                    $('#maxOrderError').html("The quantity can't exceed the maximum stock (Max. Stock =" +maxsize + ")");
                    $('#quantity').val(maxsize);
                }else if(parseInt(nowVal) < parseInt(initVal)){
                    $("#maxOrderError").html("");
                    $('#maxOrderError').css({display:"block"});
                    $('#maxOrderError').html("The quantity can't exceed the minimum order (Min. Order =" +initVal + ")");
                    $('#quantity').val(initVal);
                }else{
                    $('#maxOrderError').css({display:"none"});
                }
            }
            var minVal = parseInt(aLi.eq(aLiIndex[0]).find('var.minvalue').html());
            var thisVal = $(this).val();
            var nowshowprice = '';//新版页面
            var _indexselectedli = 0;
            for(var j=0;j<arr.length;j++){
            	_indexselectedli = aLiIndex[j];
                if(parseInt(thisVal)<=arr[j]){
                    aLi.eq(_indexselectedli).addClass('active').siblings().removeClass('active');
                    break;
                }
                if(parseInt(thisVal)>=arr[j]){
                    aLi.eq(_indexselectedli).addClass('active').siblings().removeClass('active');
                }
            }
            if(thisVal==''){
                aLi.eq(aLiIndex[0]).addClass('active').siblings().removeClass('active');
                _indexselectedli = aLiIndex[0];
            }
            var selectedli = aLi.eq(_indexselectedli).find("span");
            if(selectedli.length==2){
            	nowshowprice = $(selectedli[1]).html();
            }else if(selectedli.length==3){
            	nowshowprice = $(selectedli[2]).html();
            }
            if(nowshowprice.length>0){
            	$("div .current-price>span").html(nowshowprice);
            }
            if(parseInt(thisVal)<=minVal){
                $(this).val(minVal);
            }

            
            
        }, this), 100);
    });
}

/* addto fav */
var AddtoFav = function( options ) {
    this.SetOptions( options );
    this.warp = $('#' + this.options.warp);
    this.addtofavBtn = $('#' + this.options.addtofavBtn);
    this.timer = null;
    this.isIE6 = ( $.browser.msie && $.browser.version == '6.0' );
    this.Init();
};
AddtoFav.prototype = {
    SetOptions: function( options ) {
        this.options = {
            warp: 'warp',
            addtofavBtn:'j-favato'
        };
        $.extend( this.options, options || {} );
    },
    Init: function() {
        var _this = this;
         this.warp.delegate('.j-favato','click',function(evt){
            _this.clickFav(evt);
         });
       
    },
    clickFav: function(evt) {
        var _this = this;
        var proid = $("#proid").val();
		//var urlpath = "/addfav.do?proid=" + proid+"&seoitemurl=" + seoitemurl;
		var urlpath = "/addfav.do?proid="+proid+"&fromnew=true";
		$.ajax({
            url: urlpath,
            type: 'GET',
            cache: true,
            dataType: 'json',
            async: false,
            success: function(data){
            	if("0" == data.resultabc){
            		var seoitemurl = $("#seoitemurl").attr("href");
            		window.location.href = "http://m.dhgate.com/login.do?returnURL="+seoitemurl;
            	}else{
            		var target = $(evt.currentTarget);
    		        if(!target.hasClass('storeOver')){
    		             target.addClass('storeOver');
    		        }else{
    		             target.removeClass('storeOver');
    		        }
            	}
            }
        });
		_gaq.push(['_trackEvent', 'detail', ' favorite']);
    }
};

function addToCard(that){
	if($("#canadd").hasClass("detail-soldout")){
		return;
	}
	//如果运不到该国家
	if($('#shippingMErr').length>0 && $("#shippingMErr").css("display")!="none"){
		_selectCty = $("#selectBtn");
		var noshiptocountry = _selectCty.children('option').eq(_selectCty.get(0).selectedIndex).html();
		noshiptocountry = "This item cannot be shipped to "+noshiptocountry;
    	$('#opacityLayer').html(noshiptocountry);
        $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
        var timer = null;
        timer = setTimeout(function(){
            $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
        },3000);
    	return;
    }
	var _J_selectColor = $("#J_selectColor");//二级页面
	var _J_selectAttr_a = $("#J_selectAttr a");//转向二级页面的触发属性对象
	var isturntoeditprop = $("#isturntoeditprop").val();
	//第一次转向属性编辑页
    if(isturntoeditprop=="0" || isturntoeditprop==""){
    	if(_J_selectColor.css("display")=='none'){
    		_J_selectAttr_a.trigger('click');
    		return;
    	}
    }
    /*if(!$('#J_selectAttr').find('span').length){
        $('#opacityLayer').html('Please select color,size,Wholesale price.');
        $('#opacityLayer').animate({ opacity: 1 ,zIndex:99},500, 'ease-out');
       
        var timer = null;
        timer = setTimeout(function(){
            $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
        },3000);
        return;
    }*/
    var quantity = $("#quantity").val();
    var opt = $("#opiontype").val();
    var itemcode = $("#itemcode").val();
    var proid =$("#proid").val();
    var skuid = $("#selectedSkuVal").val();
    /*var xv = $("#mbh").val();
    if(xv != null && xv != "undifined" && xv =="0"){
    	if(_J_selectColor.css("display")=='none'){
    		_J_selectAttr_a.trigger('click');
    	}
        $("#mbherror").css({display : 'block'});
        return;
    }*/
    var bc = $('#hiddenBuycustomSize');
    if(bc != null){
        var bcval = bc.val();
        if(bcval == ""){
        	if(_J_selectColor.css("display")=='none'){_J_selectAttr_a.trigger('click');}
            $('#selectError').css({display:"block"});
            return;
        }
    }
    var invnum = $('#inventoryQtyNum');
    if(invnum != null ){
        var n = invnum.html();
        if( parseInt(n) == 0){
        	if(_J_selectColor.css("display")=='none'){_J_selectAttr_a.trigger('click');}
            $('#soldoutError').css({display:"block"});
            $('#maxOrderError').css({display:"none"});
            $('#qtynote').css({display:"none"});
            return;
        }
    }
    //属性是否选择
    if($('#customSize').length > 0){
        var att = $('#customSize').attr("initattr");
        var arrFaber = [];
        if($('#customSize>li').length > 0 ){
            $('#customSize>li').each(function(j){
                if($(this).find('i').length){
                    arrFaber.push(1);
                }
            });
            if(arrFaber.length==0){
            	if(_J_selectColor.css("display")=='none'){_J_selectAttr_a.trigger('click');}
                $('#selectError').html("");
                $('#selectError').css({display:'block'});
                $('#selectError').html("Please select \""+ att +"\".");
                $('#maxOrderError').css({display:"none"});
                return;
            }
        }
    }
    if(quantity == '' || quantity < 0 || isNaN(quantity)){
    	if(_J_selectColor.css("display")=='none'){_J_selectAttr_a.trigger('click');}
        $("#quantity").addClass("rederrortip");
        return;
    }
    var data = "quantity=" + quantity + "&itemcode=" + itemcode + "&proid=" + proid;
    data += "&skuid="+skuid;
    var skuMd5 = $("#skuId_"+skuid).attr("skuMd5");
    if(skuMd5 != undefined){
        data += "&skumd5="+skuMd5;
    }
    $.ajax({
        url: '/addCart.do',
        type: 'post',
        data: data,
        async: false,
        error: function(){
        },
        success: function(){
        	initsummarynew();
            //$("#hasaddcard").show();
        	 $('#opacityLayer').html('1 item added to cart');
             $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
            
             var timer = null;
             timer = setTimeout(function(){
                 $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
             },3000);
             return;
        }
      });
    if(_J_selectColor.css("display")=='none'){
    	_gaq.push(['_trackEvent', 'detail','AddtoCart', $("#itemcode").val()]);
    }else{
    	_gaq.push(['_trackEvent', 'detailoption','AddtoCart', $("#itemcode").val()]);
    }
}
/**
 * 立即购买
 *
 */
function buynow(){
	if($("#buyitnow").hasClass("detail-soldout")){
		return;
	}
	//如果运不到该国家
	if($('#shippingMErr').length>0 && $("#shippingMErr").css("display")!="none"){
		_selectCty = $("#selectBtn");
		var noshiptocountry = _selectCty.children('option').eq(_selectCty.get(0).selectedIndex).html();
		noshiptocountry = "This item cannot be shipped to "+noshiptocountry;
    	$('#opacityLayer').html(noshiptocountry);
        $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
        var timer = null;
        timer = setTimeout(function(){
            $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
        },3000);
    	return;
    }
	//添加tracking
	if($("#J_selectColor").css("display")=='none'){
    	_gaq.push(['_trackEvent', 'detail','buyitnow', $("#itemcode").val()]);
    }else{
    	_gaq.push(['_trackEvent', 'detailoption','buyitnow', $("#itemcode").val()]);
    }
	var _J_selectColor = $("#J_selectColor");//二级页面
	var _J_selectAttr_a = $("#J_selectAttr a");//转向二级页面的触发属性对象
	var isturntoeditprop = $("#isturntoeditprop").val();
	//第一次转向属性编辑页
    if(isturntoeditprop=="0" || isturntoeditprop==""){
    	if(_J_selectColor.css("display")=='none'){
    		_J_selectAttr_a.trigger('click');
    		return;
    	}
    }
	var quantity = $("#quantity").val();
	var opt = $("#opiontype").val();
	var itemcode = $("#itemcode").val();
	var proid =$("#proid").val();
	var skuid = $("#selectedSkuVal").val();
	/*var xv = $("#mbh").val();
	if(xv != null && xv != "undifined" && xv =="0"){
		$("#mbherror").css({display : 'block'});
		return null;
	}*/
	var bc = $('#hiddenBuycustomSize');
	if(bc != null){
		var bcval = bc.val();
		if(bcval == ""){
			if(_J_selectColor.css("display")=='none'){_J_selectAttr_a.trigger('click');}
			$('#selectError').css({display:"block"});
			return null;
		}
	}
	var invnum = $('#inventoryQtyNum');
	if(invnum != null ){
		var n = invnum.html();
		if( parseInt(n) == 0){
			if(_J_selectColor.css("display")=='none'){_J_selectAttr_a.trigger('click');}
			$('#soldoutError').css({display:"block"});
			$('#maxOrderError').css({display:"none"});
			$('#qtynote').css({display:"none"});
			return null;
		}
	}
	//属性是否选择
	if($('#customSize').length > 0){
		var att = $('#customSize').attr("initattr");
		var arrFaber = [];
		if($('#customSize li').length > 0 ){
			$('#customSize li').each(function(j){
				if($(this).find('i').length){
					arrFaber.push(1);
				}
			});
			if(arrFaber.length==0){
				if(_J_selectColor.css("display")=='none'){_J_selectAttr_a.trigger('click');}
				$('#selectError').html("");
				$('#selectError').css({display:'block'});
				$('#selectError').html("Please select \""+ att +"\".");
				$('#maxOrderError').css({display:"none"});
				return;
			}
		}
	}
	if(quantity == '' || quantity < 0 || isNaN(quantity)){
		$("#quantity").addClass("rederrortip");
		return ;
	}else{
		var data = "quantity=" + quantity + "&itemcode=" + itemcode + "&proid=" + proid;
		if(opt != null ){
			data +="&opiontype="+opt;
		}
		/*
		//购买属性
		var sizevalue = "";
		var abc = document.getElementsByName("buyattrval");
		for(var i=0;i<abc.length;i++){
			var ax = abc[i].value;
			sizevalue += ax +"-";
		}
		sizevalue = sizevalue.substring(0,sizevalue.length-1);
		$("#matrixbuykeys").attr("value",sizevalue);
		
		if(sizevalue != null && sizevalue != ""){
			data += "&matrixbuykeys="+sizevalue;
		}
		//销售属性
		var colorsize = "";
		var abc = document.getElementsByName("saleattrval");
		for(var i=0;i<abc.length;i++){
			var ax = abc[i].value;
			colorsize += ax +"-";
		}
		colorsize = colorsize.substring(0,colorsize.length-1);
		
		$("#matrixsalekeys").attr("value",sizevalue);
		
		if(colorsize != null && colorsize != ""){
			data += "&matrixsalekeys=" + colorsize;
		}
		*/
		data += "&skuid="+skuid;
		var skuMd5 = $("#skuId_"+skuid).attr("skuMd5");
		if(skuMd5 != undefined){
			data += "&skumd5="+skuMd5;
		}
		$.ajax({
		    url: '/buynow.do',
		    type: 'GET',
		    data: data,
		    dataType:'json',
		    async: true,
		    error: function(){
		    },
		    success: function(data){
		    	var form = $("#detailabc")[0];
		    	form.action = data.urlabc;
		    	form.submit();
		    }
		  });
	}
}
/**
 * 修改相关属性(sku、quantity、country)的时候
 */
function chgProperty(){
	var minSaleSize = $("#minsalesize").val(); 
	var minOrderSize = $("#minordersize").val(); 
	var catePubId = $("#catepubid").val(); 
	var isProm = $("#isprominfo").val(); 
	var countryid = $("#selectBtn").val();
	var quantity = $("#quantity").val();
	var proid = $("#proid").val();
	var itemcode = $("#itemcode").val();
	var selectedSku = $("#selectedSkuVal").val();
	var shiptype = $("#chooseMethod").find('div.chosubcon>ul>li.choactive>span').eq(0).html();
	var _chooseMethod = $("#chooseMethod");
	_chooseMethod.find('div.chosubcon').html('<div class="popup-loading"></div>');
	$.ajax({
        url: "/modifyFreightBychgProperty.do",
        data: {
        	minSaleSize: minSaleSize,
        	minOrderSize:minOrderSize,
        	countryid:countryid,
        	quantity:quantity,
        	proid:proid,
        	itemcode:itemcode,
        	skuid:selectedSku,
        	catePubId:catePubId,
        	isProm:isProm,
        	shiptype:shiptype
		},
        type: 'GET',
        cache: true,
        dataType: 'html',
        success: function(data){
        	if(data == null || data == undefined){
        		return;
        	}
        	_chooseMethod.find('div.chosubcon').find('div.popup-loading').remove();
        	_chooseMethod.find('div.chosubcon').html('');
        	_chooseMethod.find('div.chosubcon').append(data); 
        	var oPrice = _chooseMethod.find('div.chosubcon>ul>li.choactive>span').eq(1).html();
        	if(oPrice == undefined || oPrice == null || oPrice==''){
        		return;
        	}
        	var iNum = oPrice.indexOf('$')+1;
        	var priceNum = parseFloat($.trim(oPrice.substring(iNum)));
        	var oShipWay = $('#shippingcostid');
        	if(priceNum==0){
	        	oShipWay.html('');
	        	oShipWay.append('<em>Free shipping</em>');
        	}else{
	        	oShipWay.html('');
	        	oShipWay.append(oPrice);
        	}
        	var _selectBtn = $("#selectBtn");
        	var country = _selectBtn.children('option').eq(_selectBtn.get(0).selectedIndex).html();
        	$("#shippingM").html(country+' Via '+shiptype);
        }
    });
}
$(function(){
    //dealy deals 倒计时
    DHM.Countdown({
        id:".j-cartLT"
        ,format:"dhms"
    });

	//搜索
	var imgSlider = new Slider();
    //seo word
    var seoword = new SeoWord();
    var mayLike = new youMayLike();
    var itemde = new ItemDescri();
    var getcoupon = new GetCoupon();
    var selectCountry = new SelectCountry();
    var attrSelect = new AttrSelect();
    var descuse = new DescriptionUse();
    //促销活动倒计时
    salesPromotionCountDown('span', 'discountCountDown');
     InitProperty();
    var DH_Color_Select = new colorSelect( DH_Product_Properties_Color_Object );
    //only number
    onlyNumber('d-num');
    /* addto fav */
    var addtoFav = new AddtoFav();

    hashManager.init().callBack = function(hash){
        switch(hash){
            case 'viewpic' : 
                imgSlider.state(1);
                this.currentHash = 'viewpic';
                break;
            case 'Viewcoupcon' : 
                getcoupon.state(1);
                this.currentHash = 'Viewcoupcon';
                break;
            case 'Viewcshipment' : 
                selectCountry.state(1);
                this.currentHash = 'Viewcshipment';
                break;
            case 'ViewAttr' : 
                attrSelect.state(1);
                this.currentHash = 'ViewAttr';
                break;
            case 'Viewimg' : 
                descuse.state(1);
                this.currentHash = 'Viewimg';
                break;
            case this.defaultHash : 
                this.currentHash === 'viewpic' && imgSlider.state(0);
                this.currentHash === 'Viewcoupcon' && getcoupon.state(0);
                this.currentHash === 'Viewcshipment' && selectCountry.state(0);
                this.currentHash === 'ViewAttr' && attrSelect.state(0);
                this.currentHash === 'Viewimg' && descuse.state(0);
                break;
        }
    };
});