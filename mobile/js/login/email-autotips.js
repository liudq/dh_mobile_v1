  
/**
 * 邮箱自动提示插件
 * @constructor EmailAutoComplete
 * @ options {object} 可配置项
 */

 function EmailAutoComplete(options) {
    
    this.config = {
        trigger      :  '.inputElem',       // 目标input元素
        wrap           :  '.parentCls',       // 当前input元素的父级类
        hiddenCls      :  '.hiddenCls',       // 当前input隐藏域 
        searchForm     :  '.jqtransformdone', //form表单
        inputValColor  :  'red',              // 输入框输入提示颜色
        closeBtn       :  '.close-btn',
        mailArr        : ['@gmail.com','@hotmail.com','@yahoo.com','@outlook.com','@mail.ru','@yandex.ru','@aol.com   ','@msn.com','@live.com'], //邮箱数组
        isSelectHide   : true,                // 点击下拉框 是否隐藏 默认为true
        format: function(index,text){
            return '<li class="p-index'+index+'">'+'<span class="output-num"></span><em class="em" data-html="'+text+'">'+text+'</em></li>';
        },
        callback       : null                 // 点击某一项回调函数
    };

    this.cache = [];

    this.init(options);
   
 }

EmailAutoComplete.prototype = {
    
    constructor: EmailAutoComplete,

    init: function(options){
        this.config = $.extend(this.config,options || {});

        this.wrap = $(this.config.wrap);

        var self = this,
            _config = self.config,
            _cache = self.cache;

        //对多个触发元素进行缓存
        for ( var i = 0, len = $(_config.trigger).length; i < len; i++) {
            _cache.push({
                onlyFlag            : true,     // 只渲染一次
                currentIndex        : -1,
                oldIndex            : -1
            });
        }
        
        $(_config.trigger).each(function(index,item){
            $(item).blur(function(e){
                var parentNode = $(this).closest(_config.wrap);
                setTimeout(function(){
                    $(item).attr({'data-html':''});
                    // 给隐藏域赋值
                    $(_config.hiddenCls,parentNode).val('');

                    _cache[index].currentIndex = -1;
                    _cache[index].oldIndex = -1;
                    $(".auto-tip",parentNode) && !$(".auto-tip",parentNode).hasClass('hidden') && $(".auto-tip",parentNode).addClass('hidden');
                    //self._removeBg(parentNode);
                },100)
                
            });
            $(item).keyup(function(e){
                var target = e.target,
                    targetVal = $.trim($(this).val()),
                    keycode = e.keyCode,
                    elemHeight = $(this).height(),
                    elemWidth = $(this).width(),
                    parentNode = $(this).closest(_config.wrap);

              // $(this).closest(_config.wrap).find('div').addClass(self.config.foucusColor);
                $(parentNode).css({'position':'relative'});
                // 如果输入框值为空的话 那么下拉框隐藏
                
                if(targetVal == ''||targetVal.length<2) {
                 
                    $(item).attr({'data-html':''});
                    // 给隐藏域赋值
                    $(_config.hiddenCls,parentNode).val('');

                    _cache[$(target).index()].currentIndex = -1;
                    _cache[$(target).index()].oldIndex = -1;
                    $(".auto-tip",parentNode) && !$(".auto-tip",parentNode).hasClass('hidden') && $(".auto-tip",parentNode).addClass('hidden');
                }else {
                   
                    $(item).attr({'data-html':targetVal});

                    // 给隐藏域赋值
                    $(_config.hiddenCls,parentNode).val(targetVal);
                    
                    $(".auto-tip",parentNode) && $(".auto-tip",parentNode).hasClass('hidden') && $(".auto-tip",parentNode).removeClass('hidden');
                    // 渲染下拉框内容
                    self._renderHTML({keycode:keycode,e:e,target:target,targetVal:targetVal,height:elemHeight,width:elemWidth,parentNode:parentNode});
                }
                
                
            });
        });
    
        // $(_config.closeBtn,self.wrap).click(function(e){
        //     $(_config.trigger,self.wrap).val('');
        // })
        
       // 阻止form表单默认enter键提交
       $(_config.searchForm).each(function(index,item) {
            $(item).keydown(function(e){
                 var keyCode = e.keyCode;
                 if(keyCode == 13) {
                     return false;
                 }
            });
       });

       // 点击文档document时候 下拉框隐藏掉
       $(document).click(function(e){
          e.stopPropagation();
          var target = e.target,
              tagCls = _config.trigger.replace(/^\./,'');

          if(!$(target).hasClass(tagCls)) {
             $('.auto-tip') && $('.auto-tip').each(function(index,item){
                 !$(item).hasClass('hidden') && $(item).addClass('hidden');
             });
          }
       });
    },

    /*
     * 渲染下拉框提示内容
     * @param cfg{object}
     */
    _renderHTML: function(cfg) {
        var self = this,
            _config = self.config,
            _cache = self.cache,
            _index = $(_config.trigger).index($(cfg.target)),
            curVal;

       $('.auto-tip',cfg.parentNode).hasClass('hidden') && $('.auto-tip',cfg.parentNode).removeClass('hidden');
        
            if(/@/.test(cfg.targetVal)) {
                curVal = cfg.targetVal.replace(/@.*/,'');
            }else {
                curVal = cfg.targetVal;
            }

            if(_cache[_index].onlyFlag) {
                $(cfg.parentNode).append('<input type="hidden" class="hiddenCls"/>');
                var wrap = '<div class="emaillist auto-tip"><ul>';

                for(var i = 0; i < _config.mailArr.length; i++) {

                    wrap += _config.format(i,_config.mailArr[i]);
                }

                wrap += '</ul><div class="ly-close"><a href="javascript:;">Close</a></div></div>';
                _cache[_index].onlyFlag = false;

                $(cfg.parentNode).append(wrap);
                $('.auto-tip',cfg.parentNode).css({'position':'absolute','top':cfg.height,'left':0,
                    'border':'1px solid #ccc','z-index':10000});
            } else {
                //重绘html
               
                var wrap = '<ul>';
                for(var i = 0; i < _config.mailArr.length; i++) {
                    wrap += _config.format(i, _config.mailArr[i]);
                }

                wrap += '</ul>';
               
                $('.auto-tip',cfg.parentNode).html(wrap);
            }
            
            // 给所有li添加属性 data-html
            $('.auto-tip li',cfg.parentNode).each(function(index,item){
                $('.output-num',item).html(curVal);
                !$('.output-num',item).hasClass(_config.inputValColor) && 
                $('.output-num',item).addClass(_config.inputValColor);
                var emVal = $.trim($('.em',item).attr('data-html'));
                $(item).attr({'data-html':curVal + '' +emVal});
            });

            // 精确匹配内容
            self._accurateMate({target:cfg.target,parentNode:cfg.parentNode});

            // 鼠标移到某一项li上面时候
           // self._itemHover(cfg.parentNode);
            
            // 点击对应的项时
            self._executeClick(cfg.parentNode);
     
        
    },
    /**
     * 精确匹配某项内容
     */
    _accurateMate: function(cfg) {
        var self = this,
            _config = self.config,
            _index = $(_config.trigger).index($(cfg.target)),
            _cache = self.cache;

        var curVal = $.trim($(cfg.target,cfg.parentNode).attr('data-html')),
            newArrs = [];

        if(/@/.test(curVal)) {
            
            // 获得@ 前面 后面的值
            var prefix = curVal.replace(/@.*/, ""),
                suffix = curVal.replace(/.*@/, "");

            $.map(_config.mailArr,function(n){
                var reg = new RegExp('^@'+suffix);
                if(reg.test(n)) {
                    newArrs.push(n);
                }
            });

            if(newArrs.length > 0) {
                $('.auto-tip',cfg.parentNode).html('');
                $(".auto-tip",cfg.parentNode) && $(".auto-tip",cfg.parentNode).hasClass('hidden') && 
                $(".auto-tip",cfg.parentNode).removeClass('hidden');

                var html = '<ul>',layyerClose='<div class="ly-close"><a href="javascript:;">Close</a></div>';
                for(var j = 0, jlen = newArrs.length; j < jlen; j++) {
                    html += _config.format(j,newArrs[j]);
                }
                $('.auto-tip',cfg.parentNode).html(html+'</ul>'+layyerClose);
                
                // 给所有li添加属性 data-html
                $('.auto-tip li',cfg.parentNode).each(function(index,item){
                    $('.output-num',item).html(prefix);
                    !$('.output-num',item).hasClass(_config.inputValColor) && 
                    $('.output-num',item).addClass(_config.inputValColor);

                    var emVal = $.trim($('.em',item).attr('data-html'));
                    
                    $(item).attr('data-html','');
                    $(item).attr({'data-html':prefix + '' +emVal});
                });

                // 精确匹配到某项时候 让当前的索引等于初始值
                _cache[_index].currentIndex = -1;
                _cache[_index].oldIndex = -1;
                
                $('.auto-tip .output-num',cfg.parentNode).html(prefix);

                // 鼠标移到某一项li上面时候
                //self._itemHover(cfg.parentNode);

                // 点击对应的项时
                self._executeClick(cfg.parentNode);
            }else {
                $(".auto-tip",cfg.parentNode) && !$(".auto-tip",cfg.parentNode).hasClass('hidden') && 
                $(".auto-tip",cfg.parentNode).addClass('hidden');
                $('.auto-tip',cfg.parentNode).html('');
            }
        }
       
    },
   
   
  
    /**
      * 当数据相同的时 点击对应的项时 返回数据
      */
     _executeClick: function(parentNode) {
        var _self = this,
            _config = _self.config;

        if (_self._executeClick.isrun) {
            return;
        }

        $('.auto-tip').delegate('li','click',function(e){
            var target = $(e.currentTarget),dataAttr = target.attr('data-html'),targetinp=$(_config.trigger,parentNode);
            targetinp.val(dataAttr);
           
            if(_config.isSelectHide) {
              !$(".auto-tip",parentNode).hasClass('hidden') && $(".auto-tip",parentNode).addClass('hidden');
            }
            // 给隐藏域赋值
            $(_config.hiddenCls,parentNode).val(dataAttr);

           _config.callback && $.isFunction(_config.callback) && _config.callback();
           
            
        });

        _self._executeClick.isrun = true;
     }
};

// 初始化
$(function() {
    new EmailAutoComplete({
        trigger      :  '.emailadd',       // 目标input元素
        wrap      :  '.emailcon',       // 当前input元素的父级类
        hiddenCls      :  '.hiddenCls',       // 当前input隐藏域 
        searchForm     :  '#joinfree'
    });
});