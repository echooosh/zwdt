function setMatterDetiles(item, id) {
	// 信息窗口
	var sContent = '<div id="sContent">' +
		'<div class="sCon_info2">' +
		'<div class="item">' +
		'<p class="tit"><span>事项名称：</span>' + item.name + '</p>' +
		'<p><span>事项类型：</span>' + filterUrl(item.itemType) + '</p>';
	if (item.itemCode) {
		sContent +=
			'<p><span>事项编码：</span>' + ((item.itemCode && item.itemCode.length) > 20 ? "<hr>" : "") + filterUrl(item
				.itemCode) + '</p><i title="我要纠错"  onclick="openCorrection(\'' + item.id +
			'\',\'service\')"  class="layui-icon cursor"><span class="iconfont">&#xe777;</span> 纠错</i>';

	}

	sContent += '</div>';
	if (item.dealProcess) {
		sContent += '<div class="item">' +
			'<p><span>申请（办理）流程：</span><span class="content">' + splitText(item.dealProcess, 60) + '</span></p>' +
			'</div>';
	}
	sContent += '<div class="item">' +
		'<p><span>申请（办理）条件：</span><span class="content">' + splitText(item.dealCondition, 60) + '</span></p>' +
		'</div>' +
		'<div class="item">' +
		'<p><span>办理形式：</span>' + filterText(item.dealType) + '</p>' +
		'<p><span>法定办结时限：</span>' + filterUrl(item.legalDeadline) + '</p>' +
		'<p><span>承诺办结时限：</span>' + filterUrl(item.promiseDeadline) + '</p>' +
		'</div>';
	//<p><span>办理时间：</span>'+filterUrl(item.dealDate)+'</p>
	if (isOnline(item.dealType)) {
		sContent += '<div class="item">' +
			'<p><span>网上办理地址：</span></p>' +
			'<p>' + filterUrl(item.dealPlace) + '</p>' +
			'</div>';
	}

	sContent += '<div class="item">' +
		'<p><span>实施机构：</span>' + filterUrl(item.dealOrg) + '</p>' +
		'</div>' +
		'</div>' +
		'<div class="sCon_dtList">' +
		'<div class="layui-tab" lay-filter="docDemoTabBrief">' +
		'<ul class="layui-tab-title">';

	var showHall = item.hallList && item.hallList.length > 0 && isOffline(item.dealType);
	var showFiles = item.materialList && item.materialList.length > 0;

	if (showHall) {
		sContent += '<li class="layui-this"><span class="iconfont">&#xe642;</span>相关办理地点</li>';
	}
	if (showFiles) {
		if (showHall) {
			sContent +=
				'<li><span class="iconfont">&#xea48;</span>相关参考材料<span class="layui-badge">' + item.materialList
				.length + '</span></li>';
		} else {
			sContent +=
				'<li class="layui-this"><span class="iconfont">&#xea48;</span>相关参考材料<span class="layui-badge">' + item
				.materialList.length + '</span></li>';
		}

	}
	sContent += '</ul>' +
		'<div class="layui-tab-content" style="padding: 15px 0;">';
	if (showHall) {
		sContent +=
			'<div class="layui-tab-item layui-show">';
		if (siteKey != "721") {
			sContent +=
				'<li class="layui-inline layui-word-aux">注：以下办理地点仅供参考,由于每个办事地点的管辖区域不同,事项办理时会受管辖区域限制,您可提前拨打电话进行确认</li>';
		}
		$.each(sortList(item.hallList, myPoint), function(i, item) {
			var dataIndexLength = item.dataIndex.split('/').length;
			if (dataIndexLength >= 2 && item.dataIndex.split('/')[dataIndexLength - 1] !=
				item.dataIndex.split('/')[dataIndexLength - 2]) {
				sContent +=
					'<li class="gen cursor layui-elem-quote" onclick="showMarker(\'' + item.id + '\',\'' + id +
					'\')" ><span class="layui-font-blue">' + item.dataIndex.split('/')[0] +
					'</span><i class="icon-map">' + changeKM(item.distance) +
					' <span class="iconfont">&#xe610;</span></i><br><i class="layui-icon icon-map icon-left layui-icon-location"></i>' +
					item.dataIndex.split('/')[dataIndexLength - 1] + '</li><hr>';
			} else {
				sContent +=
					'<li class="gen cursor layui-elem-quote" onclick="showMarker(\'' + item.id + '\',\'' + id +
					'\')" ><i class="layui-icon icon-map icon-left layui-icon-location"></i>' + item.name +
					'<i class="icon-map">' + changeKM(item.distance) + '</i></li><hr>';
			}

		});
		sContent += '</div>';
	} else {
		// sContent += '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">
		// 			  <legend>该事项暂无现场办理地址</legend>
		// 			</fieldset>';
	}
	if (showFiles) {
		var fileItem = '<div class="layui-tab-item" id="resourceCon">';
		if (!showHall)
			fileItem = '<div class="layui-tab-item layui-show" id="resourceCon">';
		sContent += fileItem;

		filePhoto = item.materialList;
		$.each(item.materialList, function(i, item) {
			//sContent += '<blockquote class="layui-elem-quote">'+item.name+'</blockquote>';
			if (item.materialFile.toLowerCase().indexOf('.jpg') >= 0 || item
				.materialFile.toLowerCase().indexOf(
					'.png') >= 0) {
				sContent +=
					'<li class="cursor" onclick="openPhoto(' + i + ')">' + (i + 1) + '、' + item.name +
					'<i class="iconfont">&#xe648;</i></li><hr>';
			} else {
				sContent +=
					'<li class="cursor" ><a target="_bank" href ="' + getFileUrl(item.materialFile) + '">' + (
						i + 1) + '、' + item.name + ' <i class="iconfont">&#xe7bd;</i></a></li><hr>';
			}
		});
	} else {
		// sContent += '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">
		// 									  <legend>暂无材料说明</legend>
		// 									</fieldset>';
	}
	sContent += '</div>' +
		' </div>' +
		'	</div>' +
		'		</div>' +
		'	</div>';
	//存记录
	setHistory(item.id, item.name, item.dataIndex, "事项");
	return sContent;
}