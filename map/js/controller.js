/************************************************/

//接口模式  offline：0 --- online：1
var	mode = 1;
var host = "";
//海量点模式(建议1万点以上开启)
var bigPoint = false; //是否聚合

//坐标类型是否需要转换
//百度：true --- 天地图：false
var pointType = true;

if (document.location.hostname.indexOf("customs.gov.cn") > 0) {
	var mode = 0;
	var host = "";
} else if (document.location.hostname.indexOf("govmap.") >= 0 || document.location.hostname.indexOf("mapgov.cn") >= 0) {
	var host = "";
}

var api = ["data", host + "/govmap-system/"];
var filePath = ["data/", host + "/govmap-system/sys/common/static/"];
//网点信息
var getOrg = ["/location/{id}.json", "govmap/appHall/frontQueryById?id={id}"];
// 公告信息
var getNotice = ["/matter/hotList.json", "govmap/appRelatedNotice/list?id={id}"]
//网点列表
var getOrgList = ["/location/orgList.json", "govmap/appOrg/frontPageList?pid=1593069623254011905"];
//网点查询列表
var searchOrgList = ["/location/search.json", "govmap/appHall/frontQueryByIndex?keyword={id}"];
//办事信息
var getWork = ["/matter/{id}.json", "govmap/appItem/frontQueryById?id={id}"];
//办事信息
var getWorkList = ["/matter/cateList.json", "govmap/appCate/frontPageList?pid=0"];
//业务查询列表
var searchWorkList = ["/matter/search.json", "govmap/appItem/frontQueryByIndex?keyword={id}"];
//获取热点业务
var getQueryHotList = ["/matter/hotList.json", "govmap/appItem/frontQueryHotList"];
//获取热点业务
var getQueryOnlineList = ["/matter/onlineList.json", "govmap/appItem/frontQueryOnlineList"];
//纠错
var jiucuo = ["", "govmap/appAdvise/frontAdd"];
//验证码
var getCode = ["", "sys/randomImage/{id}"];
//站点属性
var siteInfo = {
	"21": {
		name: "上海海关政务地图",
		distance: "上海",
		point: getPoint(121.487899486, 31.24916171),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"721": {
		name: "拱北海关政务地图",
		distance: "拱北",
		point: getPoint(113.56062, 22.22157),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"429": {
		name: "葫芦岛市政务地图",
		distance: "葫芦岛",
		point: getPoint(120.860757645, 40.7430298813),
		zoom: 12,
		selectedIcon: "resource/marker/red.png",
		icon: "resource/marker/blue.png"
	},
	"731": {
		name: "长沙海关政务地图",
		distance: "长沙",
		point: getPoint(112.979352788, 28.2134782309),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"732": {
		name: "长沙海关政务地图",
		distance: "长沙",
		point: getPoint(112.979352788, 28.2134782309),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"700": {
		name: "北京海关政务地图",
		distance: "北京",
		point: getPoint(116.395645038, 39.9299857781),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"701": {
		name: "南京海关政务地图",
		distance: "南京",
		point: getPoint(118.778074408, 32.0572355018),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"702": {
		name: "黄埔海关政务地图",
		distance: "黄埔",
		point: getPoint(113.307649675, 23.1200491021),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"703": {
		name: "重庆海关政务地图",
		distance: "重庆",
		point: getPoint(106.530635013, 29.5446061089),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"704": {
		name: "呼和浩特海关政务地图",
		distance: "呼和浩特",
		point: getPoint(111.66035052, 40.8283188731),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"705": {
		name: "青岛海关政务地图",
		distance: "青岛",
		point: getPoint(120.384428184, 36.1052149013),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"456856": {
		name: "石家庄海关政务地图",
		distance: "石家庄",
		point: getPoint(114.514976, 38.042007),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"381544": {
		name: "广州海关政务地图",
		distance: "广州",
		point: getPoint(113.264499, 23.130061),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"460660": {
		name: "大连海关政务地图",
		distance: "大连",
		point: getPoint(121.614786, 38.913962),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"465829": {
		name: "长春海关政务地图",
		distance: "长春",
		point: getPoint(125.323643, 43.816996),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"467803": {
		name: "哈尔滨海关政务地图",
		distance: "哈尔滨",
		point: getPoint(126.535050, 45.802981),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"470737": {
		name: "宁波海关政务地图",
		distance: "宁波",
		point: getPoint(121.624540, 29.860258),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"479561": {
		name: "合肥海关政务地图",
		distance: "合肥",
		point: getPoint(121.624540, 29.860258),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"484105": {
		name: "福州海关政务地图",
		distance: "福州",
		point: getPoint(119.296411, 26.074286),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"490944": {
		name: "厦门海关政务地图",
		distance: "厦门",
		point: getPoint(118.088910, 24.479627),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"496811": {
		name: "南昌海关政务地图",
		distance: "南昌",
		point: getPoint(115.857972, 28.682976),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"500243": {
		name: "济南海关政务地图",
		distance: "济南",
		point: getPoint(117.120128, 36.652069),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"501387": {
		name: "郑州海关政务地图",
		distance: "郑州",
		point: getPoint(113.625351, 34.746303),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"506360": {
		name: "武汉海关政务地图",
		distance: "武汉",
		point: getPoint(114.304569, 30.593354),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"511667": {
		name: "深圳海关政务地图",
		distance: "深圳",
		point: getPoint(114.057939, 22.543527),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"527427": {
		name: "西安海关政务地图",
		distance: "西安",
		point: getPoint(108.939645, 34.343207),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"531964": {
		name: "银川海关政务地图",
		distance: "银川",
		point: getPoint(106.230977, 38.487783),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"533775": {
		name: "西宁海关政务地图",
		distance: "西宁",
		point: getPoint(101.777795, 36.616621),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"534835": {
		name: "湛江海关政务地图",
		distance: "湛江",
		point: getPoint(110.357538, 21.270108),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"536555": {
		name: "江门海关政务地图",
		distance: "江门",
		point: getPoint(113.081548, 22.578948),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"549778": {
		name: "贵阳海关政务地图",
		distance: "贵阳",
		point: getPoint(106.628201, 26.646694),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"552989": {
		name: "兰州海关政务地图",
		distance: "兰州",
		point: getPoint(103.834228, 36.060798),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"556553": {
		name: "乌鲁木齐海关政务地图",
		distance: "乌鲁木齐",
		point: getPoint(87.616824,43.825377),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"566004": {
		name: "满洲里海关政务地图",
		distance: "满洲里",
		point: getPoint(117.379134,49.598620),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"575563": {
		name: "杭州海关政务地图",
		distance: "杭州",
		point: getPoint(120.210792,30.246026),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"583542": {
		name: "太原海关政务地图",
		distance: "太原",
		point: getPoint(112.549656,37.870451),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"596171": {
		name: "汕头海关政务地图",
		distance: "汕头",
		point: getPoint(116.681956,23.354152),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"600269": {
		name: "南宁海关政务地图",
		distance: "南宁",
		point: getPoint(108.366407,22.817700),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"605716": {
		name: "海口海关政务地图",
		distance: "海口",
		point: getPoint(110.198418,20.045805),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"611265": {
		name: "昆明海关政务地图",
		distance: "昆明",
		point: getPoint(102.833669,24.881490),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"613079": {
		name: "拉萨海关政务地图",
		distance: "拉萨",
		point: getPoint(91.171924,29.653491),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"519390": {
		name: "成都海关政务地图",
		distance: "成都",
		point: getPoint(104.066301,30.572961),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	},
	"706": {
		name: "天津海关政务地图",
		distance: "天津",
		point: getPoint(117.210813092, 39.1439299033),
		zoom: 12,
		selectedIcon: "resource/marker/icon.png",
		icon: "resource/marker/icon2.png"
	}
};

function getPoint(lng, lat) {
	if (pointType) {
		var point = bMapTransTianMap(lng, lat);
		lng = point.lng;
		lat = point.lat;
	}
	return new T.LngLat(lng, lat)
}

//获取ajax地址
function getAjaxUrl(url, id) {
	return api[mode] + url[mode].format(id);
}

//获取ajax地址
function getAjaxOnLineUrl(url, id) {
	return "https://127.0.0.1:8008/govmap-system/" + url[1].format(id); //
}

//获取接口数据
function getAjaxData(url, id) {
	$.ajax({
		url: getAjaxUrl(url, id),
		method: "get",
		success: function(res) {
			if (res.success) {
				layer.msg(res.message);
			} else {
				console.log(res);
			}
		},
		error: function() {
			layer.msg("调用出错");
		}
	})
}

//获取附件地址
function getFileUrl(path, id) {
	return filePath[mode] + path.format(id);
}