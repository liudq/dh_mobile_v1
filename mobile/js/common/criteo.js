/**
 * Created by zhaojing on 2014/10/20.
 */
var Criteo={
    loadScript:function(url,callback) {
        var doc=document;
        var script = doc.createElement("script");
        script.type = "text/javascript";
        script.onload = script.onreadystatechange = function() {
            if (script.readyState && script.readyState != "loaded" && script.readyState != "complete")
                return;
            script.onreadystatechange = script.onload = null;
            callback();
        };
        script.src = url;
        doc.getElementsByTagName("head")[0].appendChild(script);
    },
    init:function(callback){
        this.loadScript('//static.criteo.net/js/ld/ld.js',function(){
            var criteoCountryList, ip_country, cookieInfo, PID;
            criteoCountryList={'AR':[8598],'AU':[8599],'CA':[8601],'CL':[8600],'DK':[8602],'FI':[8603],'NL':[8604],'NO':[8605],'NZ':[8606],'SE':[8607],'US':[3090],'BR':[11552],'FR':[11554],'IT':[11553],'RU':[11555]};
            var getCookie=DHM.Cookie.getCookie;
            cookieInfo=getCookie("b_u_cc");
            if(cookieInfo){
                var array=cookieInfo.split('|');
                var len=array.length;
                for (var i=0;i<len;i++){
                    var a=array[i].replace(/(^\s*)|(\s*$)/g,"").split("=");
                    if(a[0].replace(/(^\s*)|(\s*$)/g,"")=="ucc"){
                        ip_country=decodeURIComponent(a[1]);
                        break;
                    }
                }
            }
            if(!ip_country){
                ip_country = getCookie('b2b_ip_country');
            }
            if(!ip_country){
                ip_country = getCookie('b2b_country');
            }
            if(!ip_country) return;
            ip_country=ip_country.toUpperCase();
            PID = criteoCountryList[ip_country] ? criteoCountryList[ip_country][0] : null;
            if (PID && criteoCountryList.hasOwnProperty(ip_country)) {
                callback && callback.call(this,PID);
            }
        });
    }
};