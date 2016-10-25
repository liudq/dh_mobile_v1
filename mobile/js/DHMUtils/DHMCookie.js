/**
 * Created by zhaojing on 2014/7/16.
 * setCookie('the_cookie', 'the_value', { expires: 7, path: '/',domain:"",secure:""});设置cookie并设置其他属性等
 */
var DHM= DHM || {};
DHM.Cookie={
	//设置cookie
	setCookie:function(name,value,options){
		var options = options || {};
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString();
		}
		var path = options.path ? '; path=' + options.path : '';
		var domain = options.domain ? '; domain=' + options.domain : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [encodeURIComponent(name), '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	},
	delCookie:function(name){
		var date = new Date();
		date.setTime(date.getTime()-(24*60*60*1000));
		document.cookie = name + "=a; expires=" + date.toUTCString();
	},
	converted:function(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		return s;
	},
	//得到cookie
	getCookie:function(name){
		var cookieValue = null;
		if (!document.cookie && document.cookie == '') {
			return cookieValue;
		}
		var cookies=document.cookie.split(';');
		var len=cookies.length;
		for (var i=0;i<len;i++) {
			var cookie=cookies[i].replace(/(^\s*)|(\s*$)/g,"");
			var index=cookie.indexOf("=");
			if(index!=-1){
				if (typeof name != 'undefined') {
					var cn=decodeURIComponent(cookie.substring(0,index)),
						cv=decodeURIComponent(cookie.substring(index+1));
					if (cn==name.replace(/(^\s*)|(\s*$)/g,"")) {
						cookieValue=DHM.Cookie.converted(cv);
						break;
					}
				}else {
					cookieValue={};
					var cn=decodeURIComponent(cookie.substring(0,index)),
						cv=decodeURIComponent(cookie.substring(index+1));
					cookieValue[cn]=DHM.Cookie.converted(cv);
				}
			}
		}
		return cookieValue;
	}

};

