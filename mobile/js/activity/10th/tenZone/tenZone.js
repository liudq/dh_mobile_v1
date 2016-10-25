/**
 * Created by zhaojing on 2014/7/23.
 */
Zepto(function($){
    DHM.Init.logoSummary();
    DHM.Init.loginState();
    var $ten=DHM.Util.domExist(".j-tenZ");
    if(!$ten) return;
    var touch=DHM.Util.events().end;
    var $children=$ten.children();
    $children.find("h3").delegate("h3",touch,function(){
        $(this).parent().toggleClass("current").siblings().removeClass("current");
    });
});