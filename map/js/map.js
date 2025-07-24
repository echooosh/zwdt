var srcWidth = $(window).width();

$(document).ready(function () {
  changeMap(siteKey);
});

/***********站点选择*************************************/
function changeMap(siteKey, shadeClose) {
  if (siteInfo[siteKey]) {
    $("#changeMap").hide();
    loadPage(siteKey);
    return;
  }

  $("#changeMap").show();
  var html =
    '<div class="layui-field-box">' +
    '	<H3 class="tit icon-center">请选择</H3>' +
    "	<hr> ";
  $.each(siteInfo, function (i, item) {
    html +=
      '<button type="button" class="layui-btn layui-btn-fluid" onclick ="loadPage(\'' +
      i +
      "');\">" +
      item.name +
      "</button><hr>";
  });
  html += "</div>";
  layer.open({
    type: 1,
    title: false,
    closeBtn: 0,
    shade: 0.8,
    shadeClose: shadeClose,
    skin: "",
    content: html,
  });
}

function loadPage(key) {
  siteKey = key;
  $("#siteKey").val(siteKey);
  document.title = siteInfo[siteKey].name;
  $.ajaxSetup({
    headers: {
      "X-Tenant-Id": siteKey,
    },
  });
  currpoint = null;
  initMap();
  getDtList();
  getYwList();
  getHotList();
  getOnlineList();
  layer.closeAll("page");
  //showInputAddress(false);
}

function getMyDistance() {
  try {
    var lo = new T.Geolocation();
    fn = function (e) {
      if (this.getStatus() == 0) {
        map.centerAndZoom(e.lnglat, 15);
        layer.closeAll();
        closeLocal();
        setMyDistance(e.lnglat);
      } else if (this.getStatus() == 1) {
        //map.centerAndZoom(e.lnglat, e.level);
        layer.closeAll();
        closeLocal();
        myValue = e.cityName;
        if (myValue.indexOf(siteInfo[siteKey].distance) >= 0) {
          setMyDistance(e.lnglat);
        }

        //console.log(e.level);
        //console.log(e);
      } else {
      }
    };
    lo.getCurrentPosition(fn);
  } catch (e) {
    layer.closeAll();
    showInputAddress(true);

    layer.msg("获取定位失败，您可以手动输入地址", {
      offset: "t",
      anim: 6,
    });
  } finally {
  }
}

function setMyDistance(point) {
  //console.log(point);
  if (point) {
    //创建图片对象
    var myIcon = new T.Icon({
      iconUrl: "resource/marker/point1.png",
      iconSize: new T.Point(40, 44),
      iconAnchor: new T.Point(20, 30),
    });
    if (myDistance) {
      map.removeOverLay(myDistance);
    }
    myDistance = new T.Marker(point, {
      icon: myIcon,
      title: "起始位置",
      hashCode: "mypoint",
    });

    map.addOverLay(myDistance); //标出所在地
    if (polyline) {
      map.removeOverLay(polyline);
    }
    currpoint = point;
    myPoint = point;
    currpoint = myPoint;

    map.centerAndZoom(currpoint, siteInfo[siteKey].zoom);

    //console.log(myValue);

    var infoWin1 = new T.InfoWindow();
    var sContent =
      "<div style='margin:0px;'>" +
      "<div style='margin:10px 10px; '>" +
      "<div style='margin:10px 0px;'>" +
      myValue +
      "</div>" +
      "<p style='min-width:150px; '>位置不对?<a class='cursor' style='display: revert;' onclick='showInputAddress(true)'>点击这里修改</a></p>" +
      "</div>" +
      "</div>";

    infoWin1.setContent(sContent);
    myDistance.addEventListener("click", function () {
      myDistance.openInfoWindow(infoWin1);
    }); // 将标注添加到地图中

    myDistance.openInfoWindow(infoWin1);
  } else {
    showInputAddress(true);
  }
}

