var id=getQueryString("orderNo");
var wxData={};
var diffIds=[];
$(function(){
    //获取需要补差价订单的信息
    getDiffOrder();
    //实时改变当前补差价总价
    var sumPrice=0;

    $("#shop-car").on("change","input[name='checkbox']",function(){
        var num=parseFloat($(this).parent().parent().find($(".diff-num2")).html());
        var ids=$(this).parent().parent().attr("goods-id");
        if($(this).is(":checked")){
            sumPrice+=num;
            diffIds.push(ids);
        }else{
            sumPrice-=num;
            diffIds.remove(ids);
        }
        // for(var i=0;i<$("#shop-car li").length;i++){
        //     var numVal=parseFloat($("#shop-car li").eq(i).find($(".diff-num2")).html());
        //     if($("#shop-car li").eq(i).find("input[type=checkbox]").is(":checked")){
        //         sumPrice+=numVal;
        //     }else{
        //         sumPrice-=numVal;
        //     }
        // }
        $("#diff-price").html(sumPrice.toFixed(2));
    });

    //点击选择支付方式
    $("#submit").on("tap",function(){
        var sum=0;
        for(var i=0;i<$("#shop-car li").length;i++){
            if($("#shop-car li").eq(i).find("input[type=checkbox]").is(":checked")){
                var diffPrice=$("#shop-car li").eq(i).find(".diff-num2").html();
                sum+=diffPrice;
            }
        }
        if(sum<=0){
            mui.toast("请选择商品");
            return false;
        }
        var urlVip=globalUrl+"/userInfo/checkState";
        enAjax2(urlVip,'get',true,{},function(data){
            console.log(data);
            if(data.data.vip == 1){
                $("#wx-pay").remove();
            }
        },null,false);
        mui("#sheet1").popover('toggle');
    });
    $("#ye-pay").on("tap",function(){
        mui("#sheet2").popover('toggle');
        var diffPrice=$("#diff-price").html();
        $("#sheet2 .sheet-con .msg-num .msg-value").html(diffPrice);
        var url=globalUrl+'/order/orderView';
        var data={orderNo:id};
        enAjax2(url,'post',true,data,function(data){
            var coupon=data.data.coupon;
            if(coupon!=null){
                coupon=data.data.coupon.discountNum
            }else{
                coupon=0.00
            }
            $("#sheet2 .sheet-con .msg-id .msg-value").html(data.data.orderNo);
            $("#sheet2 .sheet-con .msg-coupon .msg-value").html(coupon.toFixed(2));

        },null,false);
        var url2=globalUrl+"/balance/getBalanceByUserId";
        enAjax2(url2,'get',true,{userId:$.cookie("userId")},function(data){
            $("#sheet2 .sheet-con .msg-curplus .msg-value").html(data.money.toFixed(2));
        });
    });

    $("#czk-pay").on("tap",function(){
        mui("#sheet4").popover('toggle');
        var diffPrice=$("#diff-price").html();
        $("#sheet4 .sheet-con .msg-num .msg-value").html(diffPrice);
        var url=globalUrl+'/order/orderView';
        var data={orderNo:id};
        enAjax2(url,'post',true,data,function(data){
            var coupon=data.data.coupon;
            if(coupon!=null){
                coupon=data.data.coupon.discountNum
            }else{
                coupon=0.00;
            }
            $("#sheet4 .sheet-con .msg-id .msg-value").html(data.data.orderNo);
            $("#sheet4 .sheet-con .msg-coupon .msg-value").html(coupon.toFixed(2));

        },null,false);
        var url2=globalUrl+"/balance/getBalanceByUserId";
        enAjax2(url2,'get',true,{userId:$.cookie("userId")},function(data){
            $("#sheet4 .sheet-con .msg-curplus .msg-value").html(data.disMoney.toFixed(2));
        });
    });
    $("#submit2").on("tap",function(){
        //余额支付补差价
        var idss=diffIds.toString();
        enAjax(globalUrl+'/washItem/getItemId','post',true,{orderNo:id,ids:idss},function(data){
            var idPay=data.data;
            diffPay(id,idPay);
        },null)
        // repair(id,idss);
        // diffPay(id,idss);
    });
    $("#submit3").on("tap",function(){
        // var diff=[];
        // var idss=[];
        // var orderId=$(".orderNum span").html();
        // mui("#sheet3").popover('toggle');
        // for(var i=0;i<$("#shop-car li").length;i++){
        //     // if($("#shop-car li").eq(i).find("input[type=checkbox]").is(":checked")){
        //         var ids=$("#shop-car li").eq(i).attr("goods-id");
        //         var diffPrice=$("#shop-car li").eq(i).find("input[type=number]").val()?$("#shop-car li").eq(i).find("input[type=number]").val():0;
        //         var diffData={id:ids,orderNo:orderId,fillPrice:diffPrice};
        //         diff.push(diffData);
        //         idss.push(ids);
        //         var idString=idss.toString();
        //         console.log(diff);
        //         compensate(diff);
        //     // }
        // }
        //
        // var goodsIds="";
        // for(var i=0;i<$("#shop-car li").length;i++){
        //     // if($("#shop-car li").eq(i).find("input[type=checkbox]").is(":checked")){
        //         var goodsId=$("#shop-car li").eq(i).attr("goods-id");
        //         goodsIds+=goodsId+",";
        //     // }
        // }
        // goodsIds.substring(0,goodsIds.lastIndexOf(','));
        // console.log(goodsIds);

        var idss=diffIds.toString();
        enAjax(globalUrl+'/washItem/getItemId','post',true,{orderNo:id,ids:idss},function(data){
            var idPay=data.data;
            enAjax(globalUrl+"/wechat/supplUnifiedOrder",'post',true,{orderNo:id,ids:idPay},wxpayDiff,null);
        },null);


    });

    $("#submit4").on("tap",function(){
        //余额支付补差价
        var idss=diffIds.toString();
        enAjax(globalUrl+'/washItem/getItemId','post',true,{orderNo:id,ids:idss},function(data){
            var idPay=data.data;
            discountPay(id,idPay);
        },null);

    });


    $(".btn-close1").on("tap",function(){
        mui("#sheet2").popover('toggle');
    });
    $(".btn-close2").on("tap",function(){
        mui("#sheet3").popover('toggle');
    });
    $(".btn-close3").on("tap",function(){
        mui("#sheet4").popover('toggle');
    });
    $("#wx-pay").on("tap",function(){
        mui("#sheet3").popover('toggle');
        var diffPrice=$("#diff-price").html();
        $("#sheet3 .sheet-con .msg-num .msg-value").html(diffPrice);
        var url=globalUrl+'/order/orderView';
        var data={orderNo:id};
        enAjax2(url,'post',true,data,function(data){
            var coupon=data.data.coupon;
            if(coupon!=null){
                coupon=data.data.coupon.discountNum
            }else{
                coupon=0.00
            }
            $("#sheet3 .sheet-con .msg-id .msg-value").html(data.data.orderNo);
            $("#sheet3 .sheet-con .msg-coupon .msg-value").html(coupon.toFixed(2));

        },null,false);
        var url2=globalUrl+"/balance/getBalanceByUserId";
        enAjax2(url2,'get',true,{userId:$.cookie("userId")},function(data){
            $("#sheet3 .sheet-con .msg-curplus .msg-value").html(data.money.toFixed(2));
        });
    })
});

