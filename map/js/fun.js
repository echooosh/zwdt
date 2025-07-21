//替换占位符
String.prototype.format = function(id) {
	let r = this;
	//r = r.replace(new RegExp("{date}","g"), formatDateTime(new Date()));
	r = r.replace(new RegExp("{id}", "g"), id);
	return r;
};

//判断字数较多时添加回车换行
function addBR(html) {
	if (!html || html.trim().length == 0) {
		html = "无";
	}
	if (html.length > 0) {
		html = "\n" + html;
	} else {
		html = html.replace(/[\r\n]/g, " "); //去掉回车换行
	}
	return html;
}

//转换空值
String.prototype.clearNULL = function(word) {
	let r = this;
	return r ? r : word;
};

//给文本中网址和电话号码接增加链接
function filterUrl(html) {
	html = addBR(html);
	var regex = /((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/g;

	//链接可点击
	//html = html.replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g,
	html = html.replace(regex,
		"<a class='url' target='_bank' href='$&'>$&</a>");
	regex = /((\(\d{3,4}\) ?)|(\d{3,4}-))?\d{3,4}-\d{7,8}/g;
	html = html.replace(regex, "<a target='_bank' href=\"tel:$&\">$&</a>");
	return html;
}

//转换文字
function filterText(html) {
	html = addBR(html);
	html = html.replace("线上办理", "网上办理");
	return html;
}


//给文本中网址接增加链接
function filterMore(html) {
	html = addBR(html);
	//链接可点击
	return html.replace(
		/((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/g,
		"<a class='url' target='_bank' href='$1$2'>$1$2</a>");
}

//文字溢出隐藏
function splitText1(text, width, clamp) { //text：所需显示的文字； width:每行的长度；clamp:行数；
	var copyText = "",
		index, flag = false;
	text = text.replace(/\ +/g, ""); //去掉空格
	text = text.replace(/[ ]/g, ""); //去掉空格
	text = text.replace(/[\r\n]/g, ""); //去掉回车换行
	for (var i = 0; i < text.length; i++) {
		copyText += text[i];
		var copySpan = document.createElement("span");
		copySpan.innerText = copyText + '...';;
		$(copySpan).hide().css({
			'position': 'absolute',
			'width': 'auto',
			'overflow': 'visible',
			'font-size': '14px',
			//'letter-spacing':'.3px'
		});
		$("body").after(copySpan);
		var wth = $(copySpan).width();
		removeElement(copySpan);
		if (wth > width * clamp) {
			index = i;
			flag = true;
			break;
		}

	}
	text = addBR(text);
	return flag ? text.substring(0, i) + '...<a title="' + text + '" class="icon-map" onclick="changeTxt(true,' +
		width + ',' + clamp + ')">展开</a>' : text;
}
//文字溢出隐藏 展开
function splitText(text, count) { //text：所需显示的文字；count:字数；

	//判断是否含有图片
	if (text.indexOf('<img ') == -1) {
		text = text ? text : "无";
		var copyText = text;
		var flag = false;
		text = text.replace(/\ +/g, ""); //去掉空格
		text = text.replace(/[ ]/g, ""); //去掉空格
		text = text.replace(/[\r\n]/g, ""); //去掉回车换行

		if (text.length > count) {
			flag = true;
		} else {
			copyText = addBR(copyText);
		}
		text = addBR(text);
		return flag ? text.substring(0, count) + '...<a title="' + copyText +
			'" class="icon-map cursor" onclick="changeTxt(true,this,' +
			count + ')">展开</a>' : copyText;
	} else {
		var id = Math.random().toString().split('.')[1];
		return "<a class='url cursor'  onclick='showText(\"" + id + "\")'>点击查看</a><div id='" + id + "' style='display:none'><div style='margin:20px'>" + text + "</div></div>";
	}
}

function showText(id) {
	currIdx = layer.open({
		type: 1,
		title: false,
		closeBtn: 1,
		shadeClose: true,
		area: ["auto", "80%"],
		skin: '',
		content: $("#" + id).html()
	});
}

//文字溢出隐藏 展开
function splitTextNoEnter(text, count) { //text：所需显示的文字；count:字数；
	text = text ? text : "无";
	var copyText = text;
	var flag = false;
	text = text.replace(/\ +/g, ""); //去掉空格
	text = text.replace(/[ ]/g, ""); //去掉空格
	text = text.replace(/[\r\n]/g, ""); //去掉回车换行

	if (text.length > count) {
		flag = true;
	}
	return flag ? text.substring(0, count) + '...<a title="' + copyText +
		'" class="icon-map cursor" onclick="changeTxtNoEnter(true,this,' +
		count + ')">展开</a>' : copyText;
}


//文字溢出隐藏
function removeElement(_element) { //删除处理元素(兼容各个浏览器)
	var _parentElement = _element.parentNode;
	if (_parentElement) {
		_parentElement.removeChild(_element);
	}
}

//文字溢出隐藏 收起
function changeTxt(isShow, e, count) {
	var text = $(e).attr("title");
	//console.log(text);
	if (!isShow) {
		text = splitText(text, count);
	} else {
		text += '<a title="' + text + '" class="icon-map cursor" onclick="changeTxt(false,this,' + count + ')">收起</a>';
		text = addBR(text);
	}
	$(e).parent().html(text);
}

//文字溢出隐藏 收起
function changeTxtNoEnter(isShow, e, count) {
	var text = $(e).attr("title");
	//console.log(text);
	if (!isShow) {
		text = splitTextNoEnter(text, count);
	} else {
		text += '<a title="' + text + '" class="icon-map cursor" onclick="changeTxtNoEnter(false,this,' + count +
			')">收起</a>';
	}
	$(e).parent().html(text);
}


// 格式化日期：yyyy-MM-dd
function formatDateTime(date) {
	const year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	if (month < 10) {
		month = "0" + month.toString();
	}
	if (day < 10) {
		day = "0" + day.toString();
	}
	return year.toString() + month.toString() + day.toString();
}

//将秒数转换为时分秒格式
function formatSeconds(value) {

	var theTime = parseInt(value); // 秒
	var middle = 0; // 分
	var hour = 0; // 小时

	if (theTime > 60) {
		middle = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		if (middle > 60) {
			hour = parseInt(middle / 60);
			middle = parseInt(middle % 60);
		}
	}
	var result = "" + parseInt(theTime) + "秒";
	if (middle > 0) {
		result = "" + (parseInt(middle) + 1) + "分钟";
	} else {
		result = "1分钟";
	}
	if (hour > 0) {
		result = "" + parseInt(hour) + "小时" + result;
	}
	return result;
}

function isOnline(str) {
	return str.indexOf("线上办理") > -1;
}

function isOffline(str) {
	return str.indexOf("窗口办理") > -1;
}




/**
 * 返回两个经纬度之间的距离
 * @param  {string} lat1    起点纬度
 * @param  {string} lng1    起点经度
 * @param  {string} lat2    终点纬度
 * @param  {string} lng2    终点经度
 * @return {string}         返回两个经纬度之间的距离
 */

function getDistance(lat1, lng1, lat2, lng2) {
	function e(lat1, lng1, lat2, lng2) {
		lat1 = (lat1 * f) / 180;
		lat2 = (lat2 * f) / 180;
		lng1 =
			2 *
			Math.asin(
				Math.sqrt(
					Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
					Math.cos(lat1) *
					Math.cos(lat2) *
					Math.pow(Math.sin(((lng1 * f) / 180 - (lng2 * f) / 180) / 2), 2)
				)
			);
		return (lng1 = Math.round(6378137 * lng1));
	}
	let f = Math.PI;
	return 1e3 < e(lat1, lng1, lat2, lng2) ? Math.round(e(lat1, lng1, lat2, lng2)) : e(lat1, lng1, lat2, lng2);
}
/**
 * 百度地图经纬度转为腾讯地图经纬度
 * @param {Number} lat
 * @param {Number} lng
 * @returns
 */
function bdMapToTxMap(lat, lng) {
	let pi = (3.14159265358979324 * 3000.0) / 180.0;
	let x = lng - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
	lng = z * Math.cos(theta);
	lat = z * Math.sin(theta);
	return {
		lng: lng,
		lat: lat
	};
}
/**
 * 腾讯地图转百度地图经纬度
 * @param {Number} lat
 * @param {Number} lng
 * @returns
 */
function txMapToBdMap(lng, lat) {
	let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
	let x = lng;
	let y = lat;
	let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
	let lngs = z * Math.cos(theta) + 0.0065;
	let lats = z * Math.sin(theta) + 0.006;

	return {
		lng: lngs,
		lat: lats,
	};
}


// 将百度地图经纬度转换为腾讯地图经纬度        
function bMapTransQQMap(lng, lat) {
	let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	let x = lng - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	let lngs = z * Math.cos(theta);
	let lats = z * Math.sin(theta);
	return lats + "," + lngs;

}

// 将百度地图经纬度转换为高德地图经纬度        
function bMapTransGMap(lng, lat) {
	let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	let x = lng - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	let lngs = z * Math.cos(theta);
	let lats = z * Math.sin(theta);
	return lngs + "," + lats;

}

//将腾讯/高德地图经纬度转换为百度地图经纬度
function qqMapTransBMap(lng, lat) {
	let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	let x = lng;
	let y = lat;
	let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
	let lngs = z * Math.cos(theta) + 0.0065;
	let lats = z * Math.sin(theta) + 0.006;

	return {
		lng: lngs,
		lat: lats
	}
}

//将百度坐标转火星坐标：bd09II=>gcj02
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

function baiduTomars(baidu_point) {
	var mars_point = {
		lat: 0,
		lng: 0,
	};
	var x = baidu_point.lng - 0.0065;
	var y = baidu_point.lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	mars_point.lat = z * Math.sin(theta);
	mars_point.lng = z * Math.cos(theta);
	return mars_point;
}

//火星坐标系GCJ02转地球坐标系WGS84
var PI = 3.14159265358979324;

function transformGCJ2WGS(gc_point) {
	var gcjLat = gc_point.lat;
	var gcjLng = gc_point.lng;
	let d = delta(gcjLat, gcjLng)
	return {
		'lat': gcjLat - d.lat,
		'lng': gcjLng - d.lng
	}
}

function delta(lat, lng) {
	let a = 6378245.0
	let ee = 0.00669342162296594323
	let dLat = transformLat(lng - 105.0, lat - 35.0)
	let dLng = transformLng(lng - 105.0, lat - 35.0)
	let radLat = lat / 180.0 * PI
	let magic = Math.sin(radLat)
	magic = 1 - ee * magic * magic
	let sqrtMagic = Math.sqrt(magic)
	dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
	dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
	return {
		'lat': dLat,
		'lng': dLng
	}
}

function transformLat(x, y) {
	let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
	ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
	ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
	ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
	return ret
}

function transformLng(x, y) {
	let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
	ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
	ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
	ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
	return ret
}



//百度地图坐标转天地图坐标的方式： 1， 首先把百度坐标转成火星坐标； 2， 把火星坐标GCJ02转地球坐标系WGS84； 3， 在天地图上展示WGS84坐标。
// var bpoint = {
// 	lng: 113.64964385,
// 	lat: 34.7566100641
// }; //这是百度坐标
// var obj = transformGCJ2WGS(baiduTomars(bpoint)); //调用二次转换函数
// var xx = obj.lat; //获取转换后的WGS84坐标
// var yy = obj.lng;
// console.log(obj.lat);
// console.log(obj.lng);



// 将百度地图经纬度转换为天地图地图经纬度    
function bMapTransTianMap(lng, lat) {
	var bpoint = {
		lng: lng,
		lat: lat
	};
	var obj = transformGCJ2WGS(baiduTomars(bpoint)); //调用二次转换函数
	return {
		lng: obj.lng,
		lat: obj.lat,
	};
}

//坐标数组排序
function sortList(data, Point) {
	if (Point) {
		$.each(data, function(i, item) {
			data[i].distance = getDistance(Point.lat, Point.lng, item.lat, item.lng);
		});
		//根据距离（distance）排序
		function sortdistance(a, b) {
			return a.distance - b.distance
		}
		//利用js中的sort方法
		data.sort(sortdistance);
	}
	return data;

}

//米转千米
function changeKM(m) {
	if (m) {
		if (m < 1000) {
			return m + "m";
		} else if (m < 10000) {
			return (m / 1000).toFixed(2) + "km";
		} else if (m < 100000) {
			return (m / 1000).toFixed(1) + "km";
		} else {
			return (m / 1000).toFixed(0) + "km";
		}
	} else {
		return "";
	}
}

//判断是否手机
function isMobile() {
	var userAgentInfo = navigator.userAgent;

	var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

	var mobile_flag = false;

	//根据userAgent判断是否是手机
	for (var v = 0; v < mobileAgents.length; v++) {
		if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
			mobile_flag = true;
			break;
		}
	}

	var screen_width = window.screen.width;
	var screen_height = window.screen.height;

	//根据屏幕分辨率判断是否是手机
	if (screen_width <= 640 && screen_height <= 800) {
		mobile_flag = true;
	}

	return mobile_flag;
}

var GetRequest = function() {
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] =
				unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/*
 *  根据某个字段实现对json数组的排序
 * @param   array  要排序的json数组对象
 * @param   field  排序字段（此参数必须为字符串）
 * @param   reverse 是否倒序（默认为false）
 * @return  array  返回排序后的json数组
 */
function jsonSort(array, field, reverse) {
	// 数组长度小于2 或 没有指定排序字段 或 不是json格式数据
	if (array.length < 2 || !field || typeof array[0] !== "object") return array;
	// 数字类型排序
	if (typeof array[0][field] === "number") {
		array.sort(function(x, y) {
			return x[field] - y[field]
		});
	}
	// 字符串类型排序
	if (typeof array[0][field] === "string") {
		array.sort(function(x, y) {
			return x[field].localeCompare(y[field])
		});
	}
	// 判断是否需要倒序
	if (reverse) {
		array.reverse();
	}
	return array;
}


/*
var treeNodeList = [{

		"name": "一级A",

		"children": [{

			"name": "一级-1",

			"children": [{

				"name": "一级-1-1",

				"children": [{

						"name": "一级-1-1-1",

						"type": "true",

					},

					{

						"name": "一级-1-1-3",

						"type": "true",

					}

				]

			}]

		}]

	},

	{

		"name": "二级B",

		"children": [{

			"name": "二级-1",

			"children": [{

				"name": "二级-2-2",

				"children": [{

						"name": "二级-2-2-2",

						"type": "true",

					},

					{

						"name": "二级-2-2-1",

						"type": "true",

					}

				]

			}]

		}]

	},

	{

		"name": "三级C",

		"children": [{

			"name": "三级-1",

			"children": [{

				"name": "三级-3-1",

				"children": [{

						"name": "三级-3-3-1A",

						"type": "true",

					},

					{

						"name": "三级-3-3-2",

						"type": "true",

					}

				]

			}]

		}]

	}

]


//多级树过滤
var filterObj = function(item) {
	if (item.name.indexOf(query) > -1) return true;
	if (item.hasOwnProperty("children")) {
		item.children = item.children.filter(function(child) {
			if (child.hasOwnProperty("type")) {
				return child.name.indexOf(query) > -1;
			} else if (child.hasOwnProperty("children")) {
				return filterObj(child);
			}
		})
		if (item.children.length > 0) {
			return true;
		}
	} else {
		return child.name.indexOf(query) > -1;
	}
}
var query = '3-3';
var filter = treeNodeList.filter(function(item) {

	return filterObj(item);

});

*/

//console.log(JSON.stringify(filter));
//console.log(filter);






//转换常数
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var pi = 3.14159265358979324;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function transforMLon(x, y) {
	var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
	ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
	return ret;
};

function transformLat(x, y) {
	var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
	ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
	return ret;
}

function outOfchina(lat, lon) {
	if (lon < 72.004 || lon > 137.8347)
		return true;
	if (lat < 0.8293 || lat > 55.8271)
		return true;
	return false;
}

/*
 * WGS-84：是国际标准，GPS坐标（GOOGLE Earth使用、或者GPS模块、天地图）
 * GCJ-02：中国坐标偏移标准，Google Map、高德、腾讯使用
 * BD-09：百度坐标偏移标准，Baidu Map使用
 */

/**
 * wgLat 纬度
 * wgLon 经度
 * WGS-84 到 GCJ-02 的转换（即 GPS 加偏）
 * 天地图 转 高德、腾讯
 * */
function wgs_gcj_encrypts(wgLat, wgLon) {
	var point = {};
	if (outOfChina(wgLat, wgLon)) {
		point.lat = wgLat;
		point.lng = wgLon;
		return point;
	}
	var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
	var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
	var radLat = wgLat / 180.0 * pi;
	var magic = Math.sin(radLat);
	magic = 1 - ee * magic * magic;
	var sqrtMagic = Math.sqrt(magic);
	dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
	dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
	var lat = wgLat + dLat;
	var lon = wgLon + dLon;
	point.lat = lat;
	point.lon = lon;
	return point;
};


/**
 * wgLat 纬度
 * wgLon 经度
 * BD-09转换GCJ-02
 * 百度 转 高德、腾讯、google
 * */
function bd_google_encrypt(bd_lat, bd_lon) {
	var point = {};
	var x = bd_lon - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	var gg_lon = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	point.lat = gg_lat;
	point.lon = gg_lon;
	return point;
};


/**
 * gg_lat 纬度
 * gg_lon 经度
 * GCJ-02转换BD-09
 * 高德、腾讯、Google 转 百度
 * */
function google_bd_encrypt(gg_lat, gg_lon) {
	var point = {};
	var x = gg_lon;
	var y = gg_lat;
	var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
	var bd_lon = z * Math.cos(theta) + 0.0065;
	var bd_lat = z * Math.sin(theta) + 0.006;
	point.lat = bd_lat;
	point.lon = bd_lon;
	return point;
};