function showInputAddress(showMsg) {
  $("#suggestId").val("");
  layer.closeAll();
  if (!myPoint && !showMsg) {
    // layer.msg('告诉我您所在的位置,我可以帮您计算办事地点的距离', {
    // 	time: 0, //不自动关闭
    // 	btnAlign: 'c',
    // 	anim: 0,
    // 	//skin: 'layui-layer-rim', //加上边框
    // 	btn: ['同意', '关闭'],
    // 	yes: function(index) {
    // 		layer.closeAll();
    // 		getMyDistance();
    // 	}
    // });
    getMyDistance();
  } else {
    openLocal();
  }
}

function closeLocal() {
  layer.tips("您可以点击这里查看/修改您的起点位置", "#showLocal", {
    tips: [3, "rgb(13, 77, 139)"],
    time: 4000,
  });
}

var time = "";
var lock = true;

function down() {
  time = setTimeout(function () {
    openLocal();
    lock = false;
  }, 1000);
}

function up() {
  clearTimeout(time);
  //鼠标释放时让lock异步执行，setTimeout因为异步任务，所以会放到任务队列最后执行，让click事件先执行了
  setTimeout(function () {
    lock = true;
  });
}
//弹出选择查看/修改当前位置
function showLocal() {
  if (myPoint) {
    currIdx = layer.open({
      type: 1,
      title: false,
      closeBtn: 0,
      shadeClose: true,
      skin: "",
      content:
        '	<div class="layui-field-box">' +
        '			<button type="button" class="layui-btn layui-btn-fluid" onclick ="showLocalYES();">查看起点位置</button><hr>' +
        '			<button type="button" class="layui-btn layui-btn-fluid" onclick ="openLocal();">修改起点位置</button>' +
        "		</div>",
    });
  } else {
    setMyDistance(myPoint);
  }
}
//查看起点
function showLocalYES() {
  layer.close(currIdx);
  if (myPoint) {
    setMyDistance(myPoint);
  } else {
    showLocal();
  }
}

// 关闭窗口
function closeInfo() {
  $("#infoCon .con").html("").parent().hide();
  //closeSlide();
  //resetMap();
  resetMapNoChange();
}

function showList() {
  $("#tabCon").show();
  if (srcWidth <= 640) {
    $("#map-container").css("height", "60vh");
  }
  closeInfo();
  //resetMapNoChange();
}

function slideHeight() {
  $("#tabCon").toggleClass("down");
  $("#infoCon").toggleClass("down");
  if (srcWidth <= 640) {
    if ($("#tabCon").hasClass("down")) {
      $("#map-container").css("height", "62vh !important");
      $(".top .layui-icon-down")
        .addClass("icon-xiangshang")
        .removeClass("layui-icon-down");
    } else {
      $("#map-container").css("height", "42vh !important");
      $(".top .icon-xiangshang")
        .addClass("layui-icon-down")
        .removeClass("icon-xiangshang");
    }
  }
  resetMapNoChange();
  /* setTimeout(function() {
		$(".top").show();
	}, 300); */
}

function closeSlide() {
  $("#tabCon").hide();
  $("#tabCon").removeClass("down");
  $("#infoCon").removeClass("down");
  resetMapNoChange();
  if (srcWidth <= 640) {
    $("#map-container").css("height", "100vh");
  } else {
    $("#tabCon").show();
  }
  $(".layui-icon-return").hide();
}

function initMap() {
  createMap(); // 创建地图
  //setMapEvent(); // 设置地图事件
  //addMapControl(); // 向地图添加控件
}

