/**
 * Created by liudongqing on 2015/4/22.
 *  * 依赖zepto.js
 * {
 *     element:dom          //外层dom(必选：唯一dom)
 *     ,con:".sBox-con"     //content id
 *     ,page:null           //page id
 *     ,width:100           //展示部分的宽度
 *     ,autoRun:false       //是否自动运行
 *     ,loop:false          //是否循环运行
 *     ,speed:250           //移动的时间  时间要小于delayTime
 *     ,delayTime:1000      //展示部分停留的时间
 *     ,res:false
 * }
 */

function DHMSlide(opt){
    return (this instanceof DHMSlide)?this.init(opt):new DHMSlide(opt);
}
DHMSlide.prototype.init=function(opt){
    var self=this,$dom,$con,$page,isSupportTouch="ontouchend" in document?true:false,events={};
    events=isSupportTouch?{start:'touchstart',move:'touchmove',end:'touchend'}:{start:'mousedown',move:'mousemove',end:'mouseup'};
    if(!$(opt.element).get(0)){console.log("not found "+opt.element);return false;}
    $dom=$(opt.element);
    $con=$dom.find(opt.con);
    if(!$con.get(0)){console.log("not found "+opt.con);return false;}
    $page=opt.page?$dom.find(opt.page):null;
//  参数1
    var options=self.options={
        isSupportTouch:isSupportTouch,
        events:events,
        element:$con[0],
        $page:$page,
        width:opt.width?opt.width:100,
        autoRun:opt.autoRun?true:false,
        loop:opt.loop?true:false,
        speed:opt.speed?opt.speed:500,
        delayTime:opt.delayTime?opt.delayTime:5000,
        res:opt.res?opt.res:false,
        timer: null
    };
//  根据循环与否做些操作
    var $nodes=$con.children();
    var size=$nodes.length;
    if(size<=1) return;

    if(options.res){
        $(window).resize(function() {
            if (options.timer) {
                clearTimeout(options.timer);
            }
            options.timer = setTimeout(function(){
                self.options.width=$(window).width();
                var $con=$(self.options.element);
                var size=$con.find("li").length;
                if(!self.options.loop){
                    $con.width(size*self.options.width);
                }else{
                    $con.width((size+2)*self.options.width);
                }
                $con.find("li").width(self.options.width);
                self._doPlay();
            },200)
        });
    }

    if(options.res){
        setTimeout(function(){
            self.options.width=$(window).width();
            if(!self.options.loop){
                $con.width(size*self.options.width);
            }else{
                var f=$nodes.first()[0].cloneNode(true);
                var l=$nodes.last()[0].cloneNode(true);
                $con.append(f);
                $con.prepend(l);
                $con.width((size+2)*self.options.width);
            }
            $con.find("li").width(self.options.width).show();
            self._doPlay();
            if(self.options.autoRun){
                self._autoRun(self);
            }
        },200)
    }else{
        if(!options.loop){
            $con.width(size*options.width);
        }else{
            var f=$nodes.first()[0].cloneNode(true);
            var l=$nodes.last()[0].cloneNode(true);
            $con.append(f);
            $con.prepend(l);
            $con.width((size+2)*options.width);
        }
        $con.find("li").show();
        self._doPlay();
        if(self.options.autoRun){
            self._autoRun(self);
        }
    }
    //  参数2
    self.tempX=0;self.tempY=0;self.startX=0;self.startY=0;self.index=opt.index?opt.index:0;self.size=size;
    //  添加start事件监听
    options.element.addEventListener(events.start,self,false);

    return self;
};
DHMSlide.prototype._doPlay=function(){
    var self=this;
    var ops=self.options;
    if(!ops.loop){
        if (self.index>=self.size){
            self.index=self.size-1;
        }else if(self.index<0){
            self.index=0;
        }
        self._translate((-self.index*ops.width),ops.speed);
    }else{
        self._translate(-(self.index+1)*ops.width,ops.speed);
        if (self.index==-1){
            var fn=function(scope){
                return setTimeout(function(){
                    scope._translate(-scope.size*scope.options.width,0);
                },scope.options.speed);
            };
            self.timer1= fn(self,ops.speed,ops.width);
            self.index = self.size-1;
        }else if(self.index==self.size){
            var fn=function(scope){
                return setTimeout(function(){
                    scope._translate(-scope.options.width,0);
                },scope.options.speed);
            };
            self.timer1= fn(self,ops.speed,ops.width);
            self.index=0;
        }
    }
    if(ops.$page){
        ops.$page.find("li").eq(self.index).addClass("current").siblings().removeClass("current");
    }
};
DHMSlide.prototype._start=function(e){
    var self=this;
    if(self.scrolling) return;
    clearTimeout(self.timer1);
    clearTimeout(self.timer2);
    self.scrolling=true;self.moveReady=false;self.stop=true;
    var point=self._getPage(e),events=self.options.events,element=self.options.element;
    self.tempX=0;self.tempY=0;self.startX=point.pageX;self.startY=point.pageY;
    //添加move,end事件监听
    element.addEventListener(events.move,self,false);
    document.addEventListener(events.end,self,false);
};
DHMSlide.prototype._move=function(e){
    var self=this;
    if(!self.scrolling)return;
    if(self.options.isSupportTouch){if(e.touches.length > 1||e.scale&&e.scale !== 1)return;} //多点或缩放
    var point=self._getPage(e),ops=self.options;
    var pageX = point.pageX,pageY = point.pageY;
    if(self.moveReady){
        e.preventDefault();
        var disX;self.tempX=pageX-self.startX;
        if(!ops.loop){
            if((self.index==0&&self.tempX>0)||(self.index>=(self.size-1)&&self.tempX<0)){
                self.tempX/=3;
            }
            disX=-self.index*ops.width+self.tempX;
        }else{
            disX=-(self.index+1)*ops.width+self.tempX;
        }
        self._translate(disX,0);
    }else{
        var x=Math.abs(self.startX-pageX),y=Math.abs(self.startY-pageY);
        var z=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var a=180/(Math.PI/Math.acos(y/z));
        if (z > 5) {
            if (a > 55) {
                e.preventDefault();
                self.moveReady = true;
                self.options.element.addEventListener('click',self,false);
            }else {
                self.scrolling = false;
            }
        }
    }
};
DHMSlide.prototype._end=function(e){
    e.stopPropagation();
    var self=this;
    var ops=self.options;
    self.stop=false;
    if (!self.scrolling){
        if(ops.autoRun){
            self._autoRun(self);
        }
        return;
    }
    if(Math.abs(self.tempX)>ops.width/10){self.tempX>0?self.index--:self.index++;}
    self._doPlay();
    if(ops.autoRun){
        self._autoRun(self);
    }
    self.scrolling = false;
    self.moveReady = false;
    ops.element.removeEventListener(ops.events.move,self,false);
    document.removeEventListener(ops.events.end,self,false);
    ops.element.removeEventListener('click', self, false);
};
DHMSlide.prototype._click=function(e){
    e.preventDefault();
    e.stopPropagation();
};
DHMSlide.prototype._getPage=function(e){
    return e.changedTouches?e.changedTouches[0]:e;
};
DHMSlide.prototype._translate=function(dist,speed){
    var style=this.options.element.style;
    style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration = speed+'ms';
    style.webkitTransform=style.MozTransform='translate('+dist+'px,0)'+'translateZ(0)';
};
DHMSlide.prototype._autoRun=function(s){
    var self=s;
    var fn=function(scope){
        return setTimeout(function(){
            if(scope.stop) return;
            scope.index++;
            scope._doPlay();
            scope._autoRun(scope);
        },scope.options.delayTime);
    };
    self.timer2=fn(self);
};
DHMSlide.prototype.handleEvent=function(event){
    var self = this;
    var events=self.options.events;
    switch (event.type) {
        case events.start:self._start(event); break;
        case events.move:self._move(event); break;
        case events.end:self._end(event); break;
        case 'click': self._click(event); break;
    }
};
DHMSlide.prototype.toNext=function(){
    var self=this;
    self.index++;
    self._doPlay();
};
DHMSlide.prototype.toPre=function(){
    var self=this;
    self.index--;
    self._doPlay();
};
