/**
 * Created by zhaojing on 2014/7/16.
 * 倒计时、促销计时相关封装 依赖zepto.js
 *
 * “data-countdown”:页面接受数据的DOM中attr名称
 * 调用方法：
 * DHM.Countdown({
 *    id:"#ttt"
 *   ,format:"hms"
 *   ,endTime:"utc"
 *   ,fn:function([h,m,s],dom){},function([d,h,m,s],dom){}
 *});
 */
(function($){
    function DHMCountdown(ops){
		this.init(ops);
	}
	DHMCountdown.prototype={
		constructor:DHMCountdown,
        url:"http://m.dhgate.com/buyertime.do?callback=?"
        ,getServerTime:function(){
			var _self=this;
            $.getJSON(_self.url, function(data){
				_self.oprTime(data,_self);
            });
        }
        ,oprTime:function(data,scope){
            var serverTime=data.time*1;
			var now=new Date(serverTime);
            var _self=scope;
            _self.$dom.each(function(i,n){
				var endTime;
				if(_self.endTime){
					endTime=_self.endTime;
				}else{
					var day=now.getDay();
					var year=now.getFullYear();
					var month=now.getMonth()+1;
					var date=now.getDate();
					var end=year+"/"+month+"/"+date+" 15:59:59";
					var et=new Date(end).getTime();
					if(day==0){
						endTime=new Date(year+"/"+month+"/"+(date+1)+" 15:59:59").getTime();
					}else if(day==6){
						endTime=new Date(year+"/"+month+"/"+(date+2)+" 15:59:59").getTime();
					}else if(day==5){
						if(serverTime<et){
							endTime=et;
						}else{
							endTime=new Date(year+"/"+month+"/"+(date+3)+" 15:59:59").getTime();
						}
					}else{
						if(serverTime<et){
							endTime=et;
						}else{
							endTime=new Date(year+"/"+month+"/"+(date+1)+" 15:59:59").getTime();
						}
					}
				}
                if (serverTime < endTime) {
                    //距离活动结束剩余时间
                    n.leftTime=Math.floor((endTime - serverTime) / 1000);
                    n.timeOutFn=_self.setTime(n,_self);
                    n.timeOutFn();
                    _self.sum=0;
                    _self.checkTime(scope);
                }
            });
        }
        ,formatTime:function(l,dom,scope){
			var _self=scope;
            var d, h, m, s;
            if(_self.format=="hms"){
                h=Math.floor(l/3600);
                if(h<10){h="0"+h;}
                m=Math.floor(l/60)%60;
                if(m<10){m="0"+m;}
                s=Math.floor(l)%60;
                if(s<10){s="0"+s;}
				_self.setDomFn([h,m,s],dom,scope);
            }else{
                d = Math.floor(l/86400);
                h = Math.floor(l/3600)%24;
                m = Math.floor(l/60)% 60;
                s = l%60;
                if(d<10){d="0"+d;}
                if(h<10){h="0"+h;}
                if(m<10){m="0"+m;}
                if(s<10){s="0"+s;}
				_self.setDomFn([d,h,m,s],dom,scope);
            }
        }
        ,setTime:function(dom,scope){
            return function(){
                if (dom.timer) {
                    clearTimeout(dom.timer);
                }
                dom.leftTime--;
                var leftTime=dom.leftTime;
                if(leftTime<0){
                    if(scope.circle){
                        leftTime=24*3600-1;
                        dom.leftTime=leftTime;
                    }else{
                        clearTimeout(dom.timer);
                        return;
                    }
                }
				scope.formatTime(leftTime,dom,scope);
                dom.timer = setTimeout(function(){
                    dom.timeOutFn();
                }, 1000);
            }
        }
        ,setDomFn:function(t,dom,scope){
			var _self=scope;
            if(t.length==3){
                if(_self.fn){
					_self.fn(t,dom);
                }else{
                    $(dom).html(t[0]+"h&nbsp;"+t[1]+"m&nbsp;"+t[2]+"s");
                }
                return;
            }else if(t.length==4){
                if(_self.fn){
					_self.fn(t,dom);
                }else{
                    $(dom).html(t[0]+"d&nbsp;"+t[1]+"h&nbsp;"+t[2]+"m&nbsp;"+t[3]+"s");
                }
                return;
            }
        }
        ,checkTime:function(scope){
			var _self=scope;
            if (_self.sum == 300) {
				_self.getServerTime();
            }
            if (_self.timer) {
                clearTimeout(_self.timer);
            }
			_self.timer = setTimeout(function(){
				_self.sum++;
				_self.checkTime(_self);
            }, 1000);
        }
        ,init:function(ops){
            if(!ops.id||!$(ops.id).get(0)){
                return false;
            }
            this.$dom=$(ops.id);
            this.format=ops.format||"dhms";//dhms,hms
            if(ops.fn){
                this.fn=ops.fn;
            }
            this.circle=ops.circle||false;
			this.endTime=ops.endTime||null;
            this.getServerTime();
        }
    };
    window.DHM= window.DHM || {};
    window.DHM.Countdown=function(ops){
        new DHMCountdown(ops);
    };
})(Zepto);