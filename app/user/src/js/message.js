$(function(){
	mui("body").on("tap","a",function(){
		window.location.href=this.href;
	});

    pullupRefresh2();
		mui.init({
			pullRefresh:{
				container:'#chose-con2',
				up:{
					height:50,
					auto:true,
					contentrefresh:'正在加载...',
					contentnomore:'没有更多数据',
					callback:pullupRefresh
				}
			}
		})
});


var count=1;
function pullupRefresh(){
	setTimeout(
		function(){
			$.ajax({
				contentType:'application/json;charset=UTF-8',
				url:globalUrl+'/sysNotice/getSysNoticeByScope',
				type:'post',
				data:JSON.stringify({page:count,scope:$.cookie("userId")}),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("token", $.cookie("token"));
                },
                crossDomain: true,
				success:function(data){
					console.log(data);
					if(data.code==401){
						// alert(data.code);
						window.location.href=wxUrl;
					}else{
                        mui('#chose-con2').pullRefresh().endPullupToRefresh((++count>data.navigatepageNums.length));
                        for(var i=0;i<data.list.length;i++){
                            var item='<a href="order/order-detail.html?id='+data.list[i].orderNo+'">'+
                                '<li mes-id="'+data.list[i].id+'">'+
                                '<div class="mess-icon"><p><img src="../../public/img/set.png" alt="" /></p></div>'+
                                '<div class="mess-txt">'+
                                '<div class="top-text">'+
                                '<p class="mess-tit">'+data.list[i].title+'</p>'+
                                '<p class="time">'+timestampToTime(data.list[i].createTime)+'</p>'+
                                '</div>'+
                                '<p>'+data.list[i].content+'</p>'+
                                '</div>'+
                                '</li>'+
                                '</a>';
                            $(item).appendTo($("#mess"));
                        }
					}

				}
			})
		},500)
}

function pullupRefresh2(){
	$.ajax({
		url:globalUrl+"/notice/getNoticeList",
		type:'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
            if(data.code==401){
                window.location.href=wxUrl;
            }else{
                $("#chose-con1").html("");
            	for(var i=0;i<data.data.list.length;i++){
            		var tit=data.data.list[i].noticeTitle?data.data.list[i].noticeTitle:"无标题";
            		var noticeId = data.data.list[i].id;
					var item='<div class="mui-card">'+
								'<div class="mui-card-header">'+
								'<div class="mui-media-body"><p class="card-tit">'+tit+'</p>'+
								// '<p><span class="year">2018</span>年<span class="month">7</span>月<span class="day">5</span>日</p>'+
							'</div>'+
							// '<p class="top-btn">置顶</p>'+
								'</div>'+
								'<div class="mui-card-content"><img src="http://'+data.data.list[i].cover+'" alt="" />'+
								'<div class="mui-card-content-inner">'+
								'<p style="color: #666;">'+data.data.list[i].remark+'</p>'+
							'</div>'+
							'</div>'+
							'<a href="user-center/newsDetails.html?newsId='+noticeId+'"><div class="mui-card-footer">查看详情</div></a>'+
						'</div>';
					$(item).appendTo($("#chose-con1"));
				}
			}
		}
	})
}

