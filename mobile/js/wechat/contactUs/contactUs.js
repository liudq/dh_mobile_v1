/**
 * Created by zhaojing on 2014/8/25.
 */
;Zepto(function($){
    function eType(){
        var isSupportTouch="ontouchend" in document?true:false;
        if(isSupportTouch){
            return 'touchend';
        }else{
            return 'click';
        }
    }
    $("#J_getPsw").bind(eType(),function(e){
        e.preventDefault();
        e.stopPropagation();
        var $p=$(this).parent();
        $.ajax({
            url: "/ajax/user400code.do",
            type:"GET",
            dataType: "json",
            success: function(res){
                if(!res||!res.user400code) {
                    alert("对不起，没有获取到密码,请重试。")
                    return;
                }
                $p.html('<div class="psdWord">'+res.user400code+'</div>')
            },
            error: function(xhr, ts, et){
                console.log(xhr+"\n"+ts+"\n"+et);
                return false;
            }
        });
    });
});