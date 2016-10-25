/**
 * Created by zhaojing1 on 2014/12/31.
 */
Zepto(function($){
	function Clearance(){
		this.opt={
//			PUrl:"aaa.json?",
			CUrl:"http://cms.dhgate.com/cmsapi/clearancesale/get_categorys_ajax.do?isblank=true&promoid=244055&callback=?",
			PUrl:"http://cms.dhgate.com/cmsapi/clearancesale/get_products_ajax.do?isblank=true&callback=?&site=m&sortField=itemsSold&sortType=desc&promoid=244055&bigCategoryId=",
			$main:$(".j-cr-main"),
			$con:$("#J_crCon")
		};
		DHM.Init.logoSummary();
		DHM.Init.loginState();
		this.init();
	}
	Clearance.prototype.getCas=function(){
		var self=this;
		DHM.Common.request({
			url:self.opt.CUrl,
			fn:self.casRes,
			scope:self
		});
	};
	Clearance.prototype.casRes=function(data,scope){
		var self=scope;
		if(!data) return;
		var len=data.length,html=[],$con=self.opt.$con;
		for(var i=0;i<len;i++){
			var d=data[i];
			html.push('<div class="cr-sec"><h3 class="j-cr-tit tit"><a>');
			html.push(d.categoryName);
			html.push('</a></h3><div class="j-cr-main" data-pagenum="1" data-cid="',d.categoryId,'" style="display:none">');
			html.push('<ul class="cont"></ul><div class="j-more dh-more"><a href="javascript:;">More<span></span></a></div>');
			html.push('</div></div>');
		}
		$con.append(html.join(""));
		var $d=$con.find(".j-cr-main").first();
		self.getPro(self,$d);
		$con.find(".j-cr-main").first().show();
		self.mToggle();
		self.morePro(self,$con);
	};
	Clearance.prototype.morePro=function(scope,$con){
		$con.find(".j-more").click(function(){
			var $p=$(this).parent();
			var pn = parseInt($p.get(0).dataset.pagenum);
			$p.get(0).dataset.pagenum=pn+1;
			scope.getPro(scope,$p);
		});
	};
	Clearance.prototype.getPro=function(scope,$d){
		var self=scope;
		var ds=$d[0].dataset;
		DHM.Common.request({
			url:self.opt.PUrl+ds.cid+"&pageNo="+ds.pagenum,
			fn:self.ProRes,//成功后的方法
			scope:self,//成功调用方法所用的作用域
			fnParam:$d//成功后调用方法所用的参数
		});
	};
	Clearance.prototype.ProRes=function(data,scope,$d){
		var self=scope;
		if(!data) return;
		var len=data.length,html=[];
		for(var i=0;i<len;i++){
			var d=data[i];
			html.push('<li><div class="cr-pro">');
			html.push('<a class="cr-img" href="', d.productShowUrl.replace("www.dhgate.com","m.dhgate.com"),'">');
			html.push('<img src="',d.imageShowUrl,'" alt="" /></a>');
			html.push('<div class="pro-info">',d.productname,'</div>');
			html.push('<div class="pre-price">$',d.price,' / ',d.sizeSpec,'</div>');
			html.push('<div class="now-price"><em>$',d.discountPrice,'</em> / ',d.sizeSpec,'</div>');
			html.push('</div></li>');
		}
		$d.find("ul").append(html.join(""));
	};
	Clearance.prototype.mToggle=function(){
		var self=this;
		var $tits=$(".j-cr-tit");
		$tits.click(function(){
			var $con=$(this).next();
			if(!$con.find("ul li").get(0)){
				self.getPro(self,$con);
			}
			var ifShow=$con.css("display");
			$con.hide();
			if(ifShow=="block") return;
			$con.show();
		});
	};
	Clearance.prototype.init=function(){
		this.getCas();
	};
	new Clearance();
});