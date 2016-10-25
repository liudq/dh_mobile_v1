/**
 * Created by zhaojing1 on 2014/11/20.
 */
/**
 * Created by zhaojing on 2014/10/15.
 */
Zepto(function($){
    function DHMSearch(opt){
        this.opts=$.extend({
            searchDomId:"#J_search",
            searchInputId:"#J_searchInput",
            searchCancelId:"#J_searchCl",
            searchDelId:"#J_searchDel",
            searchListId:"#J_searchList",
            emptyInfoId:".j-opacity-layer",
            searchHotUrl:"/getrelatedsearchwords.do",
            searchSugUrl:"/suggest.do"
        },opt);
        this.util=DHM.Util;
        this.mevent=this.util.eType();
        this.init();
    }
    DHMSearch.prototype={
        constructor:DHMSearch,
        //      是否显示search层
        ifSearchShow:function(flag,scope){
            var self=scope;
            var $search=self.$search;
            var $searchList=self.$searchList;
            var $searchCancel=self.util.domExist(self.opts.searchCancelId);
            if(flag){
                $search.siblings("div,section,footer,header").hide();
                $search.addClass('dhm-search-act');
                $searchList.show();
                if($searchCancel) $searchCancel.show();
            }else{
                $search.siblings("div,section,footer,header").show();
                $search.removeClass('dhm-search-act');
                $searchList.hide();
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
            self.$searchList.delegate(".j-historyClose",mevent,function(){
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
                        arr.push("<li class='hot-icon'><span>"+(i+1)+"</span><i class='sr-hotrangelist'>"+_data[i]+"</i></li>");
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
            $searchCancel.delegate($searchCancel,"click",function(e){
                self.ifSearchShow(false,self);
                self.$search.hide();
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
            $(self.opts.searchDelId).show();
            self.$searchList.removeClass('search-hot');
        },
        closeSearchList:function(){
            var self=this,mevent=DHM.Util.eType();
            self.$searchList.delegate(".j-searchlistClose",mevent,function(){
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
            self.searchInput();
            self.searchCancel();
            self.searchSug();
            self.searchSubmit();
            self.delSearch();
            self.closeHistory();
            self.closeSearchList();
            self.formSubmit();
            $("#J_searchPro").click(function(){
                self.ifSearchShow(true,self);
                self.$search.show();
            });
        }
    };
    new DHMSearch();

    function MyInit(){
        this.init();
    }
    MyInit.prototype={
        constructor:MyInit,
        //   站内信和购物车数量,登录状态
        logoAndLogin:function(){
            DHM.Init.logoSummary();
            DHM.Init.loginState();
        },
        // 轮播图
        slide:function(){
            DHMSlide({
                element:"#J_banner",
                con:"#J_bannerCon",
                page:"#J_bannerPage",
                width:320,
                loop:true,
                autoRun:true,
                speed:500
                ,delayTime:3500
            });
        },
        titPro:function(){
            var self=this;
            var e=DHM.Util.eType();
            var $tit=$("#J_dcpTit");
            var $span=$tit.find("span");
            $tit.delegate("span",e,function(){
                if($(this).next().css("display")=="none"){
                    $span.next().hide();
                    $span.parent().removeClass("active");
                    $(this).next().show();
                    $(this).parent().addClass("active");
                }else{
                    $(this).next().hide();
                    $(this).parent().removeClass("active");
                }
            });
        },
        mayLike:function(){
            var self=this;
            var cid=document.getElementById("J_sliding").dataset.cid;
            DHM.Util.request({
                url:"http://www.dhgate.com/hot-selling/dcpcp/dcphotselling.html?cid="+cid+"&callback=?",
                type:"GET",
                dataType:'text',
                fn:self.respons,//成功后的方法
                scope:self
            });
        },
        respons:function(data,scope,param){
            if(!data||!data.result) return;
            var $sliding = $("#J_sliding");
            var res=data.result;
            var len=res.length;
            if(!len) return;
            var html=['<ul>'];
            for(var i=0;i<len;i++){
                var r=res[i];
                html.push('<li>');
                html.push('<a href="'+r.link+'"><img src="'+r.imgSrc+'" alt=""/></a>');
                html.push('<p>'+r.title+'</p>');
                html.push('<p><i>'+r.price+'</i> / '+r.unit+'</p>');
                html.push('</li>');
            }
            html.push('</ul>');
            $sliding.html(html.join(""));
            var w=(120+8);
            DHMSliding({
                element:$sliding,
                distance:w*2,
                totalWidth:w*len,
                containerWidth:320,
                speed:500
            });
        },
        init:function(){
            var self=this;
            self.logoAndLogin();
            self.slide();
            self.titPro();
            self.mayLike();
        }
    };
    new MyInit();

});