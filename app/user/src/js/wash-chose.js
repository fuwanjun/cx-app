var _id;
weixinReload();
$(function () {
        mui.init();
    //页面载入时获取历史购物车中的商品数量和总价
    carPrice();
    //菜单tab切换
    $(".menu-list li").on("tap", function () {
        var i = $(this).index();
        $(".menu-list li").removeClass("menu-active");
        $(".menu-list li").eq(i).addClass("menu-active");
        $(".con-list li").removeClass("con-active");
        $(".con-list li").eq(i).addClass("con-active");
        //获取对应id的商品
        getItem(i + 1);

    });

    //根据上层页面点击传过来的id跳转对应tab页面
    var id = getQueryString("id");
    var listTab = $(".menu-list li");
    var listCon = "menu-active";
    var conTab = $(".con-list li");
    var conCon = "con-active";
    if (id == 1) {
        $(".menu-list li").removeClass("menu-active");
        $(".menu-list li").eq(0).addClass("menu-active");
        $(".con-list li").removeClass("con-active");
        $(".con-list li").eq(0).addClass("con-active");
        getItem(1);
    } else if (id == 2) {
        $(".menu-list li").removeClass("menu-active");
        $(".menu-list li").eq(1).addClass("menu-active");
        $(".con-list li").removeClass("con-active");
        $(".con-list li").eq(1).addClass("con-active");
        getItem(2);
    } else if (id == 3) {
        $(".menu-list li").removeClass("menu-active");
        $(".menu-list li").eq(2).addClass("menu-active");
        $(".con-list li").removeClass("con-active");
        $(".con-list li").eq(2).addClass("con-active");
        getItem(3);
    } else {
        $(".menu-list li").removeClass("menu-active");
        $(".menu-list li").eq(3).addClass("menu-active");
        $(".con-list li").removeClass("con-active");
        $(".con-list li").eq(3).addClass("con-active");
        getItem(4);
    }
    $("#shop-car").on("tap", function () {
        var token = $.cookie('token');
        if (token) {
            window.location.href = "clothes-box.html";
        } else {
            window.location.href ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx31fd1e1bad23db37&redirect_uri=http%3A%2F%2Fwww.changwash.com%2Fapp%2Fuser%2Fview%2Forder%2Fclothes-box.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }
    });

    //添加商品
    $(".vip-con").on("tap", ".adds", function () {
        _id = $(this).parent().parent().attr("data-id");
        var left=$(this).offset().left;
        var top=$(this).offset().top;
        var carTop=$("#shop-car").offset().top;
        var carLeft=$("#shop-car").offset().left;
        var join='<div style="width: 0.25rem;height:0.25rem;position:absolute;top:'+top+'px;left:'+left+'px;border: 1px solid #39a4f2;background:#39a4f2;border-radius: 50%;"><img style="width: 100%;" src="../../../public/img/order/shopcar.png" alt=""></div>';

        var urlVip=globalUrl+"/userInfo/checkIsVip";
        enAjax2(urlVip,'get',true,{},function(data){
            console.log(data);
            var vipIndex;
            for(var i=0;i<$(".menu-list li").length;i++){
                if($(".menu-list li").eq(i).hasClass("menu-active")){
                    vipIndex=i;
                }
            }
            if(vipIndex==0&&!data){
                $("#vip-mask").css("display","block");

            }else{
                $(join).appendTo($(".vip-con")).animate({top:carTop+"px",left:carLeft+"px"})//.remove();

                //获取添加的商品ID

                var obj=$(this).parent().parent();
                var url=globalUrl+'/orderform/putCart';
                var data=JSON.stringify({goodsId:_id, commodityCount: "1", washMode: []});
                contentAjax2(url,'post',true,data,function(data){
                    carPrice()
                },null,false);
            }
        },null,true);

    });

    $("#vip-mask .close-btn").on("tap",function(){
        $("#vip-mask").css("display","none");
    });

    //关闭下拉框
    $("#mask").on("tap", ".close", function () {
        $("#mask").slideUp();
    });


    //点击确认添加商品到购物车
    $("#mask button").on("tap", function () {
        var arr = [];
        for (var i = 0; i < $(".tips .tip").length; i++) {
            if ($(".tips .tip").eq(i).hasClass("tip-active")) {
                var _tipId = $(".tips .tip").eq(i).attr("data-id");
                var _tipName = $(".tips .tip").eq(i).html();
                var _tipPrice = $(".tips .tip").eq(i).attr("price");
                var tipObj = {id: _tipId, modeName: _tipName, price: _tipPrice};
                arr.push(tipObj);
            }
        }
        var commodity = {goodsId: _id, commodityCount: 1, washMode: arr};
        postTip(commodity);
        $("#mask").slideUp();
    });
    var userId=$.cookie('userId');
    $("#submit").on("tap", function () {
        var url = globalUrl + '/orderform/getCartsByUserId';
        var data = {userId: userId};
        enAjax(url, 'get', true, data, subMes, null, false);
        function subMes(data) {
            console.log(data);

            var order = [];
            for (var i = 0; i < data.length; i++) {
                var goodsId = data[i].goodsId;
                var num = data[i].commodityCount;
                var partsIds = [goodsId];
                for (var j = 0; j < data[i].washMode.length; j++) {
                    var partsChild = data[i].washMode[j].id;
                    partsIds.push(partsChild);
                }
                var splic = partsIds.join("-");
                order.push(splic);
            }
            var orderString = order.toString();
            console.log(orderString);
            if (orderString == "") {
                mui.alert("请选择商品");
            } else {
                $.ajax({
                    url: globalUrl + '/order/creatOrder',
                    type: 'post',
                    data: {carts: orderString},
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("token", $.cookie("token"));
                    },
                    crossDomain: true,
                    success: function (data) {
                        console.log(data);
                        $("#submit").parent().attr("href", "order-pay.html?id=" + data.data);
                        window.location.href = "order-pay.html?id=" + data.data;
                    }
                })
            }
        }

    });
    //选择配件
    $(".tips").on("tap", ".tip", function () {
        var i = $(this).attr("data-id");
        var tipPrice = parseFloat($(this).attr("price"));
        var nowPrice = parseFloat($(this).parent().parent().find($(".this-item #detail-price")).html());
        $(this).toggleClass("tip-active");
        if ($(this).hasClass("tip-active")) {
            nowPrice += tipPrice;
        } else {
            nowPrice -= tipPrice
        }
        $("#detail-price").html(nowPrice.toFixed(2));
    })
});