// function compensate(diff){
//     $.ajax({
//         contentType:"application/json;charset=UTF-8",
//         url:globalUrl+'/orderItem/updataAllByFillPrice',
//         async:false,
//         type:'post',
//         data:JSON.stringify(diff),
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("token", $.cookie("token"));
//         },
//         crossDomain: true,
//         success:function(data){
//             mui("#sheet2").popover('toggle');
//             console.log(data);
//         }
//     })
// }

//获取需要补差价订单的信息
function getDiffOrder(){
    enAjax(globalUrl+'/washItem/getList4Fill','get',true,{orderNo:id},function(data){
        console.log(data);
        $(".orderNum span").html(id);
        $(".clothes form").html("");
        for(var i=0;i<data.data.length;i++){
            var name=data.data[i].beforeName;
            var item='<li goods-id="'+data.data[i].id+'">'+
                '<div class="mui-checkbox">'+
                '<label></label>'+
                '<input name="checkbox" type="checkbox">'+
                '</div>'+
                // '<div class="clothes-pic"><img src="http://'+data.data[i].productImage+'" alt="" /></div>'+
                '<div class="clothes-name">'+
                '<p>'+name+'</p>'+
                '<p>￥<span>'+data.data[i].beforePrice+'</span></p>'+
                '</div>'+
                '<div>'+
                '<div class="mui-numbox">'+
                // '<input class="diff-num" type="number" placeholder="输入补价金额" />'+
                '<span>差价：<span class="diff-num2">'+data.data[i].fillPrice+'</span></span>'+
                '</div>'+
                '</div>'+
                '</li>';
            $(item).appendTo($(".clothes form"));
        }
    },null)
}

//实时修改补差价总额


