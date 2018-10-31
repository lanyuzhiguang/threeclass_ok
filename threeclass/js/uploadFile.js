//$(function() {
	var subscription;
	var fileId = "",
		name = "",
		size = 0,
		fileUrl = "";
		var num = 0;	
	function fileChange(_this, ftype, isPrivate,fsize) {
		var addlist = $(_this).attr("add");
		name = _this.files[0].name;
		var f = _this.files[0];
		if(_this.files[0].type.indexOf(ftype) == -1) {
			layer.open({
			  	title: '提示',
			  	content: '文件格式不符合要求！'
			});
		} else if (_this.files[0].size > fsize) {
			layer.open({
			  	title: '提示',
			  	content: '文件过大！'
			});
		} else {
			$.ajax({
				type:"get",
				url:_ctxPath+'back/super/file/upToken.do',
				data:{
					isPrivate: isPrivate,
					fileName: name
				},
				xhrFields: {				
		            withCredentials: true	
		        },							
		        crossDomain: true,
				success:function(data) {
					var observable = qiniu.upload(f, data.key, data.token);
					observable.subscribe({
						complete: function(res) {
							var d = [];
							if(data.url)
								d.push(data.key + '~' + data.url);
							else
								d.push(data.key);
							d = {
								data: d,
								success: true
							};
							fileId = res.key;
//							toastr.success("上传成功！");
							
							
							if (isPrivate === false) {
								fileUrl = _qiniuImageHost + fileId;
					        		if ($(addlist)) {
					        			num++;
										if(num==9){
											$(addlist).find(".fileImg").remove();
										}
					        		$(addlist).append('<div class="imgItem" ><span class="del"><img src="img/cha.png"></span><img  class="needimg" src="' + fileUrl + '" goimgup="' + fileId + '"></div>');
					        		
					        		$(".del").off("click").on("click",function(){
					        			$(this).parent().remove();
					        			num--
					        			if (num==8) {
					        				$(addlist).find(".fileImg").remove();
					        				$(addlist).prepend(fileImg)
					        			}
					        		})
					        	}
					        	
							} else{
								$.ajax({
									type:"get",
									url:_ctxPath+'back/super/file/fileUrl.do',
									data:{
										"fileId": fileId
									},
									xhrFields: {				
							            withCredentials: true	
							        },							
							        crossDomain: true,
							        success:function(datau){
								        	fileUrl = datau;
								        	if ($(addlist)) {
								        		num++;
											if(num==9){
												$(addlist).find(".fileImg").remove();
											}
								        	$(addlist).append('<div class="imgItem" ><span class="del"><img src="img/cha.png"></span><img  class="needimg" src="' + fileUrl + '" goimgup="' + fileId + '"></div>');
									        $(".del").off("click").on("click",function(){
							        			$(this).parent().remove();
							        			num--
							        			if (num==8) {
							        				$(".fileImg").remove();
							        				$(addlist).prepend(fileImg)
							        			}
							        		})
								    	}
									}
								});
							}
						},
						next: function(res) {
							size = res.total.size;
	//						console.log("文件大小（七牛）：" + res.total.size);
						},
						error: function(err) {
							toastr.success("上传失败:" + err.message);
						}
					})
				}
			});
		}
	}
	function fileFUN(_this,isPrivate,fsize) {
		var addlist = $(_this).attr("add");
		var item =$(funjianitem).clone().css("display","");
		$(addlist).append(item);
		name = _this.files[0].name;
		var f = _this.files[0];
		if (_this.files[0].size > fsize) {
			layer.open({
			  	title: '提示',
			  	content: '文件过大！'
			});
		} else {
			$.ajax({
				type:"get",
				url:_ctxPath+'back/super/file/upToken.do',
				data:{
					isPrivate: isPrivate,
					fileName: name
				},
				xhrFields: {				
		            withCredentials: true	
		        },							
		        crossDomain: true,
				success:function(data) {
					fileId = data.key;
					var observable = qiniu.upload(f, data.key, data.token);
					subscription = observable.subscribe({
						complete: function(res) {
							if (isPrivate === false) {
								fileUrl = _qiniuImageHost+fileId;
					        		if ($(addlist)) {
							        		item.find(".ahref").attr("href",fileUrl);
							        		item.find(".ahref").attr("download",name);
							        		item.find(".filename").text(name);
							        		item.find(".filename").attr("flieid",fileId);		
					        	}	
							} else{
								$.ajax({
									type:"get",
									url:_ctxPath+'back/super/file/fileUrl.do',
									data:{
										"fileId": fileId
									},
									xhrFields: {				
							            withCredentials: true	
							        },							
							        crossDomain: true,
							        success:function(url){
										fileId = data.key;
										toastr.success("上传成功！");
							        	if ($(addlist)) {
							        		item.find(".ahref").css("color","#5A5A5A");
											item.find(".ahref").attr("href",url);
							        		item.find(".filename").attr("flieid",fileId);
							        	}
							        }
								});
							}
							$(".progress").remove();
							$(".canlefile").remove();
						},
						next: function(res) {
							item.find(".ahref").attr("download",name);
							item.find(".filename").text(name);
							$(".progressSon").css("width", res.total.percent + "%");
							$(".progressSon").text(parseInt(res.total.percent) + "%");
							size = res.total.size;
						},
						error: function(err) {
							toastr.success("上传失败:" + err.message);
						}
					})
				}
			});
		}
	}
  function cancleupf (that){
	this.subscription.unsubscribe();
	alert($(that).parent().html())
    $(that).parent().remove()
  }
