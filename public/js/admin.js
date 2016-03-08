$(function(){
	$(".del").on("click",function(){
		var _this=$(this),id=_this.attr("data-id"),tr=_this.closest("tr");
		$.ajax({
			type:'DELETE',
			url:'/admin/list?id='+id
		}).done(function(results){
			if(results.success==1){
				tr.remove();
			}
		})
	})
})