function createMap() {
  var map = new T.Map("map-container", {
    projection: "EPSG:4326",
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
  //control.setPosition(T_ANCHOR_TOP_LEFT);
}

function resetMap() {
  // map.centerAndZoom(currpoint ?? siteInfo[siteKey].point, siteInfo[siteKey].zoom);
  var p = currpoint;
  if (currpoint) {
    p = siteInfo[siteKey].point;
  }
  //console.log(p);
  map.centerAndZoom(p, siteInfo[siteKey].zoom);
}

function resetMapNoChange() {
  if (isMobile()) {
    setTimeout("resetMaps()", 300);
  }
}

function resetMaps() {
  var infoCon = $("#infoCon").height();
  var tabCon = $("#tabCon").height();
  if (!$("#infoCon").is(":visible")) {
    infoCon = 0;
  }
  if (!$("#tabCon").is(":visible")) {
    tabCon = 0;
  }
  var bottom = infoCon;
  if (tabCon > bottom) bottom = tabCon;
  $("#map-container").height(
    $(window).height() - bottom + $(".searchBox").height() + $("#tab1").height()
  );
  if (currpoint) {
    map.panTo(currpoint); //地图中心移动
  }
}

// 地图事件设置函数：
function setMapEvent() {
  map.enableDragging(); // 启用地图拖拽事件，默认启用(可不写)
  map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
  map.enableDoubleClickZoom(); // 启用鼠标双击放大，默认启用(可不写)
  map.enableKeyboard(); // 启用键盘上下左右键移动地图
}

// 地图控件添加函数：
function addMapControl() {
  map.addControl(
    new BMapGL.ZoomControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
    })
  ); // 添加缩放控件
  map.addControl(new BMapGL.ScaleControl()); // 向地图中添加比例尺控件
  map.addControl(new BMapGL.CopyrightControl()); //版权
  //map.addControl(new BMapGL.CityListControl());// 添加城市列表控件
  //map.addControl(new BMapGL.LocationControl());//定位

  map.addControl(
    new BMapGL.MapTypeControl({
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
    })
  );
}

//办事地点列表
function getDtList(name) {
  map.clearOverLays(); // 清除地图标记点
  getMyDistance();
  layui.use("laytpl", function (laytpl) {
    $.ajax({
      url: getAjaxUrl(getOrgList),
      method: "get",
      success: function (res) {
        if (res.success) {
          var html = "";
          datas = [];
          $.each(res.result, function (i, item) {
            html += getOrgHTML(item);
          });
          addPoints();
          $("#datingList").html(html);

          //加载大厅搜索数据
          loadOrg();
        } else {
          layer.msg(res.message);
        }
      },
      error: function () {
        layer.msg("未搜索到结果");
      },
    });
  });
}

//海量点位使用
var img = new Image();
// 大厅列表HTML
function getOrgHTML(item, html) {
  var html = "";
  html +=
    '<li class="layui-menu-item-group layui-menu-item-up" lay-options="{type: \'group\'}">';
  html +=
    '<div class="layui-menu-body-title">' +
    item.name +
    '<i class="layui-icon layui-icon-down"></i></div>';
  html += "<ul>";
  if (item.hallList && item.hallList.length > 0) {
    $.each(item.hallList, function (i, item) {
      html +=
        '<li class="gen" lay-value="' +
        item.id +
        '" lay-options="{id:\'' +
        item.id +
        '\'}"><i class="layui-icon icon-left layui-icon-location"></i><a class="cursor">' +
        item.name +
        "</a></li>";
      //构造数据
      datas.push({
        LngLat: newLngLat(item.lng, item.lat),
        icon: img,
        tag: item,
      });
    });
  } else if (item.childList && item.childList.length > 0) {
    $.each(item.childList, function (i, item) {
      html += getOrgHTML(item);
    });
  }
  html += "</ul>";
  html += "</li>";
  return html;
}

