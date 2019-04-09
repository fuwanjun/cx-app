var orderId=getQueryString("id");
var userId=$.cookie("userId");
//初始化
$(function(){
    //获取订单信息
    getOrderMes();

    //获取当前时间作为下单时间
    $("#date").html(getNowFormatDate());

    //获取取件送件地址
    var getArea=$.cookie("getArea")?$.cookie("getArea"):"请输入取衣地址";
    var backArea=$.cookie("backArea")?$.cookie("backArea"):"送回地址若不填则默认和取衣地址一致";
    $("#back").html(backArea);
    $("#get").html(getArea);

    //获取优惠券
    var couponId=$.cookie("couponId")?$.cookie("couponId"):"";
    var couponName=$.cookie("couponName")?$.cookie("couponName"):"";
    $("#check-yhq").html(couponName);
    //获取取件方式
    var wlType="";
    if($.cookie("wlType")){
        wlType=$.cookie("wlType");
    }else{
        $.cookie("wlType",EncodeUtf8("德邦物流"))
        wlType="德邦物流";
    }
    $("#check-wl").html(wlType);

    //获取预约时间
    var expressYear=$.cookie("year")?$.cookie("year"):"";
    var expressTime=$.cookie("time")?$.cookie("time"):"";
    var expressDetail=$.cookie("detail")?$.cookie("detail"):"";
    if(expressTime){
        $("#get-time").html(expressYear+"-"+expressTime+"-"+expressDetail);
    }else{
        $("#get-time").html("");
    }



});

//选择地址
$("#get").parent().parent().on("tap",function(){
    $(this).parent().attr("href","send-wash.html?id="+orderId);
    window.loaction.href="send-wash.html?id="+orderId;
});
$("#back").parent().parent().on("tap",function(){
    $(this).parent().attr("href","back-wash.html?id="+orderId);
    window.loaction.href="back-wash.html?id="+orderId;
});

//点击选择优惠券
$("#preferential").on("tap",function(){
    mui('#sheet1').popover('toggle');
    getCouponNomal(userId);
});


//点击选择物流方式
$("#Logistics").on("tap",function(){
    mui("#wlType").popover('toggle');
});

//选中物流方式
$("#wlType ul li").on("tap",function(){
    var wlName=$(this).html();
    $.cookie("wlType",EncodeUtf8(wlName));
    $("#check-wl").html(wlName);

    mui("#wlType").popover('toggle');
});

//选择预约时间
$("#yy-time").on("tap",function(){
    window.location.href="visit-door.html?id="+orderId;
});


//获取可用优惠券
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
                    if(parseFloat($("#price2").html())>=data.data[i].coupon.contentNum){
                        var item='<li class="mui-table-view-cell" reduce="'+data.data[i].coupon.discountNum+'" couponid="'+data.data[i].couponId+'" fullPrice="'+data.data[i].coupon.contentNum+'">'+
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

//选择优惠券
$("#yhq-box").on("tap","li",function(){
    var totalPrice=parseFloat($("#price2").html());
    var couponId=$(this).attr("couponid");
    var couponReduce=$(this).attr("reduce");

    $("#check-yhq").html($(this).find($(".card-name")).html());
    $("#check-yhq").attr("couponid2",couponId);
    $.cookie("couponId",couponId);
    var couponName=$("#check-yhq").html();
    couponName=codeTrans(couponName);
    couponName=codeTrans2(couponName);
    couponName=codeTrans3(couponName);
    $.cookie("couponName",EncodeUtf8(couponName));
    $.cookie("couponReduce",couponReduce);
    var reduceNum=parseFloat($(this).attr('reduce'));
    mui('#sheet1').popover('toggle');
    $("#yhq").html(reduceNum.toFixed(2));
    $("#total").html((totalPrice-reduceNum).toFixed(2))
});

//获取订单内商品
function getOrderMes(){
    var url=globalUrl+'/order/orderView';
    var data={orderNo:orderId};
    enAjax(url,'post',true,data,mess,null);
    function mess(data){
        console.log(data);
        $("#price2").html(data.data.payment);
        var reduce=$.cookie("couponReduce");
        if(reduce){
            $("#total").html((data.data.payment-reduce).toFixed(2));
        }else{
            $("#total").html(data.data.payment.toFixed(2));
        }

        for(var i=0;i<data.data.orderItems.length;i++){
            var item='<div class="order">'+
                '<p>'+data.data.orderItems[i].productName+'</p>'+
                '<p>X<span>'+data.data.orderItems[i].quantity+'</span></span></p>'+
                '<p><span>'+(data.data.orderItems[i].currentUnitPrice*data.data.orderItems[i].quantity).toFixed(2)+'</span> 元</p>'+
                '</div>';
            $(item).appendTo($("#orders"));
        }
    }
}

//点击提交订单
$("#submit").on("tap",function(){
    if($("#get").html()=='请输入取衣地址'||$("#get").html()==''){
        mui.alert("请填写地址");
    }else if($("#get-time").html()==""){
        mui.alert("请选择取件时间");
    }else{
        var getAddressId=$.cookie("getId");
        var backAddressId=$.cookie("backId")?$.cookie("backId"):$.cookie("getId");
        // var yhqId=$.cookie("couponId")?$.cookie("couponId"):"";
        // var expressYear=$.cookie("year")?$.cookie("year"):"";
        // var expressTime=$.cookie("time")?$.cookie("time"):"";
        // var expressDetail=$.cookie("detail")?$.cookie("detail"):"";
        var time=getNowFormatDate();
        var express=$.cookie("express")?$.cookie("express"):"";
        var tipText=$("#textarea").val();
        $.ajax({
            url:globalUrl+'/taker/createOrderByTaker',
            type:'post',
            data:{
                orderNo:orderId,
                addressId:getAddressId,
                sendAddressId:backAddressId,
                message:tipText,
                // paymentType:"3",
                // couponId:yhqId,
                // subTime:time,
                // shippingType:express
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
    $.cookie("express", "", {expires: -1});
    $.cookie("year", "", {expires: -1});
    $.cookie("time", "", {expires: -1});
    $.cookie("detail", "", {expires: -1});
    $.cookie("couponName", "", {expires: -1});
    $.cookie("couponId", "", {expires: -1});
    $.cookie("couponReduce", "", {expires: -1});
    $.cookie("wlType", "", {expires: -1});
    window.location.href="mall.html";
});