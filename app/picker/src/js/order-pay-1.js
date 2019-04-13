var orderId=getQueryString("id");
var _goodsId=getQueryString("goodsId");

$(function(){
	mui.init();
	$("#date").html(getNowFormatDate());
	if(orderId==null){
		getThisGoods(_goodsId);
		$("#submit").on("tap",function(){
			var idString=_goodsId.toString();
			var couponId=$("#check-yhq").attr("couponid2")?$("#check-yhq").attr("couponid2"):"";
			var timeCon=$("#time").html()?$("#time").html():"";
			var tipText=$("textarea").val();
			if($("#get").html()=='请输入取衣地址'||$("#get").html()==''){
				mui.alert("请填写地址");
			}else{
				if($("#check").is(':checked')){
					var url=globalUrl+'/order/creatOrderByGoods';
					var data={addressId:getAddressId,sendAddressId:backAddressId,couponId:couponId,subTime:timeCon,goodsId:_goodsId,message:tipText}
					enAjax(url,'post',true,data,subMes,null);
				}else{
					mui.confirm('<p>目前排队人数约<span class="dialog-num">100</span>人</p><p>预计取件时间：<span class="dialog-date">2018/7/6</span></p>', '提示',['返回','继续支付'],function(e){
						if(e.index==1){
							var url=globalUrl+'/order/creatOrderByGoods';
							var data={addressId:getAddressId,sendAddressId:backAddressId,couponId:couponId,subTime:timeCon,goodsId:_goodsId,message:tipText};
							enAjax(url,'post',true,data,subMes,null);
						}else{
							
						}
					})
				}
			}
		});
		
		//选择地址
		$("#get").parent().parent().on("tap",function(){
			$(this).parent().attr("href","send-wash.html?goodsId="+_goodsId);
			window.loaction.href="send-wash.html?goodsId="+_goodsId;
		});
		$("#back").parent().parent().on("tap",function(){
			$(this).parent().attr("href","back-wash.html?goodsId="+_goodsId);
			window.loaction.href="back-wash.html?goodsId="+_goodsId;
		})
		
	}else{
		var yf=parseFloat($("#yf").html());
		var mj=parseFloat($("#mj").html());
		var yhq=parseFloat($("#yhq").html());
		var djcx=parseFloat($("#djcx").html());
	//	var orderId=getQueryString("id");
		console.log(orderId);
		//获取订单信息
		getOrderMes();

		//选择地址
		$("#get").parent().parent().on("tap",function(){
			$(this).parent().attr("href","send-wash.html?id="+orderId);
			window.loaction.href="send-wash.html?id="+orderId;
		});
		$("#back").parent().parent().on("tap",function(){
			$(this).parent().attr("href","back-wash.html?id="+orderId);
			window.loaction.href="back-wash.html?id="+orderId;
		});
		//点击立即支付提示信息
		$("#submit").on("tap",function(){
			var tipText=$("textarea").val();
			var contentId=$(".mui-content").attr("id");
			var yhqId=$("#check-yhq").attr("couponid2");
			if($("#get").html()=='请输入取衣地址'||$("#get").html()==''){
				mui.alert("请填写地址");
			}else{

					var sumPrice=parseFloat($("#total").html());
					var time=$("#time").html();
					$.ajax({
						url:globalUrl+'/order/updataOrder',
						type:'post',
						data:{
							id:contentId,
							addressId:getAddressId,
							sendAddressId:backAddressId,
							message:tipText,
							subTime:time,
							couponId:yhqId
						},
						success:function(data){
							console.log(data);
							$("#submit").parent().attr("href","pay-money.html?id="+orderId);
							window.location.href="pay-money.html?id="+orderId;
						}
					})
			}
		})

	}
	
		var getArea=$.cookie("getArea")?$.cookie("getArea"):"请输入取衣地址";
		var backArea=$.cookie("backArea")?$.cookie("backArea"):"送回地址若不填则默认和取衣地址一致";
		$("#back").html(backArea);
		$("#get").html(getArea);
		
		//选择时间
//		var dtPicker = new mui.DtPicker(); 
//		$("#time").on("tap",function(){
//			if($("#check").is(':checked')){
//				var dtPicker = new mui.DtPicker(); 
//			    dtPicker.show(function (selectItems) { 
//			        $("#time").html(selectItems.y.value+"-"+selectItems.m.value+"-"+selectItems.d.value);
//			    });
//			}
//		})
//		$("#check").on("tap",function(){
//			if($("#check").is(":checked")){
//				$("#time").html("");
//			}else{
//				var dtPicker=new mui.DtPicker();
//				dtPicker.show(function (selectItems) { 
//					$("#time").html(selectItems.y.value+"-"+selectItems.m.value+"-"+selectItems.d.value);
//				});	
//			}
//		})
		
		//选择优惠券
//		$("#preferential").on("tap",function(){
//			mui('#sheet1').popover('toggle');
//			getCoupon(88);
//		})
//		
//		
		var getAddressId=$.cookie("getId");
		var backAddressId=$.cookie("backId")?$.cookie("backId"):getAddressId;

});

