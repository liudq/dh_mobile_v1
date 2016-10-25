/**
 * Created by liudongqing on 2015/07/06.
 */
Zepto(function($) {
//	ui相关
    function List() {
        var self = this;
        self.touchEvent = DHM.Common.eType();
        self.clickEvent = "click";
        self.navId = "J_nav";
        self.listDataset = document.getElementById(self.navId).dataset;
        self.$input = $("#J_searchInput");
//		mayInterest
       /* self.mayIOpt = {
            url: DHM.Common.mobileHost + "promoproduct.do",
            id: "#J_mayInterest"
        };*/
//		list mode
        self.lModeOpt = {
            bId: "#J_uoBtn",
            lId: "#J_list"
        };
//		nav
        self.sortOpt = {
            sortUrl: DHM.Common.mobileHost + "search.do?",
            sortId: "#J_sortBy",
            sortLayerId: "#J_sortByLayer"
        };
//		filter
        self.filterOpt = {
            filterId: "#J_filter",
            filterLayerId: "#J_filterLayer"
        };
        self.casOpt = {
            casId: "#J_categories",
            cancelId: ".j-casDone",
            hideId: ".j-casCancelAll"
        };
        //category by ldq
        self.cateOpt = {
            cateId:"#J_category",
            chooseId:"#chooseCategory",
            editId:"#editCategory",
            closeId:'.closeCas'
        }
        self.init();
    }

    List.prototype = {
        constructor: List,
        _translate: function ($d, dist, flag) {
            var style = $d.get(0).style;
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = '500ms';
            style.webkitTransform = style.MozTransform = 'translateX(' + dist + ')';
            if (dist == 0) {
                $("body").css({'height': $(window).height(), 'overflow': 'hidden'});
                setTimeout(function () {
                    $d.css({"position": "absolute"});
                }, 500);
            } else if (flag) {
                $d.css("position", "fixed");
                $("body").css({'height': $(window).height(), 'overflow': 'hidden'});
            } else {
                $("body").css({'height': 'auto', 'overflow': 'auto'});
                $d.css("position", "fixed");
            }
        },
//		shadow
        _shadow: function (scope) {
            var self = scope;
            if (!self.shadowEle) {
                var shadow = document.createElement("div");
                shadow.style.cssText = "display:none;width:100%;height:100%;position:fixed;top:0;left:0;z-index:99;zoom:1;background:#000;opacity:0.3";
                $("body").append(shadow);
                self.shadowEle = $(shadow);
            }
            return self.shadowEle;
        },
        //获取一级类目
        getPrimaryCatsR:function(){
            var apiUrl ="http://m.dhgate.com/json/mobile_24_top_json.html";
            DHM.Common.request({
               url:apiUrl,
                dataType:'html',
           //  url : '/api.php?jsApiUrl=' + apiUrl,
                data:{
                    client:"wap"
                },
                fn:self.getPrimaryCats,
                scope:self
            });

        },
        getPrimaryCats:function(data,scope,param){
            alert('succeess');
            var self = scope,
                $mi = param;
            var $data = data.data;
            var $state = data.state;
            var chooseCategory = $('.chooseCategory');
            for(var i=0;i<$data.length;i++){
                var d = $data[i];
                var str = (d.dispName)?('<li data-cid="i"><span>' + d.dispName + '</span></li>'):'';
                if($state == '0x0000'){
                    chooseCategory.appendTo(str);
                }
            }

        },
        //类目弹层
        unfoldCategory: function(){
            var self = this,
                exist = DHM.Common.domExist;
            var $category = exist(self.cateOpt.cateId),
                $catsDone = exist(self.casOpt.cancelId);
            if(!$category) return;
            $category.delegate($category, self.touchEvent, function (e) {
                var $cas = DHM.Common.domExist(self.casOpt.casId);
                self._translate($cas, 0);
                self.getPrimaryCatsR();
            });
            //弹层选完类目Done后操作
            $catsDone.delegate($catsDone, self.clickEvent, function (e) {
                self.cancelFilter(e, self);
                e.preventDefault();
                e.stopPropagation();
            });

        },
//		列表方式变化
        listMode: function () {
            var self = this;
            var exist = DHM.Common.domExist;
            var $btn = exist(self.lModeOpt.bId);
            var $list = exist(self.lModeOpt.lId);
            if (!$btn) return;
            $btn.delegate($btn, self.touchEvent, function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).toggleClass("uo-tile");
                if (!$list) return;
                $list.toggleClass("dhm-tiled");
                if(!$list.hasClass("dhm-tiled")){
                    $list.find('span.text-black').hide();
                    $list.find('span.order').hide();
                    $list.find('span.freeSipping').hide();
                    $list.find('a.list-cont').css('height','42px');
                } else {
                    $list.find('span.text-black').show();
                    $list.find('span.order').show();
                    $list.find('span.freeSipping').show();
                    $list.find('a.list-cont').css('height','130px');
                }
              /*  if ($list.hasClass("dhm-tiled")) {
                    self.listDataset.vt = 1;
                    document.location.href = self.sortOpt.sortUrl + $.param(self.listDataset);
                } else {
                    self.listDataset.vt = 2;
                    document.location.href = self.sortOpt.sortUrl + $.param(self.listDataset);
                }*/
            });
        },
//		可能感兴趣的
       /* mayInterest: function () {
            var self = this;
            var $mi = DHM.Common.domExist(self.mayIOpt.id);
            if (!$mi) return;
            var cid = $mi.get(0).dataset.cid, pp = $mi.data("pp"), key = $mi.data("key");
            DHM.Common.request({
                url: self.mayIOpt.url,
                data: {cid: cid, pp: pp, key: key},
                type: "GET",
                dataType: "html",
                scope: self,
                fn: self.responseMI,
                fnParam: $mi
            });
        },*/
        responseMI: function (data, scope, param) {
            var self = scope, $mi = param;
            $mi.html(data);
            var len = $mi.find("li").length;
            var w = 125;
            DHMSliding({
                element: $mi[0],
                distance: 250,
                totalWidth: w * len + 10,
                containerWidth: $(window).width(),
                speed: 500
            });
        },
//		sort by
      /*  _sortDom: function ($sortLayer) {
            var self = this;
            if (!self.sortEle) {
                var param = self.listDataset;
                var sort = $.trim(param.sort),
                    stype = $.trim(param.stype);
                var ele = ['<ul>'];
                ele.push('<li ', sort == "1" ? 'class="sort-active"' : '', '>', sort == "1" ? '<span>' : '<a data-sort="1" data-stype="">', msgObj["l_best_match"], sort == "1" ? '</span>' : '</a>', '</li>');
                ele.push('<li ', (sort == "2" && stype == "up") ? 'class="sort-active"' : '', '>', (sort == "2" && stype == "up") ? '<span>' : '<a data-sort="2" data-stype="up">', msgObj["l_price_lth"], (sort == "2" && stype == "up") ? '</span>' : '</a>', '</li>');
                ele.push('<li ', (sort == "2" && stype == "down") ? 'class="sort-active"' : '', '>', (sort == "2" && stype == "down") ? '<span>' : '<a data-sort="2" data-stype="down">', msgObj["l_price_htl"], (sort == "2" && stype == "down") ? '</span>' : '</a>', '</li>');
                ele.push('<li ', sort == "3" ? 'class="sort-active"' : '', '>', sort == "3" ? '<span>' : '<a data-sort="3" data-stype="down">', msgObj["l_items_htl"], sort == "3" ? '</span>' : '</a>', '</li>');
                ele.push('<li ', sort == "4" ? 'class="sort-active"' : '', '>', sort == "4" ? '<span>' : '<a data-sort="4" data-stype="">', msgObj["l_recent_list"], sort == "4" ? '</span>' : '</a>', '</li>');
                ele.push('<li ', sort == "5" ? 'class="sort-active"' : '', '>', sort == "5" ? '<span>' : '<a data-sort="5" data-stype="">', msgObj["l_feedback"], sort == "5" ? '</span>' : '</a>', '</li>');
                ele.push('</ul>');
                $sortLayer.append(ele.join(""));
                $sortLayer.delegate("a", self.clickEvent, function (e) {
                    self.listDataset.sort = $(this).data("sort");
                    self.listDataset.stype = $(this).data("stype");
                    self.listDataset.pagenum = 1;
                    document.location.href = self.sortOpt.sortUrl + $.param(self.listDataset);
                    e.preventDefault();
                    e.stopPropagation();
                });
                self.sortEle = $(ele.join(""));
            }
            return self.sortEle;
        },*/
       /* sortBy: function () {
            var self = this,
                exist = DHM.Common.domExist;
            var $sort = exist(self.sortOpt.sortId),
                $sortLayer = exist(self.sortOpt.sortLayerId);
            if (!$sortLayer) return;
            self._sortDom($sortLayer);
            $sort.delegate($sort, self.touchEvent, function (e) {
                var $e = $(this), $s = self._shadow(self);
                $e.toggleClass("uo-sort-active");
                $s.toggle();
                $sortLayer.toggle();
                e.preventDefault();
                e.stopPropagation();
                $s.get(0).addEventListener(self.touchEvent, function (e) {
                    $sort.removeClass("uo-sort-active");
                    $s.hide();
                    $sortLayer.hide();
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
            });
        },*/
//		filter
        _filterDom: function ($filterLayer) {
            var self = this;
            if (!self.filterEle) {
                var ds = self.listDataset;
                var ele = ['<ul>',
                    '<li><span class="tit">', msgObj["filter"], '</span><span class="j-flCancel cancel">', msgObj["cancel"], '</span></li>',
                    '<li><span>', msgObj["cas"], '</span><span class="j-flCas cas dhm-rt-arrow">', ds.cid ? $filterLayer.data("cataname") : msgObj["l_all_cas"], '</span></li>',
                    '<li>',
                    '<span>', msgObj["price"], '</span>',
                    '<div class="price">',
                    '<input type="number" value="', ds.maxPrice, '" placeholder="', msgObj["max"], '" name="maxPrice"/>',
                    '<span>&nbsp;-&nbsp;</span>',
                    '<input type="number" value="', ds.minPrice, '" placeholder="', msgObj["min"], '" name="minPrice"/>',
                    '</div>',
                    '</li>',
                    '<li>',
                    '<span>', msgObj["l_min_order"], '</span>',
                    '<div class="price">',
                    '<input type="number" value="', ds.minorder, '" placeholder="', msgObj["less_than"], '" name="minorder"/>',
                    '</div>',
                    '</li>',
                    '<li><span>', msgObj["free_shipping"], '</span><span data-name="fs" data-value="', ds.fs, '" class="j-flChange btn', (ds.fs == '1') ? ' btn-active' : '', '"></span></li>',
//					'<li><span>On Sale</span><span class="j-flChange btn"></span></li>',
//					'<li><span>In Stock</span><span class="j-flChange btn"></span></li>',
                    '<li><span>', msgObj["wholesale"], '</span><span  data-name="wholesaleonly" data-value="', ds.wholesaleonly, '" class="j-flChange btn', (ds.wholesaleonly == '1') ? ' btn-active' : '', '"></span></li>',
                    '<li><span>', msgObj["reviews"], '</span><span data-name="reviews" data-value="', ds.reviews, '" class="j-flChange btn', (ds.reviews == '1') ? ' btn-active' : '', '"></span></li>',
                    '<li><div class="confirm-btn">',
                    '<input type="button" value="', msgObj["apply"], '" class="j-flApply"/>', '<input type="button" value="', msgObj["reset"], '" class="j-flReset reset"/>',
                    '</div></li>',
                    '</ul>',
                    '<div class="j-flCancel cancel-img"></div>'];
                $filterLayer.append(ele.join(""));
                self.filterEle = $(ele.join(""));
                $filterLayer.find("input").on("keyup", function () {
                    var numbers = parseFloat(this.value)
                    if (!numbers || numbers < 0) {
                        this.value = '';
                    }
                });
                $filterLayer.delegate(".j-flCancel", self.clickEvent, function (e) {
                    self.cancelFilter(e, self);
                });
                $filterLayer.delegate(".j-flChange", self.clickEvent, self.changeFilter);
                $filterLayer.delegate(".j-flReset", self.clickEvent, function (e) {
                    self.resetFilter(e, $filterLayer, self)
                });
                $filterLayer.delegate(".j-flApply", self.clickEvent, function (e) {
                    self.applyFilter(e, $filterLayer, self)
                });
                $filterLayer.delegate(".j-flCas", self.clickEvent, function (e) {
                    var $cas = DHM.Common.domExist(self.casOpt.casId);
                    self._translate($cas, 0);
                });

            }
            return self.filterEle
        },
     /*   applyFilter: function (e, $filterLayer, scope) {
            var self = scope;
            var $cas = DHM.Common.domExist(self.casOpt.casId);
            $filterLayer.find(".j-flChange").each(function (i, e) {
                var $e = $(e);
                self.listDataset[$e.data("name")] = $e.data("value");
            });
            self.listDataset["minPrice"] = $filterLayer.find("input[name='minPrice']").val();
            self.listDataset["maxPrice"] = $filterLayer.find("input[name='maxPrice']").val();
            self.listDataset["minorder"] = $filterLayer.find("input[name='minorder']").val();
            var cid = "";
            $cas.find("li").each(function (i, e) {
                if ($(e).hasClass("cas-active")) {
                    cid = e.dataset.cid;
                }
            });
            if (cid) {
                self.listDataset["cid"] = cid;
            }
            if ($filterLayer.find(".j-flCas").text() == msgObj["l_all_cas"]) {
                self.listDataset["cid"] = "";
            }
            self.listDataset.pagenum = 1;
            document.location.href = self.sortOpt.sortUrl + $.param(self.listDataset);
            e.preventDefault();
            e.stopPropagation();
        },*/
       /* resetFilter: function (e, $filterLayer, scope) {
            $filterLayer.find(".j-flChange").each(function (i, e) {
                $(e).removeClass("btn-active");
                $(e).data("value", 0);
            });
            $filterLayer.find("input[type='number']").val("");
            if (!scope.listDataset.key) {
                $filterLayer.find(".j-flCas").text($filterLayer.data("cataname"));
                var $cas = DHM.Common.domExist(scope.casOpt.casId);
                $cas.find("li").removeClass("cas-active")
            } else {
                $filterLayer.find(".j-flCas").text(msgObj["l_all_cas"]);
            }
            e.preventDefault();
            e.stopPropagation();
        },*/
        /*changeFilter: function (e) {
            var $e = $(this);
            $e.toggleClass("btn-active");
            if ($e.hasClass("btn-active")) {
                $(this).data("value", "1");
            } else {
                $(this).data("value", "0");
            }
            e.preventDefault();
            e.stopPropagation();
        },*/
      /*  filter: function () {
            var self = this,
                exist = DHM.Common.domExist;
            var $filter = exist(self.filterOpt.filterId),
                $filterLayer = exist(self.filterOpt.filterLayerId);
            if (!$filterLayer) return;
            self._filterDom($filterLayer);
            $filter.delegate($filter, self.touchEvent, function (e) {
                var $s = self._shadow(self);
                $s.toggle();
                self._translate($filterLayer, 0);
                e.preventDefault();
                e.stopPropagation();
                $s.get(0).addEventListener(self.touchEvent, function () {
                    self.cancelFilter(e, self)
                }, false);
            });
        },*/
        cancelFilter: function (e, scope) {
            var self = scope;
            var $s = self._shadow(self),
                $filterLayer = DHM.Common.domExist(self.filterOpt.filterLayerId),
                $cas = DHM.Common.domExist(self.casOpt.casId);
            self._translate($filterLayer, "100%");
            self._translate($cas, "100%");
            $s.hide();
            if (!e) return;
            e.preventDefault();
            e.stopPropagation();
        },
        _deleteNode:function($d){
            $node = $d.html();
            $node.closest('li').remove();
        },

//		cas opr
        casOpr: function () {
            var self = this;
            var $cas = DHM.Common.domExist(self.casOpt.casId),
                 $editCat = DHM.Common.domExist(self.cateOpt.editId),
                $filterLayer = DHM.Common.domExist(self.filterOpt.filterLayerId);
            if (!$cas) return;

            $cas.delegate(self.casOpt.cancelId, self.clickEvent, function (e) {
                self._translate($cas, "100%", true);
                e.preventDefault();
                e.stopPropagation();
            });
            $cas.delegate(self.casOpt.hideId, self.clickEvent, function (e) {
                self.cancelFilter(e, self);
                e.preventDefault();
                e.stopPropagation();
            });
            $cas.delegate(".chooseCategory li", self.clickEvent, function (e) {
                if ($(this).hasClass("tit")) return;
                var name = $(this).find("span").text();
                $filterLayer.find(".j-flCas").text(name);
                $(this).addClass("cas-active").siblings("li").removeClass("cas-active");
                var lispan = $(this).find('span').html();
                var lis = $editCat.find('li');
                if(lis.length<3){
                    $editCat.append('<li><a href="javascript:;">' +  lispan + '<span class="closeCas"></span>' + '</a></li>');
                    e.preventDefault();
                    e.stopPropagation();
                }else{
                    alert('对不起，最多选择5个类目');
                }
            });
            $editCat.delegate( '.closeCas',self.clickEvent,function(){
                var $spans = $cas.find('li').find('.closeCas');
                var lengths = $spans.length;
                if(lengths>1){
                    $(this).closest('li').remove();
                }
            });
        },
//		page
        /*pageOpr: function () {
            var self = this;
            var $page = DHM.Common.domExist(self.pageOpt.pageId);
            if (!$page) return;
            var $a = $page.find("a");
            var $pre = $a.first(), $next = $a.last(), maxPage = $page.data("maxpage");
            var pagenum = self.listDataset.pagenum;
            if (maxPage <= 1) {
                $pre.hide();
                $next.hide();
            }
            if (!pagenum || pagenum == 1) {
                pagenum = 1;
                $pre.hide();
            } else {
                $pre.show();
            }
            if (pagenum >= maxPage) {
                $next.hide();
            } else {
                $next.show();
            }
            $pre.delegate($pre, self.touchEvent, function (e) {
                self.listDataset.pagenum = parseInt(pagenum) - 1;
                document.location.href = self.sortOpt.sortUrl + $.param(self.listDataset);
                e.preventDefault();
                e.stopPropagation();
            });
            $next.delegate($next, self.touchEvent, function (e) {
                var nowPage = parseInt(pagenum) + 1;
                if (nowPage > maxPage) {
                    self.listDataset.pagenum = maxPage;
                } else {
                    self.listDataset.pagenum = nowPage;
                    document.location.href = self.sortOpt.sortUrl + $.param(self.listDataset);
                }
                e.preventDefault();
                e.stopPropagation();
            });
        },*/
        lazyLoad: function () {
            var self = this;
            var $list = DHM.Common.domExist(self.lModeOpt.lId);
            if (!$list) return;
            $list.find("img").each(function (i, e) {
                var $e = $(e);
                if ($e.data("src")) {
                    $e.attr("src", $e.data("src"));
                }
            });
        },

        init: function () {
            DHM.Init.logoSummary();
            DHM.Init.loginState();
            var self = this;
            self.unfoldCategory();
            self.listMode();
            self.lazyLoad();
            self.casOpr();
        }
    };
    new List();
    $("#J_language").click(function () {
        $("#J_shadow").show();
        $("#J_languageCont").show();
    });
    $(".j-languageCancel").click(function () {
        $("#J_shadow").hide();
        $("#J_languageCont").hide();
    });
    $("#J_languageCont").find("li").click(function () {
        if ($(this).hasClass("tit")) {
            return;
        }
        $(this).addClass("active").siblings().removeClass("active");
    });
    //点击more显示更多，点击fewer隐藏更多（ldq add）
  /*  $(".moreLink").click(function () {
        if ($(this).html() == "+ More") {
            $(this).siblings("div.moreRelated").show();
            $(this).html("- Fewer");
        } else {
            $(this).siblings("div.moreRelated").hide();
            $(".moreLink").html("+ More");
        }
    });*/
});
