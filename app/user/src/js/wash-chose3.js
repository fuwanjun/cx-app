var _id;
weixinReload();
$(function(){
    mui.init();
    //页面载入时获取历史购物车中的商品数量和总价
    carPrice();
    var menuWidth=$(".menu-box").width();
    var url=globalUrl+"/headTitle/getHeadTitleAll";
    enAjax(url,'get',true,{},function(data){
        console.log(data);
        for(var i=0;i<data.data.length;i++){
            var list='<li>'+data.data[i].titleName+'</li>';
            var listCon='<li class="con">这是第'+(i+1)+'个DIV</li>'
            $(list).appendTo($(".menu-list"));
            $(listCon).appendTo($(".con-list"));

        }
        $(".menu-list li").css("width",menutWidth/4+"px");
        $(".menu-list").css("width",menuWidth/4*data.data.length)
    },null,false);

    $(".menu").on("tap","li",function(){
        var i=$(this).index();
        $(".menu li").removeClass("list-active");
        $(".menu li").eq(i).addClass("list-active");
        $(".content li").removeClass("con-active");
        $(".content li").eq(i).addClass("con-active");
    })
});


//获取购物车的数量和总价
function carPrice(){
    var url=globalUrl+'/orderform/getCartsByUserId';
    var data={userId:userId};
    enAjax2(url,'get',true,data,getCarNumPrice,null,true);

    function getCarNumPrice(data){
        console.log(data);
        testDiv(data)
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