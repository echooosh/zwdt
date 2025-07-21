var mapType = {
	nb: 0,
	baidu: 1,
	amap: 2,
	qq: 3
};

var mapMode = {
	debug: 0,
	demo: 1,
	release: 2
}

//当前点位提示层
var myCompOverlay = null;
var polyline = null;
//点位数据
var datas = [];
//业务数据
var works = [];


//当前选中点位信息
var currIdx = "";
var currpoint = null;
//当前相册数组
var filePhoto = [];
//Lbs定位macker对象
var myDistance = null;
//Lbs定位坐标
var myPoint = null;
//距离路程
var describeStr = "";
//我的位置
var myValue = "";
//坐标点读取的索引
var mod = 0;