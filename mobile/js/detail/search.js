/**
 * Created by zhaojing on 2014/8/28.
 */
//  逻辑功能
function DHMHomeSearch(opt){
    this.opts=$.extend({
        warpId:"#warp",
        logoDomId:".j-logo",
        searchDomId:"#J_search",
        searchInputId:"#J_searchInput",
        searchCancelId:".j-searchCancel",
        searchDelId:".j-delSearch",
        searchListId:"#J_searchList",
        emptyInfoId:".j-opacity-layer",
        searchHotUrl:"http://m.dhgate.com/getrelatedsearchwords.do",
        searchSugUrl:"http://m.dhgate.com/suggest.do"
    },opt);
    this.util=DHM.Util;
    this.mevent=this.util.eType();
    this.init();
}
DHMHomeSearch.prototype={
    constructor:DHMHomeSearch,
//      是否显示search层
    ifSearchShow:function(flag,scope){
        var self=scope;
        var $warp=self.util.domExist(self.opts.warpId);
        var $search=self.$search;
        var $searchList=self.$searchList;
        var $logo=self.util.domExist(self.opts.logoDomId);
        var $searchCancel=self.util.domExist(self.opts.searchCancelId);
        var $carBuy=self.util.domExist("#J_carBuy");
        if(flag){
            if($warp) $warp.hide();
            if($carBuy) $carBuy.hide();
            if($searchList) $searchList.show();
            if($search) $search.find('header').addClass('showOff');
            if($logo) $logo.hide();
            if($searchCancel) $searchCancel.show();
        }else{
            if($warp) $warp.show();
            if($carBuy) $carBuy.show();
            if($searchList) $searchList.hide();
            if($search) $search.find('header').removeClass('showOff');
            if($logo) $logo.show();
            if($searchCancel) $searchCancel.hide();
        }
    },
//      设置历史搜索记录
    setSearchData:function(v){
        var data=localStorage.getItem('DHMSearchData');
        if(!data) {
            localStorage.setItem("DHMSearchData",v);
        }else{
            var str=v+"-"+data;
            var arr =str.split('-');
            // 去重
            for (var i = 0; i <arr.length; i++) {
                if (arr.indexOf(arr[i]) != i) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            localStorage.setItem("DHMSearchData",arr.slice(0,7).join("-"));
        }
    },
//      获取历史搜索记录
    getSearchDate:function(){
        var data=localStorage.getItem('DHMSearchData');
        return data?data.split('-'):[];
    },
    oprSearchData:function(data,scope){
        var self=scope;
        var arr=['<ul>'],len=data.length,$searchList=self.$searchList;
        $searchList.removeClass('search-hot');
        for(var i=0;i<len;i++){
            arr.push("<li>"+data[i]+"</li>");
        }
        arr.push('</ul><div class="searchlist-close"><a href="javascript:;" class="j-historyClose">Clear history</a></div>');
        $searchList.html('').append(arr.join(""));
    },
    closeHistory:function(){
        var self=this,mevent=DHM.Util.eType();
        self.$search.delegate(".j-historyClose",mevent,function(){
            localStorage.setItem('DHMSearchData','');
            self.$searchList.hide();
        });
    },
//      searchInput 获取焦点
    searchInput:function(){
        var self=this;
        var $searchInput=self.util.domExist(self.opts.searchInputId);
        if(!$searchInput) return;
        $searchInput.focus(function(){
            $(this).val("");
            self.ifSearchShow(true,self);
            var searchData=self.getSearchDate();
            if(searchData.length>0){
                self.oprSearchData(searchData,self);
            }else{
                self.util.request({
                    url:self.opts.searchHotUrl,
                    type:"GET",
                    fn:self.searchHotRes,//成功后的方法
                    scope:self
                });
            }
        });

    },
    searchHotRes:function(data,scope,param){
        var self=scope,_data=data.data;
        if(_data&&_data.length){
            var len=_data.length,$searchList=self.$searchList;
            $searchList.addClass('search-hot');
            var arr=['<span class="search-title">Hot Searches</span><ul>'];
            for(var i=0;i<len;i++){
                if(i<=2){
                    arr.push("<li><span>"+(i+1)+"</span><i class='sr-hotrangelist'>"+_data[i]+"</i></li>");
                }else{
                    arr.push("<li>"+_data[i]+"</li>");
                }
            }
            arr.push('</ul>');
            $searchList.html('').append(arr.join(""));
        }
    },
//      退出搜索
    searchCancel:function(){
        var self=this;
        var $searchCancel=self.util.domExist(self.opts.searchCancelId);
        if(!$searchCancel) return;
        $searchCancel.delegate($searchCancel,"click",function(){
            $(".j-searchDom").hide();
            self.ifSearchShow(false,self);
        });
    },
//      搜索联想
    searchSug:function(){
        var self=this;
        var $searchInput=self.util.domExist(self.opts.searchInputId);
        if(!$searchInput) return;
        //输入联想
        $searchInput.on('keyup',function(){
            var value=$(this).val();
            if(!value){$(this).foucus();return;}
            self.util.request({
                url:self.opts.searchSugUrl,
                type:"GET",
                data:"q="+value+"&limit=7&c=",
                dataType:'text',
                fn:self.searchSugRes,//成功后的方法
                scope:self
            });
        });
    },
    searchSugRes:function(data,scope,param){
        var self=scope;
        if(!data) return;
        var list = data.split('| ');
        list.pop();
        var len = list.length;
        var arr =['<ul>'];
        for(var i=0;i<len;i++){
            arr.push("<li>"+list[i]+"</li>");
        }
        arr.push('</ul><div class="searchlist-close"><a href="javascript:;" class="j-searchlistClose">Close</a></div>');
        self.$searchList.html('').append(arr.join(""));
        $('.del-btn').show();
        self.$searchList.removeClass('search-hot');
    },
    closeSearchList:function(){
        var self=this,mevent=DHM.Util.eType();;
        self.$search.delegate(".j-searchlistClose",mevent,function(){
            self.$searchList.hide();
        });
    },
//      点击列表提交
    searchSubmit:function(){
        var self=this;
        self.$searchList.delegate('li',self.mevent,function(e){
            var target = $(e.currentTarget),targetVal="";
            if(!target.find('.sr-hotrangelist').length){
                targetVal = target.text();
            }else{
                targetVal = target.find('.sr-hotrangelist').text();
            }
            var $searchInput=self.util.domExist(self.opts.searchInputId);
            if($searchInput){
                $searchInput.val(targetVal);
            };
            self.setSearchData(targetVal);
            self.$search.find("form").submit();
        });
    },
//      表单提交
    formSubmit:function(){
        var self=this;
        var $searchInput=self.util.domExist(self.opts.searchInputId);
        if(!$searchInput) return;
        self.$search.find("form").submit(function(){
            var v=$searchInput.val();
            if(v==''){
                var oDiv = $('.j-opacity-layer');
                setTimeout(function(){
                    oDiv.animate({ opacity: 1,zIndex:999 },1000, 'ease-in');
                },500);
                setTimeout(function(){
                    oDiv.animate({ opacity: 0, zIndex:-2},2000, 'ease-out');
                },3000);
                return false;
            }else{
                self.setSearchData(v);
                return true;
            }
        });
    },
//      删除搜索内容
    delSearch:function(){
        var self=this;
        var $searchDel=self.util.domExist(self.opts.searchDelId);
        if(!$searchDel) return;
        $searchDel.delegate($searchDel,self.mevent,function(){
            var $searchInput=self.util.domExist(self.opts.searchInputId);
            if($searchInput){
                $searchInput.val('');
            }
            self.$searchList.hide();
            $(this).hide();
        });
    },
    init:function(){
        var self=this;
        self.$search=self.util.domExist(self.opts.searchDomId);
        self.$searchList=self.util.domExist(self.opts.searchListId);
        if(!self.$search||!self.$searchList) return false;
        self.$search.delegate(".j-searchbtn","click",function(){
            $(".j-searchDom").show();
            $("#J_searchInput").focus();
        });
        self.searchInput();
        self.searchCancel();
        self.searchSug();
        self.searchSubmit();
        self.delSearch();
        self.closeHistory();
        self.closeSearchList();
        self.formSubmit();
    }
};
new DHMHomeSearch();