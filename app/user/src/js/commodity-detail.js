var _id;
var _on;
var tipPrice;
var dataType;
$(function(){
	_id=getQueryString('id');
	_on=getQueryString("on");

	//获取当前商品月销量
    goodsSaleNum(_id);

	$(".btn-reduce").on("tap",function(){
		var itemNum=$(this).next("input").val();
		if(itemNum<2){
            itemNum=1;
            return;
		}
		$(this).next("input").val(--itemNum);
	});
    $(".btn-add").on("tap",function(){
        var itemNum=$(this).prev("input").val();
        $(this).prev("input").val(++itemNum);
    });
	//获取购物车数量和总价
	carPrice();
	$("#shop-car").on("tap",function(){
		var token=$.cookie('token');
		if(!token){
            window.location.href=wxUrl;
            return false;
		}
		window.location.href="clothes-box.html";
	});
	//获取评价数量
	getEValuatesNum();

	//获取当前商品的相关信息及第一条评论
	getGoodsEvaluate1();

	//点击X收起下拉框
	$("#close").on("tap",function(){
		popInit();
		mui('#sheet1').popover('toggle');
	});
	$("#close2").on("tap",function(){
		popInit();
		mui('#sheet1').popover('toggle');
	});

	var token=$.cookie('token');
	//点击加入购物车
	$("#incar").on("tap",function(){

		// if(!token){
		// 	window.location.href=wxUrl;
		// }
		var arr=[];
		for(var i=0;i<$("#tips-box .tip").length;i++){
			if($("#tips-box .tip").eq(i).hasClass("tip-active")){
				var _tipId=$("#tips-box .tip").eq(i).attr("data-id");
				var _tipName=$("#tips-box .tip").eq(i).html();
				var _tipPrice=$("#tips-box .tip").eq(i).attr("price");
				var tipObj={id:_tipId,modeName:_tipName,price:_tipPrice};
				arr.push(tipObj);
			}
		}
		var count=$("#number").val();
		var commodity={goodsId:_id,commodityCount:count,washMode:arr};
		postTip(commodity);
		popInit();
		mui('#sheet1').popover('toggle');
	});


	$("#more").parent().attr("href","more-comment.html?id="+_id);
	//+商品
	$(".btn-add").on("tap",function(){
		var count=$("#number").val();
		$("#detail-price").html((tipPrice*count).toFixed(2));
	});
	//-商品
	$(".btn-reduce").on("tap",function(){
		var count=$("#number").val();
		$("#detail-price").html((tipPrice*count).toFixed(2));
	});


	//购买单件商品
	$("#submit").on("tap",function(){
		var token=$.cookie('token');
		if(!token){
            window.location.href=wxUrl;
		}else{
            var goodsId=$(".com-mes").attr("goods-id");
            $("#submit").parent().attr("href","order-pay.html?goodsId="+goodsId);
		}

	});

	//选择配件
	$("#sheet1").on("tap","#tips-box .tip",function(){
		var i=$(this).attr("data-id");
		var count=$("#number").val();
		if($(this).hasClass("tip-active")){
			$(this).removeClass("tip-active");
			var per=parseFloat($("#detail-price").html());
			tipPrice=per;
			var tipp=parseFloat($(this).attr("price"))*count;
			tipPrice-=tipp;
				$("#detail-price").html((tipPrice).toFixed(2));
		}else{
			$(this).addClass("tip-active");
			var per=parseFloat($("#detail-price").html());
			tipPrice=per;
			var tipp=parseFloat($(this).attr("price"))*count;
			tipPrice+=tipp;
			$("#detail-price").html((tipPrice).toFixed(2));
		}
	})

});

//将选择的商品配件回传
function postTip(tip){
	var url=globalUrl+'/orderform/putCart';
	var data=JSON.stringify(tip);
	contentAjax(url,'post',true,data,partsBack,null,false);
	function partsBack(data){
		console.log(data);
		if(data.code==401){
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx31fd1e1bad23db37&redirect_uri=http%3a%2f%2fwww.changwash.com&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
		}
		carPrice();
	}
}


