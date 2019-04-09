var orderId = getQueryString("id");
$(function () {
    mui.init();
    //打分
    $('#stars2 li').on("tap", function () {
        var index = $(this).index();
        for (var i = 0; i < index + 1; i++)
            $('#stars2 li').eq(i).find('img').attr("src", "../../../public/img/order/star2.png").parent().addClass("check-star2").nextAll().removeClass("check-star2").find('img').attr("src", "../../../public/img/order/star1.png");

    });
    $('#stars3 li').on("tap", function () {
        var index = $(this).index();
        for (var i = 0; i < index + 1; i++)
            $('#stars3 li').eq(i).find('img').attr("src", "../../../public/img/order/star2.png").parent().addClass("check-star3").nextAll().removeClass("check-star3").find('img').attr("src", "../../../public/img/order/star1.png");
    });

    //获取订单号对应的商品及价格
    $.ajax({
        url: globalUrl + '/order/orderView',
        type: 'post',
        data: {orderNo: orderId},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success: function (data) {
            console.log(data);
            $(".order-id span").html(data.data.orderNo);
            $("#payNum").html(data.data.payment.toFixed(2));
            if(data.data.orderShipping){
                $(".mui-content").attr("takerId", data.data.orderShipping.takerId);
            }
            $(".mui-content").attr("user-id", data.data.userId);
            $(".mui-content").attr("takerId", data.data.orderShipping.takerId);
            for (var i = 0; i < data.data.orderItems.length; i++) {
                var item = '<li data-id="' + data.data.orderItems[i].productId + '">' +
                    '<div class="pic-box">' +
                    '<div class="item-pic"><img src="http://' + data.data.orderItems[i].productImage + '" alt="" /></div>' +
                    '<p class="pic-name"><span class="n">' + data.data.orderItems[i].productName + '</span></p>' +
                    '</div>' +
                    '<div class="price">' +
                    '<p class="all-items">￥<span>' + data.data.orderItems[i].totalPrice + '</span></p>' +
                    '<p class="item-num">x <span>' + data.data.orderItems[i].quantity + '</span></p>' +
                    '</div>' +
                    '</li>';
                $(item).appendTo($(".items ul"));
            }
        }
    });
});

//提交评价
$("#submit").on("tap",function(){
    var formData=new FormData();
    var idss="";
    for(var i=0;i<$(".items ul li").length;i++){
        var goodsId=$(".items ul li").eq(i).attr("data-id");
        idss=idss+","+goodsId;
    }
    var goodsContent = $("#goodsContent").val();
    var complaintContent = $("#complaint-box").val();
    var userId = $(".mui-content").attr("user-id");
    var orderId = $(".order-id span").html();
    var takerId = $(".mui-content").attr("takerId");
    var score2 = $(".check-star2").length;
    var score3 = $(".check-star3").length;

    formData.append("orderNo",orderId);
    formData.append("goodsId",idss);
    formData.append("evaluateContent",goodsContent);
    formData.append("userId",userId);
    formData.append("star",score2);

    //配送员文字评价
    getEvaluate(formData);
    //配送服务评星
    getStar(score3, takerId, orderId);
    //投诉
    if(complaintContent!=""){
        if(complaintContent.length<10){
            mui.alert("投诉内容不小于10个字");
        }else{
            complaint(orderId, complaintContent, takerId);
        }
    }
    window.location.href="my-order4.html";
});


$(".mui-checkbox").find("input[type=checkbox]").on("change",function(){
    if($(this).is(":checked")){
        $("#complaint-box").css("display","block");
    }else{
        $("#complaint-box").css("display","none");
    }
});


//商品文字评价
function getEvaluate(formData) {
    $.ajax({
        contentType:false,
        processData:false,
        cache:false,
        url: globalUrl + '/goods/putGoodsEvaluate',
        type: 'post',
        async:false,
        data: formData,

        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success: function (data) {
            // alert(data.code);
            console.log(data);
        }
    })
}

//配送服务评星
function getStar(score, takerId, orderId) {
    $.ajax({
        contentType: "application/json;charset=UTF-8",
        url: globalUrl + '/takeUser/putTakerEvaluate',
        type: 'post',
        async:false,
        data: JSON.stringify({
            orderId: orderId,
            score: score,
            takerId: takerId
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success: function (data) {
            // alert(data.score);
            console.log(data);
        }
    })
}

//投诉
function complaint(orderId, content, takerId) {
    $.ajax({
        contentType: "application/json;charset=UTF-8",
        url: globalUrl + '/takeUser/putTakerReport',
        type: 'post',
        async:false,
        data: JSON.stringify({
            orderNo: orderId,
            content: content,
            takerId: takerId
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success: function (data) {
            console.log(data);
        }
    })
}