var orderId=getQueryString("id");
$(function(){
    $("#nowCity").html($.cookie("now"));
    $("title").html("常洗-"+$("#nowCity").html()+"站");
	$("#date").html(getNowFormatDate());
	var mj=parseFloat($("#mj").html());
	var yhq=parseFloat($("#yhq").html());
	var djcx=parseFloat($("#djcx").html());
	console.log(orderId);
	
	//获取订单信息
	createOrder();
	
	$("#submit").on("tap",function(){
        var payType=$('#payType').attr('pay');
        //折扣卡支付
		if(payType==1){
            var url=globalUrl+'/order/orderView';
            var data={orderNo:orderId};
            enAjax2(url,'post',true,data,function(data){
                var coupon=data.data.coupon;
                if(coupon!=null){
                    coupon=data.data.coupon.discountNum
                }else{
                    coupon=0.00
                }
                $("#sheet4 .sheet-con .msg-id .msg-value").html(data.data.orderNo);
                $("#sheet4 .sheet-con .msg-num .msg-value").html(data.data.payment.toFixed(2));
                $("#sheet4 .sheet-con .msg-coupon .msg-value").html(coupon.toFixed(2));
                mui("#sheet4").popover('toggle');

            },null,false);
            var url2=globalUrl+"/balance/getBalanceByUserId";
            enAjax2(url2,'get',true,{userId:$.cookie("userId")},function(data){
                $("#sheet4 .sheet-con .msg-curplus .msg-value").html(data.disMoney.toFixed(2));
            })
        }
        //余额支付
        else if(payType==2){
            var url=globalUrl+'/order/orderView';
            var data={orderNo:orderId};
            enAjax2(url,'post',true,data,function(data){
                var coupon=data.data.coupon;
                if(coupon!=null){
                    coupon=data.data.coupon.discountNum
                }else{
                    coupon=0.00
                }
                $("#sheet2 .sheet-con .msg-id .msg-value").html(data.data.orderNo);
                $("#sheet2 .sheet-con .msg-num .msg-value").html(data.data.payment.toFixed(2));
                $("#sheet2 .sheet-con .msg-coupon .msg-value").html(coupon.toFixed(2));
                mui("#sheet2").popover('toggle');

            },null,false);
            var url2=globalUrl+"/balance/getBalanceByUserId";
            enAjax2(url2,'get',true,{userId:$.cookie("userId")},function(data){
                $("#sheet2 .sheet-con .msg-curplus .msg-value").html(data.money.toFixed(2));
            })
        }
        // 微信支付
        else if(payType==3){
            pay(orderId);
        }
	});


	$("#ye-pay").on("tap",function(){
        mui("#sheet2").popover('toggle');
        var url=globalUrl+'/order/orderView';
        var data={orderNo:orderId};
        enAjax2(url,'post',true,data,function(data){
        	var coupon=data.data.coupon;
        	if(coupon!=null){
                coupon=data.data.coupon.discountNum
			}else{
                coupon=0.00
			}
        	$("#sheet2 .sheet-con .msg-id .msg-value").html(data.data.orderNo);
            $("#sheet2 .sheet-con .msg-num .msg-value").html(data.data.payment.toFixed(2));
            $("#sheet2 .sheet-con .msg-coupon .msg-value").html(coupon.toFixed(2));

		},null,false);
        var url2=globalUrl+"/balance/getBalanceByUserId";
		enAjax2(url2,'get',true,{userId:$.cookie("userId")},function(data){
            $("#sheet2 .sheet-con .msg-curplus .msg-value").html(data.money.toFixed(2));
		})
        // mui("#sheet1").popover('toggle');
        // payMoney();

// 		mui.prompt('请输入余额支付密码','支付','支付',['取消','确定'],function(e){
// 			if(e.index==1){
// 				var password=e.value;
// 				var url=globalUrl+'/balance/checkPayPassword';
// 				var data={password:password};
// 				enAjax(url,'post',false,data,passwordToPay,null);
// 				function passwordToPay(data){
// //							console.log(data);
// 					if(data.code==-1){
// 						// mui("#sheet1").popover('hide');
// 						e.value=="";
// 						mui.toast(data.message);
// 						return;
// 					}else{
// 						//余额支付订单
// 						payMoney();
// 					}
// 				}
// 			}
// 		})
	});

    $("#czk-pay").on("tap",function(){
        mui("#sheet4").popover('toggle');
        var url=globalUrl+'/order/orderView';
        var data={orderNo:orderId};
        enAjax2(url,'post',true,data,function(data){
            var coupon=data.data.coupon;
            if(coupon!=null){
                coupon=data.data.coupon.discountNum
            }else{
                coupon=0.00
            }
            $("#sheet4 .sheet-con .msg-id .msg-value").html(data.data.orderNo);
            $("#sheet4 .sheet-con .msg-num .msg-value").html(data.data.payment.toFixed(2));
            $("#sheet4 .sheet-con .msg-coupon .msg-value").html(coupon.toFixed(2));

        },null,false);
        var url2=globalUrl+"/balance/getBalanceByUserId";
        enAjax2(url2,'get',true,{userId:$.cookie("userId")},function(data){
            $("#sheet4 .sheet-con .msg-curplus .msg-value").html(data.disMoney.toFixed(2));
        })
    });

	$("#wx-pay").on("tap",function(){
        // mui("#sheet3").popover('toggle');
        // var url=globalUrl+'/order/orderView';
        // var data={orderNo:orderId};
        // enAjax2(url,'post',true,data,function(data){
        //     var coupon=data.data.coupon;
        //     if(!coupon){
        //         coupon=data.data.coupon.discountNum
        //     }else{
        //         coupon=0.00
        //     }
        //     $("#sheet3 .sheet-con .msg-id .msg-value").html(data.data.orderNo);
        //     $("#sheet3 .sheet-con .msg-num .msg-value").html(data.data.payment);
        //     $("#sheet3 .sheet-con .msg-coupon .msg-value").html(coupon.toFixed(2));
        //     $("#sheet3 .sheet-con .msg-curplus .msg-value").html();
        // },null,false);
        // var url2=globalUrl+"/balance/getBalanceByUserId";
        // enAjax2(url2,'get',true,{userId:$.cookie("userId")},function(data){
        //     $("#sheet3 .sheet-con .msg-curplus .msg-value").html(data.money.toFixed(2));
        // })
		pay(orderId);

	});
	$("#submit2").on("tap",function(){
        payMoney();
	});
    $("#submit4").on("tap",function(){
        payDisMoney();
    });
    // $("#submit3").on("tap",function(){
    //     pay(orderId);
    // });
	$(".btn-close1").on("tap",function(){
        mui("#sheet2").popover('toggle');
	});
    $(".btn-close2").on("tap",function(){
        mui("#sheet3").popover('toggle');
    });
    $(".btn-close3").on("tap",function(){
        mui("#sheet4").popover('toggle');
    })
});

