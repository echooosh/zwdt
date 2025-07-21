var name;
var type;
var siteKey;

function onload() {


	var Requests = new Object();
	Requests = GetRequest();
	id = Requests["id"];
	siteKey = Requests["siteKey"];
	//var siteKey = $(window.parent.document).find('#siteKey').val();

	$.ajaxSetup({
		headers: {
			'X-Tenant-Id': siteKey
		}
	}); 
	//获取服务信息
	$.ajax({
		url: getAjaxUrl(getWork, id),
		method: "get",
		async: false,
		success: function(res) {
			//console.log(res);
			if (res.success) {
				var item = res.result;
				$('#title').val(item.name);
			} else {
				layer.msg("读取错误！");
			}
		},
		error: function() {
			layer.msg("调用出错");
		}
	});

}

layui.use(['form'], function() {
	var form = layui.form;
	//提交事件
	form.on('submit(btnSubmit)', function(data) {
		var reContent =
			`===服务数据纠错修改建议如下:===\n纠错内容:\n${$("#newcontent").val()};\n纠错人联系方式:${$("#contact").val()}`;
		data.field.content = reContent;
		$.ajax({
			type: "POST",
			url: getAjaxOnLineUrl(jiucuo),
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(data.field),
			success: function(res) {
				//console.log(res); 
				if (res.success) {
					window.parent.layer.closeAll('iframe');
					window.parent.layer.msg("提交成功,感谢您的反馈!");
				} else {
					getNewCode();
					layer.msg(res.message);
				}
			},
			error: function() {
				layer.msg("调用出错");
			}
		});

		return false;
	});
});
