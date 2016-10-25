/**
 * Created by zhaojing on 2014/10/15.
 * 依赖zepto.js 、DHMCommon.js
 */
Zepto(function($){
    function DHMSearch(){
		var self=this;
		var exist = DHM.Common.domExist;
		self.$search=exist("#J_search");
		self.$input=exist("#J_searchInput");
		self.$cancel=exist("#J_searchCl");
		self.$del=exist("#J_searchDel");
		self.$result=exist("#J_searchResult");
		self.$topSearch=exist(".j-topSearchBtn");
		self.hotUrl=DHM.Common.mobileHost+"getrelatedsearchwords.do";
		self.sugUrl=DHM.Common.mobileHost+"suggest.do";
		self.chickEvent="click";
		self.init();
    }
    DHMSearch.prototype={
        constructor:DHMSearch,
//		之前div的状态
		_ifDisplay:function(){
			var self=this;
			var $siblings=self.$search.siblings('div,section,nav,article,header,footer');
			var opt={};
			$siblings.each(function(i,e){
				var s=e.style.display;
				opt[i+"-"+s]=e;
			});
			return [opt,$siblings];
		},
//      是否显示search层
        _ifSearchShow:function(flag,scope){
            var self=scope;
            var $search=self.$search;
            if(flag){
                $search.addClass('dhm-search-active');
				self.siblingsOpt[1].hide();
                if(self.$cancel) self.$cancel.show();
            }else{
                $search.removeClass('dhm-search-active');
				var so=self.siblingsOpt[0];
				for(var k in so){
					so[k].style.display= k.split("-")[1];
				}
                if(self.$cancel) self.$cancel.hide();
            }
        },
		_ifSearchShow2:function(flag,scope){
			var self=scope;
			var $search=self.$search;
			if(flag){
				$search.addClass('dhm-search-active');
				self.siblingsOpt[1].hide();
				$search.show();
			}else{
				$search.removeClass('dhm-search-active');
				var so=self.siblingsOpt[0];
				for(var k in so){
					so[k].style.display= k.split("-")[1];
				}
				$search.hide();
			}
		},
//      获取历史搜索记录
		_getSearchDate:function(){
			var data=localStorage.getItem('DHMSearchData');
			return data?data.split('-'):[];
		},
//		展示历史搜索记录
		_oprSearchData:function(data,scope){
			var self=scope;
			var arr=['<ul>'],len=data.length,$result=self.$result;
			$result.removeClass('search-hot');
			for(var i=0;i<len;i++){
				arr.push("<li>"+data[i]+"</li>");
			}
			arr.push('</ul><div class="close"><a href="javascript:;" class="j-historyClose">',msgObj["clear_history"],'</a></div>');
			$result.html(arr.join("")).show();
		},
//      设置历史搜索记录
        _setSearchData:function(v){
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
		_getErrorDom:function(){
			var self=this;
			if(!self.$errorDom){
				self.$errorDom=$('<div class="j-opacity-layer opacity-layer">'+msgObj['input_key_word']+'</div>');
				$("body").append(self.$errorDom);
			}
			return self.$errorDom;
		},
//		清除历史搜索记录
        closeHistory:function(){
            var self=this;
            self.$result.delegate(".j-historyClose",self.chickEvent,function(){
                localStorage.setItem('DHMSearchData','');
                self.$result.hide();
            });
        },
//      searchInput 获取焦点
        searchInput:function(){
            var self=this;
            if(!self.$input) return;
			self.$input.focus(function(){
                $(this).val("");
				if(!self.$topSearch){
					self._ifSearchShow(true,self);
				}
                var searchData=self._getSearchDate();
                if(searchData.length>0){
                    self._oprSearchData(searchData,self);
                }else{
                    DHM.Common.request({
                        url:self.hotUrl,
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
                var len=_data.length,$result=self.$result;
				$result.addClass('search-hot');
                var arr=['<ul><li class="tit">',msgObj['hot_search'],'</li>'];
                for(var i=0;i<len;i++){
                    if(i<=2){
                        arr.push("<li class='icon'><span>",(i+1),"</span>",_data[i],"</li>");
                    }else{
                        arr.push("<li>",_data[i],"</li>");
                    }
                }
                arr.push('</ul>');
				$result.html(arr.join("")).show();
            }
        },
//      退出搜索
        searchCancel:function(){
            var self=this;
            var $cancel=self.$cancel;
            if(!$cancel) return;
			$cancel.delegate($cancel,self.chickEvent,function(e){
				if(self.$topSearch){
					self._ifSearchShow2(false,self);
				}else{
					self._ifSearchShow(false,self);
				}
				e.stopPropagation();
				e.preventDefault();
            });
        },
//      搜索联想
        searchSug:function(){
            var self=this;
            var $input=self.$input;
            if(!$input) return;
			$input.on('keyup',function(){
                var value=$(this).val();
                if(!value){
					$(this).focus();
					self.$del.hide();
					return;
				}
				self.$del.show();
                DHM.Common.request({
                    url:self.sugUrl,
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
			self.$result.removeClass('search-hot');
            var list = data.split('| ');
            list.pop();
            var len = list.length;
            var arr =['<ul>'];
            for(var i=0;i<len;i++){
                arr.push("<li>"+list[i]+"</li>");
            }
            arr.push('</ul><div class="close"><a href="javascript:;" class="j-searchResultClose">',msgObj['close'],'</a></div>');
            self.$result.show().html(arr.join(""));
        },
        closeSearchList:function(){
            var self=this;
            self.$result.delegate(".j-searchResultClose",self.chickEvent,function(){
                self.$result.hide();
            });
        },
//      删除搜索内容
		delSearch:function(){
			var self=this;
			var $del=self.$del;
			if(!$del) return;
			$del.delegate($del,self.chickEvent,function(){
				self.$input.val('');
				self.$result.hide();
				$(this).hide();
			});
		},
//      点击列表提交
        searchSubmit:function(){
            var self=this;
            self.$result.delegate('li',self.chickEvent,function(e){
                var target = $(e.currentTarget),targetVal="";
				if(target.attr("class")=="tit") return;
                if(target.attr("class")=="icon"){
                    targetVal = target.text().substring(1);
                }else{
                    targetVal = target.text();
                }
				self.$input.val(targetVal);
                self._setSearchData(targetVal);
                self.$search.find("form").submit();
            });
        },
//      表单提交
        formSubmit:function(){
            var self=this;
            self.$search.find("form").submit(function(){
                var v=self.$input.val();
                if(v==''){
                    var oDiv=$(".j-opacity-layer");
                    setTimeout(function(){
                        oDiv.animate({ opacity: 1,zIndex:999 },1000, 'ease-in');
                    },500);
                    setTimeout(function(){
                        oDiv.animate({ opacity: 0, zIndex:-2},2000, 'ease-out');
                    },3000);
                    return false;
                }else{
					if(document.getElementById("J_nav")){
						document.getElementById(self.navId).dataset.key=v;
					}
                    self._setSearchData(v);
                    return true;
                }
            });
        },

        init:function(){
            var self=this;
            if(!self.$search||!self.$result) return false;
			self.siblingsOpt=self._ifDisplay();
			if(self.$topSearch){
				self.$topSearch.delegate(self.$topSearch,self.chickEvent,function(){
					self._ifSearchShow2(true,self);
				});
			}
			self._getErrorDom();
            self.searchInput();
            self.searchCancel();
            self.searchSug();
			self.closeSearchList();
            self.delSearch();
			self.searchSubmit();
            self.closeHistory();
            self.formSubmit();
        }
    };
    new DHMSearch();
});