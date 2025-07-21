
var img = new Image();


$("#captcha").one("focus", function() {
	getNewCode(); //获取验证码
}).keypress(function(e) {
	var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
	if (keyCode == 13) {
		$("#btnSubmit").trigger("click");
	}
});

function getNewCode() {
	var math = new Date().getTime();
	$("#checkKey").val(math);
	$.ajax({
		url: getAjaxOnLineUrl(getCode, math),
		method: "get",
		async: true,
		success: function(res) {
			//console.log(res);
			if (res.success) {
				img.src = res.result;
				$(img).appendTo("#rcode")
			} else {
				layer.msg(res.message);
			}
		},
		error: function() {
			layer.msg("调用出错");
		}
	});
}