//获取订单信息
function createOrder(){
	var url=globalUrl+'/order/orderView';
	var data={orderNo:orderId};
	enAjax(url,'post',true,data,getOrderMes,null,false);
	function getOrderMes(data){
		console.log(data);
        removeMask();
        //获取物流方式
		var wlName="";
		if(data.data.expressStatus==1){
            wlName="顺丰物流";
		}else if(data.data.expressStatus==3){
            wlName="德邦物流";
        }else if(data.data.expressStatus==2){
            wlName="自配物流";
        }
		$("#wlName").html(wlName);

        var payType="";
        if(data.data.paymentType==1){
            payType="折扣卡支付";
        }else if(data.data.paymentType==2){
            payType="余额支付";
        }else if(data.data.paymentType==3){
            payType="微信支付";
        }
        $("#payType").attr('pay',data.data.paymentType);
        $("#payType").html(payType);

		var tipCon=data.data.message?data.data.message:" ";
		$("#tip-text").html(tipCon);
		$("#yf").html(data.data.shippingFreight.toFixed(2));
		if(data.data.couponId!=null){
			$("#yhq").html(data.data.coupon.discountNum.toFixed(2));
		}
	
		var sum=0;
		var endTime=(parseInt(data.data.subTime.substr(-2))+2)+":00";
		$("#get").html(data.data.address.region+data.data.address.detailAddress);
		$("#back").html(data.data.send_address.region+data.data.send_address.detailAddress);
		$("#time").html(data.data.subTime+":00-"+endTime);
		for(var i=0;i<data.data.orderItems.length;i++){
			var item='<div class="order">'+
						'<p>'+data.data.orderItems[i].productName+'</p>'+
						'<p>X<span>'+data.data.orderItems[i].quantity+'</span></span></p>'+
						'<p>￥<span>'+(data.data.orderItems[i].currentUnitPrice)*data.data.orderItems[i].quantity+'</span></p>'+
					'</div>';
			$(item).appendTo($("#orders"));
			sum+=data.data.orderItems[i].totalPrice;
			$("#price2").html(sum.toFixed(2));
			$("#total").html(data.data.payment.toFixed(2));
		}
	}
}

