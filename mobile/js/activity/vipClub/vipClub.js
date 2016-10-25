/**
 * Created by zhaojing1 on 2014/12/15.
 */
Zepto(function($){
	DHM.Init.logoSummary();
	DHM.Init.loginState();
	function VIPClub(){
		this.init();
	}
	VIPClub.prototype={
		construction:VIPClub,
		vipRes:function(data,scope){
			var self=scope;
			var banner=data.banners;
			var len=banner.length;
			var page=['<ul class="j-slidePage v-page v-page1">'],html=[];
			for(var i=0;i<len;i++){
				var ban=banner[i];
				var href="";
				if(ban.cid){
					href="http://m.dhgate.com/wholesale/"+ban.cname.replace(/[ ]/g,"+")+"/c"+ban.cid+".html";
				}else if(ban.item_code){
					href="http://m.dhgate.com/product/al/"+ban.item_code+".html";
				}else if(ban.link_type=="Lp"){
					href=ban.link_url_wap;
				}
				html.push(['<li><a href="',href,'#vipClub-WAP-banner',(i+1),'"><img src="',ban.img_url,'"/></a></li>'].join(""));
				page.push('<li ',(i==0)?'class="current"':'','></li>');
			}
			page.push('</ul>');

			$("#J_banner").append(page.join(""));
			$("#J_bannerCon").append(html.join(""));
			DHMSlide({
				element:"#J_banner",
				con:"#J_bannerCon",
				page:$("#J_banner").find(".j-slidePage"),
				loop:true,
				autoRun:true,
				speed:500,
				delayTime:3500,
				res:true
			});
			var cas=data.categroies;
			if(cas[0].vipList){
				self.getVipList(cas,scope);
			}else{
				self.getCid(cas,self);
			}
		},
		getVipList:function(cas,scope){
			var len=cas.length;
			for(var i=0;i<len;i++){
				var c=cas[i];
				var data={};
				data["pros"]=c.vipList;
				scope.cidRes(data,scope,c.name);
			}
		},
		getCid:function(cas,scope){
			var len=cas.length;
			for(var i=0;i<len;i++){
				DHM.Common.request({
					url:"http://m.dhgate.com/vipPlusProList.do?cid="+cas[i].cid+"&num=4",
					fn:scope.cidRes,
					scope:scope,
					fnParam:cas[i].name
				});
			}
		},
		cidRes:function(data,scope,name){
			var self=scope,$item=$("#J_vipItems");
			var datas=data.pros;
			var len=datas.length;
			var html=['<div class="v-items">',
				'<h3>',name,'</h3>',
				'<div class="v-container">','<ul class="j-slideBox v-con">'
			];
			for(var i=0;i<len;i++){
				var d= datas[i];
				if(i%2==0){
					html.push('<li>');
				}
				var tarcking='';
				if(d.itemcode){
					tarcking='#vipClub-WAP-'+d.itemcode;
				}
				html.push('<div class="pro">','<a href="',d.producturl,tarcking,'"><img src="',d.img,'" alt="" /></a>');
				html.push('<p class="info">',d.productname,'</p>');
				html.push('<p class="dp">',d.price,'</p>');
				html.push('<p class="bp">',d.beforeprice ,'</p></div>');
				if(i%2==1){
					html.push('</li>');
				}
			}
			html.push('</ul><ul class="j-slidePage v-page"></ul></div></div>');
			$item.append(html.join(""));
			var $e=$(".j-slideBox").last();
			var $p=$e.parent();
			var $page=$e.next();
			var len=$e.find("li").length, html=[];
			for(var i=0; i<len; i++){
				html.push('<li ',(i==0)?'class="current"':'','></li>');
			}
			$page.html(html.join(''));
			DHMSlide({
				element:$p,
				con:$e,
				page:$page,
				width:300,
				speed:500
			});
		},
		init:function(){
			var self=this;
			DHM.Common.request({
				url:"http://m.dhgate.com/activities/promotion/app_vipclub.html",
				fn:self.vipRes,
				scope:self
			});
		}
	};
	new VIPClub();
});