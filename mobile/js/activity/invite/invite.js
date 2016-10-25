/**
 * Created by zhaojing on 2014/9/26.
 */
Zepto(function($){
    function InviteFriend(){
        this.opt={
            downloadId:"#download",
            formId:"#inviteForm",
            emailId:"#email",
            nameId:"#userName",
            pswId:"#pwd",
            dpwd:'#dpwd',
            agreeId:"#agreement"
        };
        this.init();
    }
    InviteFriend.prototype.eType=function(){
        var isSupportTouch="ontouchend" in document?true:false;
        if(isSupportTouch){
            return 'touchend';
        }else{
            return 'click';
        }
    };
    InviteFriend.prototype.mValidate=function($email,$psw,$dpsw){
        var self=this;
        var ops = self.opt;
        var $form=$(ops.formId);
        if(!$form.get(0)){
            console.log("not found "+ops.formId);
            return;
        }
        var reg1=/^[a-zA-Z0-9\._-]+@([a-zA-Z0-9_-]+\.)+([a-zA-Z]{2,3})$/;
        var reg2=/^([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/;
        var reg3=/^[\s\S]{6,30}$/;
        $form.submit(function(){
            var flag=true;
            if($email){
                if(!reg1.test($email.val())){
                    $email.parent().next(".error-info").text("The email is empty or you entered is incorrect.please try again.").show();
                    $email.parent().addClass("error");
                    flag =false;
                }
            }
            if($psw){

                var v=$psw.val();
                if(!reg2.test(v)||v.length<6||v.length>30){
                    $psw.parent().next(".error-info").text("6-30 characters required.(at least 1 letter and 1 number)").show();
                    $psw.parent().addClass("error");
                    flag =false;
                }
            }
            
            if($dpsw){
                var v=$dpsw.val(),fv=$psw.val();
                if(!v||!$.trim(v)){
                     $dpsw.parent().addClass("error");
                     $dpsw.parent().next(".error-info").text("Confirm password is required. Please try again.").show();
                    return false;
                }else if ($.trim(v)!=$.trim(fv)) {
                   
                    $dpsw.parent().addClass("error");
                    $dpsw.parent().next(".error-info").text("Passwords do not match. Please try again.").show();
                    return false;
                }else{
                    
                    return true;
                }

            }
            // if($name){
            //     if(!reg3.test($name.val())){
            //         $name.parent().next(".error-info").text("The password is required and must between 6 and 30.please try again.").show();
            //         $name.parent().addClass("error");
            //         flag =false;
            //     }
            // }
            if(!$(self.opt.agreeId).get(0).checked){
                $(self.opt.agreeId).parent().next(".error-info").text("You must accept Registration Agreement.").show();
                flag =false;
            }
            return flag;
        });
    };
    InviteFriend.prototype.vEmail=function($email){
        var reg=/^[a-zA-Z0-9\._-]+@([a-zA-Z0-9_-]+\.)+([a-zA-Z]{2,3})$/;
        $email.keyup(function(){
            var $val = $(this).val();
           
            if($val!=''){
                
                $(this).parent().siblings('.close-btn').show();
            }else{
                $(this).parent().siblings('.close-btn').hide();
            }
        }).focus(function(){
            $(this).parent().next(".error-info").text('').hide();
            $(this).parent().removeClass("error");
            $(this).parent().addClass("foucusColor");
            var offsetTop = $(this).offset().top;
            document.body.scrollTop = offsetTop-8;
        }).blur(function(){
            var _self =this;
            setTimeout(function(){

                $(_self).parent().removeClass("foucusColor");

                if(!reg.test($email.val())){
                    $(_self).parent().next(".error-info").text("The email is empty or you entered is incorrect.please try again.").show();
                    $(_self).parent().addClass("error");
                }
            }, 120);
        });
    };
    InviteFriend.prototype.vPsw=function($psw){
        var reg=/^([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/;
        $psw.keyup(function(){
            var $val = $(this).val();
            if($val!=''){
                $(this).next('.close-btn').show();
            }else{
                $(this).next('.close-btn').hide();
            }
        }).focus(function(){
            $(this).parent().next(".error-info").text('').hide();
            $(this).parent().removeClass("error");
            $(this).parent().addClass("foucusColor");
            var offsetTop = $(this).offset().top;
            document.body.scrollTop = offsetTop-8;
        }).blur(function(){
            var v=$psw.val();
             $(this).parent().removeClass("foucusColor");
            if(!reg.test(v)||v.length<6||v.length>30){
                $(this).parent().next(".error-info").text("6-30 characters required.(at least 1 letter and 1 number)").show();
                $(this).parent().addClass("error");
            }
        });
    };
    InviteFriend.prototype.vdPsw=function($dpsw){
       var _self = this;

        $dpsw.keyup(function(){
            var $val = $(this).val();
            if($val!=''){
                $(this).next('.close-btn').show();
            }else{
                $(this).next('.close-btn').hide();
            }
        }).focus(function(){
           
            $(this).parent().next(".error-info").text('').hide();
            $(this).parent().removeClass("error");
            $(this).parent().addClass("foucusColor");
            var offsetTop = $(this).offset().top;
            document.body.scrollTop = offsetTop-8;
        }).blur(function(){
             
            var v = $(this).val(),fv=$(_self.opt.pswId).val();
           $(this).parent().removeClass("foucusColor");
            if(!v||!$.trim(v)){
                
                 $(this).parent().addClass("error");
                 $(this).parent().next(".error-info").text("Confirm password is required. Please try again.").show();
                return false;
            }else if ($.trim(v)!=$.trim(fv)) {
               
                $(this).parent().addClass("error");
                $(this).parent().next(".error-info").text("Passwords do not match. Please try again.").show();
                return false;
            }else{
                
                return true;
            }

         
        });


        

    };
    InviteFriend.prototype.vName=function($name){
        var reg=/^[\s\S]{6,30}$/;
        $name.keyup(function(){
            var $val = $(this).val();
            if($val!=''){
                $(this).next('.close-btn').show();
            }else{
                $(this).next('.close-btn').hide();
            }
        }).focus(function(){
            $(this).parent().next(".error-info").text('').hide();
            $(this).parent().removeClass("error");
            $(this).parent().addClass("foucusColor");
            var offsetTop = $(this).offset().top;
            document.body.scrollTop = offsetTop-8;
        }).blur(function(){
            $(this).parent().removeClass("foucusColor");
            if(!reg.test($name.val())){
                $(this).parent().next(".error-info").text("The nickName is required and must between 6 and 30.please try again.").show();
                $(this).parent().addClass("error");
            }
        });
    };
    InviteFriend.prototype.downLoad=function(){
        var self=this;
        var etype = self.etype,
            $download=$(self.opt.downloadId);
        if(!$download.get(0)){
            console.log("not found "+self.opt.downloadId);
            return;
        }
        $download.on(etype,function(){
            var a = navigator.userAgent;
            var exp1 =/ip(hone|od)/i;
            var exp2 =/(A|a)ndroid/i;
            if (exp1.test(a)){
                window.location.href="https://itunes.apple.com/us/app/dhgate-mobile-chinese-online/id905869418?l=zh&ls=1&mt=8";
            }else if(exp2.test(a)){
                window.location.href="https://play.google.com/store/apps/details?id=com.dhgate.buyer";
            }else{
                console.log("not ios and not android");
            }
        });
    };
    InviteFriend.prototype.agree=function(){
        var self=this;
        $(self.opt.agreeId).change(function(){
            var c=this.checked;
            if(!c){
                $(this).parent().next(".error-info").text("You must accept Registration Agreement.").show();
            }else{
                $(this).parent().next(".error-info").hide();
            }
        });
    };
    InviteFriend.prototype.agreeA=function(){
        var self=this;
        if(!self.agreeDialog){
            var html=["<div class='agree-info'>",
                "<div style='position:relative'><a href='javascript:;'>X</a></div>",
                "<span>Registration Agreement</span>",
                "<div class='agree-info-box'>",
                "<p>BEFORE YOU COMPLETE THE REGISTRATION PROCESS AND BECOME OUR REGISTERED BUYER, PLEASE READ THE FOLLOWING TERMS CAREFULLY. IF YOU DO NOT ACCEPT ALL OF THE REGISTRATION AGREEMENT, PLEASE DO NOT CLICK “CREATE MY ACCOUNT” BUTTON.</p>",
                "<p><b>Introduction</b></p>",
                "<p>Welcome to DHgate, your reliable online marketplace.The web site identified by the uniform resource locator www.dhgate.com (the '<b>Site</b>') is provided by Dunhuang Holding (HK) (referred to throughout this site as '<b>DHgate</b>') as a service to our customers. This Registration Agreement (referred to throughout this site as '<b>the Agreement</b>') is entered into between you as the registered user of the site (the '<b>the Registered User or User</b>') and DHgate.Please review the following basic rules that govern your use and access on the site. Please also note that your click of “Create My Account” button constitutes your unconditional agreement to follow and be bound by this Agreement. If you do not accept all of the terms of this Agreement, please do not click the “Accept the Agreement” button.</p>",
                "<p>1. Application of Registration Agreement</p>",
                "<p>1.1 For your registration and purchase on the Site, you should accept this Agreement, the Terms of Use, the terms and conditions related to them and the Security and Privacy policy of DHgate. Meanwhile, during your purchase and transaction process on the Site, certain Membership Agreement and related terms and conditions between you as a Registered User and DHgate will bind. Therefore, besides this Agreement, we recommend you to read those relative terms, conditions and information carefully. Additionally, your acceptance of this Agreement also means that the aforesaid relative terms, conditions and the Security and Privacy policy of DHgate will apply to your purchase and transaction process on the Site.</p>",
                "<p>1.2 Terms has not been defined or stipulated in this Agreement shall be interpreted in accordance with the definition(s) or provision(s) of the Terms of use of DHgate.</p>",
                "<p>1.3 Except as explicitly stated otherwise, the registration, services, functions and features on the Site is free of charge for our Registered Users, however, DHgate reserves the right to charge them in the future for whatever reason.</p>",
                "<p>1.4 After your registration, you will get a unique Account ID and Password from DHgate and the Site. Each Use shall take responsibility solely for the transaction outcome occurred under this Account ID and Password, and for the confidentiality of your Account ID and Password. You should use this Account ID and Password alone, and, without prior written consent from DHgate, you should not transfer your Account ID and Password to others for any use. DHgate shall never take responsibility for any loss or damages related to your incorrect use or transfer of the Account ID or Password.</p>",
                "<p>1.5 In its sole discretion, DHgate may suspend or terminate any account, part of function and service of any account, for whatever reason, including but not limited to, any delay of payment delivery, breach of contract, infringement of third party rights, or creating any liability for the Site or DHgate.</p>",
                "<p>1.6 Please also note that the services, functions and features from the Site that the registered user may enjoy may differ with the country or region you are living or transacting, and certain functions and services on the Site may require special verification or be preserved for paying members only.</p>",
                "<p>2. The purchase on the Site</p>",
                "<p>2.1 You must be registered on the Site in order to make purchases on the Site and/or access some Services. Your status as a Registered User and the purchase process are governed by the Agreement and any terms and conditions related thereto. DHgate may reject a User’s application for registration for any reason. Upon registration on the Site, DHgate shall assign an account (the “DHgate Account”) and a password (the “Password”) to each Registered User.</p>",
                "<p>2.2 Each User will be required to provide information or material about your entity, business or products/services as part of the registration process on the Site or your use of any Service or the DHgate account. Each User represents, warrants and agrees that (a) such information and material, whether submitted during the registration process or thereafter throughout the continuation of the use of the Site or Service, is true, accurate, current and complete, and (b) you will maintain and promptly amend all information and material to keep it true, accurate, current and complete.</p>",
                "<p>2.3 By confirming your purchase at the end of the checkout process, you agree to accept and pay for the item(s) purchased. You realize that any delay in the process of delivery payment may constitute a contract breach, and you shall be solely responsible for such breach.</p>",
                "<p>2.4 Each User understands and accepts that the price listed for the product on the Site and/or the price paid for the product includes the commission due to DHgate.</p>",
                "<p>2.5 You understand that by using and accessing the Site or any Services provided on the Site, you may encounter content that may be deemed by some to be offensive, indecent, or objectionable, which content may or may not be identified as such. You agree to use the Site and any Service at your sole risk, and that DHgate shall have no liability to you for Content that may be deemed to be offensive, indecent, or objectionable.</p>",
                "<p>2.6 Each User understands and accepts that the product and content listing or displaying on the Site may relate to copyrights, trademarks, trade secrets, patents and other personal or proprietary rights of a third party. Further, each User agrees that the User who uploads or lists that content and information on the Site shall be solely responsible for any violation of third party rights. The Site and DHgate shall not be liable for any infringement or purchase dispute related to the intellectual property and/or other personal or proprietary rights of third party.</p>",
                "<p>2.7 When required by the government, law enforcement body, or obligee whose legitimate right has been injured, or forced by subpoena or other legal document, DHgate may disclose the User’s identity and contact information. User agrees not to bring any action or claim against DHgate for such disclosure.</p>",
                "<p>3. Transactions between Buyers and Sellers</p>",
                "<p>3.1 Each Registered User understands and agrees that DHgate is not a traditional seller or mart. Throughout the Site, what DHgate provides is only an online platform or venue for information exchange and transaction between buyers and sellers. Although DHgate will monitor the regular operation of the Site to fulfill the duty of care, DHgate does not review and check each posted content and listing to search for the infringement and illegal activity. Besides, due to the limitation of current technology, searching for the infringement and illegal activity in our Site is beyond our competence and capability.</p>",
                "<p>3.2 Despite this Agreement, the terms and conditions linked to this Agreement, Security and Privacy policy of DHgate and other terms and conditions throughout the Site, no agency relationship will be created between DHgate and the seller or buyer concerning the listing and transaction, whether or not such transactions are entered into via the Site.</p>",
                "<p>3.3 Registered Users hereby acknowledges that although DHgate tries its best to provide the users with accurate information and listing posted by sellers, and do general verifications about the identity of the sellers, there still may be risks of purchasing with people online. Therefore, we encourage you, the registered user, to use relevant tools available, reasonable judgment, as well as common sense, to make the deal online.</p>",
                "<p>3.4 In no event shall DHgate be responsible for any infringement or transaction dispute, including, but not limited to, transaction disputes about quality, safety, breach of warranty, lawfulness or availability of the products or services and the payment from buyers, as well as any intellectual property infringement by sellers.</p>",
                "<p>3.5 The users (including the seller and buyer) agree to release and indemnify DHgate and its agents, affiliates, directors, officers and employees from all claims, demands, actions, proceedings, costs, expenses and damages (including, but not limited to, any actual, special, incidental or consequential damages) arising out of or in connection with any transactional dispute about the products, listing, or information on the Site.</p>",
                "<p>3.6 In order to help the sellers and the Registered Users solve and settle any transactional disputes effectively and efficiently, DHgate has established the “Handling Procedures for Transactional Dispute”. Such procedures can be viewed at: http://help.dhgate.com/help/buyerhelpen.php?catid=3303. Here, the sellers and Registered Users shall agree that when the Registered Users file the transactional disputes with DHgate, the sellers and the Registered Users should comply with the “Handling Procedures for Transactional Dispute”, and permit DHgate to make a final binding decision regarding the dispute.</p>",
                "<p>4. Limitation of Liability</p>",
                "<p>4.1 To the maximum extent permitted by law, this Site is provided by DHgate on an “as is”, “as available” and “with all facts” basis. DHgate makes no representations or warranties of any kind, express or implied, as to the operation of the Site or the information, content, materials, or products included on this Site. To the full extent permissible by applicable law, DHgate hereby expressly disclaims any and all warranties, express or implied, including, but not limited to, any warranties of condition, quality, durability, performance, accuracy, reliability, non-infringement, merchantability or fitness for a particular purpose. Without limiting the foregoing, DHgate disclaims any and all warranties, express or implied, for any merchandise offered on this Site. All such warranties, representations, conditions and undertakings are hereby excluded. You acknowledge, by your use or access of the Site, that your use or access of the site is at your sole risk. This disclaimer does not apply to any product warranty offered by the manufacturer of the item. This disclaimer constitutes an essential part of this Agreement.</p>",
                "<p>4.2 Under no circumstances and under no legal or equitable theory, whether in tort, contract, strict liability or otherwise, shall DHgate or any of its affiliates, employees, directors, officers, agents, vendors or suppliers be liable to you or to any other person for any indirect, special, incidental or consequential losses or damages of any nature arising out of or in connection with the use of or inability to use the Site, including, without limitation, damages for lost profits, loss of goodwill, loss of data, work stoppage, accuracy of results, or computer failure or malfunction, even if an authorized representative of DHgate has been advised of or should have known of the possibility of such damages.</p>",
                "<p>4.3 In addition, in no event shall DHgate be liable for damages stemming from any one of the following, no matter it is special, direct, indirect, punitive, incidental or consequential damages, or related to contract, negligence, tort or otherwise:</p>",
                "<p>a) Any disputes related to goods, services, or information purchased or obtained from a seller or a third-party via the Site, including, but not limited to, disputes about quality, safety, warranty, lawfulness or availability of such goods, services or information;</p>",
                "<p>b) Any violation of Third Party Rights on the Site;</p>",
                "<p>c) Unauthorized access to data or private information of any User on the Site; or</p>",
                "<p>d) Statements or conducts of any User of the Site.</p>",
                "<p>4.4 Notwithstanding any of the foregoing provisions, if DHgate, our employees, agents, affiliates, representatives or anyone acting on our behalf is found to be liable, our liability will not exceed the commissions paid by you in connection with your use of the Site during the three month period preceding the date on which the claim arose.</p>",
                "<p>5. Indemnification</p>",
                "<p>You agree to defend, indemnify and hold DHgate and its affiliate, directors, officers and employees harmless from and against any and all losses, claims, liabilities, damages, costs and expenses, including attorneys’ fees, arising from or related to (1) your use of the Site, (2) your breach of any representations and/or warranties made by you to DHgate and (3) claims asserted by third party rights claimants or other third parties relating to products offered or displayed on the Site.</p>",
                "<p>6. Termination</p>",
                "<p>The Agreement is effective unless and until terminated by either you or DHgate. You may terminate this Agreement at any time, provided that you discontinue any further use of this Site. DHgate also may terminate this Agreement at any time and may do so immediately without notice, and accordingly deny you access to the Site, if in DHgate’s sole discretion you fail to comply with any term or provision of this Agreement. Upon any termination of the Agreement by either you or DHgate, you must promptly destroy all materials downloaded or otherwise obtained from this Site, as well as all copies of such materials, whether made under the Terms of Use or otherwise. DHgate’s right to any Contents, and the provisions of Sections 2, 3, 4, 5, 7, and 8, shall survive any termination of this Agreement.</p>",
                "<p>7. Notice</p>",
                "<p>7.1 Except as explicitly stated otherwise, all notice or demand to or upon DHgate shall be in writing and delivered to DHgate by mail to the following address: 6F Dimeng Commerical Building No.3-2, Hua Yuan Road, Haidian District, Beijing, China 100191, Attn: Legal Department. Notice shall be deemed effective when received by DHgate in any of the above-mentioned manner.</p>",
                "<p>7.2 All notices or demands to or upon a User shall be effective if delivered personally, by e-mail to the e-mail address provided to DHgate during the registration process (as updated from time to time, if applicable), or by posting such notice or demand on an area of the Site that is publicly accessible without a charge. Notice to a User shall be deemed to be received by such User if and when: (1) DHgate is able to demonstrate that communication, whether in physical or electronic form, has been sent to such User, or (2) immediately upon DHgate posting such notice on an area of the Site that is publicly accessible without charge.</p>",
                "<p>7.3 You agree that all agreements, notices, demands, disclosures and other communications that DHgate sends to you electronically satisfy the legal requirement that such communication should be in writing.</p>",
                "<p>8. General</p>",
                "<p>8.1 DHgate reserves the right to update or modify this Registration Agreement at any time without prior notice to you. Your use of the Site following any such change constitutes your unconditional agreement to follow and be bound by the Registration Agreement as changes.</p>",
                "<p>8.2 Headings used in the Agreement are for reference purposes only and in no way define or limit the scope of the section.</p>",
                "<p>8.3 If any provision of this Agreement is held to be unenforceable for any reason, such provision shall be deleted or reformed to the extent necessary to make it enforceable and the other terms of this Agreement shall remain in full force and effect.</p>",
                "<p>8.4 The failure of DHgate to act with respect to a breach of this Agreement by you or others does not constitute a waiver and shall not limit DHgate’s rights with respect to such breach or any subsequent breaches.</p>",
                "<p>8.5 Any action or proceeding arising out of or related to this Agreement or your use of this Site must be submitted to the China international Economic and Trade Arbitration Commission for arbitration which shall be conducted in accordance with the Commission’s arbitration rules in effect at the time of the application for arbitration. The arbitral award shall be final and binding upon both parties.</p>",
                "<p>8.6 This Agreement shall be governed by and construed under the laws of People’s Republic of China (“P.R.C.”) without regard to conflict of law provisions.</p>",
                "<p>8.7 If there is any conflict between the English version and another language version of this Agreement, the English version shall prevail.</p>",
                "</div>"];
            self.agreeDialog=$(html.join(""));
            self.agreeShadow=$("<div style='display:none;width:100%;height:100%;position:fixed;top:0;left:0;z-index:999;zoom:1;background:#999;opacity:0.5'></div>");
            $("body").append(self.agreeDialog);
            $("body").append(self.agreeShadow);
            self.agreeDialog.find("a").on(self.eType(),function(){
                self.agreeDialog.hide();
                self.agreeShadow.hide();
                e.stopPropagation();
                e.preventDefault();
            });
        }

        $(".j-agree-a").on(self.eType(),function(){
            self.agreeDialog.show();
            self.agreeShadow.show();
            e.stopPropagation();
            e.preventDefault();
        });
    };
    InviteFriend.prototype.closeBtn=function(evt){
        //关闭
        var target = $(evt.currentTarget),$val=target.parent().find('.invite-text');
        
       if($val.val()!=''){
         $val.val('');
         target.hide();
       }
       
        
    };
    InviteFriend.prototype.plaintext=function(evt){
        var target = $(evt.currentTarget),$inp=target.siblings('.invite-text');
       //明文密文功能
        if($inp.val()==''){return false;}
        if(!target.hasClass('see')){
            $inp.attr('type','text');
            target.addClass('see');
        }else{
            $inp.attr('type','password');
            target.removeClass('see');
        }
      
    };
    InviteFriend.prototype.init=function(){
        var self=this;
        var ops= self.opt;
        self.etype=self.eType();
        self.downLoad();
        var $email=$(ops.emailId),
            $psw=$(ops.pswId),
            $dpsw=$(ops.dpwd),
            $name=$(ops.nameId);
        if($email.get(0)){
            self.vEmail($email);
        }else{
            $email=null;
            console.log("not found "+ops.emailId);
        }
        if($psw.get(0)){
            self.vPsw($psw);
        }else{
            $psw=null;
            console.log("not found "+ops.pswId);
        }
        
        if($dpsw.get(0)){
            self.vdPsw($dpsw);
        }else{
            $dpsw=null;
            console.log("not found "+ops.pswId);
        }
        if($name.get(0)){
            self.vName($name);
        }else{
            $name=null;
            console.log("not found "+ops.nameId);
        }
        self.mValidate($email,$psw,$dpsw,$name);
        self.agree();
        self.agreeA();
        $(document.body).delegate('.j-close','click',self.closeBtn);
        $(document.body).delegate('.js-see','click',self.plaintext);
    };
    new InviteFriend();
});