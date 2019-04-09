$(function(){
	var prize=getQueryString('prize');
	var token=$.cookie('token');
	if(!token){
		window.location.href=wxUrl;
	}
	if(prize==3){
		$(".tab-con").removeClass("con-active");
        $(".tab-con").eq(2).addClass("con-active");
	}
    var headImg=$.cookie("headImgUrl");
    var nickName=$.cookie("nickName");
    $("#head-pic img").attr("src",headImg);
    $("#userName").html(nickName);
		mui("#con1").pullRefresh({
			up:{
				height:50,
				auto:true,
				contentrefresh:'正在加载...',
				contentnomore:'没有更多数据',
				callback:pullupRefresh1
			}
		});

	getCouponNum($.cookie("userId"));
	$(".list li").on("tap",function(){
		var index=$(this).index();
		if(index==0){

				mui("#con1").pullRefresh({
					up:{
						height:50,
						auto:true,
						contentrefresh:'正在加载...',
						contentnomore:'没有更多数据',
						callback:pullupRefresh1
					}
				})

		}else if(index==1){
			$(".allCards").html('');
				getCoupon(1);
			
		}else if(index==2){
			$(".cards").html('');
				myCoupon($.cookie("userId"));
		}
		$(".tab-con").removeClass("con-active");
		$(".tab-con").eq(index).addClass("con-active");
	});
	
	//点击领取兑换券
	$(".allCards").on("tap",".get-card",function(){
		var cardId=$(this).parent().attr("coupon-id");
		mui.confirm('是否确认兑换此优惠券？','',['取消','确定'],function(e){
			if(e.index==1){
				exchange(cardId);

			}
		})
		
	})
	
	//积分记录分页
	
	
});

//获取所有优惠券
function getCoupon(id){
	$.ajax({
		url:globalUrl+'/coupon/getCouponList',
		type:'post',
		data:{couponType:id},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
			for(var i=0;i<data.data.length;i++){
				var item='<li coupon-id="'+data.data[i].id+'">'+
						'<div class="card-mes">' +
							'<p class="card">'+data.data[i].remark+'</p>'+
							'<p><span>'+data.data[i].discountNum+'</span>元洗衣券 <span>(消费满<span>'+data.data[i].contentNum+'</span>元使用</span>)</p>'+
							'<p class="integral-num">消耗积分 <span>'+data.data[i].storeConvert+'</span></p>'+
						'</div>'+
						'<div class="get-card">立即兑换</div>'+
					'</li>';
				
				$(item).appendTo($(".allCards"));
			}
		}
	})
}


//获取用户的优惠券
function myCoupon(userId){
	$.ajax({
		url:globalUrl+'/coupon/getCouponItemByUserId',
		type:'post',
		data:{
			userId:userId
		},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
			if(data.status==210){
				var noCard='<h4 style="text-align: center; color: #8f8f94;">你暂时还没有奖品哦</h4>'
				$(noCard).appendTo($(".cards"));
                return false
			}
			if(data.status==200){
				if(!data.data){
                    var noCard='<h4 style="text-align: center; color: #8f8f94;">你暂时还没有奖品哦</h4>'
                    $(noCard).appendTo($(".cards"));
                    return false
				}
                for(var i=0;i<data.data.length;i++){
                    /**
					 * 优惠券分类
					 * 1.普通优惠券 && 首次登陆赠送优惠券
					 * 3.顺丰优惠券
                     */

                	var couponType=data.data[i].coupon.couponType;
                	var couponName;
                	if(couponType==1){
                        couponName="全品类优惠券";
					}else if(couponType==3){
                		couponName="活动专享";
					}else{
                        couponName="全品类优惠券";
					}
					var item='<li>' +
								'<div class="card-txt">' +
									'<div class="card-line" style="margin-bottom: 0.15rem;">' +
										'<p class="card-tit">'+data.data[i].coupon.discountNum+'元洗衣券</p>'+
										'<p>（消费满'+data.data[i].coupon.contentNum+'元使用）</p>'+
									'</div>'+
									'<div class="card-line">' +
										'<p class="card-size">面额： <span>'+data.data[i].coupon.discountNum+'</span>元</p>'+
                        				'<p class="card-area">适用范围：<span>'+couponName+'</span></p>'+
									'</div>'+
 								'</div>' +
								'<div class="card-icon"></div>'+
							'</li>';
                    // var item='<li>'+
                    //     '<div class="card-txt">'+
                    //     '<p class="txt-tit"><span>'+data.data[i].coupon.discountNum+'</span>元洗衣券 <span>(消费满<span>'+data.data[i].coupon.contentNum+'</span>元使用)</span><span style="display:inline-block;margin-left:0.2rem;">X '+data.data[i].couponCount+'</span></p>'+
                    //     '<p class="txt-con">面额： <span>'+data.data[i].coupon.discountNum+'</span>元</p>'+
                    //     '<p class="txt-con">适用范围：<span>'+couponName+'</span></p>'+
                    //     '</div>'+
                    //     '<div class="card-icon"></div>'+
                    //     '</li>';
                    $(item).appendTo($(".cards"));
                }
			}
		}
	})
}

//获取该用户的总积分
function getCouponNum(userId){
	$.ajax({
		url:globalUrl+"/userintegral/getUserIntegralByUserId",
		type:'post',
		data:{userId:userId},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
			$("#coupon").html(data.fraction);
		}
	})
}
//兑换优惠券
function exchange(couponId){
	$.ajax({
		url:globalUrl+"/userintegral/paymentIntegral",
		type:'post',
		data:{
			couponId:couponId
		},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
			mui.alert(data.msg);
			getCouponNum($.cookie("userId"));
            window.location.reload();
		}
	})
}
var count=1;
function pullupRefresh1(){
	setTimeout(function(){
		$.ajax({
			contentType:'application/json;charset=UTF-8',
			url:globalUrl+'/userintegral/getIntegralDetailPageByUserId',
			type:'post',
			data:JSON.stringify({page:count,scope:$.cookie("userId")}),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", $.cookie("token"));
            },
            crossDomain: true,
			success:function(data){
				console.log(data);
				mui('#con1').pullRefresh().endPullupToRefresh((++count>data.navigatepageNums.length));
				var recordName;
                var recordType;
				for(var i=0;i<data.list.length;i++){
					if(data.list[i].type=="PAY"){
                        recordName="兑换优惠券";
                        recordType="-";
					}else if(data.list[i].type=="INCOME"){
                        recordName="消费奖励";
                        recordType="+";
					}else if(data.list[i].type=="PROMO"){
                        recordName="推广用户";
                        recordType="+";
					}
                    // var recordName=data.list[i].type=="PAY"?"兑换优惠券":"消费积分";
					// var recordType=data.list[i].type=="PAY"?"-":"+";
					var trList='<tr>'+
	//							'<td>'+i+1+'</td>'+
								'<td>'+recordName+'</td>'+
								'<td>'+recordType+data.list[i].integral+'</td>'+
								'<td>'+timestampToTime(data.list[i].createTime)+'</td>'+
							'</tr>';
					$(trList).appendTo($("tbody"));		
				}
			}
		})
	},500)
	
}