//获取用户已有的优惠券
function getCoupon(userId){
	$.ajax({
		url:globalUrl+'/coupon/getCouponItemByUserId',
		type:'post',
		data:{userId:userId},
		success:function(data){
			console.log(data);
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

function getThisGoods(goodsId){
	$.ajax({
		url:globalUrl+'/goods/getGoodsModeByGoodsId',
		type:'get',
		data:{id:goodsId},
		success:function(data){
			console.log(data);
			var item='<div class="order">'+
						'<p>'+data.goodsName+'</p>'+
						'<p>X<span>1</span></span></p>'+
						'<p>￥<span>'+data.goodsPrice.toFixed(2)+'</span></p>'+
					'</div>';
			$(item).appendTo($("#orders"));
			$("#total").html(data.goodsPrice.toFixed(2));
			$("#price2").html(data.goodsPrice.toFixed(2));
		}
	})
}

//获取订单信息
function getOrderMes(){
	var url=globalUrl+'/order/orderView';
	var data={orderNo:orderId};
	enAjax(url,'post',true,data,mess,null);
	function mess(data){
		var sum=0;
		var totalPrice=parseFloat(data.data.payment);
		$(".mui-content").attr("id",data.data.id);
		for(var i=0;i<data.data.orderItems.length;i++){
			var item='<div class="order">'+
				'<p>'+data.data.orderItems[i].productName+'</p>'+
				'<p>X<span>'+data.data.orderItems[i].quantity+'</span></span></p>'+
				'<p>￥<span>'+data.data.orderItems[i].totalPrice.toFixed(2)+'</span></p>'+
			'</div>';
			$(item).appendTo($("#orders"));
			sum+=data.data.orderItems[i].totalPrice;
		}
//			console.log(totalPrice+yf-mj-yhq-djcx);
		$("#price2").html(sum.toFixed(2));
		$("#total").html(totalPrice.toFixed(2));
		
//			console.log("sum:"+sum+"yf:"+yf+"mj:"+mj+"yhq:"+yhq+"djcx:"+djcx);
		$("#yhq-box").on("tap","li",function(){
			var totalPrice=parseFloat(data.data.payment);
			var couponId=$(this).attr("couponid");
			
			$("#check-yhq").html($(this).find($(".card-name")).html());
			$("#check-yhq").attr("couponid2",couponId)
			var reduceNum=parseFloat($(this).attr('reduce'));
			mui('#sheet1').popover('toggle');
			$("#yhq").html(reduceNum.toFixed(2));
			$("#total").html((totalPrice-reduceNum).toFixed(2))
			
		})
	}
}

function subMes(data){
	$("#submit").parent().attr("href","pay-money.html?id="+data.data);
	window.location.href="pay-money.html?id="+data.data;
}