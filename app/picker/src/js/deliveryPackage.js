mui.init();
mui(".sortBox").on("tap","div",function(){
    jQuery(this).addClass("sort-active").siblings().removeClass("sort-active");
});

backOrder1(1,40);
$(".chose-btn").on("tap",function(){
    var index=$(this).index();
    if(index==0){
        $("#item1 ul").html("");
        backOrder1(1,40);
    }else if(index==1){
        $("#item2 ul").html("");
        backOrder2(1,45);
    }else if(index==2){
        $("#item3 ul").html("");
        backOrder3(1,50);
    }else{}
});

function backOrder1(page,status){
    $.ajax({
        url:globalUrl+'/sender/listByStatus',
        type:'get',
        data:{page:page,status:status},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success:function(data){
            console.log(data);
            $("#mesNum").html(data.data.list.length);
            $("#item1 ul").html("");
            if(data.data.list==0){
                var tipMessage='<p style="text-align:center;margin-top:0.3rem;background:#f4f8ff;">没有待送订单</p>';
                $(tipMessage).appendTo($("#item1 ul"));
            }

            for(var i=0;i<data.data.list.length;i++){
                var address=data.data.list[i].address.region?data.data.list[i].address.region:" ";
                var detailAddress=data.data.list[i].address.detailAddress?data.data.list[i].address.detailAddress:" ";

                var item='<li class="mui-table-view-cell bg-white">'+
                    '<div class="font-size-12 color-666 margin-bottom-r10">'+
                    '<span>订单编号：</span><span>'+data.data.list[i].orderNo+'</span>'+
                    '</div>'+
                    '<div class="mui-flex font-size-14 margin-bottom-r10">'+
                    '<div class="widthLimit"><i class="mui-icon mui-icon-location font-size-16"></i>'+address+detailAddress+'</div>'+
                    //											'<div class="font-size-12">距离1.7km</div>'+
                    '</div>'+
                    '<div class="font-size-12 color-333 margin-bottom-r10">'+
                    '<span class="customerName">'+data.data.list[i].address.userName+'</span><span>15263258965</span>'+
                    '</div>'+
                    '<div class="font-size-12 mui-flex mui-flex-halign-center">'+
                    '<div class="color-666"><span>取件时间：</span><span>'+timestampToTime(data.data.list[i].createTime)+'</span></div>'+
                    '<div class="border-orange">扫码封签</div>'+
                    '<a href="packageDetail.html?orderId='+data.data.list[i].orderNo+'"><div class="border-blue detail-mes">查看详情</div></a>'+
                    '</div>'+
                    '</li>';
                $(item).appendTo($("#item1 ul"));
            }
        }
    })
}
function backOrder2(page,status){
    $.ajax({
        url:globalUrl+'/sender/listByStatus',
        type:'get',
        data:{page:page,status:status},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success:function(data){
            console.log(data);
            $("#mesNum").html(data.data.list.length);
            $("#item1 ul").html("");
            if(data.data.list==0){
                var tipMessage='<p style="text-align:center;margin-top:0.3rem;background:#f4f8ff;">没有待送订单</p>';
                $(tipMessage).appendTo($("#item1 ul"));
            }

            for(var i=0;i<data.data.list.length;i++){
                var address=data.data.list[i].address.region?data.data.list[i].address.region:" ";
                var detailAddress=data.data.list[i].address.detailAddress?data.data.list[i].address.detailAddress:" ";

                var item='<li class="mui-table-view-cell bg-white">'+
                    '<div class="font-size-12 color-666 margin-bottom-r10">'+
                    '<span>订单编号：</span><span>'+data.data.list[i].orderNo+'</span>'+
                    '</div>'+
                    '<div class="mui-flex font-size-14 margin-bottom-r10">'+
                    '<div class="widthLimit"><i class="mui-icon mui-icon-location font-size-16"></i>'+address+detailAddress+'</div>'+
                    //											'<div class="font-size-12">距离1.7km</div>'+
                    '</div>'+
                    '<div class="font-size-12 color-333 margin-bottom-r10">'+
                    '<span class="customerName">'+data.data.list[i].address.userName+'</span><span>15263258965</span>'+
                    '</div>'+
                    '<div class="font-size-12 mui-flex mui-flex-halign-center">'+
                    '<div class="color-666"><span>取件时间：</span><span>'+timestampToTime(data.data.list[i].createTime)+'</span></div>'+
                    '<div class="border-orange">扫码封签</div>'+
                    '<a href="packageDetail.html?orderId='+data.data.list[i].orderNo+'"><div class="border-blue detail-mes">查看详情</div></a>'+
                    '</div>'+
                    '</li>';
                $(item).appendTo($("#item2 ul"));
            }
        }
    })
}

function backOrder3(page,status){
    $.ajax({
        url:globalUrl+'/sender/listByStatus',
        type:'get',
        data:{page:page,status:status},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success:function(data){
            console.log(data);
            $("#mesNum").html(data.data.list.length);
            $("#item1 ul").html("");
            if(data.data.list==0){
                var tipMessage='<p style="text-align:center;margin-top:0.3rem;background:#f4f8ff;">没有待送订单</p>';
                $(tipMessage).appendTo($("#item1 ul"));
            }

            for(var i=0;i<data.data.list.length;i++){
                var address=data.data.list[i].address.region?data.data.list[i].address.region:" ";
                var detailAddress=data.data.list[i].address.detailAddress?data.data.list[i].address.detailAddress:" ";

                var item='<li class="mui-table-view-cell bg-white">'+
                    '<div class="font-size-12 color-666 margin-bottom-r10">'+
                    '<span>订单编号：</span><span>'+data.data.list[i].orderNo+'</span>'+
                    '</div>'+
                    '<div class="mui-flex font-size-14 margin-bottom-r10">'+
                    '<div class="widthLimit"><i class="mui-icon mui-icon-location font-size-16"></i>'+address+detailAddress+'</div>'+
                    //											'<div class="font-size-12">距离1.7km</div>'+
                    '</div>'+
                    '<div class="font-size-12 color-333 margin-bottom-r10">'+
                    '<span class="customerName">'+data.data.list[i].address.userName+'</span><span>15263258965</span>'+
                    '</div>'+
                    '<div class="font-size-12 mui-flex mui-flex-halign-center">'+
                    '<div class="color-666"><span>取件时间：</span><span>'+timestampToTime(data.data.list[i].createTime)+'</span></div>'+
                    '<div class="border-orange">扫码封签</div>'+
                    '<a href="packageDetail.html?orderId='+data.data.list[i].orderNo+'"><div class="border-blue detail-mes">查看详情</div></a>'+
                    '</div>'+
                    '</li>';
                $(item).appendTo($("#item3 ul"));
            }
        }
    })
}