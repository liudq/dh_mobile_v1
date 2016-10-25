/**
 * Created by zhaojing on 2014/7/16.
 * 加载页面后常用方法，需要在具体页面调用
 * 依赖zepto.js 和 DHMUtil.js DHMCookie.js和
 */
var DHM= DHM || {};
DHM.Init={
    logoDataUrl:"/logodata.do" //头部购物车、邮件信息数量接口url
    /**
     * 头部购物车、邮件信息数量
     */
    ,logoSummary:function(){
        var _self=this;
        var param={$cart:$("#cartnum"),$msg:$("#msgnum")};
        DHM.Util.request({
            url:_self.logoDataUrl,
            dataType:"json",
            fn:_self.lSResponse,
            scope:_self,
            fnParam:param
        });
    }
    ,lSResponse:function(data,scope,param){
		if(!data) return;
        var cartnum = data.cartnum;
        var msgnum = data.msgnum;
        param.$cart.html(cartnum);
        param.$msg.html(msgnum);
    }
    /**
     * 记录登录状态，得到cookie中的userName
     */
    ,loginState:function(){
        var value=DHM.Cookie.getCookie("b2b_nick_n");
        if(!value) return;
        var $foot=$('#foot'),$logined=$("#J_logined");
        if(value.length>=15){
            var html=msgObj['hello']+', ' + value.substring(0,15)+'......'+ ' | <a href="/signout.do">'+msgObj['sign_out']+'</a>';
        }else{
            var html=msgObj['hello']+', ' + value + ' | <a href="/signout.do">'+msgObj['sign_out']+'</a>';
        }
        
        if($foot.get(0)){
            $foot.html(html);
        }else{
            $logined.html(html);
        }
    }
};