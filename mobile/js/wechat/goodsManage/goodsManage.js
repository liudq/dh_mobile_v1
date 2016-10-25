/**
 * Created by zhaojing on 2014/8/20.
 */
;Zepto(function($){
    /**
     * 商品管理
     * @param opt
     * @constructor
     */
    function GoodsManage(opt){
        var self=this;
        self.mevent="click";
        self.opts=$.extend({
            onShelfId:".j-onShelf",
            offShelfId:".j-offShelf",
            appealFromId:"#appealForm",
            appealFromUrl:"xxx.do",
            offShelfUrl:"/product/productsDownshelf.do",
            onShelfUrl:"/product/productsUpshelf.do"
        },opt);
        self.init()
    }
    GoodsManage.prototype={
        constructor:GoodsManage,
        errorInfo:{
            "apealForm":{
                reg:/^[\s\S]{0,500}$/,
                err:"字数不超过500."
            },
            "searchForm":{
                reg:/^\d{0,12}$/,
                err:"只能输入数字,且数字不得超过12个."
            }
        },
//      提交申诉
        appealForm:function(){
            var self=this;
            var $form=DHM.Util.domExist(self.opts.appealFromId),errorInfo=self.errorInfo["apealForm"];
            if(!$form) return;
            $form.submit(function(){
                if(!errorInfo.reg.test($form.find("textarea").val())){
                    alert(errorInfo.err);
                    return false;
                }
                alert("接口还未提供");
                return false;
                DHM.Util.request({
                    url: self.opts.appealFromUrl,
                    data:$form.serialize(),
                    fn:self.appealRes,
                    scope:self
                });
            });
        },
        appealRes:function(data,scope,param){
            alert(data)
        },
//      确认上/下架弹层
        dialog:function(text,button){
            var self=this;
            var html=[
                '<div class="layyer-wrap cur">',
                    '<div class="ly-confirm">',
                        '<div class="ly-tips"><p>',text,'</p></div>',
                        '<div class="ly-confirmBtn"><a class="j-layerSure">',button,'</a></div>',
                    '</div>',
                    '<div class="ly-cancel"><a class="j-layerCancel">取消</a></div>',
                '</div>'];
            var layer=$(html.join(""));
            $("body").append(layer);
            var $cancel=layer.find(".j-layerCancel");
            $cancel.delegate($cancel,"click",function(){
               layer.hide();
            });
            return layer;
        },
//      下架
        offShelf:function(){
            var self=this,$offShelf=DHM.Util.domExist(self.opts.offShelfId);
            if(!$offShelf) return;
            $offShelf.delegate($offShelf,self.mevent,function(){
                if(!self.layerOff){
					var str="是否确认将该产品下架？<br/>下架后可在已下架中查看该产品";
					if($(".j-checkPanding").get(0)){
						str="是否确认将该产品下架？";
					}
                    self.layerOff=self.dialog(str,"确认下架");
                    var $sure=self.layerOff.find(".j-layerSure");
                    $sure.delegate($sure,"click",function(){
                        DHM.Util.request({
                            url:self.opts.offShelfUrl,
                            data:"itemcode="+self.offShelfData,
                            fn:self.offShelfRes,
                            scope:self
                        });
                    });
                }
                self.layerOff.show();
                self.offShelfData=$(this).attr("itemcode");
            });
        },
        offShelfRes:function(data,scope,param){
            scope.layerOff.hide();
            if(data.result==1){
                alert("下架失败");
            }else if(data.result==0){
                document.forms[0].submit();
            }
        },
//      上架
        onShelf:function(){
            var self=this,$onShelf=DHM.Util.domExist(self.opts.onShelfId);
            if(!$onShelf) return;
            $onShelf.delegate($onShelf,self.mevent,function(){
                if(!self.layerOn){
                    self.layerOn=self.dialog("是否确认将该产品上架？确认后产品将进行审核的过程，审核通过后将会在已上架中展示。","确认上架");
                    var $sure=self.layerOn.find(".j-layerSure");
                    $sure.delegate($sure,"click",function(){
                        DHM.Util.request({
                            url:self.opts.onShelfUrl,
                            data:"itemcode="+self.onShelfData,
                            fn:self.onShelfRes,
                            scope:self
                        });
                    });
                }
                self.layerOn.show();
                self.onShelfData=$(this).attr("itemcode");
            });
        },
        onShelfRes:function(data,scope,param){
            scope.layerOn.hide();
            if(data.result==1){
                alert("上架失败");
            }else if(data.result==0){
                document.forms[0].submit();
            }
        },
//      商品查询
        searchPro:function(){
            var self=this,$search=$(document.forms[0]);
            if(!$search.get(0)||$search[0].id=="appealForm") return;
            var $text=$search.find("input[type='text']"),err=self.errorInfo["searchForm"];
            $text.focus(function(){
                $search.find("a").show();
            }).blur(function(){
                if(!$(this).val()){
                    $(this).prev("a").hide();
                }
            });
            $text.prev("a").click(function(){
                $text.val("");
                $(this).hide();
            });
            $search.submit(function(){
                if(!err.reg.test($text.val())){
                    alert(err.err);
                    return false;
                }
                return true;
            });
        },
//      初始化
        init:function(){
            var self=this;
            self.appealForm();
            self.offShelf();
            self.onShelf();
            self.searchPro();
        }
    };
    new GoodsManage();

    /**
     * 初始化商品管理数量
     * @param opt
     * @constructor
     */
    function MyProducts(opt){
        var self=this;
        self.opts=$.extend({
            onshelfNumId:"#J_onshelfNum",
            checkNumId:"#J_checkNum",
            nopassNumId:".j_nopassNum",
            offshelfNumId:"#J_offshelfNum",
            myProductsUrl:"/product/productCount.do"
        },opt);
        self.init()
    }
    MyProducts.prototype={
        constructor:MyProducts,
        domfn:DHM.Util.domExist,
        getOnshelfNum:function(){
            var self=this;
            var $onshelfNum=self.domfn(self.opts.onshelfNumId);
            if(!$onshelfNum) return;
            DHM.Util.request({
                url:self.opts.myProductsUrl,
                data:"productType=1",
                fn:self.getProNumRes,
                scope:self,
                fnParam:$onshelfNum
            });
        },
        getCheckNum:function(){
            var self=this;
            var $checkNum=self.domfn(self.opts.checkNumId);
            if(!$checkNum) return;
            DHM.Util.request({
                url:self.opts.myProductsUrl,
                data:"productType=2",
                fn:self.getProNumRes,
                scope:self,
                fnParam:$checkNum
            });
        },
        getNopassNum:function(){
            var self=this;
            var $nopassNum=self.domfn(self.opts.nopassNumId);
            if(!$nopassNum) return;
            DHM.Util.request({
                url:self.opts.myProductsUrl,
                data:"productType=3",
                fn:self.getProNumRes,
                scope:self,
                fnParam:$nopassNum
            });
        },
        getOffshelfNum:function(){
            var self=this;
            var $offshelfNum=self.domfn(self.opts.offshelfNumId);
            if(!$offshelfNum) return;
            DHM.Util.request({
                url:self.opts.myProductsUrl,
                data:"productType=4",
                fn:self.getProNumRes,
                scope:self,
                fnParam:$offshelfNum
            });
        },
        getProNumRes:function(data,scope,param){
            if(!data||!data.count) return;
            param.text(data.count);
        },
        init:function(){
            var self=this;
            self.getOnshelfNum();
            self.getOffshelfNum();
            self.getCheckNum();
            self.getNopassNum();
        }
    };
    new MyProducts();
});