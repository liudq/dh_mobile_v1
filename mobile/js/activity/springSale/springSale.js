/**
 * Created by xiaonannan on 2015/04/24.
 */

Zepto(function($) {
	//DHM.Init.logoSummary();
	//DHM.Init.loginState();


	function endActiveEgg() {

		var countUrl = "http://m.dhgate.com/buyertime.do?callback=?";

		$.getJSON(countUrl, function(data) {
			if (!data) return;
			var endTime = new Date("2015/05/05 23:00:00").getTime(); //活动结束时间(北京时间)
			var serverTime = new Date(data.time * 1).getTime();
			if (serverTime > endTime) {
				// 添加时间空间id
				$("header").before('<div id="J_endActiveEgg" style="overflow:hidden; background: none repeat scroll 0% 0% rgb(255, 249, 225); border-bottom: 1px solid rgb(253, 218, 134); padding: 7px 10px 10px 10px;  line-height: 17px; "><p>The Easter Egg Hunt has ended, but you can still purchase these items at their regular price.</p></div>');
				var divNotesHieght = $("#J_endActiveEgg").height() - 17;
				$("#J_endActiveEgg").css({
					height: "0px"
				});
				$("#J_endActiveEgg").animate({
					opacity: 1,
					height: divNotesHieght + "px",
					color: '#000'
				}, 1500, 'ease', function() {
					$(this).show();
				});
				setTimeout(function() {
					$("#J_endActiveEgg").animate({
						opacity: 0,
						height: "0",
					}, 1500, 'ease-in', function() {
						$(this).hide();
					});
				}, 12000);
			}
		});

	}


	//设置类目滑动
	DHMSlide({
		element: "#j-slideBox",
		con: "#j-slideBoxCon",
		page: null,
		width: 130,
		speed: 500,
		autoRun: false, //是否自动运行
		loop: false,
		distance: 0
	});


	DHM.curpage = 0;
	var inRequest = false;
	var pageList = {};
	DHM.easterpromotion = {};
	var categoryId = 103;
	var eggNumId = 1;

	// 类目切换
	$("#j-slideBoxCon li a").click(function() {

		if ($(this).parent().hasClass("current")) {
			return;
		}
		categoryId = $(this).attr("categoryId");
		eggNumId = $(this).attr("eggNumId");
		console.log(categoryId + "" + eggNumId);
		$(this).parent().siblings().removeClass("current");
		$(this).parent().addClass("current");

		$("#J_dailyItems").html("");
		DHM.curpage = 0;
		pageList = {};
		//初始化调用 （初始化加载第几页，或跳转到第几页）
		DHM.easterpromotion.toPage(1);
		$('#j-more').show();

		//var bigCategoryId = DHM.easterpromotion.getQueryString("cid");

	});



	//获取浏览器URL参数方法
	DHM.easterpromotion.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return "";
	}

	//var bigCategoryId = DHM.easterpromotion.getQueryString("cid");
	//var promoId = DHM.easterpromotion.getQueryString("promoid");

	//隐藏更多按钮
	function hideMore() {
		$('#j-more').hide();
	}

	//随机数据
	function randomsort(a, b) {
		return Math.random() > .5 ? -1 : 1; //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1  
	}

	//请求成功要执行的方法
	DHM.easterpromotion.requestSuccess = function(data) {
		console.log(data.date.list.length);
		var datalistLength = data.date.list.length;
		if (datalistLength <= 0) {
			hideMore();
			return;
		} else if (0 < datalistLength && datalistLength < 50) {
			hideMore();
		}
		inRequest = false;
		setEasterEggItems(data);
	}

	//绘制正常产品
	function setEasterEggItems(data) {
		console.log(data);
		if (!data) return;
		var datalist = data.date.list;
		datalist = datalist.sort(randomsort); //数组随机

		var len = datalist.length;
		var $daily = $("#J_dailyItems");
		for (var i = 0; i < len; i++) {
			var dd = datalist[i];
			var url = dd.productUrl.replace("www.dhgate.com", "m.dhgate.com");

			if (dd.isEgg == "false") {
				var html = ['<li>',
					'<div class="list-img">',
					'<a href=', url, '#wap_lp-Spring-0427-', dd.itemcode, '><img src=', dd.imageurl, ' /></a>',
					'</div>',
					'<a href=', url, '#wap_lp-Spring-0427-', dd.itemcode, ' class="list-cont">',
					'<span class="text-black">', dd.title, '</span>',
					'</a>',
					'</li>'
				];
			}

			$daily.append(html.join(""));
		}

	}

	//中奖展示模块

	//防止多次重复请求方法
	DHM.easterpromotion.toPage = function(page) {
		DHM.curpage = page;
		inRequest = true;
		if (pageList[page]) {
			console.log('page in use');
			return;
		} else {
			pageList[page] = true;
		}

		// 获取普通产品列表
		DHM.Common.request({
			// url:"msearch.do",
			//url:"http://m.dhgate.com/msearch.do?instock=0&stype=down&sort=3&fs=0&pagenum=1&pagesize=3&cid=135&eggnum=3",
			url: "http://m.dhgate.com/msearch.do?instock=0&stype=down&sort=3&fs=0&pagenum=" + page + "&pagesize=50&cid=" + categoryId + "&eggnum=" + eggNumId,
			//url:"http://m.dhgate.com/msearch.do?instock=0&stype=down&sort=3&fs=0&pagenum=1&pagesize=5&cid=002&callback=callback",
			// url:"http://cms.dhgate.com/cmsapi/clearancesale/get_products_ajax.do?isblank=true&callback=?&sitse=m&language=en&sortField=itemsSold&sortType=desc&pageNo="+page+"&promoid="+promoId+"&bigCategoryId="+bigCategoryId,
			type: "GET",
			dataType: "jsonp",
			fn: DHM.easterpromotion.requestSuccess //成功后的方法
		});

	}

	//绑定页面后加载的dom方法
	$('.J-EggItems').live('click', function() {

		var url = $(this).attr("eggtag");
		$("#eggShowId").show();
		$("#eggShowId").find("a").attr("href", url);
		DHM.easterpromotion.shadow(self).show();

	});

	//绑定页面后加载的dom方法 关闭中奖弹层
	$('#eggShowId a').live('click', function() {
		$("#eggShowId").hide();
		DHM.easterpromotion.shadow(self).hide();
	});



	//创建遮罩层shadow
	DHM.easterpromotion.shadow = function(scope) {
		var self = scope;
		if (!self.shadowEle) {
			var shadow = document.createElement("div");
			shadow.style.cssText = "display:none;width:100%;height:100%;position:fixed;top:0;left:0;z-index:99;zoom:1;background:#000;opacity:0.3";
			$("body").append(shadow);
			self.shadowEle = $(shadow);
		}
		return self.shadowEle;
	}


	//创建Dialog
	function pubDialog() {
		this.opt = {
			cTshare: "Tshare",
			//hasLogin:false,
			closeDialog: null
		};
		this.init();
	}

	pubDialog.prototype.eType = function() {
		var isSupportTouch = "ontouchend" in document ? true : false;
		if (isSupportTouch) {
			return 'touchend';
		} else {
			return 'click';
		}
	};

	pubDialog.prototype.closeDialog = function() {
		var self = this;
		if (!self.opt.closeDialog) {
			var html = ['<div class="tg-close-layer">',
				'<h3>SHARE</h3>',
				'<p class="j-cLayer-cont"></p>',
				'<div class="closeBtn"><a href="javascript:;">Cancel</a></div>',
				'</div>'
			];
			var str = $(html.join(""));
			str.appendTo("body");
			str.find(".closeBtn").on(self.eType(), function(e) {
				str.hide();
				self.$shadow.hide();
				e.preventDefault();
				e.stopPropagation();
			});
			self.opt.closeDialog = str;
		}
		return self.opt.closeDialog;
	};
	pubDialog.prototype.showDialog = function() {
		var self = this;
		var str = ['<div class="btnshare">',
			'<a onclick="loadPage(\'facebook\');" href="javascript:void(0);" class="facebook" title="Share on Facebook">Share to Fackbook</a>',
			'</div>',
			'<div class="btnshare">',
			'<a onclick="loadPage(\'twitter\');" href="javascript:void(0);" class="twitter" title="Share on Twitter">Share to Twitter</a>',
			'</div>'
		];
		$("#Tshare").click(function() {
			var $close = self.closeDialog();
			$close.find(".j-cLayer-cont").html(str.join(""));
			self.$shadow.show();
			$close.show();
		})
	};

	pubDialog.prototype.init = function() {
		var self = this;
		self.showDialog();
		self.$shadow = $('<div class="tg-shadow"></div>');
		$("body").append(self.$shadow);
	};


	//分享模块 
	loadPage = function(site) {
		var rawURL = window.location.href;
		if (rawURL.indexOf("#") > 0) {
			rawURL = rawURL.substring(0, rawURL.indexOf("#"))
		}
		var currentURL = encodeURIComponent(rawURL);

		var title = window.document.title || '';
		title = encodeURIComponent(title);
		//var bodytext = encodeURIComponent(pageDescription);
		var newURL;
		switch (site) {
			case "facebook":
				newURL = "http://www.facebook" + ".com/share.php?src=bm&v=4" + "&u=" + currentURL + "&t=" + title;
				break;
			case "twitter":
				newURL = "https://twitter" + ".com/intent/tweet?status=" + title + ":+" + currentURL;
				break;
		}
		window.open(newURL, "bookmarkWindow")
	}

	//更多按钮
	$('#j-more').click(function() {
		if (inRequest) {
			//console.log('error');
			return;
		}
		DHM.curpage = DHM.curpage + 1;
		DHM.easterpromotion.toPage(DHM.curpage);

	});

	//初始化调用 （初始化加载第几页，或跳转到第几页）
	DHM.easterpromotion.toPage(1);
	//初始化dialog
	new pubDialog();
	//初始化endActiveEgg
	endActiveEgg();
});