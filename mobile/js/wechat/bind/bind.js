function bindSub(isBind,appid,domina){
	if(!validate()){
		$("#tip").show();
		return;
	}
	var uname = $("input[name=uname]").val();
	var upass = $("input[name=upass]").val();
	$.ajax({
        url: "/validuser.do",
        data: {
			uname:uname,
			upass:upass
		},
        type: 'GET',
        async: false,
        success: function(data){
        	if(data=="success"){
        		if(isBind == "unbind"){
        			var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http://"+domina+"/unbind.do?userStr="+uname+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
        		}else if(isBind == "bind"){
	        		var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http://"+domina+"/bind.do?userStr="+uname+"/"+upass+"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        		}
	        	var form = $("#subform")[0];
	        	form.action = url;
	        	form.submit();
        	}else{
        		$("#tip").show();
        		//alert("noUser");
        	}
        }
    });
}

function validate(){
	var uname = $("input[name=uname]").val();
	var upass = $("input[name=upass]").val();
	if(uname == ""){
		return false;
	}
	if(upass == ""){
		return false;
	}
	$("input[name=uname]").val(uname.toLowerCase());
	return true;
}


/**
*验证信息
**/
function validateUserInfo(){
	var email = $("#email").val();
	var telephone = $("#telephone").val();
	
	//对电子邮件的验证 
    var myreg =/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	//对于手机号码的验证 11位数字
	var mobile=/^\d{11}$/;
	if(!(email != '' && myreg.test(email))){
		return false;
	}
	if(!(telephone != '' && mobile.test(telephone))){
		return false;
	}
	return true;
}


/**
*提交信息
**/
function subInfo(){
	if(validateUserInfo()){
		$("#userForm")[0].submit();
	}else{
		$("#tip").show();
	}
	
}