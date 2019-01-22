$(function(){
	//载入购物车数据
	ajaxInit();
	 //点击编辑出现删除按钮
	 // $(".ok").on("tap",function(){
	 // 	$(".del").slideToggle();
	 // });
	 
	 //减少商品
	 $("#shop-car").on("tap",".mui-btn-numbox-minus",function(){
	 	if($(this).next().val()<=1){
			mui.alert("商品数量不能小于1");
	 	}else{
	 		var o=$(this);
		 	var _id=o.parent().parent().parent().attr("data-id");
		 	var thisMes=o.parent().parent().parent().find($(".tail-mes span"))
		 	var arr=[];
			for(var i=0;i<thisMes.length;i++){
				var _tipId=thisMes.eq(i).attr("id");
				var _tipName=thisMes.eq(i).html();
				var _tipPrice=thisMes.eq(i).attr("price");
				var tipObj={id:_tipId,modeName:_tipName,price:_tipPrice};
				arr.push(tipObj);
			}
			var commodity={goodsId:_id,commodityCount:-1,washMode:arr};
			$.ajax({
				contentType:"application/json;charset=UTF-8",
				url:globalUrl+'/orderform/putCart',
				data:JSON.stringify(commodity),
				type:'post',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("token", $.cookie("token"));
                },
                crossDomain: true,
				success:function(data){
					console.log(data);
					o.next("input[type=number]").val(data.commodityCount);
					o.parent().parent().parent().find($(".nowPrice")).html(data.price);
					var sum=0;
					for(var j=0;j<$("form li").length;j++){
						var even=parseFloat($("form li").eq(j).find($(".nowPrice")).html());
						sum+=even;
					}
					$("#all-price").html(sum.toFixed(2));
				}
			})
	 	}
	});
	 
	 
	 //增加商品
	 $("#shop-car").on("tap",".mui-btn-numbox-plus",function(){
	 	var o=$(this);
	 	var _id=o.parent().parent().parent().attr("data-id");
	 	var thisMes=o.parent().parent().parent().find($(".tail-mes span"))
	 	var arr=[];
		for(var i=0;i<thisMes.length;i++){
			var _tipId=thisMes.eq(i).attr("id");
			var _tipName=thisMes.eq(i).html();
			var _tipPrice=thisMes.eq(i).attr("price");
			var tipObj={id:_tipId,modeName:_tipName,price:_tipPrice};
			arr.push(tipObj);
		}
		var commodity={goodsId:_id,commodityCount:1,washMode:arr};
		$.ajax({
			contentType:"application/json;charset=UTF-8",
			url:globalUrl+'/orderform/putCart',
			data:JSON.stringify(commodity),
			type:'post',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", $.cookie("token"));
            },
            crossDomain: true,
			success:function(data){
				console.log(data);
				o.prev("input[type=number]").val(data.commodityCount);
				o.parent().parent().parent().find($(".nowPrice")).html(data.price);
				var sum=0;
				for(var j=0;j<$("form li").length;j++){
					var even=parseFloat($("form li").eq(j).find($(".nowPrice")).html());
					sum+=even;
				}
				$("#all-price").html(sum.toFixed(2));
			}
		})
	});
	 
	//全选
	$("#chose-all").on("change",function(){
		var allPrice=parseFloat($("#all-price").html());
		if(this.checked){
			$("form li").find($("input[type=checkbox]")).prop("checked",true);
			var sum=0;
			for(var i=0;i<$("form li").length;i++){
				sum+=parseFloat($("form li").eq(i).find($(".nowPrice")).html());
			}
			$("#all-price").html(sum.toFixed(2));
		}else{
			var zero=0;
			$("form li").find($("input[type=checkbox]")).prop("checked",false);
			$("#all-price").html(zero.toFixed(2));
		}
	});
	//单选
	$("#shop-car").on("change","input[name='checkbox']",function(){
		if(this.checked){
			var allPrice=parseFloat($("#all-price").html());
			var chosePrice=parseFloat($(this).parent().parent().find($(".nowPrice")).html());
			$("#all-price").html((allPrice+chosePrice).toFixed(2));
		}else{
			var allPrice=parseFloat($("#all-price").html());
			var chosePrice=parseFloat($(this).parent().parent().find($(".nowPrice")).html());
			$("#all-price").html((allPrice-chosePrice).toFixed(2));
		}
	});
	
	//删除商品
	$(".ok").on("tap",function(){
		if($("form li").length<1){
			mui.alert("购物车里什么都没有诶")
		}else{
			mui.confirm("确定删除选中的商品？","提醒",["否","是"],function(e){
				if(e.index==1){
					var idss=[];
					for(var i=0;i<$("form li").length;i++){
						if($("form li").eq(i).find($("input[type=checkbox]")).is(":checked")){
							
							var goodsId=$("form li").eq(i).attr("data-id");
							var a=$("form li").eq(i).find($(".tail-mes span")).length;
							var partsIds=[goodsId];
							for(var j=0;j<a;j++){
								var partsId=$("form li").eq(i).find($(".tail-mes span")).eq(j).attr("id");
								partsIds.push(partsId);
							}
							var splic=partsIds.join("-");
							console.log(splic);
							idss.push(splic);
						}
					}
					console.log(idss.toString());

					var pickerId=$.cookie("id");
					//删除选中的商品
					$.ajax({
			//			contentType:"application/json;charset=UTF-8",
						url:globalUrl+'/orderform/deletedCartByUserId',
						type:'post',
						data:{
							userId:pickerId,
							ids:idss.toString()
						},
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("token", $.cookie("token"));
                        },
                        crossDomain: true,
						success:function(data){
							console.log(data);
							ajaxInit();
						}
					})
				}else{
					
				}
				
			});
		}
		
		
	});
	
	$("#check-out").on("tap",function(){
		var order=[];
		if($("form li").length<1){
			mui.alert("请选择商品")
		}else{
			for(var i=0;i<$("form li").length;i++){
				
				if($("form li").eq(i).find($("input[type=checkbox]")).is(":checked")){
					var goodsId=$("form li").eq(i).attr("data-id");//id
					var a=$("form li").eq(i).find($(".tail-mes span")).length;//length
					var num=$("form li").eq(i).find($("input[type=number]")).val();
					var partsIds=[goodsId];
					
					for(var j=0;j<a;j++){
						var partsId=$("form li").eq(i).find($(".tail-mes span")).eq(j).attr("id");
						partsIds.push(partsId);
					}
	
					var splic=partsIds.join("-");
					order.push(splic);
				}
			}
			
			var orderString=order.toString();
			console.log(orderString);
			$.ajax({
				url:globalUrl+'/order/creatOrder',
				type:'post',
				data:{
					carts:orderString
				},
				success:function(data){
					console.log(data);
					$("#check-out").parent().attr("href","order-pay.html?id="+data.data);
					window.location.href="order-pay.html?id="+data.data;
				}
			})
		}
		
	})

