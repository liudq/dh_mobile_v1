/**
 * Created by zhaojing on 2014/7/16.
 * 倒计时、促销计时相关封装 依赖zepto.js
 *
 * “data-countdown”:页面接受数据的DOM中attr名称
 * 调用方法：
 * DHM.Countdown({
 *    id:"#ttt"
 *   ,format:"hms"
 *   ,endTime:"2014-07-21 23:59:59"
 *   ,fn:function([h,m,s],dom){},function([d,h,m,s],dom){}
 *});
 */
(function($){
    var DHMcountdown={
        url:"http://m.dhgate.com/buyertime.do?callback=?"
        ,getServerTime:function(){
            $.getJSON(DHMcountdown.url, function(data){
                DHMcountdown.oprTime(data);
            });
        }
        ,oprTime:function(data){
            var serverTime=data.time*1;
            var _self=this;
            _self.$dom.each(function(i,n){
                var endTime;
                if(_self.endTime){
                    endTime=_self.endTime;
                }else{
                    var str=$(n).data("countdown");
                    endTime=new Date(str).getTime();
                }
                if (serverTime < endTime) {
                    //距离活动结束剩余时间
                    n.leftTime=Math.floor((endTime - serverTime) / 1000);
                    n.timeOutFn=_self.setTime(n);
                    n.timeOutFn();
                    _self.sum=0;
                    _self.checkTime();
                }
            });
        }
        ,formatTime:function(l,dom){
            var d, h, m, s;
            if(DHMcountdown.format=="hms"){
                h=Math.floor(l/3600);
                if(h<10){h="0"+h;}
                m=Math.floor(l/60)%60;
                if(m<10){m="0"+m;}
                s=Math.floor(l)%60;
                if(s<10){s="0"+s;}
                DHMcountdown.setDomFn([h,m,s],dom);
            }else{
                d = Math.floor(l/86400);
                h = Math.floor(l/3600)%24;
                m = Math.floor(l/60)% 60;
                s = l%60;
                if(d<10){d="0"+d;}
                if(h<10){h="0"+h;}
                if(m<10){m="0"+m;}
                if(s<10){s="0"+s;}
                DHMcountdown.setDomFn([d,h,m,s],dom);
            }
        }
        ,setTime:function(dom){
            return function(){
                if (dom.timer) {
                    clearTimeout(dom.timer);
                }
                dom.leftTime--;
                var leftTime=dom.leftTime;
                if(leftTime<0){
                    if(DHMcountdown.circle){
                        leftTime=24*3600-1;
                        dom.leftTime=leftTime;
                    }else{
                        clearTimeout(dom.timer);
                        return;
                    }
                }
                DHMcountdown.formatTime(leftTime,dom);
                dom.timer = setTimeout(function(){
                    dom.timeOutFn();
                }, 1000);
            }
        }
        ,setDomFn:function(t,dom){
            if(t.length==3){
                if(DHMcountdown.fn){
                    DHMcountdown.fn(t,dom);
                }else{
                    $(dom).html(t[0]+"h&nbsp;"+t[1]+"m&nbsp;"+t[2]+"s");
                }
                return;
            }else if(t.length==4){
                if(DHMcountdown.fn){
                    DHMcountdown.fn(t,dom);
                }else{
                    $(dom).html(t[0]+"d&nbsp;"+t[1]+"h&nbsp;"+t[2]+"m&nbsp;"+t[3]+"s");
                }
                return;
            }
        }
        ,checkTime:function(){
            if (DHMcountdown.sum == 300) {
                DHMcountdown.getServerTime();
            }
            if (DHMcountdown.timer) {
                clearTimeout(DHMcountdown.timer);
            }
            DHMcountdown.timer = setTimeout(function(){
                DHMcountdown.sum++;
                DHMcountdown.checkTime();
            }, 1000);
        }
        ,init:function(ops){
            if(!ops.id||!$(ops.id).get(0)){
                return false;
            }
            this.$dom=$(ops.id);
            if(ops.endTime){
                this.endTime=new Date(ops.endTime).getTime();
            }
            this.format=ops.format||"dhms";//dhms,hms
            if(ops.fn){
                this.fn=ops.fn;
            }
            this.circle=ops.circle||false;
            this.getServerTime();
        }
    };
    window.DHM= window.DHM || {};
    window.DHM.Countdown=function(ops){
        DHMcountdown.init(ops);
    };
})(Zepto);