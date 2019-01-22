var orderId=getQueryString("id");
var userId=$.cookie("userId");
var getArea=$.cookie("getArea");
var backArea=$.cookie("backArea");
var totalPrice="";
var wlType="";
$(function(){
    getGoods(orderId);
    area($.cookie("getId"));
    $("#total").html(parseFloat(totalPrice).toFixed(2));
    //地址
    if(getArea){
        $("#get").html(getArea);
    }
    if(backArea){
        $("#back").html(backArea);
    }
    //优惠券
    if($.cookie("couponReduce")){
        $("#check-yhq").html($.cookie("couponName"));
        var reduce=parseFloat($.cookie("couponReduce"));
        $("#yhq").html(reduce.toFixed(2));
        $("#total").html((totalPrice-$.cookie("couponReduce")).toFixed(2));
        totalPrice=(totalPrice-$.cookie("couponReduce")).toFixed(2);
    }

    var wlName="";
    if($.cookie("wlType")==2){
        $("#zipei").show();
        $("#Logistics").hide();
        $("#yf").html(0.00);
        $("#total").html(totalPrice);
    }else if($.cookie("wlType")==1){
        $("#zipei").hide();
        $("#Logistics").show();
        wlName="顺丰物流";
    }else if($.cookie("wlType")==3){
        $("#zipei").hide();
        $("#Logistics").show();
        wlName="德邦物流";
    }
    $("#check-wl").html(wlName);
    payTypeToPrice($.cookie("paymentType"),$.cookie("wlType"));

//    预约时间
    //获取预约时间
    var expressYear=$.cookie("year")?$.cookie("year"):"";
    var expressTime=$.cookie("time")?$.cookie("time"):"";
    var expressDetail=$.cookie("detail")?$.cookie("detail"):"";
    if(expressTime){
        $("#get-time").html(expressYear+"-"+expressTime+"-"+expressDetail+":00-"+(parseInt(expressDetail)+2)+":00");
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

//选择优惠券
$("#yhq-box").on("tap","li",function(){
    // var totalPrice=parseFloat($("#price2").html());
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

//不使用优惠券
$("#no-coupon").on("tap",function(){
    var totalPrice=parseFloat($("#total").html());
    var reduce=parseFloat($.cookie("couponReduce"));
    $("#total").html((totalPrice+reduce).toFixed(2));
    $.cookie("couponName", "", {expires: -1});
    $.cookie("couponId", "", {expires: -1});
    $.cookie("couponReduce", "", {expires: -1});

    $("#check-yhq").html("");
    mui('#sheet1').popover('toggle');
});

//点击选择物流方式
$("#Logistics").on("tap",function(){
    mui("#wlType").popover('toggle');
});


//选中物流方式
$("#wlType ul li").on("tap",function(){
    wlType=$(this).attr("wlType");
    $.cookie("wlType",wlType);
    var wlName="";
    if(wlType==1){
        wlName="顺丰物流";
    }else if(wlType==3){
        wlName="德邦物流";
    }
    $("#check-wl").html(wlName);
    mui("#wlType").popover('toggle');
});

//选择付款方式
$("#payStyle").on("tap",function(){
    mui("#payType").popover('toggle');
});

$("#payType ul li").on("tap",function(){
    var type=$(this).attr("payType");
    var typeName=$(this).html();
    mui("#payType").popover('toggle');
    $("#pay-type").html(typeName);
    payTypeToPrice(type,$.cookie("wlType"));
});

//选择预约时间
$("#yy-time").on("tap",function(){
    window.location.href="visit-door.html?id="+orderId;
});

//点击提交订单
$("#submit").on("tap",function(){
    if($("#payStyle").is(":hidden")){
        var chose='<ul id="chosePay" class="mui-table-view mui-table-view-radio">'+
            '<li class="mui-table-view-cell" payType="3">'+
            '<p class="mui-navigate-right">微信支付</p>'+
            '</li>'+
            '<li class="mui-table-view-cell" payType="2">'+
            '<p class="mui-navigate-right">余额支付</p>'+
            '</li>'+
            '<li class="mui-table-view-cell" payType="1">'+
            '<p class="mui-navigate-right">折扣卡支付</p>'+
            '</li>'+
            '</ul>';
        mui.confirm(chose,'选择支付方式',['取消','确定'],function(e){
            if(e.index==1){
                for(var i=0;i<$("#chosePay li").length;i++){
                    if($("#chosePay li").eq(i).hasClass("mui-selected")){
                        payType=$("#chosePay li").eq(i).attr("payType");
                        if(payType==1){
                            $.cookie("paymentType",payType);
                            $("#payStyle").show();
                            $("#pay-type").html("折扣卡支付");
                        }else if(payType==2){
                            $.cookie("paymentType",payType);
                            $("#payStyle").show();
                            $("#pay-type").html("余额支付");
                        }else if(payType==3){
                            $.cookie("paymentType",payType);
                            $("#payStyle").show();
                            $("#pay-type").html("微信支付");
                        }
                    }
                }
            }
        })
    }else{
        alert("1");
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
    $.cookie("paymentType", "", {expires: -1});
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
                    '<p><span>'+(data.data.orderItems[i].currentUnitPrice)*data.data.orderItems[i].quantity.toFixed(2)+'</span> 元</p>'+
                    '</div>';
                $(item).appendTo($("#orders"));
            }
            totalPrice=data.data.payment;
        }
    },null,false)
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
                    if(parseFloat(totalPrice)>=data.data[i].coupon.contentNum){
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

/**
 * 获取对应物流方式
 * @param getAddressId  取件地址ID
 */
function area(getAddressId){
    enAjax2(globalUrl+'/order/checkExpress','get',false,{addressId:getAddressId},function(data){
        if(data.data){
            $.cookie("wlType",2);
            $("#zipei").show();

            $("#Logistics").hide();
        }else{
            $("#zipei").hide();
            $("#Logistics").show();
            $("#check-wl").html("请选择物流方式");
        }
    },null)
}

/**
 * 获取运费
 * @param type  支付方式
 * @param wlType    物流方式
 */
function payTypeToPrice(type,wlType){
    var reduce=parseFloat($.cookie("couponReduce"))?parseFloat($.cookie("couponReduce")):0;
    var url=globalUrl+'/order/payment';
    enAjax(url,'get',true,{paymentType:type,orderNo:orderId},function(data){
        $.cookie("paymentType",type);
        if(reduce){
            $("#total").html((data.data-reduce).toFixed(2));
        }else{
            $("#total").html(data.data.toFixed(2));
        }
        enAjax2(globalUrl+"/order/freight",'get',false,{payment:parseFloat(data.data)-reduce,shippingType:wlType},function(data2){
            $("#yf").html(data2.data.toFixed(2));
            if(reduce){
                $("#total").html((data.data+data2.data-reduce).toFixed(2));
            }else{
                $("#total").html((data.data+data2.data).toFixed(2));
            }
            $.cookie("yfPrice",data2.data);
        },null)
    },null)
}


