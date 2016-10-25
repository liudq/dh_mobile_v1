/**
 * Created by zhaojing on 2014/10/22.
 */
;Zepto(function($){
//    与一些组件相关的js
    function DHMLogin(){
        this.opt={
            formId:".j-form",
            titId:".j-tit",
            nickNameUrl:"/isexisitnickname.do?nickname=",
            userNameUrl:"/isexisitbuyerusername.do?username="
        };
        this.vlidateFlag={};
        this.init();
    }
    DHMLogin.prototype={
        constructor:DHMLogin,
        loginState:function(){
            var value=DHM.Cookie.getCookie("b2b_nick_n");
            if(!value) return;
            var $loginState=$(".j-loginState");
            var html=msgObj['hello']+', ' + value + ' | <a href="/signout.do">'+msgObj['sign_out']+'</a>';
            $loginState.html(html);
        },
        changeTab:function(){
            var self=this;
            if(!$(self.opt.formId).get(0)) return;
            var $tit=$(self.opt.titId);
            $tit.on("click",function(){
                $tit.removeClass("cur-bg");
                $(this).addClass("cur-bg");
                $(this).parent().removeClass("mar-b-30");
                $(this).parent().siblings(".sec").addClass("mar-b-30");
                if($(this).next().css("display")=="none"){
                    $tit.siblings().hide();
                    $(this).siblings().show()
                }
            });
        },
        validPwd:function($d){
            var v = $d.val();
            var $p=$d.parent();
            if(!v||!$.trim(v)){
                $p.addClass("error-border");
                var regStr = 'A password is required. Please try again.';
                this.errorTips($p,regStr);
                return false;
            }else if($.trim(v).length>30||$.trim(v).length<6){
                $p.addClass("error-border");
                this.errorTips($p,msgObj['LOGIN_6_30_characters']);
                return false;
            }else{
                return true;
            }
        },
        validUsername:function($d){
            var v = $d.val();
            var reg = /^([\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$/,
                requiredStr = 'An email address is required. Please try again.',
                incorrectStr = 'Incorrect email address. Please try again';
            var $p=$d.parent();
            if(!v||!$.trim(v)){
                $p.addClass("error-border");
                this.errorTips($p,requiredStr);
                return false;
            }else if(!reg.test(v)){
                $p.addClass("error-border");
                this.errorTips($p,incorrectStr);
                return false;
            }else{
                return null;
            }
        },
        errorTips:function(target,str){
            if(!target.next('span.error-info').length){
                target.after("<span class='error-info'>"+str+"</span>");
            }else{
                target.find('.error-info').html(str);
            }
        },
        validNickName:function($d){
            var v = $d.val();
            var reg = /[^a-zA-Z0-9]/;
            var $p=$d.parent(),
                requiredStr = 'Nickname is required. Please try again.',
                SpecialStr = "Special characters can't be used. Please try again.";
            if(!v||!$.trim(v)){
                $p.addClass("error-border");
                this.errorTips($p,requiredStr);
                return false;
            }else if(reg.test(v)){
                $p.addClass("error-border");
                this.errorTips($p,SpecialStr);
                return false;
            }else{
                return null;
            }
        },
        validDpwd:function($d){
            var v = $d.val();
            var fv =$("#J_join").find("input[name='pwd']").val();
            var $p=$d.parent(),
                requiredStr = "Confirm password is required. Please try again.",
                notMatchStr = "Passwords do not match. Please try again.";
            if(!v||!$.trim(v)){
                $p.addClass("error-border");
                this.errorTips($p,requiredStr);
                return false;
            }else if ($.trim(v)!=$.trim(fv)) {
                $p.addClass("error-border");
                this.errorTips($p,notMatchStr);
                return false;
            }else{
                return true;
            }
        },
        validate:function(){
            var self=this;
            var $input=$("input[name]");
            $input.keyup(function(){
                var $val = $(this).val();
                if($val!=''){
                    $(this).next('.close-btn').show();
                }else{
                    $(this).next('.close-btn').hide();
                }
                
            }).focus(function(){
                var $p=$(this).parent();
                $p.addClass('foucusColor');
                $p.removeClass("error-border");
                $p.next(".error-info").remove();
                var offsetTop = $p.offset().top;
               
                document.body.scrollTop = offsetTop-8;
            }).blur(function(){
                var $d=$(this);
                var name=$d.attr("name");
                setTimeout(function(){
                    $d.parent().removeClass('foucusColor');
                    
                    switch(name){
                        case "pwd":
                            var f=self.validPwd($d);
                            self.vlidateFlag.pwd={f:f};
                            break;
                        case "userName":
                            var v=$d.val();
                            var $p=$d.parent();
                            var f = self.validUsername($d);
                            //alert($d.val())
                            if(f===null&&$p.parents("section").attr("id")=="J_join"){
                                $.ajax({
                                    url:self.opt.userNameUrl+v,
                                    dataType:"json",
                                    success: function(res){
                                        var existStr = "email address is already exist. Please try again";
                                        $p.removeClass('foucusColor');
                                        if(res.isexists=="1"){
                                            $p.addClass("error-border");
                                            self.errorTips($p,existStr);
                                            self.vlidateFlag.userName={f:false};
                                        }else{
                                            self.vlidateFlag.userName={f:true};
                                        }
                                    },
                                    error: function(xhr, ts, et){
                                         //alert(1111)
                                        console.log(xhr+"\n"+ts+"\n"+et);
                                        return false;
                                    }
                                });
                            }else{
                                self.vlidateFlag.userName={f:f};
                            }
                            break;
                        case "nickName":
                            var v=$d.val();
                            var $p=$d.parent();
                            var f=self.validNickName($d);
                            if(f===null){
                                $.ajax({
                                    url:self.opt.nickNameUrl+v,
                                    dataType:"json",
                                    success: function(res){

                                        if(res.isexists=="1"){
                                            $p.addClass("error-border");
                                            self.errorTips($p,'nickName is already exist. Please try again');
                                            
                                            self.vlidateFlag.nickName={f:false};
                                        }else{
                                            self.vlidateFlag.nickName={f:true};
                                        }
                                    },
                                    error: function(xhr, ts, et){
                                        console.log(xhr+"\n"+ts+"\n"+et);
                                        return false;
                                    }
                                });
                            }else{
                                self.vlidateFlag.nickName={f:f};
                            }
                            break;
                        case "dpwd":
                            var f = self.validDpwd($d);
                            self.vlidateFlag.dpwd={f:f};
                            break;
                    }
                }, 120);
            });
        },
        selectChange:function(){
            var self = this,
                $userType = $('#userType');
            $userType.change(function(){
                self.userType();
                $('#userType').css("color","#727272");
            })
        },
        //注册增加用户类型项目
        userType:function(){
            var $userType = $('#userType'),
                userTypeVal = $userType.val(),
                $parent = $userType.parent(),
                $cJError= $parent.find('.j-error-info');
            if(userTypeVal ==="selectType"){
                $cJError.addClass("error-info");
                $userType.addClass('error-border');
                $cJError.show();
                $cJError.text(msgObj['UserType']);

                return false;
            }else{
                $cJError.removeClass("error-info");
                $userType.removeClass('error-border');
                $cJError.hide();
            }
        },
        closeBtn:function(evt){
            //关闭
            var target = $(evt.currentTarget),$val=target.siblings('input[name]');
           if($val.val()!=''){
             target.siblings('input[name]').val('');
             target.hide();
           }
           
            
        },
        plaintext:function(evt){
            var target = $(evt.currentTarget),$inp=target.siblings('input[name]');
           //明文密文功能
           if($inp.val()==''){return false;}
            if(!target.hasClass('see')){
                $inp.attr('type','text');
                target.addClass('see');
            }else{
                $inp.attr('type','password');
                target.removeClass('see');
            }
          
        },
        submitForm:function(){
            var self=this;
            $(self.opt.formId).find("form").submit(function(){
                var $form=$(this);
                var $input=$form.find("input[name]");
                var flag=true, $doms=[];
                var $JErrorInfo = $input.closest('.email-txt');
                
                var $userType = $('#userType'),
                    userTypeVal = $userType.val(),
                    $parent = $userType.parent(),
                    $cJError= $parent.find('.j-error-info');
                $input.each(function(i,e){
                    var $d=$(e);
                    var $p=$d.parent();
                    if($p.hasClass("error-border")){
                        flag=false;
                    }else{
                        switch($d.attr("name")){
                            case "pwd":
                                if(!self.vlidateFlag.pwd){
                                    if(!self.validPwd($d)){
                                        flag=false;
                                    }
                                }else{
                                    if(flag&&!self.vlidateFlag.pwd.f){
                                        flag=self.vlidateFlag.pwd.f;
                                    }
                                }
                                break;
                            case "dpwd":
                                if(!self.vlidateFlag.dpwd){
                                    if(!self.validDpwd($d)){
                                        flag=false;
                                    }
                                }else{
                                    if(flag&&!self.vlidateFlag.dpwd.f){
                                        flag=self.vlidateFlag.dpwd.f;
                                    }
                                }
                                break;
                            case "userName":
                                if(!self.vlidateFlag.userName){
                                    if(self.validUsername($d)===false){
                                        flag=false;
                                    }else{
                                        $doms.push({dom:$d,url:self.opt.userNameUrl+$d.val()});
                                    }
                                }else{
                                    if(flag&&!self.vlidateFlag.userName.f){
                                        flag=self.vlidateFlag.userName.f;
                                    }
                                }
                                break;
                            case "nickName":
                                if(!self.vlidateFlag.nickName){
                                    if(self.validNickName($d)===false){
                                        flag=false;
                                    }else{
                                        $doms.push({dom:$d,url:self.opt.nickNameUrl+$d.val()});
                                    }
                                }else{
                                    if(flag&&!self.vlidateFlag.nickName.f){
                                        flag=self.vlidateFlag.nickName.f;
                                    }
                                }
                                break;
                        }
                    }
                });
                //标识是注册页面调用注册增加用户类型方法
                if($form.attr('id')=="registForm"){
                   var error =$('#registForm').find('span').hasClass("error-info");
                   self.userType();
                    if($cJError.hasClass("error-info")){
                        flag=false;
                    }else if(error){
                        flag=false;
                    }
                    else{
                        $doms.push({dom:$userType,url:self.opt.userNameUrl+userTypeVal});
                    } 
                }
                var len=$doms.length;
                if(len==0){
                    return flag;
                }
                else if(len==1){
                    var $dom=$doms[0];
                    $.ajax({
                        url:$dom.url,
                        dataType:"json",
                        success:function(res){
                            var $up=$dom.dom.parent();
                            //if(res.isexists=="1"){
                            //    $up.addClass("error-border");
                            //    $up.after("<span class='error-info'>email address is already exist. Please try again</span>");
                            //    return false;
                            //}
                            return flag;
                        },
                        error:function(xhr,ts,et){
                            console.log(xhr+"\n"+ts+"\n"+et);
                            return false;
                        }
                    });
                }
                else{
                    $.ajax({
                        url:$doms[0].url,
                        dataType:"json",
                        success: function(res){
                            var f=true;
                            var $up=$doms[0].dom.parent();
                            if(res.isexists=="1"){
                                $up.addClass("error-border");
                                self.errorTips($up,'email address is already exist. Please try again');
                               
                                f=false;
                            }else{
                                f=flag;
                            }
                            $.ajax({
                                url:$doms[1].url,
                                dataType:"json",
                                success: function(res){
                                    var $np=$doms[1].dom.parent();
                                    if(res.isexists=="1"){
                                        $np.addClass("error-border");
                                        self.errorTips($np,'email address is already exist. Please try again');
                                        
                                        f=false;
                                    }else{
                                        f=true;
                                    }
                                    return f;
                                },
                                error: function(xhr, ts, et){
                                    console.log(xhr+"\n"+ts+"\n"+et);
                                    return false;
                                }
                            });
                        },
                        error: function(xhr, ts, et){
                            console.log(xhr+"\n"+ts+"\n"+et);
                            return false;
                        }
                    });
                }
            });
        },
        init:function(){
            var self=this;
            self.loginState();
            self.changeTab();
            self.selectChange();
            self.validate();
            self.submitForm();
            $(document.body).delegate('.j-close','click',self.closeBtn);
            $(document.body).delegate('.js-see','click',self.plaintext);
        }
    };
    new DHMLogin();
});
//验证码
$("img[name=validname]").click(function(){
    var src = 'https://m.dhgate.com/verifycode.jsp?reqverfy=1&d='+Math.random();
    $("img[name=validname]").each(function(){
        $(this)[0].src = src;
    });
})
//facebook
function statusChangeCallback(response) {
    var getCookie=DHM.Cookie.getCookie;
    var opt={
        thirdType:0,
        B2BCookie:getCookie("B2BCookie"),
        ref_d:getCookie("ref_d"),
        login_auth_token:getCookie("login_auth_token")
    };
    if(response.authResponse&&response.authResponse.accessToken){
        opt["accessToken"]=response.authResponse.accessToken;
    }else{
        console.log("login error");
        return false;
    }
    if(getCookie("ref_f")){
        opt["ref_f"]=getCookie("ref_f");
    }
    if (response.status === 'connected') {
        FB.api('/me', function(response) {
            var reg = new RegExp("(^|&)returnURL=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if(r&&r[2]){
                opt["returnURL"]=decodeURIComponent(r[2]);
            }
            opt["thirdUid"]=response.id?response.id:"";
            opt["userName"]=response.email?response.email:"";
            opt["nickName"]=response.first_name?encodeURIComponent(response.first_name):"";
            var fbForm = document.createElement("form");
            fbForm.style.display="none";
            fbForm.method = "post";
            fbForm.action = "/login.do";
            for (var k in opt){
                var myInput = document.createElement("input");
                myInput.setAttribute("name",k);
                myInput.setAttribute("value",opt[k]);
                fbForm.appendChild(myInput);
            }
            document.body.appendChild(fbForm);
            fbForm.submit();
            document.body.removeChild(fbForm);
        });
    }
}
function checkLoginState() {
    FB.login(function(response){
        statusChangeCallback(response);
    },{scope: 'public_profile,email'});
}
window.fbAsyncInit = function(){
    FB.init({
        appId  : '619487934836296',
		status: true,
		oauth: true,
		cookie : true,  // enable cookies to allow the server to access
        xfbml  : true,  // parse social plugins on this page
        version: 'v2.2' // use version 2.1
    });
};
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
//google+
(function() {
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();
function render() {
    var additionalParams = {
        'callback': 'signinCallback',
		'approvalprompt': 'force',
		'clientid': '908751507097-qr3gvtf8pdfq7643lvh74b4h5scgov4j.apps.googleusercontent.com',
        'cookiepolicy': 'single_host_origin',
        'requestvisibleactions': 'http://schemas.google.com/AddActivity',
        'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
    };
    var signinButton = document.getElementById('J_googleLogin');
    signinButton.addEventListener('click', function() {
        gapi.auth.signIn(additionalParams);
    });
}
function signinCallback(authResult) {
    if (authResult['access_token']) {
        var getCookie=DHM.Cookie.getCookie;
        var opt={
            thirdType:1,
            B2BCookie:getCookie("B2BCookie"),
            ref_d:getCookie("ref_d"),
            login_auth_token:getCookie("login_auth_token"),
            accessToken:authResult['access_token']
        };
        if(getCookie("ref_f")){
            opt["ref_f"]=getCookie("ref_f");
        }
        gapi.client.load('plus','v1', function(){
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            request.execute(function(resp) {
                var reg = new RegExp("(^|&)returnURL=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if(r&&r[2]){
                    opt["returnURL"]=decodeURIComponent(r[2]);
                }
                opt["thirdUid"]=resp.id?resp.id:"";
                opt["userName"]=resp.emails[0].value?resp.emails[0].value:"";
                opt["nickName"]=resp.name.givenName?encodeURIComponent(resp.name.givenName):encodeURIComponent(resp.displayName);
                var glForm = document.createElement("form");
                glForm.style.display="none";
                glForm.method = "post";
                glForm.action = "/login.do";
                for (var k in opt){
                    var myInput = document.createElement("input");
                    myInput.setAttribute("name",k);
                    myInput.setAttribute("value",opt[k]);
                    glForm.appendChild(myInput);
                }
                document.body.appendChild(glForm);
                glForm.submit();
                document.body.removeChild(glForm);
            });
        });
    }else if(authResult['error']) {
        console.log('存在错误：' + authResult['error']);
    }
}