//余额支付补差价
function diffPay(orderNo,ids){
    var url=globalUrl+'/balance/balancePayment';
    var data={orderNumber:orderNo,ids:ids,payType:"suppl"};
    enAjax(url,'post',false,data,diffPayIn,null);
    function diffPayIn(data){
        console.log(data);
        if(data){
            if(data.state==104){
                mui.alert(data.msg+"<br/>当前余额："+data.money,'余额不足');
            }
            else if(data.state==200){
                $.cookie("getArea", "", {expires: -1});
                $.cookie("backArea", "", {expires: -1});
                $.cookie("express", "", {expires: -1});
                $.cookie("time", "", {expires: -1});
                $.cookie("detail", "", {expires: -1});
                $.cookie("couponName", "", {expires: -1});
                $.cookie("couponId", "", {expires: -1});
                var ids2=diffIds.toString();
                payAfter(ids2);
                mui.alert(data.msg,'余额支付成功',function(){
                    $("#submit").parent().attr("href","order-detail.html?id="+id);
                    window.location.href="order-detail.html?id="+id;
                });
            }else{
                mui.alert(data.msg,'余额支付失败');
            }
        }
    }
    mui("#sheet1").popover('hide');
}

//折扣卡支付补差价
function discountPay(orderNo,ids){
    var url=globalUrl+'/balance/balancePayment';
    var data={orderNumber:orderNo,ids:ids,payType:"discountSuppl"};
    enAjax(url,'post',false,data,diffPayIn,null);
    function diffPayIn(data){
        console.log(data);
        if(data){
            if(data.state==104){
                mui.alert(data.msg+"<br/>折扣卡余额："+data.money,'折扣卡余额不足');
            }
            else if(data.state==200){
                $.cookie("getArea", "", {expires: -1});
                $.cookie("backArea", "", {expires: -1});
                $.cookie("express", "", {expires: -1});
                $.cookie("time", "", {expires: -1});
                $.cookie("detail", "", {expires: -1});
                $.cookie("couponName", "", {expires: -1});
                $.cookie("couponId", "", {expires: -1});
                var ids2=diffIds.toString();
                payAfter(ids2);
                mui.alert(data.msg,'折扣卡支付成功',function(){
                    $("#submit").parent().attr("href","order-detail.html?id="+id);
                    window.location.href="order-detail.html?id="+id;
                });
            }else{
                mui.alert(data.msg,'折扣卡支付失败');
            }
        }
    }
    mui("#sheet2").popover('hide');
    mui("#sheet4").popover('hide');
}

function wxpayDiff(data){
    console.log(data);
    if(data.code==0){
        wxData=data.data;
        wxData.orderNo=data.orderNo;
        // wxData.rechargeId=data.rechargeId;
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady',
                    onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady',
                    onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady',
                    onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    }
}

function onBridgeReady(){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId":"wx31fd1e1bad23db37",     //公众号名称，由商户传入
            "timeStamp":wxData.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr":wxData.nonceStr, //随机串
            "package":wxData.packageValue,
            "signType":wxData.signType,         //微信签名方式：
            "paySign":wxData.paySign //微信签名
        },
        function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok"){
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                // alert("ok");
                $.cookie("getArea", "", {expires: -1});
                $.cookie("backArea", "", {expires: -1});
                $.cookie("express", "", {expires: -1});
                $.cookie("time", "", {expires: -1});
                $.cookie("detail", "", {expires: -1});
                $.cookie("couponName", "", {expires: -1});
                $.cookie("couponId", "", {expires: -1});
                var goodsIds="";
                for(var i=0;i<$("#shop-car li").length;i++){
                    if($("#shop-car li").eq(i).find("input[type=checkbox]").is(":checked")){
                        var goodsId=$("#shop-car li").eq(i).attr("goods-id");
                        goodsIds+=goodsId+",";
                    }
                }
                var url=globalUrl+"/balance/SupplWxpayOver";
                var data={orderNumber:id,ids:goodsIds};
                enAjax(url,'post',false,data,wxpayOver,null);
            }else{}
        });
}
function wxpayOver(data){
    console.log(data);
    window.location.href="order-detail.html?id="+id;
}

/**
 * 需要补差价的商品
 */
function repair(orderNo,ids){
    enAjax(globalUrl+'/washItem/getItemId','post',true,{orderNo:orderNo,ids:ids},function(data){
        var idPay=data.data;
        diffPay(id,idPay);
    },null)
}

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function payAfter(ids){
    enAjax2(globalUrl+'/washItem/fillFinish','post',true,{ids:ids},function(data){
        // alert(ids)
        console.log(data);
    })
}