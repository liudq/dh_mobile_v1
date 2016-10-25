/**
 * Created by zhaojing on 2014/8/22.
 * 我的活动相关js
 */
;Zepto(function($){
    function ChoosePro(opt){
        this.opts=$.extend({
            selectProId:"#J_selectPro",
            checkedId:".j-checkedPro",
            checkedAllId:".j-checkedallPro",
            checkedNumId:".j-checkedNum",
            activeCcBtnId:".j-signUpBtn",
            activeCcUrl:"XXXX.do"
        },opt);
        this.mevent=DHM.Util.eType();
        this.total=0;
        this.init();
    }
    ChoosePro.prototype={
        constructor:ChoosePro,
//      根据产品组筛选
        selectPro:function(){
            var self=this;
            var $select=DHM.Util.domExist(self.opts.selectProId);
            if(!$select) return;
            $select.change(function(){
                document.forms[0].submit();
            });
        },
//      获取相关checked的元素内容
        getCheckedDom:function(){
            var self=this;
            var ifDom=DHM.Util.domExist;
            var $check=ifDom(self.opts.checkedId);
            var $checkAll=ifDom(self.opts.checkedAllId);
            var $checkNum=ifDom(self.opts.checkedNumId);
            var sum=$check.length;
            return [$check,$checkAll,$checkNum,sum];
        },
//      check 产品
        checkedPro:function(){
            var self=this;
            var $checked=self.$checked;
            if(!$checked[0]) return;
            $checked[0].delegate($checked[0],self.mevent,function(){
                var $n=$(this);
                $n.hasClass("checkActive")?$n.removeClass("checkActive"):$n.addClass("checkActive");
                var l=$(self.opts.checkedId+".checkActive").length;
                $checked[2].text(l);
                if(l==$checked[3]){
                    $checked[1].addClass("checkActive");
                }else{
                    $checked[1].removeClass("checkActive");
                }
            });
        },
//      checked 所有产品
        checkedAllPro:function(){
            var self=this;
            var $checked=self.$checked;
            if(!$checked[1]) return;
            $checked[1].delegate($checked[1],self.mevent,function(){
                var $n=$(this);
                if($n.hasClass("checkActive")){
                    $checked[0].removeClass("checkActive");
                    $n.removeClass("checkActive");
                    $checked[2].text(0);
                }else{
                    $checked[0].addClass("checkActive");
                    $n.addClass("checkActive");
                    $checked[2].text($checked[3]);
                }

            });
        },
//      撤销报名
        cancelActive:function(){
            var self=this;
            var $cancel=DHM.Util.domExist(self.opts.activeCcBtnId);
            if(!$cancel[0]) return;
            $cancel.delegate($cancel,self.mevent,function(){
                DHM.util.request({
                    url:self.opts.activeCcUrl,
                    data:"",
                    fn:self.cancelActiveRes,
                    scope:self
                });
            });
        },
        cancelActiveRes:function(data,scope,param){
            alert(data);
        },
        init:function(){
            var self=this;
            self.selectPro();
            self.$checked=self.getCheckedDom();
            self.checkedPro();
            self.checkedAllPro();
            self.cancelActive();

        }
    };
    new ChoosePro();

    function DiscontPro(opt){
        this.opts=$.extend({
            minDiscountId:"#J_minDiscount",
            maxDiscountId:"#J_maxDiscount",
            minStrDownId:"#J_minStrDown",
            manStrDownId:"#J_maxStrDown",
            setDiscountId:"#J_setDiscount",
            singleDiscountId:".j-singleDiscount",
            setStrDownId:"#J_setStrDown",
            singleStrDownId:".j-singleStrDown",
            delBtnID:".j-proDel"
        },opt);
        this.mevent=DHM.Util.eType();
        this.init();
    }
    DiscontPro.prototype={
        constructor:DiscontPro,
//      获取折扣范围
        getDiscount:function(){
            var self=this,ifd=DHM.Util.domExist,min,max;
            var $minDis=ifd(self.opts.minDiscountId);
            var $maxDis=ifd(self.opts.maxDiscountId);
            if($minDis) min=$minDis.text()*10;
            if($maxDis) max=$maxDis.text()*10;
            return [min,max];
        },
//      获取直降范围
        getStrDown:function(){
            var self=this,ifd=DHM.Util.domExist,min,max;
            var $minStr=ifd(self.opts.minStrDownId);
            var $maxStr=ifd(self.opts.manStrDownId);
            if($minStr) min=$minStr.text()*100;
            if($maxStr) max=$maxStr.text()*100;
            return [min,max];
        },
//      折扣设置验证
        disValid:function(v,scope){
            var discount=scope.getDiscount();
            if(!/^\d{1}(\.\d{1})?$/.test(v)){
                return [false,"输入的格式不正确"];
            }else if((v*10)>=discount[0]&&(v*10)<=discount[1]){
                return [true];
            }else{
                return [false,"设置的折扣超出范围，请重新设置。"];
            }
        },
//      批量设置折扣
        setDiscount:function(){
            var self=this,ifd=DHM.Util.domExist;
            var $setDis=ifd(self.opts.setDiscountId);
            var $singleDis=ifd(self.opts.singleDiscountId);
            if(!$setDis) return;
            $setDis.blur(function(){
                var v=$(this).val();
                var valid=self.disValid(v,self);
                if(valid[0]){
                    if($singleDis) $singleDis.val(v);
                }else{
                    alert(valid[1]);
                }
            });
        },
//      单个商品设置折扣
        setSingleDis:function(){
            var self=this,ifd=DHM.Util.domExist;
            var $singleDis=ifd(self.opts.singleDiscountId);
            if(!$singleDis) return;
            $singleDis.blur(function(){
                var v=$(this).val();
                var valid=self.disValid(v,self);
                if(!valid[0]){
                    alert(valid[1]);
                }
            });
        },
//      直降设置验证
        strDValid:function(v,scope){
            var discount=scope.getStrDown();
            if(!/^\d+(\.\d{1,2})?$/.test(v)){
                return [false,"输入的格式不正确"];
            }else if((v*100)>=discount[0]&&(v*100)<=discount[1]){
                return [true];
            }else{
                return [false,"设置的折扣超出范围，请重新设置。"];
            }
        },
//      批量设置直降
        setStrDown:function(){
            var self=this,ifd=DHM.Util.domExist;
            var $setSD=ifd(self.opts.setStrDownId);
            var $singleSD=ifd(self.opts.singleStrDownId);
            if(!$setSD) return;
            $setSD.blur(function(){
                var v=$(this).val();
                var valid=self.strDValid(v,self);
                if(valid[0]){
                    if($singleSD) $singleSD.val(v);
                }else{
                    alert(valid[1]);
                }
            });
        },
//      单个商品设置直降
        setSingleStrD:function(){
            var self=this,ifd=DHM.Util.domExist;
            var $singleDis=ifd(self.opts.singleStrDownId);
            if(!$singleDis) return;
            $singleDis.blur(function(){
                var v=$(this).val();
                var valid=self.strDValid(v,self);
                if(!valid[0]){
                    alert(valid[1]);
                }
            });
        },
//      删除商品
        delPro:function(){
            var self=this,ifd=DHM.Util.domExist;
            var $del=ifd(self.opts.delBtnID);
            if(!$del) return;
            $del.delegate($del,self.mevent,function(){
               alert(1)
            });
        },
        init:function(){
            var self=this;
            self.delPro();
            self.setDiscount();
            self.setSingleDis();
            self.setStrDown();
            self.setSingleStrD();
        }
    };
    new DiscontPro();
});