//获取对应商品类目的商品
function getItem(type) {
    var url = globalUrl + '/goods/getGoodsByType';
    var data = {type: type};
    enAjax(url, 'get', true, data, itemFun, null, true);
}

function itemFun(data) {
    console.log(data);
    $(".vip-con").eq(type - 1).html("");
    var item = '';
    for (var i = 0; i < data.length; i++) {
        var img = data[i].goodsPicture ? "http://" + data[i].goodsPicture : '../../../public/img/order/pic.png';
        item += '<div class="vip-item" data-id="' + data[i].id + '" num="0" type="' + data[i].goodsType + '">' +
            '<div class="vip-item-pic"><a href="commodity-detail.html?id=' + data[i].id + '"><img src="' + img + '" alt="" /></a></div>' +
            '<p class="item-name">' + data[i].goodsName + '</p>' +
            '<div class="item-price">'+
            '<div class="all-price">' +
            '<p class="now-price">￥<span>' + data[i].goodsPrice + '</span></p>' +
            '</div>' +
            '<div class="adds"><img src="../../../public/img/picker/add.png" alt="" /></div>' +
            '</div>' +
            '</div>';
    }

    $(".vip-con").eq(type - 1).append(item);
}

function getItem(type) {
    $.ajax({
        url: globalUrl + '/goods/getGoodsByType',
        data: {type: type},
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success: function (data) {
			console.log(data);
            $(".vip-con").eq(type - 1).html("");
            var item = '';
            for (var i = 0; i < data.length; i++) {
                var img = data[i].goodsPicture ? "http://" + data[i].goodsPicture : '../../../public/img/order/pic.png';
                item += '<div class="vip-item" data-id="' + data[i].id + '" type="' + data[i].goodsType + '">' +
                     '<span class="mui-badge mui-badge-danger goodsNum"></span>'+
                    '<div class="vip-item-pic"><a href="commodity-detail.html?id=' + data[i].id + '"><img src="' + img + '" alt="" /></a></div>' +
                    '<p class="item-name">' + data[i].goodsName + '</p>' +
                    '<div class="item-price">' +
                    '<div class="all-price">' +
                    '<p class="now-price">￥<span>' + data[i].goodsPrice + '</span></p>' +
                    '</div>' +
                    '<div class="adds"><img src="../../../public/img/picker/add.png" alt="" /></div>'+
                    '</div>' +
                    '</div>';
            }

            $(".vip-con").eq(type - 1).append(item);
            carPrice();
        }
    })
}


//获取商品类型数量
function getNum(userId) {
    $.ajax({
        url: globalUrl + '/orderform/getCartsCountByUserId',
        data: {userId: userId},
        type: "get",
        crossDomain: true,
        success: function (data) {
            if (!token) {
                window.location.href = wxUrl;
            }
//			console.log(data);
            $("#item-num").html(data);
        }
    })
}

//获取购物车的数量和总价
function carPrice(){
    var url=globalUrl+'/orderform/getCartsByUserId';
    var data={userId:userId};
    enAjax2(url,'get',true,data,getCarNumPrice,null,true);

    function getCarNumPrice(data){
        console.log(data);
        testDiv(data);
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


function testDiv(data){
    if(data){
        for(var i=0;i<data.length;i++){
            // 获取商品id
            var goodsId = data[i].goodsId;
            var count = data[i].commodityCount;
            if(count!=0){
                $("div.vip-item[data-id="+goodsId+"]").find(".goodsNum").text(count).css("display","block");
            }else{
                $("div.vip-item[data-id="+goodsId+"]").find(".goodsNum").css("display","none");
            }
        }
    }

}