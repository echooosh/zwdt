var id;
var type;
var siteKey;

function onload() {


	var Requests = new Object();
	Requests = GetRequest();
	id = Requests["id"];
	siteKey = Requests["siteKey"];



	$.ajaxSetup({
		headers: {
			'X-Tenant-Id': siteKey
		}
	});
	//获取大厅信息
	$.ajax({
		url: getAjaxUrl(getOrg, id),
		method: "get",
		async: false,
		success: function(res) {
			//console.log(res);
			if (res.success) {
				var item = res.result;


				startLon = item.lng;
				startLat = item.lat;

				endLon = item.lng;
				endLat = item.lat;

				$('#title').val(item.name);
				$('#address').val(item.hallAddress);
				$('#tel').val(item.hallTel);
				//$('#duty').val(item.hallDesc);
				$("#location").val(item.lng + "," + item.lat);


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
	form.verify({
		//要求 每个复选框元素要互为兄弟元素
		otherReq_ck: function(value, item) {
			var $ = layui.$;
			//查找父元素
			var parent = $(item).parent()
			//获取勾选的个数
			var len = parent.find("input:checked").length;
			//限定格式,可自定义修改
			if (len < 1) {
				var focusElem = parent.find(".layui-unselect.layui-form-checkbox");
				//定位焦点
				focusElem.css({
					"border": "solid 1px rgb(255, 87, 34)",
					"box-sizing": "content-box"
				});
				//对非输入框设置焦点
				focusElem.first().attr("tabIndex", "1").css("outline", "0").blur(function() {
					focusElem.css({
						"border": "",
						"box-sizing": "border-box"
					});
				}).focus();
				return '至少选择1项纠错类型';
			}
			else{
				//用此字段存储纠错类型
				var arr_box = [];
				$('input[type=checkbox]:checked').each(function() {
					arr_box.push($(this).val());
				});
				$('#duty').val(arr_box.join('，'));
				//临时处理联系人
				$('#postCode').val($('#contact').val());
			}
		}
	});
	//提交事件
	form.on('submit(btnSubmit)', function(data) {


		$.ajax({
			type: "POST",
			url: getAjaxOnLineUrl(jiucuo),
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(data.field),
			success: function(res) {

				var field = data.field; // 获取表单字段值
 
				
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