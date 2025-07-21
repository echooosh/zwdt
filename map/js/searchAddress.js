// 百度地图API功能
function G(id) {
	return document.getElementById(id);
}

var myMarker;
var siteKey;
var myPoint;
var localsearch;
var infoWin;
var searchObj;

function loadSearchAddress() {
	var Requests = new Object();
	Requests = GetRequest();
	siteKey = Requests["siteKey"];

	var map = new T.Map('map-container', {
		projection: 'EPSG:4326'
	});
	window.map = map; // 将map变量存储在全局
	map.centerAndZoom(siteInfo[siteKey].point, siteInfo[siteKey].zoom);
	//允许鼠标滚轮缩放地图
	map.enableScrollWheelZoom();
	//创建比例尺控件对象
	var scale = new T.Control.Scale();
	//添加比例尺控件
	map.addControl(scale);
	//创建缩放平移控件对象
	control = new T.Control.Zoom();
	//添加缩放平移控件
	map.addControl(control);


	var config = {
		pageCapacity: 20, //每页显示的数量
		onSearchComplete: localSearchResult //接收数据的回调函数
	};
	//创建搜索对象
	localsearch = new T.LocalSearch(map, config);
	$("#suggestId").keyup(function() {
		localsearch.search(document.getElementById('suggestId').value, 1)
	});

}


function localSearchResult(result) {
	//清空地图及搜索列表
	clearAll();

	//解析建议词信息
	suggests(result.getPois());
}

//解析建议词信息
function suggests(obj) {
	if (obj) {
		searchObj = obj;
		//console.log(searchObj);
		//建议词提示，如果搜索类型为公交规划建议词或公交站搜索时，返回结果为公交信息的建议词。
		var suggestsHtml = "<div style='margin-left:8px;'>请选择下面地址:</div><ul>";
		for (var i = 0; i < obj.length; i++) {
			suggestsHtml += "<li style='color:#000;cursor: pointer;margin-left: 5px;' onclick ='setAddress(" + i +
				")' >" + obj[i].name +
				":&nbsp;&nbsp;<font style='color:#666666;cursor: pointer;'>" + obj[i].address + "</font></li>";
		}
		suggestsHtml += "</ul>";
		document.getElementById("searchResultPanel").style.display = "block";
		document.getElementById("searchResultPanel").innerHTML = suggestsHtml;
	}
}

function setAddress(i) {
	if (searchObj) {
		var item = searchObj[i];
		var lonlat = item.lonlat;
		var lng = lonlat.split(",")[0];
		var lat = lonlat.split(",")[1];

		console.log(lonlat);

		console.log(lng);

		console.log(lat);

		//创建图片对象
		var icon = new T.Icon({
			iconUrl: "resource/marker/my.png",
			iconSize: new T.Point(30, 34),
			iconAnchor: new T.Point(15, 24)
		});

		myPoint = T.LngLat(lng, lat);
		myMarker = new T.Marker(myPoint, {
			icon: icon,
			title: item.name,
			address: item.address,
			hashCode: item.hotPointID
		});




		window.parent.myValue = "起始位置：" + item.name + "<br>地址：" + item.address;
		document.getElementById('address').innerHTML = item.name + "&nbsp;[&nbsp;地址:" + item.address + "&nbsp;]&nbsp;";
		document.getElementById('suggestId').value = item.address;

		clearAll();
		map.clearOverLays();

		console.log(myMarker);

		// 将地址解析结果显示在地图上，并调整地图视野
		if (myMarker) {
			map.addOverLay(myMarker);
			map.centerAndZoom(myPoint, siteInfo[siteKey].zoom);
		} else {
			layer.tips('您选择的地址没有解析到结果！<br>请重新输入地址', "#suggestId", {
				tips: [1, '#0D4D8B'],
				time: 4000
			});
		}

	}

}


//清空地图及搜索列表
function clearAll() {
	document.getElementById("searchResultPanel").innerHTML = "";
	document.getElementById("searchResultPanel").style.display = "none";
}


function addPoint(point) {
	var opts = {
		offset: new BMap.Size(15, -15) //设置文本偏移量
	}
	var labelStr = "我的位置(可拖拽修改)";
	myPoint = point;
	var markerIcon = new BMap.Icon("resource/marker/my.png", new BMap.Size(67, 73));
	if (myMarker) {
		map.removeOverlay(myMarker);
	}
	myMarker = new BMap.Marker(point);
	myMarker.enableDragging();
	myMarker.setIcon(markerIcon);
	myMarker.setTop(true);
	myMarker.setOffset(new BMap.Size(0, -10));
	var endlabel = new BMap.Label(labelStr, opts); // 创建文本标注对象
	myMarker.setLabel(endlabel);
	map.addOverlay(myMarker);


	map.centerAndZoom(point, 17);

	myMarker.addEventListener("dragend", function() {
		setChageLnlat();
	});
}

function setChageLnlat() {
	var gc = new BMap.Geocoder(); //用所定位的经纬度查找所在地省市街道等信息
	var p = myMarker.getPosition();
	//console.log(p);
	gc.getLocation(p, function(rs) {
		if (rs.address) {
			$('#suggestId').val(rs.address);
			myPoint = p;
		}
	});
}

function setLocal() {
	if (myPoint) {
		window.parent.layer.closeAll('iframe');
		window.parent.layer.msg("设置成功!");
		window.parent.setMyDistance(myPoint);
	} else {
		layer.tips('请重新输入地址！', "#suggestId", {
			tips: [1, '#0D4D8B'],
			time: 3000
		});
	}
}

function closeLocal() {
	window.parent.layer.closeAll('iframe');
}




//初始化加载方法
$(document).ready(function() {
	if (!isMobile()) {
		$("#map-container").height(320);
	}
	loadSearchAddress();

	layer.tips('请输入您的起点地址关键字', "#suggestId", {
		tips: [3, '#0D4D8B'],
		time: 5000
	});
});