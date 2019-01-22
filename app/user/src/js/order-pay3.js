var orderId=getQueryString("id");
var userId=$.cookie("userId");
var getArea=$.cookie("getArea");
var getId=$.cookie("getId");
var backArea=$.cookie("backArea");
var wlType=$.cookie("wlType");
var payType=$.cookie("payType");
var expressYear=$.cookie("year")?$.cookie("year"):"";
var expressTime=$.cookie("time")?$.cookie("time"):"";
var expressDetail=$.cookie("detail")?$.cookie("detail"):"";
$(function(){
    getGoods(orderId);
    if(getId){
        enAjax2(globalUrl+'/order/checkExpress','get',false,{addressId:getId},function(data){
            if(data.data){
                $.cookie("wlType",2);
                $("#zipei").show();
                $("#logistics").hide();
            }else{
                $("#zipei").hide();
                $("#logistics").show();
                if($.cookie("wlType")){
                    $("#check-wl").html($.cookie("wlName"));
                    // if($.cookie("wlType")==1){
                    //     $("#check-wl").html("顺丰物流");
                    // }else if($.cookie("wlType")==3){
                    //     $("#check-wl").html("德邦物流");
                    // }
                }else{
                    $("#check-wl").html("请选择物流方式");
                }
            }
        })
    }

    if(getArea){
        $("#get").html(getArea);
    }
    if(backArea){
        $("#back").html(backArea);
    }

    if($.cookie("couponName")){
        $("#check-yhq").html($.cookie("couponName"));
    }

    if($.cookie("payType")){
        if($.cookie("payType")==1){
            $("#pay-type").html(EncodeUtf8('折扣卡支付'));
        }else if($.cookie("payType")==2){
            $("#pay-type").html(EncodeUtf8('余额支付'));
        }else if($.cookie("payType")==3){
            $("#pay-type").html(EncodeUtf8('微信支付'));
        }
    }

    if(expressTime){
        $("#get-time").html(expressYear+"-"+expressTime+"-"+expressDetail+":00-"+(parseInt(expressDetail)+2)+":00");
    }else{
        $("#get-time").html("");
    }

    getPayment(orderId,$.cookie("wlType"),$.cookie("couponId"),$.cookie("payType"));
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
        getPayment(orderId,$.cookie("wlType"),$.cookie("couponId"),$.cookie("payType"));
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
    $.ajax({
        url:globalUrl+'/expressConfig/getExpressConfigList',
        type:'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success:function(data){
            console.log(data);
            $("#wlType ul").html("");
            for(var i=0;i<data.data.length;i++){
                var item='<li class="mui-table-view-cell" wlType="'+data.data[i].type+'">'+data.data[i].expressName+'</li>';
                $(item).appendTo($("#wlType ul"))
            }
            mui("#wlType").popover('toggle');
        }
    })
});

/**
 * 选中物流方式
 */
$("#wlType ul").on("tap","li",function(){
    var wlName=$(this).html();
    $.cookie("wlType",$(this).attr("wlType"));
    $("#check-wl").html(wlName);
    $.cookie("wlName",wlName);
    getPayment(orderId,$.cookie("wlType"),$.cookie("couponId"),$.cookie("payType"));
    mui("#wlType").popover('toggle');
});

$("#payStyle").on("tap",function(){
    mui("#payType").popover('toggle');
});

$("#payType ul li").on("tap",function(){
    var payType=$(this).attr("payType");
    $.cookie("payType",payType);
    var payName=$(this).html();
    $("#pay-type").html(payName);
    getPayment(orderId,$.cookie("wlType"),$.cookie("couponId"),$.cookie("payType"));
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
 * 判断取衣地址与工厂的距离是否在三公里以内
 * @param getAddressId
 */
function area(getAddressId){
    enAjax2(globalUrl+'/order/checkExpress','get',false,{addressId:getAddressId},function(data){
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
 *获取 运费  优惠券  总价
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
                    if(parseFloat($("#total").html())>=data.data[i].coupon.contentNum){
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
