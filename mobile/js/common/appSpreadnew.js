/**
 * Created by zhaojing on 2014/7/29.
 */
(function(){
    var _getCookie=DHM.Cookie.getCookie,
        _setCookie=DHM.Cookie.setCookie,
        storage = window.localStorage;
    function AppSpread(opt){
        this.androidStore="http://download.dhgate.com/mobile/dhgate_buyer.apk";
        this.iosStore="https://itunes.apple.com/us/app/dhgate-shop-smart-shop-direct/id905869418?l=zh&ls=1&mt=8";
        this.openId=opt.openId||"";
        this.closeId=opt.closeId||"";
        this.url=window.document.URL;
        this.init();
    }
    AppSpread.prototype={
        constructor:AppSpread,
        events:function(){
            return 'click';
        },
        exp:function(){
            var a = navigator.userAgent;
            var exp2 =/(A|a)ndroid/i;
            var exp3 =/i(P|p)hone/i;
            if(exp2.test(a)){
                return "android";
            }
            else if(exp3.test(a)){
                return "iphone";
            }
            else{
                return false;
            }
        },
        openApp:function(scope,_open){
            var e=scope.events();

            _open.addEventListener(e,function(){
               
                if(_open.getAttribute('des')){
                    try{
                        ga('send', 'event', 'Checkout-product', 'TDCode', 'dload');
                    }catch(e){}
                    
                }else{
                    
                     try{
                        _gaq.push(['_trackEvent','appdownload', 'wap']);
                    }catch(e){}
                }
                var appopen = new Appopen();
            },false);
            
        },
        //判断支持localStorage
        isLocalStorageNameSupported: function() {
            try {
                if ('localStorage' in window && window['localStorage']) {
                    localStorage.setItem('__DH_LOCALSTORAGETEST__', 1);
                    return true;
                }
            } catch (e) {
                return false
            }
        },
        opr:function(){
            var _self=this;
            var e=_self.events();
            var _close=document.getElementsByClassName(_self.closeId)[0];
            var _open=document.getElementsByClassName(_self.openId)[0];
            if(_open){
                _self.openApp(_self,_open);
            }
            if(_close){
                _close.addEventListener(e,function(){
                    this.parentNode.style.display="none";
                    //判断是否支持localStorage
                    if (_self.isLocalStorageNameSupported()){
                        storage.setItem("DHMAppBannerNew","1");
                    }
                    
                }, false);
            }
        },
        init:function(){
            var self=this;
            var _dom=document.getElementById("J_appBanner");
            if(!_dom) return;
            $('.'+this.closeId).css({'width':'13%','height':'100%','left':'0px'});
            $('.'+this.openId).css({'width':'87%','height':'100%','left':'13%','fontSize':'16px','color':'#fff'});
            if(typeof msgObj==='undefined'){
                $('.'+this.openId).append('<span>Shop Better Prices on the App!</span>');
            }else{
               $('.'+this.openId).append('<span>'+msgObj['COMMON_Price_onapp']+'</span>'); 
            }
            
            $('.'+this.openId).find('span').css({'display':'inline-block','paddingLeft':'17.5%','paddingRight':'32%','paddingTop':'10px'});
         
            if($(window).width()<360){
                $('.'+this.openId).css({'fontSize':'14px'});
                $('.'+this.openId).find('span').css({'paddingTop':'6px'});
            }
            if(!self.exp()){
                _dom.style.display="none";
                return;
            }
            var store=storage.getItem("DHMAppBannerNew");
            if (!store){
                if (self.isLocalStorageNameSupported()){
                    storage.setItem("DHMAppBannerNew","4");
                }
                
               /* return;*/
            }
            var bannerIndex=parseInt(store);
            if(!_getCookie("DHMAppSpreadBanner")){
                if(bannerIndex<3){
                    document.getElementsByClassName("j-closeApp")[0].parentNode.style.display="none";
                    bannerIndex++;
                }else{
                    bannerIndex=4;
                }
                if (self.isLocalStorageNameSupported()){
                    storage.setItem("DHMAppBannerNew",bannerIndex);
                }
                _setCookie("DHMAppSpreadBanner","1");
            }else{
                if(bannerIndex<4){
                    document.getElementsByClassName("j-closeApp")[0].parentNode.style.display="none";
                }
            }
			var exp=self.exp();
			if(exp=="android" || exp=="iphone"){
				document.getElementById("J_appImgBanner").src="http://css.dhresource.com/mobile/common/image/appdownloadyellow.png";
			}
            self.opr();
        }
    };
    new AppSpread({
        openId:"j-openApp",
        closeId:"j-closeApp"
    });
})(window,window.document);