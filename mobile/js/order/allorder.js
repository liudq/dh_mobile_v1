var ORDER = {
    tools: {},
    'index':'',
    'loadding':true,
    'orderlistarray':['AwaitPayment','PendConfirm','AwaitShip','Shipped','Completed','FefundDispute','Canceled']

};
function golink(a,b,c,d){

             window.location.href='http://m.dhgate.com/sendmsg.do?order_no='+b+'&spid='+c+'&mty=2' ;
              javascript:ga('send','event','My-Orders','SendMessage');
              javascript:ga('send','event','My-Orders',ORDER.orderlistarray[d-1],'ContactSeller');
          
              console.log(a);


        };
/**
 * Created by xiaonnannan on 2015/06/15.
 */
Zepto(function($){


//orderLosd.js
(function(self, $){
    var Api_head='http://' + document.domain + "/",
        img_head='http://www.dhresource.com/',  
        tools = ORDER.tools,
        orderLosd;

    //order list
    tools.orderLosd = orderLosd = {
        init:function(){
        
            var that=this
            that.nalk();
            index=location.search.split('=')[1];
            if(index==undefined){
                index=1;
            };
             $('.det-home').click(function(){
                javascript:ga('send','event','My-Orders',ORDER.orderlistarray[index-1],'Home');
              })
            $($('#J_mayInterest ul li')[index-1]).addClass("tabselect_" + index).removeClass("tab_" + index);
            $(".select_line").css('left',(index-1) * 70 + 10);
            $($('#J_mayInterest ul li')[index-1]).addClass("selected");
            that.getorderApi(index,1);
            $('#list_'+index).show();
        },
        //乡下滑动加载新页面
        screemScroll:function(){
            $(window).bind("scroll", function(event){
            var page=$('.selected').attr('page')/1+1;
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if(scrollTop + windowHeight == scrollHeight){
                if(ORDER.loadding==true){
                   $('#list_'+index).append('<p class="loadding">Loadding······</p>') ;
                    ORDER.loadding=false;
                    orderLosd.getorderApi(index,page);
                }else{

                }  
            }

         });
        },
      
        getorderApi: function(index,pagenum){

            var that = this; 
            var func = function (res) {
            var payme=index;        
                if(res.result==0){
                    window.location.href=res.returnurl;
                }else{
                    if (res.orders.total==pagenum&&pagenum==1) {
                        ORDER.loadding=false;
                        $('.selected').attr('page',pagenum) ;
                        $('.loadding').remove();  
                        that.loadOrder(res,payme,pagenum); 
                    }else if(res.orders.total<pagenum&&res.orders.total!==0){
                        $('.loadding').remove();
                        
                    }
                    else{
                        $('.selected').attr('page',pagenum);
                        $('.loadding').remove();  
                        ORDER.loadding=true;
                        that.loadOrder(res,payme,pagenum);    
                    };
                    
                }        
            };   
           $.ajax({
               url: Api_head + 'viewOrderListByStatus.do?',
               cache:false,
               data: {rft:index,pagenum:pagenum},
               type: 'get',
               dataType: 'json',
               success: func,
               error: function () {
                   //
               }
           });
           func = null;
           return this;
        },
        loadOrder:function(order,payme,pagenum){   
            var monthArray=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] ,
             that=this,
             orderlist=order.orders.list,
             list_name=$('.selected h3').html();
             orderlist_body="";
            if(orderlist.length==0){
                $('#list_'+index).html('<div class="order_shop"><p class="shop_p">You currently have no '+list_name+' orders.</p> <a href="http://m.dhgate.com/" class="go_shop" >Start Shopping</a></div>');
            }else{
                 for(var j=0;j<orderlist.length;j++)
                {   
                    var time=orderlist[j].tdrfx.starteddate.time;
                    var  orderlist_H='   <div class="awaiting_list"><p class="pa_order">Order Number ：<span class="pa_number">'+orderlist[j].tdrfx.rfxno+'</span>   <span class="pa_time">'+that.timechage(time)+'</span></p>'+
                        '<p class="pa_order"><span class="detail_name">Order Status ：</span><span class="pa_red">'+orderlist[j].tdrfx.rfxstatusname+'</span>';
                    var orderlist_F='',
                        orderlist_B='';
                         //卖家是否在线
                    if(orderlist[j].ntalker.isonLine==false){
                        orderlist_B = '<span onclick=golink("sendmsg.do","'+orderlist[j].tdrfx.rfxno+'","'+orderlist[j].supplier.systemuserid+'","'+payme+'") class="email talk"></span>';

                    }else{
                        orderlist_B ='<span ntalkerSellerid='+orderlist[j].ntalker.ntalker_sellerid+' ntalker_buyerid='+orderlist[j].ntalker.ntalker_buyerid+'  ntalker_js_url='+orderlist[j].ntalker.ntalker_js_url+' class="chat talk"></span>';
                    }
                    //是否是一单多件商品
                    if(orderlist[j].proList.length==1)
                    {
                        orderlist_F='</p><div onclick=window.location.href="http://m.dhgate.com/mydhgate/order/orderdetail.html?rfid='+orderlist[j].tdrfx.rfxid+'&rft='+index+'"  class="pa_product"><img src="'+img_head+orderlist[j].proList[0].r_image+'" ><p class="J_name">'+that.stringoff(orderlist[j].proList[0].productname)+'</p></div>'+
                            '<p class="pa_order pa_right">Total ：<span class="pay_price">US $ '+orderlist[j].tdrfx.ordertotal+'</span></p>';
                    }else{
                        var img_list='';
                        for(var k=0;k<orderlist[j].proList.length;k++){
                            img_list +='<li><img src="'+img_head+orderlist[j].proList[k].r_image+'" ></li>';
                        };
                        orderlist_F='</p><div onclick=window.location.href="http://m.dhgate.com/mydhgate/order/orderdetail.html?rfid='+orderlist[j].tdrfx.rfxid+'&rft='+index+'" id="pa_product" class="may-like" data-pp="d" data-itemcode="123"><ul>'+img_list+' </ul> </div>'+
                            '<p class="pa_order pa_right">Total ：<span class="pay_price">US $ '+orderlist[j].tdrfx.ordertotal+'</span></p>';
                    }
                    //按钮显示
                    if(orderlist[j].tdrfx.rfxstatusid==101003){
                        orderlist_body +=orderlist_H+orderlist_B+orderlist_F+'<p class="clearfix operate pay_but"> <span rfid='+orderlist[j].tdrfx.rfxid+' class="pay_cancel">Cancel Order</span> <span rfid='+orderlist[j].tdrfx.rfxid+' class="pay_topay">Proceed to Pay</span></p>  </div>';
                    }else if(orderlist[j].tdrfx.rfxstatusid==101009&&orderlist[j].trackInfoFilled==true){
                        orderlist_body +=orderlist_H+orderlist_B+orderlist_F+' <p class="clearfix operate track_but"> <span rfid='+orderlist[j].tdrfx.rfxid+' class="track_item">Track Items</span> <span rfid='+orderlist[j].tdrfx.rfxid+' class="track_rece">Order Has Been Received</span></p>   </div>';
                    }else if(orderlist[j].tdrfx.rfxstatusid==101009&&orderlist[j].trackInfoFilled==false){
                         orderlist_body +=orderlist_H+orderlist_B+orderlist_F+' <p class="clearfix operate track_but"> <span rfid='+orderlist[j].tdrfx.rfxid+' class="track_rece">Order Has Been Received</span></p>   </div>';
                    } else if(orderlist[j].trackInfoFilled==true){
                        orderlist_body +=orderlist_H+orderlist_B+orderlist_F+'<p class="clearfix operate order_but"> <span rfid='+orderlist[j].tdrfx.rfxid+' class="only_track">Track Items</span></p> </div>';
                    }else{
                        orderlist_body +=orderlist_H+orderlist_B+orderlist_F+'</div>';
                    }
                }
          
                if(pagenum==1){
                    $('#list_'+payme).html(orderlist_body);
                    
                }else{
                    $('#list_'+payme).append(orderlist_body);
            
                }
              
            }
            that.screemScroll();
//按钮的作用；

            $('.operate').delegate('.pay_cancel','click',function(){//取消按钮
                var rf_id=$(this).attr('rfid');
                var $div_list=$(this);
                javascript:ga('send','event','My-Orders',ORDER.orderlistarray[payme-1],'CancelOrder');
                var r=confirm("Are you sure you want to cancel the order?");
                if (r==true) {
                    var that = this;
                    var func = function (res) {
                        if (res.result == 0) {
                            if (res.returnurl !== undefined) {
                                window.location.href = 'http://m.dhgate.com/login.do?rfid=' + rf_id
                            }else{
                                $('#opacityLayer').html("Sorry, order cannot be cancelled.").show();
                                $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                                setTimeout(function(){
                                    $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                                      window.location.href = 'http://m.dhgate.com/mydhgate/order/orderlist.html?rfid=' + index 
                                },1000); 
                          
                            }
                        }else{
                            $('#opacityLayer').html("Your order has been canceled.").show();
                            $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                            setTimeout(function(){
                                    $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                                    // window.location.href = 'http://m.dhgate.com/mydhgate/order/orderlist.html?rfid=' + index 
                            },1000); 
                            $div_list.parent().parent().remove();
                            var last_num=$('.selected p span').html();
                              if(last_num==1){
                                $('.selected p span').hide();
                                $('.selected p span').html(last_num-1);
                                $('#list_'+index).html('<div class="order_shop"><p class="shop_p">You currently have no '+list_name+' orders.</p> <a href="http://m.dhgate.com/" class="go_shop" >Start Shopping</a></div>');
                              }else if(last_num=='99+'){
                                var num_span=$('.selected p span').attr('num')
                                if(num_span==100){
                                $('.selected p span').html('99');
                                }else{
                                $('.selected p span').html('99+');
                                }
                                if($('#list_'+payme+' .awaiting_list').length==0){
                                    $('#list_'+payme).html('<div class="order_none"></div>')
                                    orderLosd.getorderApi(payme,1);
                                }

                              }else{
                                $('.selected p span').html(last_num-1);
                                 if($('#list_'+payme+' .awaiting_list').length==0){
                                    $('#list_'+payme).html('<div class="order_none"></div>')
                                    orderLosd.getorderApi(payme,1);
                                }
                              }    
                       
                        }
                    };
                      var apiSet = {
                        url: Api_head+'cancelOrder.do?'

                    };

                    $.ajax({
                        url: apiSet.url,
                        cache:false,
                        data:{rfid:rf_id},
                        type: 'get',
                        dataType: 'json',
                        success: func,
                        error: function () {
                            //
                        }
                    });
                    func = null;
                    return this;
                }                  
            });
            $('.operate').delegate('.pay_topay','click',function(){//付钱
                    var that = this;
                    var rf_id=$(this).attr('rfid');
                    javascript:ga('send','event','My-Orders',ORDER.orderlistarray[payme-1],'CancelOrder')
                    var func = function (res) {
                        if (res.result == 0) {
                            if (res.returnurl !== undefined) {
                                window.location.href = 'http://m.dhgate.com/login.do?rfid=' + rf_id
                            }else{
                                $('#opacityLayer').html("Query payment information failure").show();
                                $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                                setTimeout(function(){
                                    $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                                     window.location.href = 'http://m.dhgate.com/mydhgate/order/orderlist.html?rfid=' + index 
                                },1000); 
                            }
                        }else{
                            window.location.href = 'http://m.dhgate.com/dhpayment.do?rfid=' + rf_id;
                        };

                    };
                    var apiSet = {
                        url: Api_head+'canProceedToPay.do?'

                    };

                    $.ajax({
                        url: apiSet.url,
                        cache:false,
                        data:{rfid:rf_id},
                        type: 'get',
                        dataType: 'json',
                        success: func,
                        error: function () {
                            //
                        }
                    });
                    func = null;
                    return this;
            });
            $('.operate').delegate('.only_track,.track_item','click',function(){//物流
                var rf_id=$(this).attr('rfid');
                javascript:ga('send','event','My-Orders',ORDER.orderlistarray[payme-1],'TrackItem');
              window.location.href = 'trackinfo.html?rfx_id=' + rf_id+'&rft='+index;
            });
            $('.operate').delegate('.track_rece','click',function(){//取消按钮
                var rf_id=$(this).attr('rfid');
                var $div_list=$(this);
                javascript:ga('send','event','My-Orders',ORDER.orderlistarray[payme-1],'OrderReceived');
                var r=confirm("Have you received your order and you are satistied with it?");
                if (r==true) {
                    var that = this;
                    var func = function (res) {
                        if (res.result == 0) {
                            if (res.returnurl !== undefined) {
                                window.location.href = 'http://m.dhgate.com/login.do?rfid=' + rf_id
                            }else{
                                $('#opacityLayer').html("Order cannot be confirmed").show();
                                $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                                setTimeout(function(){
                                        $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                                         window.location.href = 'http://m.dhgate.com/mydhgate/order/orderlist.html?rfid=' + index 
                                },1000); 
                            }
                        }else{
                            $('#opacityLayer').html("Order received.").show();
                            $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                            setTimeout(function(){
                                $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                                   // window.location.href = 'http://m.dhgate.com/mydhgate/order/orderlist.html?rfid=' + index 
                            },1000); 
                             $div_list.parent().parent().remove();
                          var last_num=$('.selected p span').html();
                              if(last_num==1){
                                $('.selected p span').hide();
                                    $('#list_'+index).html('<div class="order_shop"><p class="shop_p">You currently have no '+list_name+' orders.</p> <a href="http://m.dhgate.com/" class="go_shop" >Start Shopping</a></div>');
                              }else if(last_num=='99+'){
                                var num_span=$('.selected p span').attr('num')
                                if(num_span==100){
                                    $('.selected p span').html('99');
                                }else{
                                    $('.selected p span').html('99+');
                                }
                                 if($('#list_'+payme+' .awaiting_list').length==0){
                                    $('#list_'+payme).html('<div class="order_none"></div>')
                                    orderLosd.getorderApi(payme,1);
                                }
                              }else{
                                 $('.selected p span').html(last_num-1);
                                if($('#list_'+payme+' .awaiting_list').length==0){
                                    $('#list_'+payme).html('<div class="order_none"></div>')
                                    orderLosd.getorderApi(payme,1);
                                }
                              }    
                                               
                      };

                    };
                      var apiSet = {
                        url: Api_head+'completeOrder.do?'

                    };

                    $.ajax({
                        url: apiSet.url,
                        cache:false,
                        data:{rfid:rf_id},
                        type: 'get',
                        dataType: 'json',
                        success: func,
                        error: function () {
                            //
                        }
                    });
                    func = null;
                    return this;
                }                  
            });
            },
        stringoff:function(productName){
            var productNameStr;

                if (productName.length >=55)
                {
                    productNameStr =productName.substring(0,50)+"...";
                }else{
                    productNameStr=productName;
                }
                return productNameStr;
        },
        timechage:function(time){
            var   year=new Date(time).getFullYear();   
            var   month=new Date(time).getMonth(); 
            var   day= new Date(time).getDate();
            var   hours=new Date(time).getHours();
            var   minutes=new Date(time).getMinutes();
            if(minutes<10){
                minutes=minutes+'0';
            }
            var monthArray=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] ;
            var monthdatil=monthArray[month]+'  '+day+', '+year+' '+hours+':'+minutes;
            return monthdatil

        },
        nalk:function(){
            $("body").on("click",".chat",function(){
                javascript:ga('send','event','My-Orders',ORDER.orderlistarray[index-1],'ContactSeller');
                javascript:ga('send','event','My-Orders','ChatSeller');
                var ntalkerSellerid = $(this).attr('ntalkerSellerid'),
                     uname=DHM.Cookie.getCookie("b2b_nick_n"),
                     ntalker_buyerid = $(this).attr('ntalker_buyerid'),
                     ntalker_js_url=$(this).attr('ntalker_js_url'),
                     ntalker_js_urlStr =ntalker_js_url.substring(0,ntalker_js_url.lastIndexOf("/")), 
                     productId = "",
                     productName ='',
                     bid_sid_pid='',
                     NTKF_PARAM = {
                        siteid:'dh_1000',                 //平台基础id
                        sellerid:'dh_'+ntalkerSellerid,    //商户id，商家页面必须此参数，平台页面不传
                        settingid:'dh_'+ntalkerSellerid+'_9999',         //Ntalker分配的缺省客服组id
                        uid:'dh_'+ntalker_buyerid+'',           //用户id  buyerid   hashcode的绝对值的字符串，前面加dh_
                        uname:uname,         //用户名    nickname获取cookie b2b_nick_n值
                        userlevel:'0'       //用户级别，1为vip用户，0为普通用户
                    },
                    itemcode =$("#J_shippingCost strong").attr("itemcode");
                //必须要请求一次后台判断用户是否登录，不能用页面上的参数，因为用户可能在另外一个页面已经退出了登录
                var charwin = [];
                $.ajax({
                    url: '/buyerislogin.do',
                    cache:false,
                    type: 'GET',
                    dataType:'text',
                    async: false,
                    error: function(){},
                    success: function(data){
                        if(data != undefined && data.trim()=="true"){//登录
                            charwin.push(""+ntalker_js_urlStr+"/mobilechat_en_us.html");//js地址
                            charwin.push("#siteid="+NTKF_PARAM.siteid+"&settingid="+NTKF_PARAM.settingid);
                            charwin.push("&destid="+NTKF_PARAM.sellerid+"_ISME9754_GT2D_embed_"+NTKF_PARAM.settingid+"_icon");
                            charwin.push("&myuid="+NTKF_PARAM.uid+"&myuname="+NTKF_PARAM.uname+"&itemid="+productId+"");
                            charwin.push("&single=0&userlevel="+NTKF_PARAM.userlevel+"&ref="+encodeURIComponent(document.location));
                            charwin.push("&title=Wholesale"+encodeURIComponent("-"+productName+""));
                            charwin.push("&itemparam="+bid_sid_pid+"");
                        }else{//未登录
                            var href=window.location.href;
                            location.href = 'http://m.dhgate.com/login.do?returnURL='+href;

                        }
                    }
                });
                if(charwin.length>0){
                    var p = "height=540,width=320,directories=no,"+ "location=no,menubar=no,resizable=yes,"+ " status=no,toolbar=no,top=100,left=200";
                    try {window.open(charwin.join(''),'chat',p);} catch(e) {}
                }
            });
        }
    };
}(window, Zepto));


