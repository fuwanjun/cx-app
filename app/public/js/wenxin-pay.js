
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
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
                $.cookie("getArea", "", {expires: -1});
                $.cookie("backArea", "", {expires: -1});
                $.cookie("express", "", {expires: -1});
                $.cookie("time", "", {expires: -1});
                $.cookie("detail", "", {expires: -1});
                $.cookie("couponName", "", {expires: -1});
                $.cookie("couponId", "", {expires: -1});
                var url=globalUrl+"/balance/wxpayOver";
                var data={orderNumber:  orderId};
                // mui.toast("付款成功");
                enAjax(url,'post',false,data,wxCheck,null,false);
                function wxCheck(data){
                    window.location.href="order-detail.html?id="+orderId;
                }
            }else{
                // mui.alert(res.err_desc);
            }
        });
}

var wxData={};
function pay(orderId){
    $.ajax({
        url:globalUrl+"/wechat/unifiedOrder",
        type:'get',
        data:{orderNo:orderId},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success:function(result){
            // mui.alert(result.data);
            wxData=result.data;
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
    });
}


function onBridgeReady2(){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId":"wx31fd1e1bad23db37",       //公众号名称，由商户传入
            "timeStamp":wxData2.timeStamp,       //时间戳，自1970年以来的秒数
            "nonceStr":wxData2.nonceStr,         //随机串
            "package":wxData2.packageValue,
            "signType":wxData2.signType,         //微信签名方式：
            "paySign":wxData2.paySign            //微信签名
        },
        function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
                $.cookie("getArea", "", {expires: -1});
                $.cookie("backArea", "", {expires: -1});
                $.cookie("express", "", {expires: -1});
                $.cookie("time", "", {expires: -1});
                $.cookie("detail", "", {expires: -1});
                $.cookie("couponName", "", {expires: -1});
                $.cookie("couponId", "", {expires: -1});
                var data={orderNumber:orderId};
                enAjax(globalUrl+"/balance/wxpayOver",'post',false,data,function(data){},null);
                mui("#sheet1").popover('toggle');
                mui.confirm('是否打印订单','打印订单',['否','是'],function(e){
                    if(e.index==1){
                        enAjax(globalUrl+'/api/print/printOrder','get',false,{orderNo:orderId,shopId:$.cookie("shopId")},function(data){},null,false);
                    }
                    window.location.href="fetchPackage2.html";
                });
            }else{
                // mui.alert(res.err_desc);
            }
        });
}

var wxData2={};
function pay2(orderId){
    $.ajax({
        url:globalUrl+"/wechat/unifiedOrder",
        type:'get',
        async:false,
        data:{orderNo:orderId},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success:function(result){
            console.log(result);
            wxData2=result.data;
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady',
                        onBridgeReady2, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady',
                        onBridgeReady2);
                    document.attachEvent('onWeixinJSBridgeReady',
                        onBridgeReady2);
                }
            } else {
                onBridgeReady2();
            }
        }
    });
}
