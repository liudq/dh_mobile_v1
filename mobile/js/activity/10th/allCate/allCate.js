/**
 * Created by zhaojing on 2014/7/23.
 */
Zepto(function($){
    DHM.Init.logoSummary();
    DHM.Init.loginState();
    var $cate=DHM.Util.domExist(".j-allCate");
    if(!$cate) return;
    var touch=DHM.Util.events().end;
    var $children=$cate.children();
    $children.find("h3").delegate("h3",touch,function(){
        $(this).parent().toggleClass("current").siblings().removeClass("current");
    });
});