//下拉框选配件
function choseDetail(dataId){
	var url=globalUrl+'/goods/getWashModeByGoodsId';
	var data={goodsId:dataId};
	enAjax(url,'get',true,data,choseDetails,null);
	function choseDetails(data){
		console.log(data);
		if($("#tips-box").html()==""){
			for(var i=0;i<data.data.length;i++){
				var item='<p class="tip" price="'+data.data[i].price+'" data-id="'+data.data[i].id+'">'+data.data[i].modeName+'</p>';
				$(item).appendTo($("#tips-box"));
			}
		}else{
			$(".tips .tip").removeClass("tip-active");
		}
	}
}
var userId=$.cookie("userId");
function popInit(){
	var price=$("#price").html();
	tipPrice=$("#price").html();
	$("#detail-price").html(price);
	$("#tips-box").find(".tip").removeClass("tip-active");
	$("#number").val("1");
}
//获取购物车的数量和总价
function carPrice(){
	var url=globalUrl+'/orderform/getCartsByUserId';
	var data={userId:userId};
	enAjax(url,'get',true,data,getCarNumPrice,null,true);

	function getCarNumPrice(data){
		console.log(data);
		var hisNum=0;
		var hisPrice=0;
		for(var i=0;i<data.length;i++){
			 hisNum+=parseFloat(data[i].commodityCount);
			 hisPrice+=parseFloat(data[i].price);
			}
		$("#item-num").html(hisNum);
		$("#all-price span").html(hisPrice.toFixed(2));
	}
}

//获取评价数量
function getEValuatesNum(){
	var url=globalUrl+'/goods/getGoodsEvaluatesCountByGoodsId';
	var data={goodsId:_id};
	enAjax(url,'get',true,data,getThisNum,null);
	function getThisNum(data){
		$("#evaluates").html(data);
	}
}

//获取当前商品的相关信息及第一条评论
function getGoodsEvaluate1(){
	var url=globalUrl+'/goods/selectGoodsEvaluatesByGoodsId';
	var data={id:_id};
	enAjax(url,'get',false,data,goodsEvaluateOk,null);
	function goodsEvaluateOk(data){
		$(".goods-pic img").attr("src","http://"+data.goodsPicture);
		$("#goodsName").html(data.goodsName);
		$("#price").html(data.goodsPrice.toFixed(2));
		$(".com-mes").attr("goods-id",data.id);
		$("#thisImg img").attr("src","http://"+data.goodsPicture);
		$("#detail-price").html(data.goodsPrice);
		tipPrice=data.goodsPrice;
		$("#sheet1").attr("one-price",data.goodsPrice);
		$("#this-goods").html(data.goodsName);
		$(".bot-tips").html(data.content);
		var goodsId=$(".com-mes").attr("goods-id");
		var pj;
		if(data.goodsEvaluates.length==0){

		}else{
			var comment='<li>'+
							'<div class="user-mes">'+
								'<div class="user-head"><img src="'+data.userInfo.userPicture+'" alt="" /></div>'+
								'<p class="user-name">'+data.userInfo.userName+'</p>'+
							'</div>'+
							'<div class="comment-con">'+data.goodsEvaluates[0].evaluateContent+'</div>'+
						'</li>';
			$(comment).appendTo($("#comments"));
		}
		if(_on==0){

		}else{
			mui('#sheet1').popover('toggle');
			choseDetail(goodsId);
		}
		//点击弹出下拉框
		$("#detail").on("tap",function(){
			mui('#sheet1').popover('toggle');
			choseDetail(goodsId);
		})

	}
}

//单个商品月销量
function goodsSaleNum(goodsId){
	var url=globalUrl+"/goods/getGoodsSales";
	var data={goodsId:goodsId};
	enAjax2(url,'get',true,data,function(data){
		console.log(data);
		$("#saleNum").html(data.data);
	})
}