//orderTab.js
(function(self, $){
    var Api_head='http://' + document.domain + '/',
        img_head='http://www.dhresource.com/',
        tools = ORDER.tools,
        orderLosd = tools.orderLosd,
        orderTab;

    tools.orderTab = orderTab =function(){
        this.init();
    }
    orderTab.prototype = {
        init:function(){
            this.tabslide();
            this.productslide();
            this.operation();
            this.messagenumapi();
         },
    
        operation:function(){
            var detail_addrlist = $("#J_track");
            detail_addrlist.delegate('.track_head','click',function(){
                if($(this).hasClass('down')==true){
                    $(this).parent().siblings().last().toggle();
                    $(this).removeClass('down').addClass('up');
                    $(this).css('border-left','1px solid #d8d8d8');
                }else{
                    $(this).parent().siblings().last().toggle();
                    $(this).removeClass('up').addClass('down');
                    $(this).css('border-left','none'); 
                }
                
            });   
        },
        tabslide:function(data,scope,param){
            var $mi = $('#J_mayInterest');
            var len = $mi.find("li").length;
            var w = $mi.find("li").find("p").first().width();
            DHMSlide({
                element:$mi[0],
                con:"ul",
                totalWidth: w * len + 10,
                width:$(window).width(),
                speed:500,
                autoRun: false, 
                loop: false,
                distance:250
            });
            var tabs = $("#J_mayInterest ul");
            var tab_li = $("#J_mayInterest ul li");
        
            tabs.delegate('li','click',function(){
                var orderlistarray=['AwaitPayment','PendConfirm','AwaitShip','Shipped','Completed','FefundDispute','Canceled'];
                index = $(this).index()+1;
                $('#list_'+index).siblings().hide();
                $('#list_'+index).show();             
                for (var i = 0; i < 7; i++) {
                    $(tab_li[i]).removeClass('tabselect_'+(i+1)) ;
                    $(tab_li[i]).addClass('tab_'+(i+1)); 
                }
                javascript:ga('send','event','My-Orders',orderlistarray[index-1]);
              $('.det-home').click(function(){
                javascript:ga('send','event','My-Orders',orderlistarray[index-1],'Home')
              })

                $(this).addClass("tabselect_" + index).removeClass("tab_" + index);
                $(".select_line").animate({left:(index-1) * 70 + 10});
                $(this).addClass("selected").siblings().removeClass("selected");
                if ($(this).attr('state')==1) {
                    $(this).attr('state','2')
                     orderLosd.getorderApi(index,1);
                     $(this).attr('page','1')
                }else{
                    return false;
                }
               
            });  
        },
      productslide:function(data,scope,param){
                var $mi = $('#pa_product');

                var len = $mi.find("li").length;
                var w = 50;
                DHMSlide({
                    element:$mi[0],
                    con:"ul",
                    totalWidth: w * len + 10,
                    width:$(window).width(),
                    speed:500,
                    autoRun: false, 
                    loop: false,
                    distance:250
                });
            },
        messagenumapi:function(){
            var that = this;
            var func = function (res) {
                that.messagenum(res);
            };
                $.ajax({
                url: Api_head + 'getOrdersCountByStatus.do',
                cache:false,
                type: 'get',
                dataType: 'json',
                success: func,
                error: function () {
                }
            });
            func = null;
            return this;
        },
    messagenum:function(num){
    
            var message=$('.ls_message');
            var Count=num.ordersCount;
            if(Count.awaitingpaycount==0){  
                $(message[0]).hide();              
            }else{
                if(Count.awaitingpaycount>99){
           
                $(message[0]).html('99+') ;  
                }else{
                $(message[0]).html(Count.awaitingpaycount);  
                }
                $(message[0]).attr('num',Count.awaitingpaycount);
                $(message[0]).show(); 
               
            };
            if(Count.pendingConfirmationcount==0){
                $(message[1]).hide(); 
            }else{
                if(Count.pendingConfirmationcount>99){
                    $(message[1]).html('99+') ;
                }else{
                    $(message[1]).html(Count.pendingConfirmationcount)  ;
                }
                 $(message[1]).attr('num',Count.pendingConfirmationcount);
                $(message[1]).show();
                
            };
             if(Count.awaitingShipmentcount==0){
                $(message[2]).hide(); 
            }else{
                if(Count.awaitingShipmentcount>99){
                     $(message[2]).html('99+') ;
                }else{
                     $(message[2]).html(Count.awaitingShipmentcount)  
                }
                 $(message[2]).attr('num',Count.awaitingShipmentcount);
                $(message[2]).show();
              
            };
             if(Count.shippedcount==0){
                $(message[3]).hide(); 
            }else{
                if(Count.shippedcount>99){
                    $(message[3]).html('99+') 
                }else{
                    $(message[3]).html(Count.shippedcount)  
                }
                 $(message[3]).attr('num',Count.shippedcount);
                $(message[3]).show();
            
            };
             if(Count.completedcount==0){
                $(message[4]).hide(); 
            }else{
                if(Count.completedcount>99){
                    $(message[4]).html('99+') 
                }else{
                    $(message[4]).html(Count.completedcount)  
                }
                 $(message[4]).attr('num',Count.completedcount);
                $(message[4]).show();
             
            };
             if(Count.refundcount==0){
                $(message[5]).hide(); 
            }else{
                if(Count.refundcount>99){
                    $(message[5]).html('99+') 
                }else{
                    $(message[5]).html(Count.refundcount)   
                }
                 $(message[5]).attr('num',Count.refundcount);
                $(message[5]).show();
            
            };
             if(Count.canceledcount==0){
                $(message[6]).hide(); 
            }else{
                if(Count.canceledcount>99){
                    $(message[6]).html('99+') 
                }else{
                    $(message[6]).html(Count.canceledcount) 
                }
                 $(message[6]).attr('num',Count.canceledcount);
                $(message[6]).show();
                
            };
          
           
        }
    };
}(window,Zepto));

    new ORDER.tools.orderTab();
    ORDER.tools.orderLosd.init();


});