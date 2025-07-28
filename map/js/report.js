(function reportVisit() {
  try {
    // 获取当前页面的文件名，如 shanghai.html
    const pagePath = window.location.pathname.split("/").pop();

    // 可选：防止重复刷新时反复统计（每个标签页只上报一次）
    if (sessionStorage.getItem('visited_' + pagePath)) {
      console.log(`[访问统计] ${pagePath} 已上报过，跳过`);
      return;
    }

    // 标记为已上报
    sessionStorage.setItem('visited_' + pagePath, '1');

    $.ajax({
      url: getAjaxUrl(getPagePath, pagePath),
      method: "post",
      async: false,
      success: function () {
        console.log(`[访问统计] ${pagePath} 上报成功`);
      },
      error: function () {},
    });
    // 发送统计请求
    // fetch(
    //   `/govmap/appTenantPageVisit/increment?pagePath=${encodeURIComponent(
    //     pagePath
    //   )}`,
    //   {
    //     method: "POST",
    //   }
    // )
    //   .then(() => {
    //     console.log(`[访问统计] ${pagePath} 上报成功`);
    //   })
    //   .catch((err) => {
    //     console.error(`[访问统计] ${pagePath} 上报失败`, err);
    //   });
  } catch (err) {
    console.error("[访问统计] 脚本执行出错", err);
  }
})();
