
$(function() {
	getHistory();
});


var historyCount = 10; //保存历史记录个数

var his = "history" + siteKey;
/**
 * 增加浏览历史记录
 * @param id 编号
 * @param name 名称
 * @param dataIndex 索引目录
 * @param type 类型
 * @return
 */
function setHistory(id, name, dataIndex, type) {
	try{
		stringCookie = localStorage.getItem(his);
		//console.log(stringCookie);
		var stringHistory = (stringCookie && "" != stringCookie) ? stringCookie : "{" + his + ":[]}";
		var json = new JSONHistory(stringHistory); //转成json
		//console.log(json);
		var list = json[his]; //获得json
		for (var i = 0; i < list.length; i++) {
			try {
				if (list[i].id == id) {
					list.splice(i, 1); //删除重复数据，开始位置,删除个数
					i = i - 1; //下标归位
				}
			} catch (e) {
				break;
			}
		}
		
		if (list.length >= historyCount) {
			//删除最开始的多余记录
			var count = list.length - historyCount + 1; //需要删除的个数
			list.splice(0, count); //开始位置,删除个数
		}
		
		var e = "{id:'" + id + "',name:'" + name + "',dataIndex:'" + dataIndex + "',type:'" + type + "',time:'" + new Date()
			.getTime() + "'}";
		
		json[his].push(e); //添加一个新的记录
		localStorage.setItem(his, json.toString());
	}catch(e){
		//TODO handle the exception
	}
}



/**
 * 获得浏览历史记录
 * @return
 */
function getHistory() {
	try{
		var historyJSON = localStorage.getItem(his);
		if (historyJSON && historyJSON != "") {
			//console.log(historyJSON);
			var data = eval("(" + historyJSON + ")");
			var history = data[his]; //历史记录
			//id  name  index
			var html = getHotHTML(history.reverse());
			$("#hotList").html(html);
		}
	}catch(e){
		//TODO handle the exception
	}
}

/**
 * 添加cookie
 * @param cookName cookie名称
 * @param cookName cookie值
 * @param expiredays 时长
 */
function setCookie(cookName, cookValue, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays * 24 * 3600 * 1000);
	var cookieVal = cookName + "=" + escape(cookValue) + ((expiredays == null) ? "" : ";expires=" + exdate
		.toGMTString()) + ";path=/";
	document.cookie = cookieVal;
}


/**
 * 获取cookie
 * @param cookName cookie名称
 * @return
 */
function getCookie(cookName) {
	if (document.cookie.length > 0) {
		var c_start = document.cookie.indexOf(cookName + "=");
		if (c_start != -1) { //存在
			c_start = c_start + cookName.length + 1; //"history="后的开始位置
			var c_end = document.cookie.indexOf(";", c_start); //找到JSESSIONID在的位置
			if (c_end == -1) { //JSESSIONID不存在
				c_end = document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}


/**
 * JSON
 */
var JSONHistory = function(sJSON) {
	this.objType = (typeof sJSON);
	if (this.objType == 'string' && '' == sJSON) {
		sJSON = '{' + his + ':[]}';
	}
	this.self = [];
	(function(s, o) {
		for (var i in o) {
			o.hasOwnProperty(i) && (s[i] = o[i], s.self[i] = o[i])
		};
	})(this, (this.objType == 'string') ? eval('0,' + sJSON) : sJSON);
};
JSONHistory.prototype = {
	toString: function() {
		return this.getString();
	},
	valueOf: function() {
		return this.getString();
	},
	getString: function() {
		var sA = [];
		(function(o) {
			var oo = null;
			sA.push('{');
			for (var i in o) {
				if (o.hasOwnProperty(i) && i != 'prototype') {
					oo = o[i];
					if (oo instanceof Array) {
						sA.push(i + ':[');
						for (var b in oo) {
							if (oo.hasOwnProperty(b) && b != 'prototype') {
								sA.push(oo[b] + ',');
								if (typeof oo[b] == 'object') arguments.callee(oo[b]);
							}
						}
						sA.push('],');
						continue;
					} else {
						sA.push(i + ':\'' + oo + '\',');
					}
					if (typeof oo == 'object') arguments.callee(oo);
				}
			}
			sA.push('},');
		})(this.self);
		return sA.slice(0).join('').replace(/\[object object\],/ig, '').replace(/,\}/g, '}').replace(/,\]/g,
			']').slice(0, -1);
	},
	push: function(sName, sValue) {
		this.self[sName] = sValue;
		this[sName] = sValue;
	}
};