//海量点位使用
function addPoints() {
  if (bigPoint) {
    var arrayObj = new Array();

    //console.log(datas);
    $.each(datas, function (i, item) {
      //向地图上添加自定义标注
      var marker = newMarker(item);

      addClickHandler(item.tag.name, marker);
      marker.addEventListener("click", attribute);
      arrayObj.push(marker);
    });
    var markers = new T.MarkerClusterer(map, {
      markers: arrayObj,
    });
    return;
  }

  var markers = [];
  $.each(datas, function (i, item) {
    //向地图上添加自定义标注
    var marker = newMarker(item.tag);
    map.addOverLay(marker);
    //console.log(item);
    addClickHandler(item.tag.name, marker);
    marker.addEventListener("click", attribute);
  });
}

//添加点击事件
function addClickHandler(content, marker) {
  marker.addEventListener("click", function (e) {
    openInfo(content, e.lnglat);
  });
}

//弹出提示文字
function openInfo(content, lnglat) {
  var point = lnglat;
  marker = new T.Marker(point); // 创建标注
  var markerInfoWin = new T.InfoWindow(content, {
    offset: new T.Point(0, -20),
  }); // 创建信息窗口对象
  map.openInfoWindow(markerInfoWin, point); //开启信息窗口
}
//marker点击事件
function attribute(e) {
  var p = e.target;
  var id = p.options.hashCode;
  //alert("marker的位置是" + p.getLngLat().lng + "," + p.getLngLat().lat);
  currpoint = newLngLat(p.getLngLat().lng, p.getLngLat().lat);
  var sContent = sconHTML(id);
  setIcon(id);
  map.centerAndZoom(currpoint);
  $("#datingList li.gen[lay-value='" + id + "']").click();
  resetMapNoChange();
  $("#datingList li.gen[lay-value='" + id + "']")
    .parents(".layui-menu-item-up")
    .children(".layui-menu-body-title")
    .click();
  $("#datingList li.gen[lay-value='" + id + "']")
    .parents("li.layui-menu-item-group")
    .siblings(".layui-menu-item-down")
    .children(".layui-menu-body-title")
    .click();
}

// 网点明细
function sconHTML(id) {
  var conHTML = "";
  var infoCon = null;
  $.ajax({
    url: getAjaxUrl(getOrg, id),
    method: "get",
    async: false,
    success: function (res) {
      if (res.success) {
        //读取个性化模板
        infoCon = res.result;
      } else {
        layer.msg("未搜索到结果！");
      }
    },
    error: function () {
      layer.msg("未搜索到结果");
    },
  });
  $.ajax({
    url: getAjaxUrl(getNotice, id),
    method: "get",
    async: false,
    success: function (tempRes) {
      if (tempRes.success) {
        //读取个性化模板
        infoCon.noticeList = tempRes.result.records;
      } else {
        infoCon.noticeList = [];
      }
    },
    error: function () {},
  });
  conHTML += setDetiles(infoCon, id);

  return conHTML;
}

//显示点位详细
function showMarker(id, ywid) {
  closeInfo();

  if (ywid) {
    $(".layui-icon-return").show();
    $(".layui-icon-return").attr("onclick", "showYwInfo('" + ywid + "');");
  } else {
    $(".layui-icon-return").hide();
  }
  //$("#tab1 li").eq(0).click();
  $.ajax({
    url: getAjaxUrl(getOrg, id),
    method: "get",
    async: false,
    success: function (res) {
      //console.log(res);
      if (res.success) {
        var item = res.result;
        // 信息窗口
        var sContent = sconHTML(id);

        $("#infoCon .con").html(sContent).parent().show();

        currpoint = newLngLat(item.lng, item.lat);
        map.centerAndZoom(currpoint, 15);

        setIcon(id);
      } else {
        layer.msg("未搜索到结果！");
      }
    },
    error: function () {
      layer.msg("未搜索到结果");
    },
  });
}

