/**
 * Created by zhaojing1 on 2014/12/8.
 * 创建全局对象DHM 依赖zepto.js
 */
var DHM= DHM || {};
DHM.Common={
//	mobileHost:"",
	mobileHost:"/",
	eType:function(){
		var isSupportTouch="ontouchend" in document?true:false;
		if(isSupportTouch){
			return 'touchend';
		}else{
			return 'click';
		}
	},
	events:function(){
		var isSupportTouch="ontouchend" in document?true:false;
		if(isSupportTouch){
			return {start:'touchstart',move:'touchmove',end:'touchend'};
		}else{
			return {start:'mousetart',move:'mousemove',end:'mouseup'};
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
	request:function(o){
		var obj=$.extend({
			url:window.location.href,
			data:null,//传给url的参数
			type:"POST",
			dataType:"json",
			async:true,//是否异步
			fn:null,//成功后的方法
			scope:null,//成功调用方法所用的作用域
			fnParam:null,//成功后调用方法所用的参数
			fnError:null//网络异常的调用方法
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
				if(obj.fnError){
					obj.fnError(obj.url,obj.scope,obj.data);
				}
				return false;
			}
		});
	},
	bindEvents:function(obj){
//		obj={id:id,eventType:'click',fn:function}
		var $d=$(obj.id)
		$d.delegate($d,obj.eventType,obj.fn)
	}
};