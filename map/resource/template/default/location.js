function setDetiles(item, id) {
  var conHTML = "";
  conHTML +=
    '<div id="sContent">' +
    '<div class="sCon_info">' +
    '<h3 class="tit">' +
    item.name +
    "</h3>" +
    '<p><span><span class="iconfont">&#xe63e;</span>' +
    filterUrl(item.hallAddress) +
    "</span><i onclick=\"showMenu('" +
    item.id +
    '\')"  class="iconfont cursor map">&#xe610;</i></p>';
  if (item.hallTel) {
    conHTML +=
      '<p><span><span class="iconfont">&#xe96c;</span> ' +
      filterUrl(item.hallTel) +
      "</span></p>";
  }

  if (item.dealDate) {
    conHTML +=
      '<div class="bgDate"><span>办公时间</span>' +
      filterUrl(item.dealDate) +
      "</div>";
  }
  conHTML +=
    '<p class="jiucuo"><i title="我要纠错"  onclick="openCorrection(\'' +
    item.id +
    '\')" class="cursor"><span class="iconfont">&#xe777;</span> 纠错</i></p>';

  if (item.businessScope) {
    conHTML +=
      '<div class="ywfw"><span class="tit2"><span class="iconfont">&#xe66b;</span>业务范围</span><br>' +
      filterUrl(item.businessScope) +
      "</div>";
  }
  conHTML += "</div>";
  if (item.photo && item.photo.length > 10) {
    conHTML +=
      '<div class="sCon_img"><img id="imgDemo" src="' +
      getFileUrl(item.photo) +
      '"></div>';
  }
  conHTML +=
    '<div class="sCon_ywList">' +
    '<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">' +
    '<ul class="layui-tab-title">';
  if (item.itemList && item.itemList.length > 0) {
    conHTML +=
      '<li class="layui-this"><span class="iconfont">&#xe642;</span>办理事项</li>';
  }

  if (item.deptList && item.deptList.length > 0) {
    conHTML +=
      '<li class="' +
      (item.itemList && item.itemList.length > 0 ? "" : "layui-this") +
      '"><span class="iconfont">&#xe7a0;</span>机构设置</li>';
  }

  conHTML +=
    '<li class="' +
    (!(item.itemList?.length || item.deptList?.length) ? "layui-this" : "") +
    '"><span class="iconfont">&#xe642;</span>公告</li>';

  //  if (item.noticeList && item.noticeList.length > 0) {
  // 	conHTML += '<li class="' + ((!(item.itemList?.length || item.deptList?.length)) ? "layui-this" : "") + '"><span class="iconfont">&#xe642;</span>公告</li>';
  // }

  // if (item.itemList && item.itemList.length > 0) {
  // 	conHTML += '<li class="">预约排号<span class="layui-badge">'+item.itemList.length}</span></li>';
  // }
  conHTML += '</ul><div class="layui-tab-content" style="padding: 15px 0;">';
  if (item.itemList && item.itemList.length > 0) {
    conHTML += '<div class="layui-tab-item layui-show">';
    $.each(item.itemList, function (i, item) {
      conHTML +=
        '<li class="gen cursor" onclick="showYwInfo(\'' +
        item.id +
        "','" +
        id +
        "')\" >" +
        (i + 1) +
        "、" +
        item.name +
        "</li><hr>";
    });
    conHTML += "</div>";
  }
  if (item.deptList && item.deptList.length > 0) {
    conHTML +=
      '<div class="layui-tab-item ' +
      (item.itemList && item.itemList.length > 0 ? "" : "layui-show") +
      '" >' +
      '<div class="layui-collapse" lay-accordion=""  id="deptDiv">';
    $.each(item.deptList, function (i, item) {
      conHTML +=
        '<div class="layui-colla-item">' +
        '<h2 class="layui-colla-title"  onclick="showInfo(this)">' +
        item.deptName +
        "</h2>" +
        '<div class="layui-colla-content">' +
        '<p><span class="iconfont">&#xe63e;</span>办事地址：' +
        filterUrl(item.deptAddress) +
        "</p>" +
        "<hr>" +
        '<p><span class="iconfont">&#xe96c;</span>咨询电话：' +
        filterUrl(item.deptTel) +
        "</p>" +
        '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">' +
        "<legend>受理范围</legend>" +
        '<span class="content">' +
        splitTextNoEnter(item.businessScope, 60) +
        "</span>" +
        "</fieldset>" +
        "</div>" +
        "</div>";
    });
    conHTML += "		</div>";

    conHTML +=
      "	</div>" +
      '<div class="layui-tab-item" style="display:none;">' +
      '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">v<legend>对接排号系统</legend>' +
      "</fieldset>" +
      '<button type="button" class="layui-btn  layui-btn-fluid">预约排号<span class="layui-badge layui-bg-gray">3人等待</span></button>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }

  if (item.noticeList && item.noticeList.length > 0) {
    conHTML +=
      '<div class="layui-tab-item ' +
      (!(item.itemList?.length || item.deptList?.length) ? "layui-show" : "") +
      '">';
    $.each(item.noticeList, function (i, notice) {
      conHTML +=
        '<li class="gen cursor" style="display: flex;flex-direction: column;" >' +
        '<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
        '<h4 style="margin: 0; word-break: break-word; flex: 1;">' +
        (i + 1) +
        "、" +
        notice.title +
        "</h4>" +
        '<span style="color: #888; font-size: 12px; white-space: nowrap; margin-left: 10px;">' +
        (notice.materialFile
          ? '<a target="_bank" href ="' +
            getFileUrl(notice.materialFile) +
            '"> <i class="iconfont">&#xe7bd;</i></a>'
          : "") +
        "</span>" +
        "</div>" +
        (notice.summary
          ? '<span style="color: #333; font-size: 13px; margin: 4px 0;white-space: pre-line;">' +
            splitText(notice.summary, 60) +
            "</span>"
          : "") +
        (notice.materialFile
          ? '<a target="_bank" href ="' +
            getFileUrl(notice.materialFile) +
            '">' +
            notice.materialFile +
            ' <i class="iconfont">&#xe7bd;</i></a>'
          : "") +
        "</li>" +
        "<hr>";
    });
    conHTML += "</div>";
  }
  conHTML += "</div></div></div></div></div>";
  return conHTML;
}