// 事项列表
function getYwList() {
  layui.use("laytpl", function (laytpl) {
    $.ajax({
      url: getAjaxUrl(getWorkList),
      method: "get",
      success: function (res) {
        if (res.success) {
          //console.log(res);
          works = [];
          var html = "";
          $.each(res.result, function (i, item) {
            html += getWorkHTML(item);
          });
          $("#yewuList").html(html);
        } else {
          layer.msg(res.message);
        }
      },
      error: function () {
        layer.msg("未搜索到结果");
      },
    });
  });
}

// 事项列表HTML
function getWorkHTML(item) {
  var html = "";
  html +=
    '<li class="layui-menu-item-group layui-menu-item-up" lay-options="{type: \'group\'}">';
  html +=
    '<div class="layui-menu-body-title">' +
    item.name +
    '<i class="layui-icon layui-icon-down"></i></div>';
  html += "<ul>";
  if (item.itemList && item.itemList.length > 0) {
    $.each(item.itemList, function (i, item) {
      html +=
        '<li class="gen" lay-options="{id: \'' +
        item.id +
        '\'}" ><i class="layui-icon icon-left layui-icon-list"></i><a class="cursor">' +
        item.name +
        "</a></li>";
      works.push(item);
    });
  } else if (item.childList && item.childList.length > 0) {
    $.each(item.childList, function (i, item) {
      html += getWorkHTML(item);
    });
  }
  html += "</ul>";
  html += "</li>";
  return html;
}

//机构
function showInfo(e) {
  if ($(e).next().hasClass("layui-show")) {
    $(e).next(".layui-colla-content").removeClass("layui-show").css({
      border: "solid #eee 1px",
    });
    $(e).css({
      color: "#0D4D8B",
      background: "#FAFAFA",
    });
  } else {
    $("#deptDiv .layui-colla-title").css({
      color: "#0D4D8B",
      background: "#FAFAFA",
    });
    $("#deptDiv .layui-colla-content").removeClass("layui-show");
    $(e).next(".layui-colla-content").addClass("layui-show").css({
      border: "solid #0D4D8B 1px",
    });
    $(e).css({
      color: "#FAFAFA",
      background: "#0D4D8B",
    });
  }
}

//显示事项详细
function showYwInfo(id, orgid) {
  closeInfo();
  //$("#tab1 li").eq(1).click();
  if (orgid) {
    $(".layui-icon-return").show();
    $(".layui-icon-return").attr("onclick", "showMarker('" + orgid + "');");
  } else {
    $(".layui-icon-return").hide();
  }
  var sContent = "";
  $.ajax({
    url: getAjaxUrl(getWork, id),
    method: "get",
    async: false,
    success: function (res) {
      //console.log(res);
      if (res.success) {
        sContent = setMatterDetiles(res.result, id);
      } else {
        layer.msg("未搜索到结果！");
      }
    },
    error: function () {
      layer.msg("未搜索到结果");
    },
  });
  $("#infoCon .con").html(sContent).parent().show();
}

//查询热点事项列表
function getHotList() {
  layui.use("laytpl", function (laytpl) {
    $.ajax({
      url: getAjaxUrl(getQueryHotList),
      method: "get",
      success: function (res) {
        //console.log(res);
        if (res.success) {
          var html = "";
          html = getHotHTML(res.result);
          if (res.result && res.result.length > 0) {
            $("#hotList").html(html);
          }
        } else {
          layer.msg(res.message);
        }
      },
      error: function () {
        layer.msg("未搜索到结果");
      },
    });
  });
}

//热点事项HTML
function getHotHTML(list) {
  var conHTML = "";
  if (list && list.length > 0) {
    $.each(list, function (i, item) {
      conHTML +=
        '<li class="gen cursor" onclick="showYwInfo(\'' +
        item.id +
        "')\" >" +
        (i + 1) +
        "、" +
        item.name +
        '<i title="' +
        item.dataIndex +
        '" class="layui-icon icon-map layui-icon-list"></i></li><hr>';
    });
  } else {
    conHTML +=
      '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">' +
      "				  <legend>暂无记录</legend>" +
      "				</fieldset>";
  }
  return conHTML;
}

