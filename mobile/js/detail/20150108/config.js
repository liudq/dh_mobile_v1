;(function(self, $){
    self.DETAIL = {
        //配置项
        opts: {
            wwwURL : (/https/i.test(location.protocol)===false?'http://':'https://') + location.hostname
        },
        //工具依赖
        tools: {
            tmpl: (function(){var cache={};function tmpl(str,data){var fn=!/[^a-z0-9A-Z_-]+/.test(str)?cache[str]=cache[str]||tmpl(document.getElementById(str).innerHTML):new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};"+"with(obj){p.push('"+str.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");return data?fn(data):fn};return tmpl})()
        },
        //模板集合
        template: {
         
        }
    };


})(window, Zepto);
