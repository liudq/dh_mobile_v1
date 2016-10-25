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
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    },
    delCookie:function(name){
        var date = new Date();
        date.setTime(date.getTime()-(24*60*60*1000));
        document.cookie = name + "=a; expires=" + date.toUTCString();
    },
    //得到cookie
    getCookie:function(name){
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies=document.cookie.split(';');
            var len=cookies.length;
            for (var i=0;i<len;i++) {
                var cookie=cookies[i].replace(/(^\s*)|(\s*$)/g,"").split("=");
                if (typeof name != 'undefined') {
                    if (cookie[0].replace(/(^\s*)|(\s*$)/g,"")==name.replace(/(^\s*)|(\s*$)/g,"")) {
                        cookieValue=decodeURIComponent(cookie[1]);
                        break;
                    }
                }else {
                    cookieValue={};
                    cookieValue[cookie[0]]=decodeURIComponent(cookie[1]);
                }
            }
        }
        return cookieValue;
    }
};

