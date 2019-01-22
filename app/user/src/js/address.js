function addressCount(address,handle){
    // pageLoad("block");
    handle=handle?handle:false;
	//点击添加地址按钮判断地址个数
	$("#addPlace").on("tap",function(){

		$.ajax({
			url:globalUrl+'/address/getAddressCountByUserId',
			type:'get',
			data:{userInfoId:$.cookie('userId')},
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", $.cookie("token"));
            },
            crossDomain: true,
			success:function(data){
                if(!handle&&data.code==401){
                    window.location.href=wxUrl;
                    return false;
                }
				console.log(data);
				if(data>=5){
					mui.alert('最多同时存在5条地址');
				}else{
					window.location.href=address;
				}
				removeMask();
			},
			error:function(){
				removeMask();
			}
		})
	})
}


//获取已存地址
function getAddressOrder(id,orderAddress,handle){
    // pageLoad("block");
    handle=handle?handle:false;
	$.ajax({
		url:globalUrl+'/address/getAddressByUserInfoId',
		type:'get',
		data:{
			userInfoId:$.cookie('userId')
		},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
            removeMask();
            if(!handle&&data.code==401){
                window.location.href=wxUrl;
                return false;
            }
            console.log(data);
            if(data.length!=0){
				for(var i=0;i<data.length;i++){
					var list='<ul class="mui-table-view wash-item" data-id="'+data[i].id+'">'+
								'<div class="mui-checkbox" style="margin-top: 0.2rem;">'+
								'<label></label>'+
								'<input name="checkbox" type="checkbox">'+
								'</div>'+
								'<a href="'+orderAddress+'?id='+id+'">'+
									'<li class="mui-table-view-cell">'+
										'<div class="mui-slider-right mui-disabled">'+
											'<span class="mui-btn mui-btn-red"><span class="mui-icon mui-icon-trash"></span></span>'+
										'</div>'+
										'<div class="mui-slider-handle">'+
											'<div class="mes">'+
												'<p>'+data[i].userName+'</p>'+
												'<p class="wash-num">'+data[i].phone+'</p>'+
											'</div>'+
											'<div class="address">'+data[i].region+'-'+data[i].detailAddress+'</div>'+
										'</div>'+
									'</li>'+
								'</a>'+
							'</ul>';
					$(list).appendTo($(".mui-content"));
					//removeMask();
				}
            }
			//删除地址
			for(var i=0;i<$(".wash-item").length;i++){
				$(".mui-btn-red").eq(i).on("tap",function(){
					var addressId=$(this).parent().parent().parent().parent().attr("data-id");
					mui.confirm("是否删除该消息？","提示",["否","是"],function(e){
						if(e.index==1){
							var url=globalUrl+'/address/deleteAddress';
							var data={"addressId":addressId};
							enAjax(url,'post',true,data,reloadAddress,null,false);
							function reloadAddress(data){
                                location.reload();
							}
						}else{}
					})
				});
			}

		},
		error:function(){
			removeMask();
		}
	})
}


//获取已存地址
function getAddressGoods(id,orderAddress,handle){
    // pageLoad("block");
	$.ajax({
		url:globalUrl+'/address/getAddressByUserInfoId',
		type:'get',
		data:{
			userInfoId:$.cookie("userId")
		},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
            removeMask();
			console.log(data);
			if(data){
                removeMask();
			}
            if(!handle&&data.code==401) {
                window.location.href = wxUrl;
                return false;
            }
			for(var i=0;i<data.length;i++){
				var list='<ul class="mui-table-view wash-item" data-id="'+data[i].id+'">'+
							'<div class="mui-checkbox" style="margin-top: 0.2rem;">'+
							'<label></label>'+
							'<input name="checkbox" type="checkbox">'+
							'</div>'+
							'<a href="'+orderAddress+'?goodsId='+id+'">'+
								'<li class="mui-table-view-cell">'+
									'<div class="mui-slider-right mui-disabled">'+
										'<span class="mui-btn mui-btn-red"><span class="mui-icon mui-icon-trash"></span></span>'+
									'</div>'+
									'<div class="mui-slider-handle">'+
										'<div class="mes">'+
											'<p>'+data[i].userName+'</p>'+
											'<p class="wash-num">'+data[i].phone+'</p>'+
										'</div>'+
										'<div class="address">'+data[i].region+'-'+data[i].detailAddress+'</div>'+
									'</div>'+
								'</li>'+
							'</a>'+
						'</ul>';
				$(list).appendTo($(".mui-content"));
				//removeMask();
			}
			//删除地址
			for(var i=0;i<$(".wash-item").length;i++){
				$(".mui-btn-red").eq(i).on("tap",function(){
					var addressId=$(this).parent().parent().parent().parent().attr("data-id");
					mui.confirm("是否删除该消息？","提示",["否","是"],function(e){
						if(e.index==1){
                            var url=globalUrl+'/address/deleteAddress';
                            var data={"addressId":addressId};
                            enAjax(url,'post',true,data,reloadAddress2,null,false);
                            function reloadAddress2(data){
                                location.reload();
                            }
                            // $.ajax({
								// url:globalUrl+'/address/deleteAddress',
								// type:'post',
								// data:{
								// 	"addressId":addressId
								// },
								// success:function(data){
								// 	console.log(data);
								// 	location.reload();
								// }
                            // })
						}else{
							
						}
					})
				});
				//removeMask();
			}

		},
		error:function(){
			removeMask();
		}
	})
}
//删除地址
function deleteAddress(addressId){
    var url=globalUrl+'/address/deleteAddress';
    var data={"addressId":addressId};
    enAjax(url,'post',true,data,function(){
        console.log(data);
    },null,false);
}