//查询网办事项列表
function getOnlineList() {
  layui.use("laytpl", function (laytpl) {
    $.ajax({
      url: getAjaxUrl(getQueryOnlineList),
      method: "get",
      success: function (res) {
        //console.log(res);
        if (res.success) {
          var html = "";
          html = getOnlineHTML(res);
          $("#onlineList").html(html);
        } else {
          layer.msg(res.message);
        }
      },
      error: function () {
        layer.msg("未搜索到结果");
      },
    });
  });
}

//网办事项HTML
function getOnlineHTML(list) {
  var conHTML = "";
  if (list.result && list.result.length > 0) {
    $.each(list.result, function (i, item) {
      conHTML +=
        '<li class="gen cursor" onclick="showYwInfo(\'' +
        item.id +
        "')\" >" +
        (i + 1) +
        "、" +
        item.name +
        '<i title="' +
        item.dataIndex +
        '" class="layui-icon icon-map layui-icon-list"></i></li><hr>';
    });
  } else {
    conHTML +=
      '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">' +
      "			  <legend>暂无网上办理事项</legend>" +
      "				</fieldset>";
  }
  return conHTML;
}

//初始化选中点位图标
function setIcon(id) {
  var myIcon = new T.Icon({
    iconUrl: siteInfo[siteKey].icon,
    iconSize: new T.Point(40, 44),
    iconAnchor: new T.Point(20, 30),
  });

  var newIcon = new T.Icon({
    iconUrl: siteInfo[siteKey].selectedIcon,
    iconSize: new T.Point(40, 44),
    iconAnchor: new T.Point(20, 30),
  });
  var allOverlay = map.getOverlays();

  if (polyline) {
    map.removeOverLay(polyline);
  }
  var n = 0;
  for (i = 0; i < allOverlay.length; i++) {
    if (
      allOverlay[i].options.hashCode != undefined &&
      allOverlay[i].options.hashCode != "mypoint"
    ) {
      // console.log(i);
      // console.log(allOverlay[i].options.hashCode);
      // console.log(datas[n].tag.id);
      if (datas[n].tag.id != id) {
        allOverlay[i].setIcon(myIcon);
        allOverlay[i].setZIndexOffset(50);
      } else {
        allOverlay[i].setIcon(newIcon);

        allOverlay[i].setZIndexOffset(100);
        //console.log(myPoint);
        var item = datas[n].LngLat;
        if (polyline) {
          map.removeOverLay(polyline);
        }
        //坐标点上显示的标题
        var title =
          "<p><b>" +
          datas[n].tag.name +
          "</b><a onclick=\"showMenu('" +
          id +
          "')\" ><img src='resource/marker/dh_icon.png'></a></p>";
        if (mod > 0)
          title =
            "<b>" +
            datas[n].tag.name +
            "</b><p>" +
            datas[n].tag.dataIndex.split("/")[mod] +
            "<a onclick=\"showMenu('" +
            id +
            "')\" ><img src='resource/marker/dh_icon.png'></a></p>";
        //console.log(datas[n].tag);
        openInfo(title, item);
        if (myPoint) {
          //有定位直线计算
          var distance = getDistance(
            item.lat,
            item.lng,
            myPoint.lat,
            myPoint.lng
          );

          if (distance < 1000000) {
            var config = {
              policy: 0, //驾车策略
              onSearchComplete: searchResult, //检索完成后的回调函数
            };
            drivingRoute = new T.DrivingRoute(map, config);
            //驾车路线搜索
            drivingRoute.search(myPoint, item);
            setTimeout(function () {
              openInfo(title + describeStr, item);
              map.centerAndZoom(item);
            }, "1000");
          }
        }
      }
      n++;
    }
  }
}

