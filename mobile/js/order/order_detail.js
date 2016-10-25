var ORDER = {
    tools: {},
    'rft':'',
    'orderlistarray':['AwaitPayment','PendConfirm','AwaitShip','Shipped','Completed','FefundDispute','Canceled']
};
 function golink(a,b,c,d){
            if(a=='sendmsg.do'){
             window.location.href='http://m.dhgate.com/sendmsg.do?order_no='+b+'&spid='+c+'&mty=2' ;
              javascript:ga('send','event','My-Orders','SendMessage');
              javascript:ga('send','event','My-Orders',ORDER.orderlistarray[ORDER.rft-1],'ContactSeller');

            }else{
               window.location.href='http://m.dhgate.com/reorder.do?rfx_id='+b+'&vid='+c+'&b2b_cart_sid='+d;
                javascript:ga('send','event','My-Orders',ORDER.orderlistarray[ORDER.rft-1],'Reorder');  
            }
              console.log(a);


        };

/**
 * Created by xiaonnannan on 2015/06/15.
 */
Zepto(function($){

    
(function(self, $){
     var Api_head='http://' + document.domain + "/",
        img_head='http://www.dhresource.com/',
        tools = ORDER.tools, 
        detailLosd;

    //order list
    tools.detailLosd = detailLosd = function(){
             this.init();
          
        },
        detailLosd.prototype = {

        init:function(){
            // $('.Order_Detail').html('<div class="order_none"></div>');
            this.detailGet();
            this.nalk();

            // this.golink();
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
        detailGet:function(){
            var that = this,
                rf_id=location.search.split('=')[1].split('&')[0];
                ORDER.rft=location.search.split('=')[2];
                $('.det-back').attr('href','http://m.dhgate.com/mydhgate/order/orderlist.html?rft='+ORDER.rft);
                 $('.det-home').click(function(){
                javascript:ga('send','event','My-Orders',ORDER.orderlistarray[ORDER.rft-1],'Home');
              })
            var func = function (res) {

                that.detailOrder(res);
            };
            var apiSet = {
                url: Api_head+'viewOrderDetail.do?'

            };

            $.ajax({
                // url : '/api.php?jsApiUrl=' + Api_head + 'viewOrderDetail.do?', //调试模式使用，上线时请删除此行
                url: apiSet.url,
                
                type: 'get',
                data:{rfid:rf_id},
                dataType: 'json',
                success: func,
                error: function () {
                    //
                }
            });
            func = null;
            return this; 
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
            $("body").on("click",".J_chat",function(){
                javascript:ga('send','event','My-Orders',ORDER.orderlistarray[ORDER.rft-1],'ContactSeller');
                javascript:ga('send','event','My-Orders','ChatSeller');
                var ntalkerSellerid = $(this).attr('ntalkerSellerid'),
                     uname=DHM.Cookie.getCookie("b2b_nick_n"),
                     ntalker_buyerid = $(this).attr('ntalker_buyerid'),
                     ntalker_js_url=$(this).attr('ntalker_js_url'),
                     ntalker_js_urlStr =ntalker_js_url.substring(0,ntalker_js_url.lastIndexOf("/")), 
                     productId = '',
                     productName = '',
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
        },
        detailOrder:function(detail){
           
            var that=this,
                order_detail=  detail.order.orderDetail ,
                datail_product="",
                detail_cost,
                detail_product,
                detail_statue,
                orderlist_B,
                detail_group,
                person,
                address,
                vid=DHM.Cookie.getCookie("vid"),
                b2b_cart_sid=DHM.Cookie.getCookie("b2b_cart_sid");

                if(order_detail.shippingvTdRfxContactinfo.addressline2==''){
                    address=order_detail.shippingvTdRfxContactinfo.addressline1+','+order_detail.shippingvTdRfxContactinfo.city+','+order_detail.shippingvTdRfxContactinfo.state+','+order_detail.shippingvTdRfxContactinfo.country+','+order_detail.shippingvTdRfxContactinfo.postalcode;
                                    }else{
                    address=order_detail.shippingvTdRfxContactinfo.addressline1+','+order_detail.shippingvTdRfxContactinfo.addressline2+','+order_detail.shippingvTdRfxContactinfo.city+','+order_detail.shippingvTdRfxContactinfo.state+','+order_detail.shippingvTdRfxContactinfo.country+','+order_detail.shippingvTdRfxContactinfo.postalcode;

                };
                 detail_statue='<p class="pa_order"><span class="detail_name">Order Status ：</span><span class="pa_red ">'+order_detail.rfxstatusname+'</span> <span onclick=golink("reorder.do","'+order_detail.tdrfxvo.rfxid+'","'+vid+'","'+b2b_cart_sid+'"); class="re_order">Re-order</span> </p>';
                //团购
                if(order_detail.tdrfxvo.groupPromoid && order_detail.tdrfxvo.groupPromoid != 0){
                      var   orderStatusId = order_detail.tdrfxvo.rfxstatusid;
                      var   groupStatus = order_detail.tdrfxvo.groupStatus;
                      if(groupStatus==null || groupStatus == 0){
                        if(orderStatusId == '101003' && order_detail.tdrfxvo.cancelOrderCountdownDesc !=null){
                            detail_group='  <div class="group_bg"> <div class="detail_group"><h3 class="group_title">Group Buying Item</h3>'+
                                            '<div class="group_text">'+
                                '<p>Please make payment , or the system will automatically cancel your order after $'+order_detail.tdrfxvo.cancelOrderCountdownDesc+'</p></div></div></div>';
                        }else if(orderStatusId =='101006' || orderStatusId =='103001'|| orderStatusId =='103002'|| orderStatusId =='105003' || orderStatusId =='105004'){
                            detail_group='  <div class="group_bg">      <div class="detail_group"><h3 class="group_title">Group Buying Item</h3><div class="group_text">'+
                                    '<p>After a group buy is successful, the seller will ship the items.</p>'+
                                    '<p>Note: If the group buying level has not been reached, the seller might cancel the order.</p></div></div> </div>'
                        }else {
                            detail_group='';
                        }
                      }else if(groupStatus == 2 && orderStatusId == '111000'){
                                detail_group=' <div class="group_bg"><div class="detail_group"><h3 class="group_title">Group Buying Item</h3><div class="group_text">'+
                                '<p>Group buy failed, the seller has canceled the order.</p></div>   </div>  </div>'
                        }else{
                            detail_group=''; 
                        }
                      $('.detail_re').html(detail_group+detail_statue);
                }else{
                    $('.detail_re').html(detail_statue);
                }
              
                 
                person='   <p>Contact Name :<span>'+order_detail.shippingvTdRfxContactinfo.firstname+order_detail.shippingvTdRfxContactinfo.lastname+'</span></p>'+
                     '<p>Phone :<span>'+order_detail.shippingvTdRfxContactinfo.tel+'</span></p>'+
                      '<p>Address :<span id="J_address">'+that.stringoff(address)+'</span></p>'
                $('.J_person').html(person);

                for(var n=0;n<order_detail.tdrfxproductlist.length;n++){
                    datail_product+=' <div class="pa_product" onclick=window.location.href="'+Api_head+'product/'+order_detail.tdrfxproductlist[n].productUrl+'/'+order_detail.tdrfxproductlist[n].itemcode+'.html"> ' +
                        '<img src='+img_head+order_detail.tdrfxproductlist[n].r_image+'><p class="detail_p J_name">'+that.stringoff(order_detail.tdrfxproductlist[n].productname)+'</p>' +
                        '<p><span class="pay_price">US $'+order_detail.tdrfxproductlist[n].targetprice+'/'+order_detail.tdrfxproductlist[n].measurename+'</span> ×'+order_detail.tdrfxproductlist[n].quantity+'</p></div>'

                     };
                if(detail.order.ntalker.isonLine==false){
                    orderlist_B = ' <p  onclick=golink("sendmsg.do","'+order_detail.tdrfxvo.rfxno+'","'+detail.order.supplier.systemuserid+'",2)  class="detail_order"><span class="email talk"></span>Contact to Seller</p>';

                }else{
                    orderlist_B =' <p ntalkerSellerid='+detail.order.ntalker.ntalker_sellerid+' ntalker_buyerid='+detail.order.ntalker.ntalker_buyerid+'  ntalker_js_url='+detail.order.ntalker.ntalker_js_url+' class="detail_order J_chat"><span  class="chat talk"></span>Contact to Seller</p>';
                }   
                $('.detail_product').html(datail_product+orderlist_B);
                detail_cost='<p>Items Cost ：<span>US $ '+order_detail.summarybuyerto.subtotal+'</span></p>'+
                            '<p>Shipping Total ：<span>US $ '+order_detail.summarybuyerto.shippingtotal+'</span></p>'+
                            '<p>Refund ：<span>-US $ '+order_detail.tdrfxvo.totalrefund+'</span></p>'+
                            '<p>Product Refund ：<span>US $ '+order_detail.tdrfxvo.rfxrefund+'</span></p>'+
                            '<p>Shipping Cost Refund ：<span>-US $ '+order_detail.tdrfxvo.shipcostrefund+'</span></p>'+
                            '<p>Payment added ：<span>US $ '+order_detail.tdrfxvo.fillsection+'</span></p>'+
                            '<p>Discount ：<span>-US $ '+order_detail.tdrfxvo.rfxsave+'</span></p>'+
                            '<p>sellerShowUpper Coupon ：<span>-US $ '+order_detail.tdrfxvo.couponofseller+'</span></p>'+
                            '<p>DHcoupon ：<span>-US $ '+order_detail.tdrfxvo.coupondiscount+'</span></p>'+
                            '<p>Shipping Cost Saving ：<span>-US $ '+order_detail.tdrfxvo.shipcostsave+'</span></p>'+
                            '<p>Wholesale Discount ：<span>-US $ '+order_detail.summarybuyerto.wholesalediscount+'</span></p>'+
                            '<p class="addr_last">Order Total：<span class="pay_price">US $ '+order_detail.summarybuyerto.totalprice+'</span></p>';
                $('.detail_addr').html(detail_cost);
                 $('.order_none').remove();
                $('.J_detail').show();
                //让显示0的隐藏
                var D_cost= $('.detail_addr p span');
                for(var t=2;t<D_cost.length;t++){
                 var costs = $(D_cost[t]).html().split('$')[1];
                 if(costs==0){
                    $(D_cost[t]).parent().hide()
                 }
                }

                detail_product='<p>Order Number ：<span>'+order_detail.tdrfxvo.rfxno+'</span></p><p>Order Time：<span>'+that.timechage(order_detail.tdrfxvo.starteddate.time)+'</span></p><p>Ship Via ：<span>'+order_detail.tdrfxvo.shippingtype+'</span></p>'
                $('.J_order').html(detail_product) ;
                //按钮的显示
                if(order_detail.tdrfxvo.rfxstatusid==101003){
                    var detail_fb='<p class="clearfix operate pay_but"> <span rfid='+order_detail.tdrfxvo.rfxid+' class="pay_cancel">Cancel Order</span> <span rfid='+order_detail.tdrfxvo.rfxid+' class="pay_topay">Proceed to Pay</span></p>';
                    $(".J_button").html(detail_fb);
                }else if(order_detail.tdrfxvo.rfxstatusid==101009&&detail.order.trackInfoFilled==true){
                    var detail_fb='<p class="clearfix operate track_but"> <span rfid='+order_detail.tdrfxvo.rfxid+' class="track_item">Track Items</span> <span rfid='+order_detail.tdrfxvo.rfxid+' class="track_rece">Order Has Been Received</span></p>';
                    $(".J_button").html(detail_fb);
                }else if(order_detail.tdrfxvo.rfxstatusid==101009&&detail.order.trackInfoFilled==false){
                    var detail_fb='<p class="clearfix operate track_but">  <span rfid='+order_detail.tdrfxvo.rfxid+' class="track_rece">Order Has Been Received</span></p>';
                    $(".J_button").html(detail_fb);
                }else if(detail.order.trackInfoFilled==true){

                    var detail_fb=' <p class="clearfix operate order_but"> <span rfid='+order_detail.tdrfxvo.rfxid+' class="only_track">Track Items</span></p>';
                    $(".J_button").html(detail_fb);
                }else{

                };
//按钮的作用
                $('.operate').delegate('.pay_cancel','click',function(){//取消按钮
                    var rf_id=$(this).attr('rfid');
                    javascript:ga('send','event','My-Orders',ORDER.orderlistarray[ORDER.rft-1],'CancelOrder');
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
                                      location.reload(); 
                                },1000);

                                }
                            }else{
                                $('#opacityLayer').html("Your order has been canceled.").show();
                                $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                                setTimeout(function(){
                                $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                                location.reload();
                                },1000); 
                               
                            };

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
                        javascript:ga('send','event','My-Orders',ORDER.orderlistarray[ORDER.rft-1],'ProceedPay');
                        var func = function (res) {
                            if (res.result == 0) {
                                if (res.returnurl !== undefined) {
                                    window.location.href = 'http://m.dhgate.com/login.do?rfid=' + rf_id
                                }else{
                                    $('#opacityLayer').html("Query payment information failure").show();
                                    $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                                    setTimeout(function(){
                                        $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                                        location.reload(); 
                                    },1000); 
                             
                                }
                            }else{
                               window.location.href = 'http://m.dhgate.com/dhpayment.do?rfid=' + rf_id
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
                    javascript:ga('send','event','My-Orders',ORDER.orderlistarray[ORDER.rft-1],'TrackItem');
                  window.location.href = 'trackinfo.html?rfx_id=' + rf_id
                });
                $('.operate').delegate('.track_rece','click',function(){//取消按钮
                    var rf_id=$(this).attr('rfid');
                    javascript:ga('send','event','My-Orders',ORDER.orderlistarray[ORDER.rft-1],'OrderReceived')
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
                                        location.reload(); 
                                    },1000); 
                                  
                                }

                            }else{
                                    $('#opacityLayer').html("Order received.").show();
                                    $('#opacityLayer').animate({ opacity: 1 ,zIndex:999},500, 'ease-out');
                                    setTimeout(function(){
                                        $('#opacityLayer').animate({ opacity: 0 ,zIndex:-22},500, 'ease-out');
                                         location.reload();  
                                    },1000);  

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
//状态栏的字
                var width=screen.width;
                if(screen.width*0.45<$('.pa_red').width()){
                    $('.pa_order .pa_red').addClass('pa_statue')
                }else{
                    $('.pa_order .pa_red').removeClass('pa_statue')
                }

        }
      
    };

}(window,Zepto));
    new ORDER.tools.detailLosd();

});