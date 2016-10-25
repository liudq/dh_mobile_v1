/* 分页选择select框 */
var pageSelect = function(options){
    this.setOptions(options);
    if (!$('#' + this.options.productManage)[0]) {
        return;
    }
    this.proManSelect = $('.' + this.options.proManSelect);
    this.productManage = $('#' + this.options.productManage);
    this.Init();
};
pageSelect.prototype = {
    setOptions: function(options){
        this.options = {
            productManage:'J_productManage',
            proManSelect:'j-proManSelect'
        };
        $.extend(this.options, options || {});
    },
    Init: function(){
        var _this = this;
         this.productManage.delegate('.j-proManSelect','change',function(){
            var index = $('.j-proManSelect').get(0).selectedIndex;
            var Val = $(this).find('option').eq(index).val();
            $('.proMa-currpage').html(Val);
         });
       
    }
};
/* 站内信标记以及限制字数数量功能 */
var InboxCon = function(options){
    this.setOptions(options);
    if (!$('.' + this.options.inboxcon)[0]) {
        return;
    }
    this.inboxcon = $('.' + this.options.inboxcon);
    this.init();
};
InboxCon.prototype = {
    setOptions: function(options){
        this.options = {
            inboxcon:'j-inboxcon'
            
        };
        $.extend(this.options, options || {});
    },
    init:function(){
        var _this = this;
        
        this.inboxcon.delegate('.inbox-mark','click', function(evt){
            _this.markState(evt);
        });
        this.inboxcon.delegate('#J_inbTextarea', 'keyup', function(evt){
            _this.numLimitEvent(evt);
        });
    },
    markState:function(evt){
        var target = $(evt.currentTarget);
        if(target.hasClass('hasMark')){
            target.removeClass('hasMark');
        }else{
            target.addClass('hasMark');
        }
    },
    numLimitEvent: function(evt){
        var target = $(evt.currentTarget), inbLeave = $('#inbLeave');
        var maxNumber = parseInt($('.inb-maxNum').html());
        var tarVal = target.val();
        
        var number = maxNumber-tarVal.length;
    
        if(number<0){
            number = 0;
            $('#J_inbTextarea').val($('#J_inbTextarea').val().substring(0,maxNumber));
        }       
        inbLeave.html(number);
    }
};

//站内信标记已读
function readMark(tdMessageTopicId){
	$.ajax({ 
		url: 'readmark.do', 
		data: {'messageTopicVO.tdMessageTopicId':tdMessageTopicId}, 
		type: "post", 
		cache : false, 
		success: function(data){
			if(data.result == true){
				window.location.reload(); 
			}else{
				alert(data);
			}
		} 
	});
	
}

//站内信翻页函数
function turnPage(page){
	$("#page").val(page);
	$("#subform")[0].submit();
}

$(function(){
    /* 翻页select */
    var pageSele = new pageSelect();
    /* 站内信标记和限制字数 */
    var inbox = new InboxCon();
    
    //类型筛选
	$("#typeselect").change(function(){
		$("#subform")[0].submit();
	});
	//条件搜索提交
	$("#suba").click(function(){
		$("#subform")[0].submit();
	});
	//站内信回复
	$("#replySub").click(function(){
		//alert($("#J_inbTextarea").val());	
		if($("#J_inbTextarea").val() == ""){
			alert("not null");
			return;
		}
		if($("#J_inbTextarea").val().length > 4000){
			alert("too long")
			return;
		}
		$.ajax({ 
			url: 'reply.do', 
			data: $('#subform').serialize(), 
			type: "post", 
			cache : false, 
			success: function(data){
				if(data.result == true){
					window.location.reload(); 
				}else{
					alert(data);
				}
			} 
		});
	});
});



