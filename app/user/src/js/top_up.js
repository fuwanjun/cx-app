var wxData={};
$(function(){
	mui.init();
	mui("body").on("tap","a",function(){
		window.location.href=this.href;
	});
	var chargeUrl=globalUrl+"/rechargeCard/getDetailList";
	var data={type:'balance'};
    enAjax(chargeUrl,'get',true,data,chargeNum,null,true);

    $("#recharge").on("tap",function(){
		for(var i=0;i<$("#meal input[type=radio]").length;i++){
			if($("input[type=radio]").eq(i).is(":checked")){
				var chargeId=$("input[type=radio]").eq(i).parent().attr("id");
				var freeNum=$("#custom label input[type=number]").val();
				var url=globalUrl+"/wechat/rechargeUnifiedOrder";
                var map;
				// 套餐充值
                if(chargeId){
                    map={id:chargeId};
				}
				// 任意金额 10+ 整数
				// if($("#custom input[type=radio]").is(":checked")){
				// 	map={price:freeNum};
				// }
                wxData.detailId=chargeId;
				var data=JSON.stringify(map);
				contentAjax(url,'post',false,data,goCharge,null,false);
			}
		}
    });

	var cardId;
	$(".recharge-card").on("tap",function(){

		mui.prompt("请输入充值卡兑换码","兑换码","兑换码",["取消","确定"],function(e){
			if(e.index==1){
				cardId=e.value;
				$.ajax({
					url:globalUrl+'/rechargeCard/useRechargeCard',
					type:'post',
					async:false,
					data:{cardId:cardId},
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("token", $.cookie("token"));
                    },
                    crossDomain: true,
					success:function(data){
						console.log(data);
						if(data.money==undefined){
							mui.alert(data.msg);
						}else{
							$("#balance").html(data.money.toFixed(2));
							mui.alert(data.msg);
						}
						
					}
				})
			}else{
				
			}
		});
	});
	$.ajax({
		url:globalUrl+'/balance/getBalanceByUserId',
		type:'get',
		async:false,
		data:{
			userId:$.cookie("userId")
		},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
			$("#balance").html(data.money.toFixed(2));
		}
	});
	
	//选中输入充值金额
	// $(".mui-input-group").find("input[type=radio]").on("change",function(){
	// 	if($(".mui-input-group").find("input[type=radio]").is(":checked")){
	// 		$(this).prev("label").find("input[type=text]").removeAttr("disabled");
	// 	}
	// });
	
	var prepay_id,
        paySign,
        appId,
        timeStamp,
        nonceStr,
        packageStr,
        signType,
        orderNo;
});
function chargeNum(data){
	console.log(data);
	for(var i=0;i<data.data.length;i++){
    	var item='<div class="mui-input-row mui-radio" id="'+data.data[i].id+'">'+
					'<label><p class="icon"><img src="../../../public/img/mine/top_up.png" alt="" /></p><p>充'+data.data[i].price+'赠送'+data.data[i].giftPrice+'元</p></label>'+
					'<input name="checkbox1" value="Item 3" type="radio" >'+
            	 '</div>';
    	$(item).appendTo($("#meal"));
	}
}


function goCharge(data){
	if(data.result.code==0){
		wxData=data.result.data;
		wxData.orderNo=data.rechargeItem.orderId;
        wxData.detailId=data.rechargeItem.detailId;
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
            	// mui.alert("充值成功！");
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
				var url=globalUrl+"/rechargeCard/rechargeBalance";
				// if(!wxData.detailId){
				// 	wxData.detailId="";
				// }
				var data={orderId:wxData.orderNo,detailId:wxData.detailId};
                enAjax(url,'post',false,data,function(){
                	window.location.reload();
				},null);
            }else{}
        });
}
