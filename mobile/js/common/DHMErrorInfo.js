/**
 * Created by zhaojing on 2014/7/14.
 * 错误提示信息
 */
var DHM= DHM || {};
DHM.ErrorInfo ={
    errorInfo:{
        "firstName":"Please enter your first name. If you have a middle name, please also include it with your first name."
        ,"lastName":"Last name is required or delivery could fail."
        ,"addressLine1":"Please enter a valid Address Line1."
        ,"stateSelect":"Please enter a valid State or Province or Region"
        ,"stateInput":"Please enter a valid State or Province or Region"
        ,"city":"Please enter a valid Billing City/Town."
        ,"postalCode":"Please enter a valid Postal Code."
        ,"mobile":"Please enter a valid Telephone."
        ,"vatNumber":"Please enter a valid VAT Number."
        ,"country":"Please enter a valid Country."
        ,"cardNum":"Please enter a valid Card Number."
    },
    regInfo:{
        "firstName":{
            reg:/^[\s\S]{0,30}$/,
            err:"The length of First Name exceed max 30."
        }
        ,"lastName":{
            reg:/^[\s\S]{0,30}$/,
            err:"The length of Last Name exceed max 30."
        }
        ,"addressLine1":{
            reg:/^[\s\S]{0,400}$/,
            err:"The length of Address Line1 exceed max 400."
        }
        ,"addressLine2":{
            reg:/^[\s\S]{0,400}$/,
            err:"The length of Address Line1 exceed max 400."
        }
        ,"city":{
            reg:/^[\s\S]{0,400}$/,
            err:"Limited to 400 characters."
        }
        ,"stateInput":{
            reg:/^[\s\S]{0,40}$/,
            err:"Limited to 40 characters."
        }
        ,"postalCode":{
            reg:/^[\s\S]{4,10}$/,
            err:"The length of Postal Code must between 4 and 10."
        }
        ,"mobile":{
            reg:/^[\s\S]{4,20}$/,
            err:"The length of Telephone must between 4 and 20."
        }
        ,"password":{
            reg:/^[\s\S]{6,20}$/,
            err:"The password must be between 6 to 20 digits."
        }
        ,"cardNum":{
            reg:/^[\s\S]{0,18}$/,
            err:"The card number must be Limited to 18 digits."
        }
        ,"verificationNum":{
            reg:/^\d{3}$/,
            err:"The length of Card Verification Number must be 3 digits."
        }
    },
    resInfo:{
        1:{id:"",err:"XXXX?????"}
        ,2:{id:"csc",err:"Security Code is incorrect."}
        ,3:{id:"cardNum",err:"Card No is incorrect."}
        ,4:{id:"",err:"You choosed shipping address cannot shipped to,please enter a new address."}
        ,5:{id:"",err:"XXXX?????"}
        ,21:{id:"firstName",err:"First name is required."}
        ,23:{id:"lastName",err:"Last Name name is required."}
        ,22:{id:"firstName",err:"The length of First Name exceed max 100."}
        ,24:{id:"lastName",err:"The length of Last Name exceed max 100."}
        ,31:{id:"addressLine1",err:"Address Line 1 is required."}
        ,32:{id:"addressLine1",err:"The length of Address Line 1 exceed max 400."}
        ,42:{id:"addressLine2",err:"The length of Address Line 2 exceed max 400."}
        ,51:{id:"city",err:" City is required."}
        ,52:{id:"city",err:"The length of City exceed max 400."}
        ,61:{id:"state",err:"State / Province is required."}
        ,62:{id:"state",err:"The length of State / Province exceed max 40."}
        ,71:{id:"country",err:"Country is required."}
        ,72:{id:"country",err:"The length of Country exceed max 100."}
        ,81:{id:"postalCode",err:"Postal/Zip Code is required."}
        ,82:{id:"postalCode",err:"The length of Postal/Zip Code exceed max 20."}
        ,91:{id:"mobile",err:" Phone Number is required."}
        ,92:{id:"mobile",err:"The length of Phone Number exceed max 20."}
    },
    getErr:function(key){
        return this.errorInfo[key];
    },
    getResErr:function(key){
        return this.resInfo[key];
    },
    getRegErr:function(key){
        return this.regInfo[key];
    }
};
