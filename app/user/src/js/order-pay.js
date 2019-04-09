var orderId=getQueryString("id");
var getArea=$.cookie("getArea");
var getId=$.cookie("getId");
var backArea=$.cookie("backArea");
var couponId=$.cookie("couponId");
var coupon=$.cookie("couponName");
var wlType=$.cookie("wlType");
var wlTypeName=$.cookie("wlTypeName");
var payType=$.cookie("payType");
var expressYear=$.cookie("year")?$.cookie("year"):"";
var expressTime=$.cookie("time")?$.cookie("time"):"";
var expressDetail=$.cookie("detail")?$.cookie("detail"):"";
var totalPrice;
var orPrice;
var orderData={orderNo:orderId};
$(function(){
    getGoods(orderId);
    if(getArea){
        $("#get").html(getArea);
        checkArea(getId)
    }
    if(backArea){
        $("#back").html(backArea);
    }

    if(coupon){
        $("#check-yhq").html($.cookie("couponName"));
        orderData.couponId=couponId;
    }
    if(wlType){
        $("#check-wl").html($.cookie("wlTypeName"));
        orderData.shippingType=wlType;
    }
    if(payType){
        var payTypeName;
        if(payType==1){
            payTypeName="折扣卡支付";
        }else if(payType==2){
            payTypeName="余额支付";
        }else if(payType==3){
            payTypeName="微信支付";
        }
        $("#pay-type").html(payTypeName);
        orderData.paymentType=payType;
    }
    if(expressTime){
        $("#get-time").html(expressYear+"-"+expressTime+"-"+expressDetail+":00-"+(parseInt(expressDetail)+2)+":00");
    }else{
        $("#get-time").html("");
    }

    getPayment(orderData);
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
        // $("#yhq").html(parseFloat($.cookie("couponReduce")).toFixed(2));
        // $("#total").html(totalPrice-parseFloat($.cookie("couponReduce")).toFixed(2));
        orderData.couponId=$.cookie("couponId");
        getPayment(orderData);

        mui('#sheet1').popover('toggle');
    }else{
        mui.toast("未满足使用条件",{duration:500});
    }
});

/**
 * 选择不使用优惠券
 */
$("#no-coupon").on("tap",function(){
    $.cookie("couponName", "", {expires: -1});
    $.cookie("couponId", "", {expires: -1});
    $.cookie("couponReduce", "", {expires: -1});

    $("#check-yhq").html("");
    mui('#sheet1').popover('toggle');
});

/**
 * 点击选择物流方式
 */
$("#logistics").on("tap",function(){
    getWlType();
    mui("#wlType").popover('toggle');
});
/**
 * 选中物流方式
 */
$("#wlType ul").on("tap","li",function(){
    wlType=$(this).attr("wlType");
    wlName=$(this).html()
    $.cookie("wlType",wlType);
    orderData.shippingType=$.cookie("wlType");
    getPayment(orderData);
    $.cookie("wlTypeName",wlName)
    $("#check-wl").html(wlName);

    mui("#wlType").popover('toggle');
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
    orderData.paymentType=$.cookie("payType");
    getPayment(orderData);
    mui("#payType").popover('toggle');
});
/**
 * 选择预约时间
 */
$("#yy-time").on("tap",function(){
    window.location.href="visit-door.html?id="+orderId;
});


$("#submit").on("tap",function(){
    if($("#get").html()=='请输入取衣地址'||$("#get").html()==''){
        mui.toast("请填写地址");
    }else if($("#get-time").html()==""){
        mui.toast("请选择取件时间");
    }else if(!$.cookie("wlType")){
        mui.toast("请选择物流方式");
    }else if($("#pay-type").html()==""){
        mui.toast("请选择支付方式");
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
                if(data.status==200){
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
                }else{
                    mui.toast(data.msg);
                }
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
            if(!data.data.wxPay){
                $("#wx-pay").hide();
            }
            for(var i=0;i<data.data.orderItems.length;i++){
                var item='<div class="order">'+
                    '<p>'+data.data.orderItems[i].productName+'</p>'+
                    '<p>X<span>'+data.data.orderItems[i].quantity+'</span></span></p>'+
                    '<p><span>'+(data.data.orderItems[i].currentUnitPrice*data.data.orderItems[i].quantity).toFixed(2)+'</span> 元</p>'+
                    '</div>';
                $(item).appendTo($("#orders"));
            }
            orPrice=data.data.payment;
        }
    },null,false)
}

//获取金额
function getPayment(data){
    var url=globalUrl+"/order/payment";
    enAjax(url,'get',false,data,function(data){
        console.log(data);
        if(data.status==200){
            $("#total").html(data.data.payment.toFixed(2));
            $("#yf").html(data.data.freight.toFixed(2));
            $("#yhq").html(data.data.coupon.toFixed(2));
            totalPrice=data.data.payment;
        }
    })
}

/**
 * 判断取衣地址与工厂的距离是否在三公里以内
 * @param getAddressId
 */
function checkArea(getAddressId){
    enAjax2(globalUrl+'/order/checkExpress_','get',false,{addressId:getAddressId},function(data){
        if(data.status==200){
            if(data.data.express){
                $.cookie("wlType",2);
                $("#zipei").show();
                $("#Logistics").hide();
                orderData.shippingType=$.cookie("wlType");
                getPayment(orderData);
            }else{
                $("#zipei").hide();
                $("#logistics").show();
            }
        }else if(data.status==210){
            mui.alert(data.msg,function(){
                window.location.href="send-wash.html?id="+orderId;
            })
        }

    },null)
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
                    if(parseFloat(orPrice)>=data.data[i].coupon.contentNum){
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
 * 获取可用物流方式
 */
function getWlType(){
    enAjax(globalUrl+"/expressConfig/getExpressConfigList","get",false,{},function(res){
        if(res.code==0){
            $("#wlType ul").html("");
            for(var i=0;i<res.data.length;i++){
            var item='<li class="mui-table-view-cell" wlType="'+res.data[i].type+'">'+res.data[i].expressName+'</li>';
            $(item).appendTo($("#wlType ul"))
            }
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