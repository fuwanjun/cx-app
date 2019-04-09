var orderId=getQueryString("id");
$(function(){
    mui.init();
    getOrder(orderId);
    getdiifRecord(orderId);
});

$(".more").on("tap",function(){
    $(this).prev("div").slideToggle();
});

//补差价
$("#diffBtn").on("tap",function(){
     enAjax(globalUrl+'/washItem/getList4Fill','get',true,{orderNo:orderId},function(data){
         console.log(data);
         if(data.data.length>0){
             window.location.href='diff-box.html?orderNo='+orderId;
         }else{
             mui.toast("没有需要补差价的商品");
         }
     },null)
});

function getOrder(orderId){
    var url=globalUrl+'/order/orderView';
    var data={orderNo:orderId};
    enAjax(url,'post',true,data,getOrderIn,null);
    function getOrderIn(data){
        if(data.status==200){
            if(data.data.status==20){
                $(".process li").eq(0).find($(".process-pic img")).attr("src","../../../public/img/order/1.png");
            }else if(data.data.status==30){
                $(".process li").eq(0).find($(".process-pic img")).attr("src","../../../public/img/order/1.png");
                $(".process li").eq(1).find($(".process-pic img")).attr("src","../../../public/img/order/2.png");
            }else if(data.data.status==35){
                $(".process li").eq(0).find($(".process-pic img")).attr("src","../../../public/img/order/1.png");
                $(".process li").eq(1).find($(".process-pic img")).attr("src","../../../public/img/order/2.png");
                $(".process li").eq(2).find($(".process-pic img")).attr("src","../../../public/img/order/3.png");
            }else if(data.data.status>35&&data.data.status<=45){
                $(".process li").eq(0).find($(".process-pic img")).attr("src","../../../public/img/order/1.png");
                $(".process li").eq(1).find($(".process-pic img")).attr("src","../../../public/img/order/2.png");
                $(".process li").eq(2).find($(".process-pic img")).attr("src","../../../public/img/order/3.png");
                $(".process li").eq(3).find($(".process-pic img")).attr("src","../../../public/img/order/4.png");
            }else if(data.data.status>=50&&data.data.status<=60){
                $(".process li").eq(0).find($(".process-pic img")).attr("src","../../../public/img/order/1.png");
                $(".process li").eq(1).find($(".process-pic img")).attr("src","../../../public/img/order/2.png");
                $(".process li").eq(2).find($(".process-pic img")).attr("src","../../../public/img/order/3.png");
                $(".process li").eq(3).find($(".process-pic img")).attr("src","../../../public/img/order/4.png");
                $(".process li").eq(4).find($(".last-pic img")).attr("src","../../../public/img/order/5.png");
            }
            var signNum="";
            var signTime="";
            if(data.data.orderShipping){
                signNum=data.data.orderShipping.signNumber?data.data.orderShipping.signNumber:'未签收';
                signTime=data.data.orderShipping.takeTime?timestampToTime(data.data.orderShipping.takeTime):'未取件';
            }else{
                signNum="未签收";
                signTime="未取件"
            }
            // var signNum=data.data.orderShipping.signNumber?data.data.orderShipping.signNumber:'';
            // var sendTime=data.data.orderShipping.sendTime==null?"":data.data.orderShipping.sendTime;

            $("#orderNum").html(data.data.orderItems[0].orderNo);
            $("#user").html(data.data.address.userName);
            $("#userPhone").html(data.data.address.phone);
            $("#sealNum").html(signNum);
            $("#time").html(signTime);

            $("#oneGoods .item").eq(0).attr("goodsId",data.data.orderItems[0].id);
            // $("#oneGoods .item").eq(0).find(".diff").parent().attr("href","diff-box.html?id="+data.data.orderNo);
            $("#oneGoods .item").eq(0).find($(".goodsPic img")).attr("src","http://"+data.data.orderItems[0].productImage);
            $("#oneGoods .item").eq(0).find($(".goodsName")).html(data.data.orderItems[0].productName);
            $("#oneGoods .item").eq(0).find($(".singleNum")).html(data.data.orderItems[0].quantity);
            $("#oneGoods .item").eq(0).find($(".goodsPrice span")).html(data.data.orderItems[0].currentUnitPrice*data.data.orderItems[0].quantity);
            $("#all-price").html(data.data.payment.toFixed(2));
            $("#pay-price").html(data.data.payment.toFixed(2));
            var num=0;
            for(var i=1;i<data.data.orderItems.length;i++){
                var item='<div class="item" goodsId="'+data.data.orderItems[i].id+'">'+
                    '<div class="item-pic goodsPic"><img src=http://'+data.data.orderItems[i].productImage+' alt="" /></div>'+
                    '<p><span class="goodsName">'+data.data.orderItems[i].productName+'</span>*<span class="singleNum">'+data.data.orderItems[i].quantity+'</span></p>'+
                    '<p class="goodsPrice"><span>'+data.data.orderItems[i].currentUnitPrice*data.data.orderItems[i].quantity+'</span>￥</p>'
                // +diffPrice+
                '</div>';
                $(item).appendTo($("#more-goods"));
            }

            for(var j=0;j<data.data.orderItems.length;j++){
                var tPrice="";
                if(data.data.paymentType!=1){
                    tPrice=(data.data.orderItems[j].currentUnitPrice*data.data.orderItems[j].quantity).toFixed(2);
                }else{
                    tPrice=(data.data.orderItems[j].totalPrice*data.data.orderItems[j].quantity).toFixed(2);
                }
                var itemTab='<tr>'+
                    '<td><p>'+data.data.orderItems[j].productName+'</p></td>'+
                    '<td><p>'+tPrice+' 元</p></td>'+
                    '<td><p>*'+data.data.orderItems[j].quantity+'</p></td>'+
                    '</tr>';
                $(itemTab).appendTo($(".listing"));
                num+=parseFloat(data.data.orderItems[j].quantity)
            }
            $("#goodsNum").html(num)
        }
    }
}

function getdiifRecord(orderId){
    var url=globalUrl+'/orderform/getPriceDiffByOrderNo';
    var data={orderNo:orderId};
    enAjax(url,'get',true,data,getdiffRecordIn,null);
    function getdiffRecordIn(data){
        for(var i=0;i<data.data.length;i++){
            var item='<tr>'+
                '<td><p>'+data.data[i].goodsName+'</p></td>'+
                '<td><p>'+data.data[i].fristPrice+'元</p></td>'+
                '<td><p style="text-align:center;">'+data.data[i].price+'元</p></td>'+
                '</tr>';
            $(item).appendTo($("#diff-record"));
        }
    }
}

/**
 * 点击单个商品补差价
 */
$("#allGoods").on("tap",".item .diff",function(){
    var goodsId=$(this).parent().attr("goodsId");
    window.location.href="diff-box.html?goodsId="+goodsId+"&id="+orderId
});

