var orderId=getQueryString("id");
var userId=$.cookie("userId");
var getArea=$.cookie("getArea");
var getId=$.cookie("getId");
var backArea=$.cookie("backArea");
var coupon=$.cookie("couponName");
var wlType=$.cookie("wlType");
var expressYear=$.cookie("year")?$.cookie("year"):"";
var expressTime=$.cookie("time")?$.cookie("time"):"";
var expressDetail=$.cookie("detail")?$.cookie("detail"):"";
var totalPrice="";
/**
 * 初始化
 */
$(function(){
    /**
     * 获取商品信息
     */
    getGoods(orderId);
    getPayment(orderId);

    /**
     * 判断有无地址并赋值
     */

    if(getArea){
        $("#get").html(getArea);
    }
    if(backArea){
        $("#back").html(backArea);
    }
    //
    //
    // /**
    //  * 判断是否使用优惠券并显示
    //  */
    if(coupon){
        $("#check-yhq").html($.cookie("couponName"));
        getPayment(orderId,'',$.cookie())
    }
    //
    area(getId);

    if(expressTime){
        $("#get-time").html(expressYear+"-"+expressTime+"-"+expressDetail+":00-"+(parseInt(expressDetail)+2)+":00");
    }else{
        $("#get-time").html("");
    }

     /**
      * 支付方式
      */
     if($.cookie("payType")){
         enAjax(globalUrl+'/order/payment','get',true,{paymentType:$.cookie("payType"),orderNo:orderId},function(data){
             if(data.status==200){
                 enAjax(globalUrl + "/order/freight", 'get', false, {
                     payment: parseFloat(totalPrice),
                     shippingType: $.cookie("wlType")
                 }, function (data2) {
                     totalPrice=(data.data+data2.data).toFixed(2);
                     $("#total").html(totalPrice);
                 })
             }
         });
         if($.cookie("payType")==1){
             $("#pay-type").html("折扣卡支付");
         }else if($.cookie("payType")==2){
             $("#pay-type").html("余额支付");
         }else if($.cookie("payType")==3){
             $("#pay-type").html("微信支付");
         }
     }

});

/**
 * 选择地址
 */
$("#get").parent().parent().on("tap",function(){
    $(this).parent().attr("href","send-wash.html?id="+orderId);
    window.loaction.href="send-wash.html?id="+orderId;
});
$("#back").parent().parent().on("tap",function(){
    $(this).parent().attr("href","back-wash.html?id="+orderId);
    window.loaction.href="back-wash.html?id="+orderId;
});

/**
 * 点击选择物流方式
 */
$("#logistics").on("tap",function(){
    mui("#wlType").popover('toggle');
});


/**
 * 选中物流方式
 */
$("#wlType ul li").on("tap",function(){
    wlType=$(this).attr("wlType");
    enAjax(globalUrl+"/order/freight",'get',false,{payment:totalPrice,shippingType:wlType},function(data){
        $("#yf").html(data.data.toFixed(2));
        totalPrice=(totalPrice+data.data).toFixed(2);
    });
    var wlName="";
    $.cookie("wlType",wlType);
    if(wlType==1){
        wlName="顺丰物流";
    }else if(wlType==3){
        wlName="德邦物流";
    }
    $("#check-wl").html(wlName);
    $("#total").html(totalPrice);

    mui("#wlType").popover('toggle');
});

/**
 * 点击优惠券按钮
 */
$("#preferential").on("tap",function(){
    mui('#sheet1').popover('toggle');
    getCouponNomal(userId);
});

/**
 * 选中优惠券
 */
$("#yhq-box").on("tap","li",function(){
    if($(this).attr("couponType")=="yes"){
        $.cookie("couponId",$(this).attr("couponid"));
        $.cookie("couponReduce",$(this).attr("reduce"));
        $.cookie("couponName",$(this).find(".bot-chose .card-name").html());
        $("#check-yhq").html($(this).find(".bot-chose .card-name").html());
        $("#yhq").html(parseFloat($.cookie("couponReduce")).toFixed(2));
        $("#total").html(totalPrice-parseFloat($.cookie("couponReduce")).toFixed(2));
        mui('#sheet1').popover('toggle');
    }else{
        mui.toast("未满足使用条件",{duration:500});
    }
});

/**
 * 选择不使用优惠券
 */
