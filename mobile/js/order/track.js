
Zepto(function($){
    var trackLoad = function () {
        this.init();
        var orderlistarray=['AwaitPayment','PendConfirm','AwaitShip','Shipped','Completed','FefundDispute','Canceled'];
    };
    trackLoad.prototype = {
            constructor:trackLoad,
        init:function(){
            var that=this;
             that.TrackList();
             that.operation();
           },
        TrackList: function () {
            var that = this,
                rf_id=location.search.split('=')[1].split('&')[0],
                rft=location.search.split('=')[2];
                $('.det-home').click(function(){
                    javascript:ga('send','event','My-Orders',orderlistarray[rft-1],'Home');
                  })
                if (rft==undefined) {
                    // $('.det-back').attr('href','javascript:history.go(-1)')
                }else{
                    $('.det-back').attr('href','http://m.dhgate.com/mydhgate/order/orderlist.html?rft='+rft);
                };
              
               
            var func = function (res) {
                that.getList(res);
            };
            var apiSet = {
                url: 'http://m.dhgate.com/getTrackInfo.do?'

            };

            $.ajax({
                url: apiSet.url,
                data: {rfx_id:rf_id},
                type: 'get',
                dataType: 'json',
                success: func,
                error: function () {
                       console.log(arguments);
                }
            });
            func = null;
            return this;
        },
        getList: function (res) {
          var that = this;
            var track_info = res.info;
            var track_list = '';
            var items_list ='';
            var all = '';
            if(res.code=='0x0000'){
                for(var i = 0;i<track_info.length;i++)
                {
                    var times=track_info[i].timeOfSubmission;
                    var time=that.timechage(times);
                    track_list ='<div class="detail_information"><p>Track Number ：<span>'+track_info[i].trackingNumer+' </span></p> '+
                        '<p>Shipping Method ：'+track_info[i].shippingMethod+'</p>'+
                        '<p>Time of Submission ：'+time+'</p>'+
                        '<p>Delivered time ：'+track_info[i].deliveredTime+'</p>';
                     
                    if(track_info[i].trackable==true)
                    {
                        var track_items=track_info[i].items;
                        items_list =' <div class="track_addr"> <div class="track_head down"><img src="http://css.dhresource.com/mobile/order/image/trak_orange.png">'+
                            '<p class="label">'  +track_items[0].address+','+track_items[0].desc+'</p><span>'+track_items[0].date+'</span></div></div>'
                        var items_info = '';
                        for(var j=1;j<track_items.length;j++)
                        {
                            items_info += '<li><img src="http://css.dhresource.com/mobile/order/image/track_grey.png">'+
                                '<p>'+track_items[j].address+','+track_items[j].desc+'</p>'+
                                '<span>'+track_items[j].date+'</span></li>';
                        }
                        items_list = items_list+'<ul class="menu">'+items_info+'</ul></div>';

                    }else if(track_info[i].trackable==false){
                        items_list =' <div class="track_addr"> <div class="track_down"><img src="http://css.dhresource.com/mobile/order/image/track_grey.png">'+
                            '<p>'  +track_info[i].untrackableDesc+'</p><span>'+time+'</span></div></div></div>'

                    }

                    track_list=  track_list+items_list;
                    $('.order_none').remove()
                    $('#J_track').append(track_list);
                }

                if(track_info.length==1){
                    $('.track_head').click()
                }
                $('.menu li').last().css('border','none');

            }else{
                alert('Timeout!');
                return false;
            }

        },
         operation:function(){
            var detail_addrlist = $("#J_track");
            detail_addrlist.delegate('.track_head','click',function(){
                if($(this).hasClass('down')==true){
                    $(this).parent().siblings().last().toggle();
                    $(this).removeClass('down').addClass('up');
                    $(this).css('border-left','1px solid #d8d8d8');

                    $(this).parent().siblings().last().find('li').last().css('border','none');
                }else{
                    $(this).parent().siblings().last().toggle();
                    $(this).removeClass('up').addClass('down');
                    $(this).css('border-left','none'); 
                }
                
            });   
        },
           timechage:function(times){
            var time=parseInt(times);
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

        }
       
    };

    new trackLoad();
});










