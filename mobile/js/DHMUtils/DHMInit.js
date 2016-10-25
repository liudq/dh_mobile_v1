/**
 * Created by zhaojing1 on 2014/12/15.
 * 加载页面后常用方法，需要在具体页面调用
 * 依赖zepto.js 和 DHMCookie.js、DHMCommon.js
 */
var DHM= DHM || {};
DHM.Init={
	logoDataUrl:DHM.Common.mobileHost+"logodata.do" //头部购物车、邮件信息数量接口url
	/**
	 * 头部购物车、邮件信息数量
	 */
	,logoSummary:function(){
		var _self=this;
		DHM.Common.request({
			url:_self.logoDataUrl,
			dataType:"json",
			fn:_self.lSResponse,
			scope:_self
		});
	}
	,lSResponse:function(data,scope,param){
		if(!data) return;
		var cartNum = data.cartnum;
		var msgNum = data.msgnum;
		if(cartNum){
			$("#cartnum,.cart-num").html('<span class="cart-nub">'+cartNum+'</span>');
			$(".j-cartNum").html(cartNum);
		}
		if(msgNum){
			$("#msgnum").html(msgNum);
		}
	}
	/**
	 * 记录登录状态，得到cookie中的userName
	 */
	,loginState:function(){
		var value=DHM.Cookie.getCookie("b2b_nick_n");
		if(!value) return;
		 if(value.length>=15){
			var html=msgObj['hello']+', ' + value.substring(0,15)+'...'+ ' | <a href="/signout.do">'+msgObj['sign_out']+'</a>';
		}else{
			var html=msgObj['hello']+', ' + value + ' | <a href="/signout.do">'+msgObj['sign_out']+'</a>';
		}
		$("#J_logined").html(html);
	}
};