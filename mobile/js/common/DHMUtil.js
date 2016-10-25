/**
 * Created by zhaojing on 2014/7/11.
 * DHMobile,只支持新版浏览器,依赖zepto.js
 */
/**
 * 创建全局对象DHM
 */
var DHM= DHM || {};
DHM.Util={
    events:function(){
        var isSupportTouch="ontouchend" in document?true:false;
        if(isSupportTouch){
            return {start:'touchstart',move:'touchmove',end:'touchend'};
        }else{
            return {start:'mousetart',move:'mousemove',end:'mouseup'};
        }
    },
    eType:function(){
        var isSupportTouch="ontouchend" in document?true:false;
        if(isSupportTouch){
            return 'touchend';
        }else{
            return 'click';
        }
    },
    domExist:function(id){
        if(!id||!$(id).get(0)){
            console.log(id+" not found dom");
            return false;
        }
        return $(id);
    },
    isBlank:function(v){
        if($.trim(v)!=""||v!=null||v!=="undefined"||v!==undefined){
            return false;
        }
        return true;
    },
    waiting:function(){
        if(this.$div) return this.$div;
        var $div=$('<div class="j-shadow shadow" style="display:none;"></div>');
        this.$div=$div;
        $("body").append(this.$div);
        return this.$div;
    },
    request:function(o){
        var _self=this;
        var obj=$.extend({
            url:window.location.href,
            data:"none",//传给url的参数
            type:"POST",
            dataType:"json",
            async:true,//是否异步
            fn:null,//成功后的方法
            scope:null,//成功调用方法所用的作用域
            loading:false,//是否启用遮罩层loading
            fnParam:null//成功后调用方法所用的参数
        },o);
        if(!obj.url) return;
        if(obj.loading){
            _self.waiting().show();
        }
        $.ajax({
            url: obj.url,
            type:obj.type,
            data:obj.data,
            async:obj.async,
            dataType: obj.dataType,
            success: function(res){
                if(obj.loading){
                    _self.$div.hide();
                }
                if(obj.fn){
                    obj.fn(res,obj.scope,obj.fnParam);
                }
            },
            error: function(xhr, ts, et){
                if(obj.loading){
                    _self.$div.hide();
                }
                console.log(xhr+"\n"+ts+"\n"+et);
                return false;
            }
        });
    }
};