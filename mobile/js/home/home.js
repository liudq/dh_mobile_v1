/**
 * Created by zhaojing on 2014/8/26.
 */
;Zepto(function($){
//    与一些组件相关的js
    function MyInit(){
        this.init();
    }

    MyInit.prototype={
        constructor:MyInit,
        //   站内信和购物车数量,登录状态
        logoAndLogin:function(){
            DHM.Init.logoSummary();
            DHM.Init.loginState();
        },

        countdown:function(){
            var _self=this;
            $.getJSON("/buyertime.do", function(data){
                var now = data.time*1;
                var day=new Date(now);
                var xq=day.getDay();
                var year=day.getFullYear();
                var month=day.getMonth()+1;
                var date=day.getDate();
                var end=new Date(year+"/"+month+"/"+date+" 15:59:59").getTime();
                var $cla=$("#J_dailyCountDown").parent();
                if(xq==6||xq==0){
                    if(!$cla.hasClass("dw-wd")){
                        $cla.addClass("dw-wd");
                    }
                }else if(xq==1){
                    if(now>end){
                        $cla.removeClass("dw-wd");
                    }else{
                        if(!$cla.hasClass("dw-wd")){
                            $cla.addClass("dw-wd");
                        }
                    }
                }else if(xq==5){
                    if(now<end){
                        $cla.removeClass("dw-wd");
                    }else{
                        if(!$cla.hasClass("dw-wd")){
                            $cla.addClass("dw-wd");
                        }
                    }
                }else{
                    $cla.removeClass("dw-wd");
                }
            });
            DHM.Countdown({
                id:"#J_dailyCountDown"
                ,format:"hms"
                ,circle:true
                ,fn:function(arry,dom){
                    $(dom).html(arry.join(":"));
                }
            });
        },

        sliding:function(){
            var $slidings = $(".j-sliding");
            var slen=$slidings.length;
            for(var i=0;i<slen;i++){
                var $sliding=$slidings.eq(i);
                var len=$sliding.find("li").length;
                var w=(81+8);
                DHMSliding({
                    element:$slidings[i],
                    distance:w*3,
                    totalWidth:w*len-8,
                    containerWidth:300,
                    speed:500
                });
            }
        },
        //延迟加载newA and bestS
        lazyLoadB:function(){
            $(window).scroll(function(){
                var slideHeight = $('.j-sliding').offset().top;
                var scrollHeight = $(window).scrollTop();
                var winHeight = $(window).height();
                secP = scrollHeight >= slideHeight - winHeight;
                if(secP){
                    var slideL = $('.j-sliding').find('li').find('a');
                    var imglen = slideL.find('img').length;
                    if(imglen>0) return;
                    for(var i=0;i<slideL.length;i++){
                        var imgUrl = slideL.eq(i).attr('data-src');
                        slideL.eq(i).append('<img src=' + imgUrl + '>')
                    }
                }
            });
        },
        // 轮播图
        slide:function(){
            var len = $("#J_bannerCon").find('ul').find('li').length,html=[];
            var dot = $(".dot");
            for(var i=0;i<len;i++){
                var w=100/len;
                html.push('<span style="width:'+w+'%"></span>');
            }
            dot.html(html.join(''));
            $('#J_bannerCon').swipeSlide({
                autoSwipe : true,
                continuousScroll:true,
                speed : 5000,
                transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
                callback : function(i){
                    $('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
                    var lazyA = $('#J_bannerCon').find('li');
                    var imgSrc = lazyA.eq(i+1).find('a').attr('data-src');
                    var imgAlt = lazyA.eq(i+1).find('a').attr('data-alt');
                    if(lazyA.eq(i+1).find('a').find('img').length>0) return;
                    else{
                        lazyA.eq(i+1).find('a').append('<img src=' + imgSrc + ' alt=' + imgAlt + '>');
                    }
                    if(lazyA.eq(0).find('a').find('img').length>0) return;
                    if(i=2){
                        lazyA.eq(0).find('a').append('<img src=' + lazyA.eq(0).find('a').attr('data-src') + '>');
                    }

                }
            });
        },
        //推荐item
        getRecommendItem: function(pageNum){
            var language = $('#J_language').html();
            //var language ='ES';
            //if(language == "EN"){
                var urlpath = '/mobileApiWeb/search-Product-getItems.do';
                $.ajax({
                    url: urlpath,
                    // url: '/api.php?jsApiUrl=' + 'http://m.es.dhgate.com/mobileApiWeb/search-Product-getItems.do',
                    type: 'GET',
                    cache: false,
                    dataType: 'json',
                    data:{
                        version : 3.3,
                        client:"wap",
                        pageSize:40,
                        type:2,
                        source:1,
                        pageNum:pageNum,
                        pageType: 'Home',
                        language:language
                    },
                    success: function(data){
                        $('.rp-items').show();
                        $('.rp-items').find('.tit').html(msgObj['Recommended_products']);
                        $('.rp-items').find('.show-more').html(msgObj['Show_more']);
                        if(!data) return;
                        var state = data.state;
                        if(state=="0x0001") {
                            $('.rp-items').hide();
                            return;
                        }
                        var len=data.data.resultList.length;
                        var $recommend=$("#J_recommendItems");
                        // 动态添加推荐商品
                        var tmpl = {
                            warp:'<li>{{image}}{{price}}</li>',
                            image:'<div class="list-img">{{promo}}{{pro}}</div>',
                            promo:'<span class={{icon}}>{{discountRate}}</span>',
                            pro:'<a  href={{url}}/{{seoName}}/{{itemCode}}.html#dhm150513-{{index}}-rec-hp><img src="http://css.dhresource.com/mobile/home/image/grey.png" class="lazy" data-original={{imgUrl}} alt={{altName}}></a>',
                            price:'<a href={{url}}/{{seoName}}/{{itemCode}}.html#dhm150513-{{index}}-rec-hp class="list-cont"><span class="price"><b class="mobile-deals"></b>{{currencyText}}{{discountPrice}}</span></a>'
                        }
                        if(language == 'RU'){
                            tmpl = {
                                warp:'<li>{{image}}{{price}}</li>',
                                image:'<div class="list-img">{{promo}}{{pro}}</div>',
                                promo:'<span class={{icon}}>{{discountRate}}</span>',
                                pro:'<a  href={{url}}/{{seoName}}/{{itemCode}}.html#dhm150513-{{index}}-rec-hp><img src="http://css.dhresource.com/mobile/home/image/grey.png" class="lazy" data-original={{imgUrl}} alt={{altName}}></a>',
                                price:'<a href={{url}}/{{seoName}}/{{itemCode}}.html#dhm150513-{{index}}-rec-hp class="list-cont"><span class="price"><b class="mobile-deals"></b>{{discountPrice}}{{currencyText}}</span></a>'
                            }
                        }
                        if(state=="0x0000"){
                            if(len>0){
                                for(var i=0;i<len;i++){
                                    var dd=data.data.resultList[i];
                                    var url="http://" + location.host + "/product";
                                    var html;
                                    var promo, pro, price,img,warps;
                                    if (dd.promoType=="0") { //折扣
                                        promo = tmpl.promo.replace(/\{\{icon\}\}/, 'off-icon').replace(/\{\{discountRate\}\}/,parseInt(dd.discountRate));
                                        price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.discountPrice);
                                    } else if(dd.promoType==='50' || dd.promoType==='70'){
                                        if(dd.discountRate!==''){
                                            promo = tmpl.promo.replace(/\{\{icon\}\}/, 'off-icon').replace(/\{\{discountRate\}\}/,parseInt(dd.discountRate));
                                            price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.discountPrice);  
                                        }else{
                                            promo = tmpl.promo.replace(/\<span class=\{\{icon\}\}\>\{\{discountRate\}\}\<\/span\>/ , '');
                                            price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.maxPrice);
                                        }
                                    }else if(dd.promoType==='60'||dd.promoType==='80'){
                                        promo = tmpl.promo.replace(/\{\{icon\}\}/, 'reduction-ico').replace(/\{\{discountRate\}\}/,parseInt(dd.discountRate));
                                        price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.discountPrice);
                                    }
                                    else if (dd.promoType=="10") { //直降
                                        promo = tmpl.promo.replace(/\{\{icon\}\}/, 'reduction-ico').replace(/\{\{discountRate\}\}/,parseInt(dd.discountRate));
                                        price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.discountPrice);
                                    } else {
                                        promo = tmpl.promo.replace(/\<span class=\{\{icon\}\}\>\{\{discountRate\}\}\<\/span\>/ , '');
                                        price = tmpl.price.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{currencyText\}\}/,data.data.currencyText).replace(/\{\{discountPrice\}\}/,dd.maxPrice);
                                    }
                                    pro = tmpl.pro.replace(/\{\{url\}\}/,url).replace(/\{\{seoName\}\}/,dd.seoName).replace(/\{\{itemCode\}\}/,dd.itemCode).replace(/\{\{index\}\}/,i+1).replace(/\{\{imgUrl\}\}/,dd.imgUrl).replace(/\{\{altName\}\}/,dd.seoName);
                                    img = tmpl.image.replace(/\{\{promo\}\}/, promo).replace(/\{\{pro\}\}/, pro);
                                    warps = tmpl.warp.replace(/\{\{image\}\}/,img).replace(/\{\{price\}\}/,price);
                                    //移动专享价添加标识
                                    if (!(dd.promoType==='50' || dd.promoType==='60' || dd.promoType==='70' || dd.promoType==='80')) {
                                        warps = warps.replace(/\<b class="mobile\-deals"\>\<\/b\>/, '');
                                    }
                                    $recommend.append(warps);
                                    if(pageNum>1){
                                        $('.show-more').hide();
                                    }
                                    $("img.lazy").lazyload();
                                }
                                //deal with top two images, show them.
                                var listImg = $('.list-img');
                                for(var i=0;i<2;i++){
                                    var lazyImg = listImg.eq(i).find('a').find('img');
                                    var imgUrl = lazyImg.attr('data-original');
                                    lazyImg.attr('src',imgUrl);
                                }
                                for(var i=20;i<len;i++){
                                    var lia = $recommend.find('li').eq(i);
                                    lia.css('display','none');
                                }
                            }
                        }
                    }
                });
            //}


        },
        init:function(){
            var self=this;
            self.logoAndLogin();
            self.countdown();
            self.slide();
            self.sliding();
            self.lazyLoadB();
            self.getRecommendItem(1);
        }
    };

    var myInit = new MyInit();
    $('.show-more').click(function(){
        var recom =  $("#J_recommendItems").find("li");
        for(var i=20;i<recom.length;i++){
            recom.css('display','block');
            var lia = recom.eq(i);
            lia.find('a img').removeClass('lazy').attr('src',lia.find('a img').attr('data-original')).removeAttr('data-original');
        }
        $(this).hide();
    });