$("#no-coupon").on("tap",function(){
    // var reduce=parseFloat($.cookie("couponReduce"));
    // $("#total").html((totalPrice+reduce).toFixed(2));
    $.cookie("couponName", "", {expires: -1});
    $.cookie("couponId", "", {expires: -1});
    $.cookie("couponReduce", "", {expires: -1});

    $("#check-yhq").html("");
    mui('#sheet1').popover('toggle');
});

/**
 * 选择预约时间
 */
$("#yy-time").on("tap",function(){
    window.location.href="visit-door.html?id="+orderId;
});

/**
 * 选择支付方式
 */
$("#payStyle").on("tap",function(){
    mui("#payType").popover('toggle');
});

$("#payType ul li").on("tap",function(){
    var payType=$(this).attr("payType");
    $.cookie("payType",payType);
    var payName=$(this).html();
    $("#pay-type").html(payName);
    enAjax(globalUrl+'/order/payment','get',false,{paymentType:payType,orderNo:orderId},function(data){
        if(data.status==200) {
            //     totalPrice=data.data;
            //     if($.cookie("couponReduce")){
            //         totalPrice=totalPrice-parseFloat($.cookie("couponReduce"));
            //     }
            //     $("#total").html(totalPrice.toFixed(2));
            // }else{
            //     mui.toast("系统异常");
            // }
            // totalPrice=data.data;
            enAjax(globalUrl + "/order/freight", 'get', false, {
                payment: parseFloat(totalPrice),
                shippingType: $.cookie("wlType")
            }, function (data2) {
                totalPrice=(data.data+data2.data).toFixed(2);
                $("#total").html(totalPrice);
            })
        }
    });
    mui("#payType").popover('toggle');
});

$("#submit").on("tap",function(){
    if($("#get").html()=='请输入取衣地址'||$("#get").html()==''){
        mui.alert("请填写地址");
    }else if($("#get-time").html()==""){
        mui.alert("请选择取件时间");
    }else if(!$.cookie("wlType")){
        mui.alert("请选择物流方式");
    }else if($("#pay-type").html()==""){
        mui.alert("请选择支付方式");
    }else{
        var getAddressId=$.cookie("getId");
        var backAddressId=$.cookie("backId")?$.cookie("backId"):$.cookie("getId");
        var yhqId=$.cookie("couponId")?$.cookie("couponId"):"";
        var expressYear=$.cookie("year");
        var expressTime=$.cookie("time");
        var expressDetail=$.cookie("detail");
        var wlType=$.cookie("wlType");
        var tipText=$("#textarea").val();
        var payType=$.cookie("payType");
        $.ajax({
            url:globalUrl+'/order/updataOrder',
            type:'post',
            data:{
                orderNo:orderId,
                addressId:getAddressId,
                sendAddressId:backAddressId,
                message:tipText,
                couponId:yhqId,
                subTime:expressYear+"-"+expressTime+"-"+expressDetail,
                shippingType:wlType,
                paymentType:payType,
                shippingFreight:$.cookie("yfPrice")
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", $.cookie("token"));
            },
            crossDomain: true,
            success:function(data){
                console.log(data);
                 $.cookie("getArea", "", {expires: -1});
                 $.cookie("backArea", "", {expires: -1});
                 $.cookie("express", "", {expires: -1});
                 $.cookie("year", "", {expires: -1});
                 $.cookie("time", "", {expires: -1});
                 $.cookie("detail", "", {expires: -1});
                 $.cookie("couponName", "", {expires: -1});
                 $.cookie("couponId", "", {expires: -1});
                 $.cookie("couponReduce", "", {expires: -1});
                 $.cookie("wlType", "", {expires: -1});
                 $.cookie("payType", "", {expires: -1});
                 $("#submit").parent().attr("href","pay-money.html?id="+orderId);
                 window.location.href="pay-money.html?id="+orderId;
            }
        })

    }
});

/**
 * 查询商品信息
 * @param orderId   订单号
 */
function getGoods(orderId){
    enAjax(globalUrl+"/order/orderView",'post',false,{orderNo:orderId},function(data){
        console.log(data);
        if(data.status==200){
            for(var i=0;i<data.data.orderItems.length;i++){
                var item='<div class="order">'+
                    '<p>'+data.data.orderItems[i].productName+'</p>'+
                    '<p>X<span>'+data.data.orderItems[i].quantity+'</span></span></p>'+
                    '<p><span>'+(data.data.orderItems[i].currentUnitPrice*data.data.orderItems[i].quantity).toFixed(2)+'</span> 元</p>'+
                    '</div>';
                $(item).appendTo($("#orders"));
            }
            // totalPrice=data.data.payment;
            // $("#total").html(totalPrice.toFixed(2));
        }
    },null,false)
}

