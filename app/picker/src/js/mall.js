$(function(){
	getItems(1);
	hisNum();
	var menuUrl=globalUrl+"/headTitle/getHeadTitleAll";
	enAjax(menuUrl,'get',true,{},function(data){
		console.log(data);
		for(var i=0;i<data.data.length;i++){
			var menuItem='<a class="mui-control-item mui-active" href="#'+data.data[i].id+'">'+data.data[i].titleName+'</a>';
			var conItem='<div id="item1" class="mui-control-content mui-active bg-white border-radius-r5">'+
							'<ul class="mui-table-view mui-flex"></ul>'+
						'</div>';
            // $(menuItem).appendTo($("#menu1"));
		}
	});
//监听点击商品类目
	mui("body").on("tap",".mui-control-item",function(){
	jQuery(".mui-control-item").removeClass("mui-active");
	jQuery(this).addClass("mui-active");
	var id=jQuery(this).attr("href");
	var index=parseInt(id.split("item")[1]);
	jQuery(id).addClass("mui-active").siblings(".mui-control-content").removeClass("mui-active");

	switch (index){
		case 1:
			type=index;
			$("#item1 ul").html("");
			getItems(type);
			break;
		case 2:
			type=index;
			$("#item2 ul").html("");
			getItems(type);
			break;
		case 3:
			type=index;
			$("#item3 ul").html("");
			getItems(type);
			break;
		case 4:
			type=index;
			$("#item4 ul").html("");
			getItems(type);
			break;
		case 5:
			type=index;
			$("#item5 ul").html("");
			getItems(type);
			break;
		case 6:
			type=index;
			$("#item6 ul").html("");
			getItems(type);
			break;
		case 7:
			type=index;
			$("#item7 ul").html("");
			getItems(type);
			break;
		default:
			break;
		}
	});


	//点击加号进行商品添加
	mui("body").on("tap",".addlogo",function(){
		var goodsId=$(this).attr("data-id");
        putCar({goodsId: "2", commodityCount: 1, washMode: []})
	});

	//点击添加配件
	$("#sheet").on("tap","#parts .label-item",function(){
		var originPrice=parseFloat($("#goodsPrice").html());
		var i=$(this).attr("parts-id");
		var partsPrice=parseFloat($(this).attr("price"));
		if($(this).hasClass("label-active")){
			originPrice-=partsPrice;
			$(this).removeClass("label-active");
		}else{
			$(this).addClass("label-active");
			originPrice+=partsPrice;
		}
		$("#goodsPrice").html(originPrice.toFixed(2));
	});

	//添加购物车
	$("#incar").on("tap",function(){
		var _id=$("#sheet").attr("item-id");
		var arr=[];
		for(var i=0;i<$("#parts .label-item").length;i++){
			if($("#parts .label-item").eq(i).hasClass("label-active")){
				var _tipId=$("#parts .label-item").eq(i).attr("parts-id");
				var _tipName=$("#parts .label-item").eq(i).html();
				var _tipPrice=$("#parts .label-item").eq(i).attr("price");
				var tipObj={id:_tipId,modeName:_tipName,price:_tipPrice};
				arr.push(tipObj);
			}
		}
		var commodity={goodsId:_id,commodityCount:1,washMode:arr};
		putCar(commodity);
		$("#parts .label-item").removeClass("label-active");
		mui('#sheet').popover('toggle');

	});
	var pickerId=$.cookie('id');
	//点击下单取件直接结算购物车中的商品
	$("#submit").on("tap",function(){
		$.ajax({
			url:globalUrl+'/orderform/getCartsByUserId',
			type:'get',
			data:{userId:pickerId},
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", $.cookie("token"));
            },
            crossDomain: true,
			success:function(data){
				console.log(data);
				var order=[];
				for(var i=0;i<data.length;i++){
					var goodsId=data[i].goodsId;
					var num=data[i].commodityCount;
					var partsIds=[goodsId];
					for(var j=0;j<data[i].washMode.length;j++){
						var partsChild=data[i].washMode[j].id;
						partsIds.push(partsChild);
					}
					var splic=partsIds.join("-");
					order.push(splic);
				}
				var orderString=order.toString();
				console.log(orderString);
				if(orderString==""){
					mui.alert("请选择商品");
				}else{
					$.ajax({
						url:globalUrl+'/order/creatOrder',
						type:'post',
						data:{carts:orderString},
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("token", $.cookie("token"));
                        },
                        crossDomain: true,
						success:function(data){
							console.log(data);
							$("#submit").parent().attr("href","order-pay.html?id="+data.data);
							window.location.href="order-pay.html?id="+data.data;
						}
					})
				}

			}
		})
	});

});

function getItems(type){
	$.ajax({
		url:globalUrl+'/goods/getGoodsByType',
		data:{type:type},
		type:'get',
		success:function(data){
			console.log(data);
			for(var i=0;i<data.length;i++){
				var img=data[i].goodsPicture?"http://"+data[i].goodsPicture:'../../public/img/picker/icon/pic.png';
				var item='<li class="mui-table-view-cell">'+
							'<div class="font-size-12 color-666 pic-goods"><img class="uniform" src="'+img+'" alt=""></div>'+
							'<div class="mui-flex font-size-14 thisName">'+data[i].goodsName+'</div>'+
							'<div class="font-size-12 color-333 mui-flex mui-flex-between">'+
							'<div><span class="customerName">￥</span><span class="font-size-14">'+data[i].goodsPrice+'</span></div>'+
							'<img class="addlogo margin-r-r05" data-price="'+data[i].goodsPrice+'" data-id="'+data[i].id+'" src="../../public/img/picker/add.png"></div>'+
						'</li>';
				$(item).appendTo($("#item"+type+' ul'));
			}
		}
	})
}

//获取商品配件
function getDetail(goodsId){
	$.ajax({
		url:globalUrl+'/goods/getWashModeByGoodsId',
		type:'get',
		data:{goodsId:goodsId},
		success:function(data){
			console.log(data);
			if($("#parts").html()==""){
				for(var i=0;i<data.data.length;i++){
					var item='<div class="label-item" price="'+data.data[i].price+'" parts-id="'+data.data[i].id+'">'+data.data[i].modeName+'</div>';
					$(item).appendTo($("#parts"));
				}
			}
		}
	})
}

//将选中商品添加到购物车
function putCar(item){
	$.ajax({
		contentType:"application/json;charset=UTF-8",
		url:globalUrl+'/orderform/putCart',
		data:JSON.stringify(item),
		type:'post',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
			hisNum();
		}
	})
}
var pickerId=$.cookie('id');
//页面载入时获取历史购物车中的商品数量和总价
function hisNum(){
	$.ajax({
		url:globalUrl+'/orderform/getCartsByUserId',
		type:'get',
		data:{userId:pickerId},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
			var hisNum=0;
			var hisPrice=0;
			for(var i=0;i<data.length;i++){
				 hisNum+=parseFloat(data[i].commodityCount);
				 hisPrice+=parseFloat(data[i].price);
//				 console.log(data[i].commodityCount);
			}
			$(".number").html(hisNum);
			$("#initPrice").html(hisPrice);
		}
	});
	if($(".number").html()==0){
		$(this).css("display","none");
	}else{
		$(this).css("display","block");
	}
}