//  最近查看
    function RecentViewed(opt){
        this.opts=$.extend({
            preId:"#J_search",
            searchSugUrl:"/getrecentkeyandcid.do"
        },opt);
        this.util=DHM.Util;
        this.init();
    }
    RecentViewed.prototype = {
        constructor:RecentViewed,
        getRecentData:function(){
            var self=this;
            self.util.request({
                url:self.opts.searchSugUrl,
                type:"GET",
                fn:self.recentDataRes,//成功后的方法
                scope:self
            });
        },
        recentDataRes:function(data,scope,param){
            var self=scope,_data=data.data;
            var $search=self.util.domExist(self.opts.preId);
            if(!_data||!$search) return;
            var arr=['<div class="hd-recent-view j-recentView">'];
            var len=_data.length;
            if(len>3){len=3};
            for(var i=0;i<len;i++){
                arr.push('<a href='+_data[i].url+'#whp >'+_data[i].title+'</a>');
            }
            arr.push('</div>');
            $(arr.join("")).insertAfter($search);
        },
        init: function(){
            this.getRecentData();
        }
    };
    new RecentViewed();
    $("#J_language").click(function(){
        $("#J_shadow").show();
        $("#J_languageCont").show();
    });
    $(".j-languageCancel").click(function(){
        $("#J_shadow").hide();
        $("#J_languageCont").hide();
    });
    $("#J_languageCont").find("li").click(function(){
        if($(this).hasClass("tit")){
            return;
        }
        $(this).addClass("active").siblings().removeClass("active");
    });

});