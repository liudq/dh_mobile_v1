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
                var b=scope.exp();
                if(b=="android"){
                    window.location.href=scope.androidStore;
                    try{
                        _gaq.push(['_trackEvent','appdownload', 'wap']);
                    }catch(e){}
                }
                if(b=="iphone"){
                    window.location.href=scope.iosStore;
                    try{
                        _gaq.push(['_trackEvent','appdownload', 'wap']);
                    }catch(e){}
                }
            },false);
            
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
                    storage.setItem("DHMAppBannerNew","1");
                }, false);
            }
        },
        init:function(){
            var self=this;
            var _dom=document.getElementById("J_appBanner");
            if(!_dom) return;
            if(!self.exp()){
                _dom.style.display="none";
                return;
            }
            var store=storage.getItem("DHMAppBannerNew");
            if (!store){
                storage.setItem("DHMAppBannerNew","4");
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
                storage.setItem("DHMAppBannerNew",bannerIndex);
                _setCookie("DHMAppSpreadBanner","1");
            }else{
                if(bannerIndex<4){
                    document.getElementsByClassName("j-closeApp")[0].parentNode.style.display="none";
                }
            }
			var exp=self.exp();
			if(exp=="android" || exp=="iphone"){
				document.getElementById("J_appImgBanner").src="http://css.dhresource.com/mobile/common/image/appDownload.png";
			}
            self.opr();
        }
    };
    new AppSpread({
        openId:"j-openApp",
        closeId:"j-closeApp"
    });
})(window,window.document);