/**
 * 查询用户的所有优惠券
 * @param userId
 */
function getCouponNomal(userId){
    $.ajax({
        url:globalUrl+'/coupon/getCouponItemByUserId',
        type:'post',
        data:{userId:userId, type:1},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success:function(data){
            if($("#yhq-box").html()==""){
                for(var i=0;i<data.data.length;i++){
                    if(parseFloat(totalPrice)>=data.data[i].coupon.contentNum){
                        var item='<li class="mui-table-view-cell" couponType="yes" reduce="'+data.data[i].coupon.discountNum+'" couponid="'+data.data[i].couponId+'" fullPrice="'+data.data[i].coupon.contentNum+'">'+
                            '<div class="bot-chose">'+
                            '<p class="card-name">满'+data.data[i].coupon.contentNum+'立减'+data.data[i].coupon.discountNum+'</p>'+
                            '<p class="card-num">X <span>'+data.data[i].couponCount+'</span></p>'+
                            '</div>'+
                            '</li>';
                        $(item).appendTo($("#yhq-box"));
                    }else{
                        var item='<li class="mui-table-view-cell" style="background: #ccc;" couponType="no" reduce="'+data.data[i].coupon.discountNum+'" couponid="'+data.data[i].couponId+'" fullPrice="'+data.data[i].coupon.contentNum+'">'+
                            '<div class="bot-chose">'+
                            '<p class="card-name">满'+data.data[i].coupon.contentNum+'立减'+data.data[i].coupon.discountNum+'</p>'+
                            '<p class="card-num">X <span>'+data.data[i].couponCount+'</span></p>'+
                            '</div>'+
                            '</li>';
                        $(item).appendTo($("#yhq-box"));
                    }
                }
            }
        }

    })
}



/**
 * 判断取衣地址与工厂的距离是否在三公里以内
 * @param getAddressId
 */
function area(getAddressId){
    enAjax2(globalUrl+'/order/checkExpress_','get',false,{addressId:getAddressId},function(data){
        if(data.data){
            $.cookie("wlType",2);
            $("#yf").html("0.00");
            $("#zipei").show();
            $("#Logistics").hide();
        }else{
            $("#zipei").hide();
            $("#logistics").show();
            if($.cookie("wlType")){
                var wlName="";
                if($.cookie("wlType")==1){
                    $("#check-wl").html("顺丰物流");
                }else if($.cookie("wlType")==3){
                    $("#check-wl").html("德邦物流");
                }
            }else{
                $("#check-wl").html("请选择物流方式");
            }

        }

    },null)
}

/**
 *
 * @param orderNo
 * @param wlType
 * @param coupon
 * @param payType
 */
    function getPayment(orderNo,wlType,coupon,payType){
        var url=globalUrl+"/order/payment";
        var data={orderNo:orderNo};
        if(wlType){
            data.shippingType=wlType;
        }
        if(coupon){
            data.couponId=coupon;
        }
        if(payType){
            data.paymentType=payType;
        }
        enAjax(url,'get',false,data,function(data){
            console.log(data);
            if(data.status==200){
                $("#total").html(data.data.payment.toFixed(2));
                $("#yf").html(data.data.freight.toFixed(2));
                $("#yhq").html(data.data.coupon.toFixed(2));
            }
        })
    }

//回退清订单缓存
$("#goback").on("tap",function(){
    $.cookie("getArea", "", {expires: -1});
    $.cookie("backArea", "", {expires: -1});
    $.cookie("getId", "", {expires: -1});
    $.cookie("backId", "", {expires: -1});
    $.cookie("express", "", {expires: -1});
    $.cookie("year", "", {expires: -1});
    $.cookie("time", "", {expires: -1});
    $.cookie("detail", "", {expires: -1});
    $.cookie("couponName", "", {expires: -1});
    $.cookie("couponId", "", {expires: -1});
    $.cookie("couponReduce", "", {expires: -1});
    $.cookie("wlType", "", {expires: -1});
    $.cookie("payType", "", {expires: -1});
});