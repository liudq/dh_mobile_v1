/**
 * Created by zhaojing1 on 2015/1/20.
 */
Zepto(function($){
	var mrequest=function(o){
		var obj=$.extend({
			url:window.location.href,
			data:null,//传给url的参数
			type:"POST",
			dataType:"json",
			async:true,//是否异步
			fn:null,//成功后的方法
			scope:null,//成功调用方法所用的作用域
			fnParam:null//成功后调用方法所用的参数
		},o);
		$.ajax({
			url: obj.url,
			type:obj.type,
			data:obj.data,
			async:obj.async,
			dataType: obj.dataType,
			success: function(res){
				if(obj.fn){
					obj.fn(res,obj.scope,obj.fnParam);
				}
			},
			error: function(xhr, ts, et){
				console.log(xhr+"\n"+ts+"\n"+et);
				return false;
			}
		});
	};
	var translate=function($d,dist){
		var style=$d.get(0).style;
		style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration = '500ms';
		style.webkitTransform=style.transform=style.MozTransform='translateX('+dist+')';
		if(dist==0){
			var h=$d.height();var wh=$(window).height();
			$("body").css({'height':$(window).height(),'overflow':'hidden'});
			$d.css({"position":"absolute","height":(h>wh)?"auto":"100%"});
			setTimeout(function(){
				$d.css({"position":"absolute"});
			},500);
		}else{
			$("body").css({'height':'auto','overflow':'auto'});
			$d.css("position","fixed");
		}
	};
	function ShowLayer(){
		this.init();
	}
	ShowLayer.prototype={
		constructor:ShowLayer,
		getObj:function(){
			var obj={
				urlHash:'#Viewsdr',
				$dom:$(".j-sdr") ,
				$layer:$("#J_sdrLayer")
			};
			return obj;
		},
		show:function(){
			var self=this;
			var obj=self.getObj();
			var $d= obj.$dom;
			if(!$d) return;
			var $l= obj.$layer;
			var h= obj.urlHash;
			$d.click(function(e){
				translate($l,0);
				self.sdrOpr(self,$(this).attr("id"),$l);
				e.preventDefault();
				e.stopPropagation();
			});
			$l.delegate("nav .j-back","click",function(){
				translate($l,"100%");
				if(h=="#ViewAttr"){
					var text=["Selection:"];
					$(".j-skuSelect li.active").each(function(i,ele){
						if($(ele).find("img").get(0)){
							text.push(["[",$(ele).find("img").attr("title"),"]"].join(""));
						}else{
							text.push(["[",$(ele).text(),"]"].join(""));
						}
					});
					$("#J_skuSel").text(text.join(""));
				}
			});
		},
		sdrOpr:function(scope,id){
			var $nav=$("#J_sdrNav");
			switch(id){
				case "J_des":
					$nav.find("a[name='d']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_descriptionLayer");
					$d.show();
					$d.siblings("article").hide();
					break;
				case "J_reviews":
					$nav.find("a[name='r']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_reviewLayer");
					$d.show();
					$d.siblings("article").hide();
					break;
				default:
					$nav.find("a[name='s']").addClass("active").siblings().removeClass("active");
					var $d=$("#J_specificsLayer");
					$d.show();
					$d.siblings("article").hide();
			}
		},
		init:function(){
			var self=this;
			self.show();
		}
	};
	new ShowLayer();
	function DetailSdr(){
		var self=this;
		self.$reviewLayer=$("#J_reviewLayer");
		self.proid="";
		self.returnURL=window.location.href;
		self.goodId=".j-good";
		self.badId=".j-bad";
		self.$nav=$("#J_sdrNav");
		self.rImgId="#J_reviewImg";
		self.imgInfo={};
		self.init();
	}
	DetailSdr.prototype={
		constructor:DetailSdr,
		sdrTab:function(){
			var self=this;
			var $nav=self.$nav;
			$nav.delegate("a",'click',function(e){
				var $a=$(this);
				switch($a.attr("name")){
					case "d":
						$a.addClass("active").siblings().removeClass("active");
						var $d=$("#J_descriptionLayer");
						$d.show();
						$d.siblings("article").hide();
						break;
					case "r":
						$a.addClass("active").siblings().removeClass("active");
						var $d=$("#J_reviewLayer");
						$d.show();
						$d.siblings("article").hide();
						break;
					default:
						$a.addClass("active").siblings().removeClass("active");
						var $d=$("#J_specificsLayer");
						$d.show();
						$d.siblings("article").hide();
				}
				e.stopPropagation();e.preventDefault();
			});
		},
		goodClick:function($d,scope){
			var self=scope;
			mrequest({
				url:"http://m.dhgate.com/addReviewHelpful.do",
				data:{"reviewId":$d.parents(".j-reviewInfo")[0].dataset.reviewid},
				fn:self.goodRes,
				scope:self,
				fnParam:$d
			});
		},
		goodRes:function(data,scope,param){
			var $d=param;
			if(!$d.siblings().eq(0).hasClass("bad-active")){
				$d.addClass("good-active");
			}
			if(data.succ){
				var num=parseInt($d.find("em").text());
				var c=$d.find("em").attr("class");
				$(c).text(num+1);
			}
			if(data.login){
				window.location.href = "http://m.dhgate.com/login.do?returnURL="+scope.returnURL;
			}
			if(data.msg){
				var $p=$d.parent().parent();
				var $s=$p.children("span");
				if(!$s.get(0)){
					$p.append('<span>'+data.msg+'</span>');
				}else{
					$s.html('<span>'+data.msg+'</span>');
				}
			}
		},
		badClick:function($d,scope){
			var self=scope;
			mrequest({
				url:"http://m.dhgate.com/addReviewHelpless.do",
				data:{"reviewId":$d.parents(".j-reviewInfo")[0].dataset.reviewid},
				fn:self.badRes,
				scope:self,
				fnParam:$d
			});
		},
		badRes:function(data,scope,param){
			var $d=param;
			if(!$d.siblings().eq(0).hasClass("good-active")){
				$d.addClass("bad-active");
			}
			if(data.succ){
				var num=parseInt($d.find("em").text());
				var c=$d.find("em").attr("class");
				$(c).text(num+1);
			}
			if(data.login){
				window.location.href = "http://m.dhgate.com/login.do?returnURL="+scope.returnURL;
			}
			if(data.msg){
				var $p=$d.parent().parent();
				var $s=$p.children("span");
				if(!$s.get(0)){
					$p.append('<span>'+data.msg+'</span>');
				}else{
					$s.html('<span>'+data.msg+'</span>');
				}
			}
		},
		showMoreR:function(){
			var self=this;
			self.showMoreRNum=2;
			self.$reviewLayer.delegate('#J_showMoreR','click',function(e){
				mrequest({
					url:"http://m.dhgate.com/loadReviews.do",
					data:{
						"proid":self.proid,
						"ReviewPageNum":self.showMoreRNum,
						"ReviewPageSize":10,
						"ReviewType":0
					},
					fn:self.showMoreRRes,
					scope:self
				});
			});
		},
		showMoreRRes:function(data,scope){
			var self=scope;
			self.showMoreRNum++;
			var $con=self.$reviewLayer.find(".review-con");
			var res=data.result;
			var len=res.length;
			for(var i=0;i<len;i++){
				var d=res[i];
				var str=(d.responseDTO)?('<div class="response"><h4>Seller response:</h4><p>'+d.responseDTO.content+'</p></div>'):'';
				var html=['<div class="j-reviewInfo rc-info" data-reviewid="',d.reviewid,'"><div class="tit">',
					'<div class="tit-star dhstar-y dhm-lt"><div class="dh-star-g"><div class="dh-star-y" style="width:',d.score*20,'%"></div></div></div>',
					'<span class="review-from">By:',d.buyerNickname,'</span><span class="review-time">',d.createdDateText,'</span></div>',
					'<div class="con"><p class="p-res">',d.content,'</p>',str,
					'<div class="good-click"><span class="j-good good-ico"><em class="jg_',d.reviewid,'">',d.helpfulcount,'</em></span>',
					'<span class="j-bad bad-ico"><em class="jb_',d.reviewid,'">',d.helplesscount,'</em></span>',
					'<a href="http://m.dhgate.com/loadReportReview.do?proid=',self.proid,'&url=',self.returnURL,'&reviewid=',d.reviewid,'" class="dhm-rt">Report This Review</a></div></div></div>'
				];
				$con.append(html.join(''));
			}
			if((self.showMoreRNum-2)*10+len>=data.pageBean.count){
				$("#J_showMoreR").remove();
			}
		},
		getrImgLayer:function(scope,data){
			var self=scope;
			if(!self.$rImgLayer){
				var res=data.result;
				var len=res.length;
				var html=['<section class="r-all-img dh-layer">',
					'<h3><a href="javascript:;" class="j-back img-back"></a><span class="tit detail-arrow-left">Reviews</span></h3>',
					'<ul>'];
				for(var i=0;i<len;i++){
					html.push('<li id="r_',res[i].reviewid,'"><img src="',res[i].tdAttachDto.imageUrl,'" /></li>');
					self.imgInfo[""+res[i].reviewid]=res[i];
				}
				html.push('</ul>');
				if(len==10){
					html.push('<div class="dh-review-more"><a id="J_showMoreI" href="javascript:;">Show 10 more photos<span></span></a></div>');
				}
				html.push('</section>');
				self.$rImgLayer=$(html.join(''));
				$("body").append(self.$rImgLayer);
				self.$rImgLayer.delegate('.j-back','click',function(){
					DetailUtil.translate(self.$rImgLayer,'100%',true);
				});
				self.$rImgLayer.delegate("li",'click',function(){
					self.getSingleR($(this),self);
				});
				self.showMoreINum=2;
				self.$rImgLayer.delegate("#J_showMoreI",'click',function(){
					self.showMoreI($(this),self);
				});
			}
			return self.$rImgLayer;
		},
		showMoreI:function($d,scope){
			var self=scope;
			mrequest({
				url:"http://m.dhgate.com/loadReviews.do",
				data:{
					"proid":self.proid,
					"ReviewPageNum":self.showMoreINum,
					"ReviewPageSize":10,
					"ReviewType":1
				},
				fn:self.showMoreIRes,
				scope:self
			});
		},
		showMoreIRes:function(data,scope){
			var self=scope;
			self.showMoreINum++;
			var $con=self.$rImgLayer.find("ul")
			var len=data.length;
			for(var i=0;i<len;i++){
				var html=['<li id="r_',data[i].reviewid,'"><img src="',data[i].tdAttachDto.imageUrl,'" /></li>'];
				self.imgInfo[""+data[i].reviewid]=data[i];
				$con.append(html.join(""));
			}
		},
		getSingle:function(scope){
			var self=scope;
			if(!self.$singleLayer){
				var html=['<section class="r-single dh-layer"></section>'];
				self.$singleLayer=$(html.join(''));
				$("body").append(self.$singleLayer);
				self.$singleLayer.delegate(self.goodId,'click',function(e){
					self.goodClick($(this),self);
					e.stopPropagation();e.preventDefault();
				});
				self.$singleLayer.delegate(self.badId,'click',function(e){
					self.badClick($(this),self);
					e.stopPropagation();e.preventDefault();
				});
				self.$singleLayer.delegate('.j-back','click',function(){
					DetailUtil.translate(self.$singleLayer,'100%',true);
				});
			}
			return self.$singleLayer;
		},
		getSingleR:function($d,scope){
			var self=scope;
			var id= $d.attr("id").split("_")[1];
			var data=self.imgInfo[id];
			var $singleLayer=self.getSingle(self);
			var html=['<h3><a href="javascript:;" class="j-back img-back"></a><span class="tit detail-arrow-left">Reviews</span></h3><div class="r-single-img"><ul>'];
			var img=data.tdAttachDto.imgMap;
			for(var k in img){
				html.push('<li><img src="',img[k],'" /></li>');
			}
			html.push('</ul></div><div class="j-reviewInfo rc-info" data-reviewid="',id,'"><div class="tit">');
			html.push('<div class="tit-star dhm-lt"><div class="dh-star-g"><div class="dh-star-y" style="width:',data.score*20,'%"></div></div></div>')
			html.push('<span class="review-from">By:',data.buyerNickname,'</span><span class="review-time">',data.createdDateText,'</span>');
			html.push('</div><div class="con">');
			html.push('<p>',data.content,'</p>');
			html.push('<div class="good-click">');
			html.push('<span class="j-good good-ico"><em class="jg_',id,'">',data.helpfulcount,'</em></span>');
			html.push('<span class="j-bad bad-ico"><em class="jb_',id,'">',data.helplesscount,'</em></span>');
			html.push('<a href="http://m.dhgate.com/loadReportReview.do?proid=',self.proid,'&url=',self.returnURL,'&reviewid=',data.reviewid,'" class="dhm-rt">Report This Review</a></div></div></div>');
			$singleLayer.html(html.join(''));
			DHMSlide({
				element:$singleLayer,
				con:'ul',
				width:320,
				speed:600
			});
			translate($singleLayer,0);
		},
		reviewImg:function(){
			var self=this;
			self.$reviewLayer.delegate(self.rImgId,'click',function(e){
				mrequest({
					url:"http://m.dhgate.com/loadReviews.do",
					data:{
						"proid":self.proid,
						"ReviewPageNum":1,
						"ReviewPageSize":10,
						"ReviewType":1
					},
					fn:self.reviewImgRes,
					scope:self
				});
				e.stopPropagation();e.preventDefault();
			});
		},
		reviewImgRes:function(data,scope,param){
			var self=scope;
			var $l =self.getrImgLayer(self,data);
			translate($l,0);
		},
		init:function(){
			var self=this;
			self.sdrTab();
			self.$reviewLayer.delegate(self.goodId,'click',function(e){
				self.goodClick($(this),self);
				e.stopPropagation();e.preventDefault();
			});
			self.$reviewLayer.delegate(self.badId,'click',function(e){
				self.badClick($(this),self);
				e.stopPropagation();e.preventDefault();
			});
			self.reviewImg();
			self.showMoreR();
		}
	};
	new DetailSdr();
});