/**
 * Created by xiaonannan on 2015/05/127.
 */
Zepto(function($) {
    function DHMRegisteredCoupon(){
        this.init();

    }
     DHMRegisteredCoupon.prototype={
        constructor:DHMRegisteredCoupon,
        registeredCoupon:function(){
            var value=DHM.Cookie.getCookie("registFlag");
            if(value == 1){
                var popHtml = ['<div class="mask" style="display:none;"></div>',
                            '<div class="registeredCoupon-pop" style="display:none;">',
                                '<div class="registeredCouponTit clearfix"><a href="javascript:void(0);" title="closed" class="closed"></a></div>',
                                    '<div class="registeredCouponCont">',
                                    '<div class="registeredCouponTxt">',
                                        '<h3>Registration successful</h3>',
                                        '<p>Start your shopping with an exclusive new member coupon!</p>',
                                    '</div>',
                                    '<div class="registeredCouponWrap"></div>',
                                    '<a href="/" class="continue-btn">Continue Shopping</a>',
                                    '<div class="registeredCouponNote">',
                                        '<h3>Note:</h3>',
                                        '<ul class="registeredCouponNoteList">',
                                            '<li>1.&nbsp;Customers may only register for one account.</li>',
                                            '<li>2.&nbsp;Malicious registration to win coupons is prohibited. These users will be banned from using the coupons.</li>',
                                        '</ul>',
                                    '</div>',
                                '</div>',
                            '</div>'
                ];
                var str = $(popHtml.join(""));
                str.appendTo("body");
                $(".closed").click(function(){
                    $(".registeredCoupon-pop,.mask").hide();
                });
                //获取coupon数据接口
                var cardUrl='/mobileApiWeb/coupon-Coupon-registCoupon.do';
                $.ajax({
                    url: cardUrl,
                    type: 'GET',
                    dataType: 'json',  
                    data: {
                          version : 3.3,
                          client:"wap"  
                      },
                    success: function(data){
                        if(data.state=="0x0002"){
                            var error = data.message;
                            alert(error);
                        }    
                        if(data && data.state=="0x0000"){
                            var dataCouponList = data.data.couponList;
                            var html=[];
                            if(dataCouponList && dataCouponList.length > 0){
                                for(var i=0;i<dataCouponList.length;i++){
                                    var _couponAmountCondition = dataCouponList[i].couponAmountCondition,
                                        _couponAmountConditionSplit  = _couponAmountCondition.split("-"),
                                        _couponExpireTime = dataCouponList[i].couponExpireTime,
                                        _couponStartTime = dataCouponList[i].couponStartTime,
                                        startTimeDate = new Date(_couponStartTime),
                                        $couponStartDate= couponTime(startTimeDate),
                                        expireTimeDate = new Date(_couponExpireTime),
                                        $expireTimeDate = couponTime(expireTimeDate);
                                    html=['<div class="success-info-cont">',
                                                '<div class="success-info-cont-lf">',
                                                    '<span class="start"></span>',
                                                    '<dl>',
                                                        '<dt span="" class="f74">$<span class="couponPrice">'+_couponAmountConditionSplit[0]+'</span></dt>',
                                                        '<dd class="f15">OFF <span class="couponOff"></span>'+_couponAmountConditionSplit[1]+'</dd>',
                                                        '<dd class="f18">COUPON</dd>',
                                                    '</dl>',
                                                    '<span class="start"></span>',
                                                '</div>',
                                                '<div class="success-info-cont-rt">',
                                                    '<p class="fb15">You have a coupon available in your account!</p>',
                                                    '<div class="dataCont">',
                                                        '<p>Start Date：<span class="couponStartDate">'+$couponStartDate+'</span></p>',
                                                        '<p>Expiry Date：<span class="couponExpiryDate">'+$expireTimeDate+'</span></p>',
                                                    '</div>',
                                                '</div>',
                                            '</div>'];
                                    $('.registeredCouponWrap').append(html.join(""));  
                                    if(data.data.isEnd == false){
                                        $('.success-info-cont,.registeredCoupon-pop,.mask').show();

                                    }else{
                                        $('.success-info-cont,.registeredCoupon-pop,.mask').hide();
                                    }        
                                }
                            }else{
                                $('.success-info-cont,.registeredCoupon-pop,.mask').hide();
                            }      
                        }
                        //couponStartTime时间戳转化日期
                        function   couponTime(now){     
                          var   year=now.getFullYear(),    
                                month=now.getMonth()+1,     
                                date=now.getDate(),  
                                hour=now.getHours(),   
                                minute=now.getMinutes(),    
                                second=now.getSeconds();     
                          return   year+"."+month+"."+date+"   "+hour+":"+minute+":"+second;       
                        }
                        
                    }
                });
                return false; 
            }
        },
        init:function(){
            var self=this;
            self.registeredCoupon();
        }
     };
	 new DHMRegisteredCoupon();
})