function createRoute(lnglats, lineColor) {
  if (polyline) {
    map.removeOverLay(polyline);
  }
  //创建线对象
  polyline = new T.Polyline(lnglats, {
    color: "green",
    weight: 5,
    opacity: 0.9,
  });
  //向地图上添加线
  map.addOverLay(polyline);
}

function searchResult(result) {
  obj = result;

  //获取方案个数
  var routes = result.getNumPlans();
  for (var i = 0; i < routes; i++) {
    //获得单条驾车方案结果对象
    var plan = result.getPlan(i);
    describeStr =
      "<p>总距离：" +
      Math.round(plan.getDistance()) +
      "公里，驾车时间约：" +
      formatSeconds(plan.getDuration()) +
      "</p>";

    createRoute(plan.getPath());
    //显示最佳级别
    map.setViewport(plan.getPath());
  }
}

function showMenu(id) {
  $.ajax({
    url: getAjaxUrl(getOrg, id),
    method: "get",
    async: false,
    success: function (res) {
      //console.log(res);
      if (res.success) {
        var item = res.result;
        //页面层-自定义
        currIdx = layer.open({
          type: 1,
          title: false,
          closeBtn: 1,
          shadeClose: true,
          skin: "",
          content:
            '<div class="layui-field-box">' +
            '		<H3 class="tit">' +
            item.name +
            "</H3> " +
            "					<hr>" +
            "					导航地址：" +
            item.hallAddress +
            "					<hr>" +
            '					<button type="button" class="layui-btn layui-btn-fluid" onclick ="openGoto(\'' +
            id +
            "'," +
            mapType.baidu +
            ');">百度地图</button><hr>' +
            '					<button type="button" class="layui-btn layui-btn-fluid" onclick ="openGoto(\'' +
            id +
            "'," +
            mapType.amap +
            ');">高德地图</button><hr>' +
            '					<button type="button" class="layui-btn layui-btn-fluid" onclick ="openGoto(\'' +
            id +
            "'," +
            mapType.qq +
            ');">腾讯地图</button>' +
            "				</div>",
        });
      } else {
        layer.msg("未搜索到结果！");
      }
    },
    error: function () {
      layer.msg("未搜索到结果");
    },
  });
}

//弹出层导航
function openGoto(id, type) {
  $.ajax({
    url: getAjaxUrl(getOrg, id),
    method: "get",
    async: false,
    success: function (res) {
      //console.log(res);
      if (res.success) {
        var item = res.result;
        //百度  http://api.map.baidu.com/marker?location=纬度,经度&title=所在位置名称&content=所在位置的简介&output=html
        //腾讯  http://apis.map.qq.com/uri/v1/marker?marker=coord:lat,lng;addr:address
        //高德  http://uri.amap.com/marker?position=lng,lat&name=address&coordinate=gaode&callnative=1
        var url = "";
        switch (type) {
          case mapType.baidu:
            url =
              "//api.map.baidu.com/marker?location=" +
              item.lat +
              "," +
              item.lng +
              "&title=" +
              item.hallAddress +
              "&content=" +
              item.name +
              "&output=html";
            break;
          case mapType.amap:
            url =
              "//uri.amap.com/marker?position=" +
              bMapTransGMap(item.lng, item.lat) +
              "&name=" +
              item.hallAddress +
              "&coordinate=" +
              item.name +
              "&callnative=1";
            break;
          case mapType.qq:
            url =
              "//apis.map.qq.com/uri/v1/geocoder?coord=" +
              bMapTransQQMap(item.lng, item.lat) +
              "&amp;name=" +
              item.name +
              "&amp;addr=" +
              item.hallAddress;
            break;
        }
        const winURL = window.open(url); // 设置要打开的对象
        layer.close(currIdx);
      } else {
        layer.msg("未搜索到结果！");
      }
    },
    error: function () {
      layer.msg("未搜索到结果");
    },
  });
}