//余额支付订单
function payMoney(){
	var url=globalUrl+'/balance/balancePayment';
	var data={orderNumber:orderId,payType:"pay"};
	enAjax(url,'post',false,data,payMoneyIn,null,false);
	function payMoneyIn(data){
		if(data){
			if(data.state==104){
				var btnArr=["取消","去充值"];
                mui.confirm("当前余额："+data.money,'余额不足',btnArr,function(e){

                    if(e.index==1){
                        window.location.href="../user-center/top_up.html";
					}else{
                        mui("#sheet1").popover('hide');
					}
                });
			}
			else if(data.state==200){
				mui("#sheet2").popover('toggle');
				mui.alert(data.msg,'余额支付成功',function(){
					$(".sheet-con").css("opacity",1).css("background","#fff");
                    $.cookie("getArea", "", {expires: -1});
                    $.cookie("backArea", "", {expires: -1});
                    $.cookie("express", "", {expires: -1});
                    $.cookie("year", "", {expires: -1});
                    $.cookie("time", "", {expires: -1});
                    $.cookie("detail", "", {expires: -1});
                    $.cookie("couponName", "", {expires: -1});
                    $.cookie("couponId", "", {expires: -1});
					// $("#submit").parent().attr("href","order-detail.html?id="+orderId);
					// window.location.href="order-detail.html?id="+orderId;
					window.location.href="order-detail.html?id="+orderId;
				});
			}else{
				mui.alert(data.msg,'余额支付失败');
			}
		}
	}
	mui("#sheet1").popover('hide');
}

//折扣卡支付订单
function payDisMoney(){
    var url=globalUrl+'/balance/balancePayment';
    var data={orderNumber:orderId,payType:"discount"};
    enAjax(url,'post',false,data,payMoneyIn,null,false);
    function payMoneyIn(data){
        if(data){
            if(data.state==104){
                var btnArr=["取消","去充值"];
                mui.confirm("当前折扣卡余额："+data.money,'折扣卡余额不足',btnArr,function(e){
                    if(e.index==1){
                        window.location.href="../user-center/saving-card.html";
                    }else{
                        mui("#sheet4").popover('hide');
                    }
                });
            }
            else if(data.state==200){
                mui("#sheet4").popover('toggle');
                mui.alert(data.msg,'折扣卡支付成功',function(){
                    $(".sheet-con").css("opacity",1).css("background","#fff");
                    $.cookie("getArea", "", {expires: -1});
                    $.cookie("backArea", "", {expires: -1});
                    $.cookie("express", "", {expires: -1});
                    $.cookie("year", "", {expires: -1});
                    $.cookie("time", "", {expires: -1});
                    $.cookie("detail", "", {expires: -1});
                    $.cookie("couponName", "", {expires: -1});
                    $.cookie("couponId", "", {expires: -1});
                    // $("#submit").parent().attr("href","order-detail.html?id="+orderId);
                    // window.location.href="order-detail.html?id="+orderId;
                    window.location.href="order-detail.html?id="+orderId;
                });
            }else{
                mui.alert(data.msg,'折扣卡支付失败');
            }
        }
    }
    mui("#sheet4").popover('hide');
}