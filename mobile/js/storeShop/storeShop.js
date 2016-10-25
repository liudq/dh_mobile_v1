/**
 * Created by liudongqing on 2015/10/25.
 */
Zepto(function($) {

    var supplierId = '';
    var ntalkUrl="";
    var ntalkBuyerId = '';
    var ntalkSellerId ='';
    var storeId = window.location.pathname.match(/\d+/g)[0];
    function storeShop(){
        var self = this;
        self.init();
    };

    function validateStore(arr){
        var iAllContentWarp = $('#j-all-content'),
            flag = true;

        if (arr.length < 1) {
            iAllContentWarp.html('<div style="margin-left: 80px;margin-bottom:80px;display:inline-block;">There is no items in this store.</div>');
            flag = false;
        }
        return flag;
    }

    storeShop.prototype = {
        constructor:storeShop,
        //可滑动类目
        mySwip:function(){
            var mySwiper = new Swiper('.swiper-container',{
                paginationClickable: true,
                slidesPerView: 'auto'
            });
        },
        //获取店铺基本信息
        getStoreInfo:function(){
            var self = this;
            var apiSet = {
                storeUrl:'http://m.dhgate.com/mobileApiWeb/store-Store-getStoreInfo.do'
                //storeUrl:'storeInfo.do'
            };
            $.ajax({
                url:apiSet.storeUrl,
                //  url: '/api.php?jsApiUrl=' + apiSet.storeUrl,
                data:{
                 client:"wap",
                 supplierseq:storeId
                 },
                type:"GET",
                cache: true,
                dataType:'json',
                success: function(data) {
                    if (data && data.state == "0x0000") {
                        if (data.data !== "") {
                            if (!validateStore(!data.data.ntalkerDto&&[])) {
                                return;
                            }
                            var sellerDataJson = data.data.sellerDto,
                                suppliername = sellerDataJson.suppliername,//卖家名称
                                contactpersondomainname = sellerDataJson.contactpersondomainname,//期望显示名称
                                levelId = sellerDataJson.levelId,//级别
                                showpercentum = sellerDataJson.showpercentum,//好评百分比
                                cofirmorderAccumulated = sellerDataJson.cofirmorderAccumulated,//交易总量
                                year = sellerDataJson.year,//seller建设年份，默认是1，新加的
                                sponsor = sellerDataJson.sponsor,//是否是收费会员 A:金色，钻石礼包；B：蓝色，白金礼包；C：白色，黄金礼包，新加的
                                systemuserid = sellerDataJson.systemuserid;

                            var ntalkDataJson = data.data.ntalkerDto,
                                isonLine = ntalkDataJson.isonLine;

                            ntalkSellerId = ntalkDataJson.ntalker_sellerid;
                            ntalkBuyerId = ntalkDataJson.ntalker_buyerid;
                            ntalkUrl = ntalkDataJson.ntalker_js_url;
                            //全局变量 supplierId
                            supplierId = sellerDataJson.supplierid;
                            //获取头部seo
                            var seoStr=['<title>ChinaWholesaleStore from ' + suppliername + ' | m.dhgate.com</title><meta name="keywords" content="' + suppliername + ', wholesale store, best china' + suppliername + '"/><meta name="description" content="' + suppliername + ' online store on m.dhgate.com, the reliable store with quality service in China." />'];
                            $('head').append(seoStr.join(""));
                            //卖家店铺信息
                            var $supplier = $('.detail-store');
                            var $contactname = (contactpersondomainname) ?  contactpersondomainname : suppliername;//显示期望显示名称，没有的话显示卖家名称

                            var $sponsor = "";
                            if(sponsor == "3"){ //金色 钻石礼包
                                $sponsor = "jsponsor";
                            } else if(sponsor == "2"){//蓝色 白金礼包
                                $sponsor = "lsponsor";
                            } else if(sponsor == "1"){//白色 黄金礼包
                                $sponsor = "hsponsor";
                            }
                          /*  var $year = "";
                            if(year== '1'){
                                $year = '1st Year';
                            } else if(year == '2'){
                                $year = '2nd Year';
                            } else if(year == '3'){
                                $year = '3rd Year';
                            } else if(year = 'undefined'){
                                $year = '';
                            } else {
                                $year = year + 'th Year';
                            }*/
                            var $levelStr = "";
                            if(levelId == "P"){
                                 $levelStr = ['<span class="levelP"></span>'];
                            } else if(levelId == "T"){
                                $levelStr = ['<span class="levelT"></span>'];
                            }
                      /*      var html =['<div class="nlsy"><h2 class="store-name">'+$contactname+'</h2>' + $levelStr + '<span class="'+ $sponsor +'"></span><span class="year">'+ $year +
                            '</span></div><div class="ft"><b>'+ cofirmorderAccumulated + '</b> Transactions,<b>'+ showpercentum + '% Positive Feedback</div>'];*/
                            var html =['<div class="nlsy"><h2 class="store-name">'+$contactname+'</h2>' + $levelStr + '<span class="'+ $sponsor +'"></span></div><div class="ft"><b>'+ cofirmorderAccumulated + '</b> Transactions,<b>'+ showpercentum + '% Positive Feedback</div>'];
                            $supplier.html(html.join(""));
                            //contact seller
                            if(isonLine == false){
                                $('.message-entrance').html('<a onClick="javascript:ga(\'send\',\'event\',\'Store\',\'message\')" id="J_dhMsg" class="detail-a detail-arrow-right" href="/sendmsg.do?mty=3&amp;spid= ' + systemuserid + '">Contact to Seller</a>');
                            } else {
                                $('.message-entrance').html('<a onClick="javascript:ga(\'send\',\'event\',\'Store\',\'chat\')" href="javascript:;" id="J_dhChat" ntalker_buyerid ='+ntalkBuyerId+' class="detail-a detail-arrow-right">Contact to Seller</a>');
                            };
                            self.addD1();
                        }
                    }
                }
            });
        },
        //获取橱窗商品
        getDisplayWinList:function(){
            var self = this;
            var apiSet = {
                displayUrl:'http://m.dhgate.com/mobileApiWeb/store-Store-getDisplayWinList.do'
            };
            $('.allContent .loading').addClass('hide');
            $.ajax({
                   url:apiSet.displayUrl,
                data:{
                    client:"wap",
                    supplierseq:storeId
                },
                type:"GET",
                chche:"true",
                dataType:"json",
                success:function(data){
                    if (data && data.state == "0x0000") 
                        if(data.data !==""){
                            var dataJson = data.data;
                            if(dataJson.length>0){
                                var $jStoreTab = $("#j-storeTab");
                                var $jStoreList = $("#j-store-list");
                                var url="http://m.dhgate.com/product";
                                for(var i= 0;i<dataJson.length;i++){
                                    $jStoreList.append('<ul class="store-list clearfix hide"></ul>');
                                    var $jStoreUls =  $jStoreList.find('ul').eq(i);
                                    var $d = dataJson[i];
                                    var catsStr =[ '<li class="swiper-slide "><a href="javascript:;">' + $d.displayWinName + '</a></li>']
                                    $jStoreTab.append(catsStr.join());
                                    for(var j = 0;j<$d.itemWinList.length;j++){
                                        var $j = $d.itemWinList[j];
                                        var maxPrice = $j.maxPrice,
                                            minPrice = $j.minPrice;
                                        var freeShip = '<dd>Free Shipping</dd>';
                                        if(!$j.isfreeShipping){
                                            freeShip='';
                                        }
                                        var promotionMark = '';
                                        var lineMax = '';
                                        if($j.ispromo == true){
                                            if($j.itemWinPromoDto.dynamicType == 0){
                                                promotionMark = ['<span class="sale"></span>'];
                                            }else if($j.itemWinPromoDto.dynamicType == 1){
                                                if($j.itemWinPromoDto.promoTypeId == 0){
                                                    promotionMark = ['<span class="off-ico2">' + $j.itemWinPromoDto.discountRate + '</span>'];
                                                }else if($j.itemWinPromoDto.promoTypeId == 10){
                                                    promotionMark = ['<span class="reduction-ico">' + $j.itemWinPromoDto.discountRate + '</span>'];
                                                }
                                            }
                                            maxPrice = $j.itemWinPromoDto.promoMaxPrice;
                                            minPrice = $j.itemWinPromoDto.promoMinPrice;
                                        }
                                        if(maxPrice !== 0){
                                            lineMax = ['<span class="lineMax">  -  ' + maxPrice + '</span>'];
                                        };
                                        var allIndex = j + 1;
                                        var productsStr = ['<a href="' + url + '/' + $j.seoItemName + '/'+$j.itemcode+'.html#st-storehome-' + allIndex + '-null"><li><div class="store-list-img">' + promotionMark + '<img data-original="' + $j.itemImgUrl + '" src="" class="lazy" alt="' + $j.seoItemName + '"/></div><h3>' + $j.itemName +
                                        '</h3> <dl class="info"><dt class="nowPrice">US $ ' + minPrice +  lineMax + '/ ' + $j.measureName + '</dt>' + freeShip + '<dd>Minimum Order: ' +
                                        $j.minOrder + '' + $j.measureName + '</dd><dd>Sold:  ' + $j.soldNum + '</dd> </dl> </li></a>'];
                                        if(j<4){
                                            productsStr = ['<a href="' + url + '/' + $j.seoItemName + '/'+$j.itemcode+'.html#st-storehome-' + allIndex + '-null"><li><div class="store-list-img">' + promotionMark + '<img src="' + $j.itemImgUrl + '"  alt="' + $j.seoItemName + '"/></div><h3>' + $j.itemName +
                                            '</h3> <dl class="info"><dt class="nowPrice">US $ ' + minPrice +  lineMax + '/ ' + $j.measureName + '</dt>' + freeShip + '<dd>Minimum Order: ' +
                                            $j.minOrder + '' + $j.measureName + '</dd><dd>Sold:  ' + $j.soldNum + '</dd> </dl> </li></a>'];
                                        }
                                        $jStoreUls.append(productsStr.join());
                                        $('#j-store-list .loading').addClass('hide');
                                        $("img.lazy").lazyload();
                                    }
                                }
                                //默认显示第一个类目的商品
                                var defaultCats = $jStoreTab.find('li').eq(0);//默认显示第一个类目的商品
                                var defaultPros = $jStoreList.find('ul').eq(0);//第一个类目的商品
                                defaultCats.addClass('current');
                                defaultPros.removeClass('hide');
                                //点击相应的类目展示对应的商品
                                var $currentCat = $jStoreTab.find('li');
                                var $currentPro = $jStoreList.find('ul')
                                $currentCat.on("click",$currentCat, $.proxy(function(e){
                                    var targetLi = $(e.target).parent('li');
                                    var index = targetLi.index();
                                    targetLi.addClass('current').siblings('li').removeClass('current');
                                    $currentPro.eq(index).removeClass('hide');
                                    $currentPro.eq(index).siblings('ul').addClass('hide');
                                }),this);
                            }else{
                                $('#j-store-list .loading').addClass('hide');
                                $('.navtab').addClass('hide');
                                $('.storeTab').addClass('hide');
                                $('.store-list').css('border-top','1px solid #ddd');
                                self.getAllProducts(0);
                            }
                        }
                    }
            });
        },
        //点击获取全部商品
        clickGetAllPro:function(){
            var self = this;
            var $all =DHM.Common.domExist("#j-all-products");
            var $allContent =DHM.Common.domExist("#j-all-content");
            var $store =DHM.Common.domExist("#j-store-products");
            var $storeTab = DHM.Common.domExist(".storeTab");
            var $allProductsTab = DHM.Common.domExist("#j-all-products");
            var $storeList = DHM.Common.domExist("#j-store-list");
            if(!$all) return;
            //点击获取全部商品
            $all.on("click",$all, $.proxy(function(){
                if($allContent.hasClass('hide')){
                    $storeTab.addClass("hide");
                    $storeList.removeClass("hide").addClass('hide');
                    $allProductsTab.addClass('current').siblings('li').removeClass('current');
                    $allContent.removeClass('hide');
                }
                if($allContent.find('ul').find('li').length>0 || $allProductsTab.hasClass('current') ){
                    return;
                } else{
                    $storeTab.addClass("hide");
                    $storeList.removeClass("hide").addClass('hide');
                    $allProductsTab.addClass('current').siblings('li').removeClass('current');
                    self.getAllProducts(0);
                }
            }),this);
            //点击切换storeHome商品
            $store.on("click",$store, $.proxy(function(){
                $allContent.addClass('hide');
                $storeTab.removeClass("hide");
                $storeList.removeClass("hide");
                $store.addClass('current').siblings('li').removeClass('current');
            }),this);

        },
       //获取全部商品
        getAllProducts:function(pageNum){
            var self = this;
            var pageSize = 40;
            $('.allContent .loading').removeClass('hide');
            var apiSet = {
                   allUrl :'http://m.dhgate.com/mobileApiWeb/store-Store-getAllProduct.do'
                    //    allUrl :'allProduct.do'
            };
            $.ajax({
                 url:apiSet.allUrl,
                // url: '/api.php?jsApiUrl=' + apiSet.allUrl,//上线时删掉
               data:{
                    client:"wap",
                    supplierseq:storeId,
                    pageNum:pageNum,
                    pageSize:pageSize
                },
                type:"GET",
                chche:"true",
                dataType:"json",
                success: function(data){
                    if (data && data.state == "0x0000") {
                        var dataJson = data.data;
                        if(dataJson !==""){
                            var itemWinDtos = dataJson.itemWinDtos;
                            var $allProducts = DHM.Common.domExist("#j-all-content");
                            var url="http://m.dhgate.com/product";
                            var $allProductsUls =  $allProducts.find('ul').eq(0);
                            for(var i = 0; i<itemWinDtos.length;i++){
                                var $d =itemWinDtos[i];
                                var maxPrice = $d.maxPrice,
                                    minPrice = $d.minPrice;
                                var freeShip = '<dd>Free Shipping</dd>';
                                if(!$d.isfreeShipping){
                                    freeShip='';
                                }
                                var promotionMark = '';
                                var lineMax = '';
                                if($d.ispromo === true){
                                    if($d.itemWinPromoDto.dynamicType == 0){
                                        promotionMark = ['<span class="sale"></span>'];
                                    }else if($d.itemWinPromoDto.dynamicType == 1){
                                        if($d.itemWinPromoDto.promoTypeId == 0){
                                            promotionMark = ['<span class="off-ico2">' + $d.itemWinPromoDto.discountRate + '</span>'];
                                        }else if($d.itemWinPromoDto.promoTypeId == 10){
                                            promotionMark = ['<span class="reduction-ico">' + $d.itemWinPromoDto.discountRate + '</span>'];
                                        }
                                    }
                                    maxPrice = $d.itemWinPromoDto.promoMaxPrice;
                                    minPrice = $d.itemWinPromoDto.promoMinPrice;
                                }
                                if(maxPrice !== 0){
                                    lineMax = ['<span class="lineMax">  -  ' + maxPrice + '</span>'];
                                };
                                var proIndex = i + 1;
                                var productsStr = ['<a href="' + url + '/' + $d.seoItemName + '/'+$d.itemcode+'.html#st–product-' + proIndex + '-null"><li><div class="store-list-img">' + promotionMark + '<img data-original="' + $d.itemImgUrl + '" src="" class="lazy"  alt="' + $d.seoItemName + '"/></div><h3>' + $d.itemName +
                                '</h3> <dl class="info"><dt class="nowPrice">US $ ' + minPrice  + lineMax + '/'  + $d.measureName + '</dt>' + freeShip + '<dd>Minimum Order: ' +
                                $d.minOrder + '' + $d.measureName + '</dd><dd>Sold:  ' + $d.soldNum + '</dd> </dl> </li></a>'];
                                if(i<4){
                                    productsStr = ['<a href="' + url + '/' + $d.seoItemName + '/'+$d.itemcode+'.html#st–product-' + proIndex + '-null"><li><div class="store-list-img">' + promotionMark + '<img src="' + $d.itemImgUrl + '" alt="' + $d.seoItemName + '"/></div><h3>' + $d.itemName +
                                    '</h3> <dl class="info"><dt class="nowPrice">US $ ' + minPrice  + lineMax + '/'  + $d.measureName + '</dt>' + freeShip + '<dd>Minimum Order: ' +
                                    $d.minOrder + '' + $d.measureName + '</dd><dd>Sold:  ' + $d.soldNum + '</dd> </dl> </li></a>'];
                                }

                                $allProductsUls.append(productsStr.join());
                                $('.allContent .loading').addClass('hide');
                                $("img.lazy").lazyload();
                            }
                            var $jMore =DHM.Common.domExist('.show-more');
                            var $moreBtn = ['<a class="show-more">Show  More<i></i></a>']
                            if(!$jMore && $('.store-list').find('a').length>0){
                                $allProductsUls.after($moreBtn.join());
                            }
                            if((pageNum+1)*pageSize >= dataJson.totalRecord && $jMore){
                                $jMore.remove();
                            }
                        }
                    }
                }
            });
        },
        //点击more按钮
        getMorePro:function(){
            var self = this;
            self.showMoreNum = 0;
          /*  var flag = true;*/
            var $allContent =DHM.Common.domExist('#j-all-content');
            //点击more 显示更多
            $allContent.delegate('.show-more',"click", $.proxy(function(){
                     $('.show-more').css('display','none');
                    self.showMoreNum++;
                    self.getAllProducts(self.showMoreNum);
                    setTimeout("$('.show-more').css('display','inline-block');",2000);
            }),this);
        },
        //回到顶部和类目悬浮
        scrolls:function(){
            $(window).scroll(function(){
                if($(window).scrollTop() > 190){
                    $('.goTop').css({'display':'block'});
                    if( $('.navs')){
                        $('.navs').addClass('j-navs')
                    }
                }else{
                    $('.goTop').css({'display':'none'});
                    if( $('.navs')){
                        $('.navs').removeClass('j-navs');
                    }
                }
            });
        },
        //D1
        addD1:function(){

            try{
                var supplierid = supplierId ;
                _dhq.push(["setVar", "pt", "st" ]);
                _dhq.push(["setVar", "supplierid", supplierid ]);
                _dhq.push(["event", "Public_S0003"]);
            }catch(e){}
        },
        init: function () {
            var self = this;
            //调用购物车数量
            DHM.Init.logoSummary();
            //底部登录信息
            DHM.Init.loginState();
            self.mySwip();
            self.getStoreInfo();
            self.getDisplayWinList();
            self.clickGetAllPro();
            self.getMorePro();
            self.scrolls();
        }


    };

    //Chat
    function Chat(){
        var NTKF_PARAM = {
            siteid:'dh_1000',                 //平台基础id
            sellerid:'dh_1013141342',    //商户id，商家页面必须此参数，平台页面不传
            settingid:'dh_1013141342_9999',         //Ntalker分配的缺省客服组id
            uid:'dh_',           //用户id  buyerid   hashcode的绝对值的字符串，前面加dh_
            uname:'',         //用户名    nickname
            userlevel:'0'       //用户级别，1为vip用户，0为普通用户
        };
        this.init();

    }
    Chat.prototype ={
        constructor:Chat,
        nalk:function(){
            $("body").on("click","#J_dhChat",function(){
                var uname=DHM.Cookie.getCookie("b2b_nick_n");
                var ntalker_buyerid = $('#J_dhChat').attr('ntalker_buyerid');
                var ntalkUrl1 = ntalkUrl.substring(0,ntalkUrl.lastIndexOf("/"));
                var NTKF_PARAM = {
                    siteid:'dh_1000',                 //平台基础id
                    sellerid:'dh_'+ntalkSellerId,    //商户id，商家页面必须此参数，平台页面不传
                    settingid:'dh_'+ntalkSellerId+'_9999',         //Ntalker分配的缺省客服组id
                    uid:'dh_'+ntalkBuyerId+'',           //用户id  buyerid   hashcode的绝对值的字符串，前面加dh_
                    uname:uname,         //用户名    nickname获取cookie b2b_nick_n值
                    userlevel:'0'       //用户级别，1为vip用户，0为普通用户
                };
                //必须要请求一次后台判断用户是否登录，不能用页面上的参数，因为用户可能在另外一个页面已经退出了登录
                var charwin = [];
                $.ajax({
                    url: '/buyerislogin.do',
                    type: 'GET',
                    dataType:'text',
                    async: false,
                    error: function(){},
                    success: function(data){
                        if(data != undefined && data.trim()=="true"){//登录
                            charwin.push(""+ntalkUrl1+"/mobilechat_en_us.html");//js地址
                            charwin.push("#siteid="+NTKF_PARAM.siteid+"&settingid="+NTKF_PARAM.settingid);
                            charwin.push("&destid="+NTKF_PARAM.sellerid+"_ISME9754_GT2D_embed_"+NTKF_PARAM.settingid+"_icon");
                            charwin.push("&myuid="+NTKF_PARAM.uid+"&myuname="+NTKF_PARAM.uname);
                            charwin.push("&single=0&userlevel="+NTKF_PARAM.userlevel+"&ref="+encodeURIComponent(document.location));
                        }else{//未登录
                            var href=window.location.href;
                            location.href = 'http://m.dhgate.com/login.do?returnURL='+href;

                        }
                    }
                });
                if(charwin.length>0){
                    var p = "height=540,width=320,directories=no,"+ "location=no,menubar=no,resizable=yes,"+ " status=no,toolbar=no,top=100,left=200";
                    try {window.open(charwin.join(''),'chat',p);} catch(e) {}
                }
            });
        },
        init:function(){
            this.nalk();
        }
    }
    new storeShop();
    new Chat();
});