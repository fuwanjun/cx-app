var pickerId = $.cookie("id");

function addressCount(address) {
    //点击添加地址按钮判断地址个数
    $("#addPlace").on("tap", function () {
        $.ajax({
            url: globalUrl + '/address/getAddressCountByUserId',
            type: 'get',
            data: {userInfoId: pickerId},
            success: function (data) {
                console.log(data);
                window.location.href = address;
            }
        })
    })
}


//获取已存地址
function getAddressOrder(id, orderAddress) {
    $.ajax({
        url: globalUrl + '/address/getAddressByUserInfoId',
        type: 'get',
        data: {
            userInfoId: pickerId
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success: function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var list = '<ul class="mui-table-view wash-item" data-id="' + data[i].id + '">' +
                    '<div class="mui-checkbox" style="margin-top: 0.2rem;">' +
                    '<label></label>' +
                    '<input name="checkbox" type="checkbox">' +
                    '</div>' +
                    '<a href="' + orderAddress + '?id=' + id + '">' +
                    '<li class="mui-table-view-cell">' +
                    '<div class="mui-slider-right mui-disabled">' +
                    '<span class="mui-btn mui-btn-red"><span class="mui-icon mui-icon-trash"></span></span>' +
                    '</div>' +
                    '<div class="mui-slider-handle">' +
                    '<div class="mes">' +
                    '<p>' + data[i].userName + '</p>' +
                    '<p class="wash-num">' + data[i].phone + '</p>' +
                    '</div>' +
                    '<div class="address">' + data[i].region + '-' + data[i].detailAddress + '</div>' +
                    '</div>' +
                    '</li>' +
                    '</a>' +
                    '</ul>';
                $(list).appendTo($(".mui-content"));
            }
            //删除地址
            for (var i = 0; i < $(".wash-item").length; i++) {
                $(".mui-btn-red").eq(i).on("tap", function () {
                    var addressId = $(this).parent().parent().parent().attr("data-id");
                    mui.confirm("是否删除该消息？", "提示", ["否", "是"], function (e) {
                        if (e.index == 1) {
                            $.ajax({
                                url: globalUrl + '/address/deleteAddress',
                                type: 'post',
                                data: {
                                    "addressId": addressId
                                },
                                success: function (data) {
                                    console.log(data);
                                    // location.reload();
                                }
                            })
                        } else {

                        }
                    })
                })
            }
        }
    })
}


//获取已存地址
function getAddressGoods(id, orderAddress) {
    $.ajax({
        url: globalUrl + '/address/getAddressByUserInfoId',
        type: 'get',
        data: {
            userInfoId: pickerId
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
        success: function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var list = '<ul class="mui-table-view wash-item" data-id="' + data[i].id + '">' +
                    //							'<a href="'+orderAddress+'?goodsId='+id+'">'+
                    '<li class="mui-table-view-cell">' +
                    '<div class="mui-slider-right mui-disabled">' +
                    '<span class="mui-btn mui-btn-red"><span class="mui-icon mui-icon-trash"></span></span>' +
                    '</div>' +
                    '<div class="mui-slider-handle">' +
                    '<div class="mes">' +
                    '<p>' + data[i].userName + '</p>' +
                    '<p class="wash-num">' + data[i].phone + '</p>' +
                    '</div>' +
                    '<div class="address">' + data[i].region + '-' + data[i].detailAddress + '</div>' +
                    '</div>' +
                    '</li>' +
                    //							'</a>'+
                    '</ul>';
                $(list).appendTo($(".mui-content"));
            }
            //删除地址
            for (var i = 0; i < $(".wash-item").length; i++) {
                $(".mui-btn-red").eq(i).on("tap", function () {
                    var addressId = $(this).parent().parent().parent().attr("data-id");
                    mui.confirm("是否删除该消息？", "提示", ["否", "是"], function (e) {
                        if (e.index == 1) {
                            $.ajax({
                                url: globalUrl + '/address/deleteAddress',
                                type: 'post',
                                data: {
                                    "addressId": addressId
                                },
                                success: function (data) {
                                    console.log(data);
                                    location.reload();
                                }
                            })
                        } else {

                        }
                    })
                })
            }
        }
    })
}

function deleteAddress(addressId){
    var url=globalUrl+'/address/deleteAddress';
    var data={"addressId":addressId};
    enAjax(url,'post',true,data,function(){
        console.log(data);
    },null,false);
}