//弹出样例参考
function openPhoto(n) {
  var photoList = [];
  var idx = 0;
  $.each(filePhoto, function (i, item) {
    if (
      item.materialFile.toLowerCase().indexOf(".jpg") >= 0 ||
      item.materialFile.toLowerCase().indexOf(".png") >= 0
    ) {
      if (n == i) {
        n = idx;
      }
      idx++;
      photoList.push({
        alt: item.name,
        pid: i + 10, //图片id
        src: getFileUrl(item.materialFile), //原图地址
        thumb: getFileUrl(item.materialFile), //缩略图地址
      });
    }
  });
  var json = {
    title: "样例参考", //相册标题
    id: Math.random(), //相册id
    start: n, //初始显示的图片序号，默认0
    data: photoList, //相册包含的图片，数组格式
  };
  layer.photos({
    photos: json,
    anim: 5, //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
  });
}

function openCorrection(id, type) {
  var w = "80vw";
  var h = "80vh";

  if (type == "service") {
    if ($(document).width() > 1000) w = "800px";
    if ($(document).height() > 600) h = "500px";
    layer.open({
      type: 2,
      title: "政务地图-事项信息纠错",
      area: [w, h],
      fixed: false, //不固定
      maxmin: true,
      shadeClose: true,
      shade: 0.4,
      content:
        "correction-service.html?id=" + id + "&siteKey=" + $("#siteKey").val(),
      success: function (layero, index) {
        var iframe = window["layui-layer-iframe" + index];
        // 信息窗口
      },
    });
  } else {
    if ($(document).width() > 1200) w = "1080px";
    if ($(document).height() > 900) {
      h = "800px";
    }
    layer.open({
      type: 2,
      title: "政务地图-办事地点信息纠错",
      area: [w, h],
      fixed: false, //不固定
      maxmin: true,
      shadeClose: true,
      shade: 0.4,
      content:
        "correction-hall.html?id=" + id + "&siteKey=" + $("#siteKey").val(),
      success: function (layero, index) {
        var iframe = window["layui-layer-iframe" + index];
        // 信息窗口
      },
    });
  }
}

//设置我的位置
function openLocal() {
  layer.close(currIdx);
  var w = "80vw";
  var h = "60vh";
  if (isMobile()) {
    if ($(document).width() > 640) w = "500px";
    if ($(document).height() > 800) {
      h = "500px";
    }
  } else {
    w = "600px";
    h = "450px";
  }
  var cont = "searchAddress.html?siteKey=" + $("#siteKey").val();
  if (myPoint) {
    cont += "&p=" + myPoint.lng + "," + myPoint.lat;
  }
  //console.log(cont);
  layer.open({
    type: 2,
    title: "政务地图-设置您的位置",
    area: [w, h],
    fixed: false, //不固定
    maxmin: true,
    shadeClose: true,
    shade: 0.4,
    content: cont,
    success: function (layero, index) {
      var iframe = window["layui-layer-iframe" + index];
      // 信息窗口
    },
  });
}

//创建坐标点
function newMarker(item) {
  //创建图片对象
  var icon = new T.Icon({
    iconUrl: siteInfo[siteKey].icon,
    iconSize: new T.Point(40, 44),
    iconAnchor: new T.Point(20, 30),
  });
  var name = item.name;
  if (mod > 0) name = item.dataIndex.split("/")[mod];
  var marker = new T.Marker(newLngLat(item.lng, item.lat), {
    icon: icon,
    title: name, //悬停坐标点显示的文字
    hashCode: item.id,
  });

  //console.log(marker);
  return marker;
}

function newLngLat(lng, lat) {
  //是否转换天地图坐标
  if (pointType) {
    var point = bMapTransTianMap(lng, lat);
    lng = point.lng;
    lat = point.lat;
  }
  return T.LngLat(lng, lat);
}

$(function () {
  $(".layui-form").click(function () {
    //console.log("关闭所有影响下拉的窗口");
    closeInfo();
    closeSlide();
  });
});
