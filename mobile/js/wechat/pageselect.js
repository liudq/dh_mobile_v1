/**
 * Created by zhaojing on 2014/8/22.
 */
(function(window, document, undefined){
    /** 分页相关
     * @param opt
     * @constructor
     */
    function ProductsPage(){
        this.opts={
            pageId:"#J_page",
            pnPage:".j-turn",
            proManSelectId:".j-proManSelect",
            curPageId:".proMa-currpage",
            curItemId:".j-curItem",
            inputId:"#pageNum"
        };
        this.init();
    }
    ProductsPage.prototype={
        constructor:ProductsPage,
        eType:function(){
            var isSupportTouch="ontouchend" in document?true:false;
            if(isSupportTouch){
                return 'touchend';
            }else{
                return 'click';
            }
        },
//      点击上一页/下一页
        pnPage:function(){
            var self=this;
            var doms = document.querySelectorAll(self.opts.pnPage);
            var len=doms.length,i=0;
            if(!len) return;
            var e=self.eType();
            for(;i<len;i++){
                doms[i].addEventListener(e,function(){
                    var pNum = this.getAttribute("pnum");
                    document.querySelector(self.opts.inputId).value=pNum;
                    document.forms[0].submit();
                }, false);
            }
        },
//      to第几页
        toPage:function(){
            var self=this;
            var dom = document.querySelector(self.opts.proManSelectId);
            if(!dom) return;
            dom.addEventListener("change",function(){
                var value=this.value;
                var text=this.options[this.selectedIndex].textContent;
                document.querySelector(self.opts.curPageId).innerHTML=text;
                document.querySelector(self.opts.inputId).value=value;
                document.forms[0].submit();
            }, false);
        },
//      一页显示item数
        curItem:function(){
            var self=this;
            var dom=document.querySelector(self.opts.curItemId);
            if(!dom) return;
            var _page=document.querySelector(self.opts.proManSelectId);
            if(!_page) return;
            var currentNum=parseInt(dom.value)*(parseInt(_page.value)-1)+1;
            dom.addEventListener("change",function(){
                document.querySelector(self.opts.inputId).value=parseInt(currentNum/dom.value)+1;
                document.forms[0].submit();
            }, false);
        },
        init:function(){
            var self=this;
            self.pnPage();
            self.toPage();
            self.curItem();
        }
    };
    new ProductsPage();
})(window, window.document);