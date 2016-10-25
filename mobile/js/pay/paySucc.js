/**
 * Created by xiaonannan on 2015/05/14.
 */
Zepto(function($) {
	function paysuccInfo(){
		var rfxno = $('.success-info-cont').attr("rfxno"),
			domain = document.domain,
			cardUrl='http://'+domain +'/mobileApiWeb/coupon-Coupon-firstOrderDailyCoupon.do';
	        $.ajax({
	            url: cardUrl,
	            type: 'GET',
	            dataType: 'json',
	            timeout : 12000,  
	            data: {
	                  version : 3.3,
	                  client:"wap",
	                  rfxno:rfxno
	              },
	            success: function(data){
		           	//var data={"data":{"couponAmountCondition":"30-300","couponExpireTime":1431936000000,"couponPeriod":3,"couponStartTime":1431676800000,"couponType":"2","isEnd":false,"nextGiveCouponTime":1431690302140,"systemTime":1431760386513},"message":"success","state":"0x0000"};
		           	if(data.state=="0x0002"){
		           		var error = data.message;
		           		alert(error);
		           	}
		           	if(data && data.state=="0x0000"){
		           		var couponPeriod = data.data.couponPeriod,
			                	couponStartTime = data.data.couponStartTime,
			                	couponExpireTime = data.data.couponExpireTime,
			                	nextGiveCouponTimes = data.data.nextGiveCouponTime,
			                	systemTimes = data.data.systemTime;
			           	if(data.data.isEnd == false){
		                	$('.success-info-cont').show();
		                }else{
		                	$('.success-info-cont').hide();
		                }
		                if(!data.data.couponAmountCondition){
		                	$('.success-info-cont').hide();
		                }else{
		                	$('.success-info-cont').show();
		                	var couponAmountCondition= data.data.couponAmountCondition,
						        couponAmountCondition = couponAmountCondition.split("-");
			                $('#couponPrice').text(couponAmountCondition[0]);
			                $('#couponOff').text(couponAmountCondition[1]);
			                $('#numberDay').html(couponPeriod);     
			                var d=new Date(couponStartTime);  
				          	$('#couponStartDate').html(couponStartTimes(d));
				          	var d=new Date(couponExpireTime); 
				          	$('#couponExpiryDate').html(couponStartTimes(d));
		                } 
			        }
			        //couponStartTime时间戳转化日期
		                function   couponStartTimes(now){     
			              var   year=now.getFullYear(),    
			                    month=now.getMonth()+1,     
			                    date=now.getDate(),  
			                    hour=now.getHours(),   
			                    minute=now.getMinutes(),    
			                    second=now.getSeconds();     
			              return   year+"."+month+"."+date+"   "+hour+":"+minute+":"+second;          
				        }
				        //倒计时
				        /*var nextGiveCouponTime=new Date(nextGiveCouponTimes);
				        console.log(couponStartTimes(nextGiveCouponTime));
				        var systemTime=new Date(systemTimes);
				        console.log(couponStartTimes(systemTime));
				        var mtimes = systemTime -nextGiveCouponTime;
				        //console.log(mtimes);	        
				        var getDays = Math.floor(mtimes / 1000 / 60 / 60 / 24);
					    var getHours = Math.floor(mtimes / 1000 / 60 / 60 % 24);
					    var getMinutes = Math.floor(mtimes / 1000 / 60 % 60);
					    var getSeconds = Math.floor(mtimes / 1000 % 60);
					    getHours = (getHours < 10) ? "0"+getHours : getHours;
					    getMinutes = (getMinutes < 10) ? "0"+getMinutes : getMinutes;
					    getSeconds = (getSeconds < 10) ? "0"+getSeconds : getSeconds;

					    $('.dataCont').append('<div class="time-txt clearfix"><strong>剩余</strong><span id="countDays" class="num_bg">'+getDays +'</span><span class="f36">天</span><span id="countHours" class="num_bg">'+getHours +'</span><span class="f36">时</span><span id="countMinutes" class="num_bg">'+getMinutes +'</span><span class="f36">分</span><span id="countSeconds" class="num_bg">'+getSeconds +'</span><span class="f36">秒</span></div>');*/
			    }
		    });
                
	}
	paysuccInfo();
})