//清除缓存
//	clearItem();
});
var pickerId=$.cookie("id");
function ajaxInit(){
	$.ajax({
		url:globalUrl+'/orderform/getCartsByUserId',
		type:'get',
		data:{userId:pickerId},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			var allPrice=0;
			console.log(data);
			$("#shop-car").html("");
			for(var j=0;j<data.length;j++){
				var details='';
				for(var k=0;k<data[j].washMode.length;k++){
					var detailPrice=data[j].washMode[k].price;
					var detailId=data[j].washMode[k].id;
					details+='<span id="'+detailId+'" price="'+detailPrice+'">'+data[j].washMode[k].modeName+' </span>';
				}
				var img=data[j].goods.goodsPicture?"http://"+data[j].goods.goodsPicture:'../../img/shose.jpg';
				var item='<li data-id="'+data[j].goodsId+'" num="'+data[j].price+'">'+
						'<div class="mui-checkbox">'+
							'<label></label>'+
							'<input name="checkbox" type="checkbox" checked>'+
						'</div>'+
						'<div class="clothes-pic"><img src="'+img+'" alt="" /></div>'+
						'<div class="clothes-name">'+
							'<p>'+data[j].goods.goodsName+'</p>'+
							'<p>￥<span class="nowPrice">'+data[j].price+'</span></p>'+
						'</div>'+
						'<div>'+
							'<p class="tail-mes">'+details+'</p>'+
							'<div class="mui-numbox" data-numbox-min="1">'+
								'<button class="mui-btn mui-btn-numbox-minus" type="button">-</button>'+
								'<input disabled class="mui-input-numbox" type="number" data-numbox-min="1" value="'+data[j].commodityCount+'">'+
								'<button class="mui-btn mui-btn-numbox-plus" type="button">+</button>'+
							'</div>'+
						'</div>'+
					'</li>';
				$(item).appendTo($("#shop-car"));
				allPrice+=parseFloat(data[j].price);
			}
			$("#all-price").html(allPrice.toFixed(2));
			var cookieNum=0;
			for(var i=0;i<$("#shop-car li").length;i++){
				var num=parseInt($("#shop-car li").eq(i).find("input[type=number]").val());
				cookieNum+=num;
			}
		}
	})
}
