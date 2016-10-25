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