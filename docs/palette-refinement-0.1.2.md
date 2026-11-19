# 0.1.2 明亮配色与纸张层次

用户反馈 0.1.1 浅色仍发灰、深色看不出纸张质感。本轮同时调整全局色板和任务页材质；不改变任务业务、主题设置或生命周期。

浅色主画布改为纯白，侧栏和任务底板使用接近白色的浅蓝，文字更深，交互绿色更清晰。去掉任务底板全幅纤维、微线网格以及工具栏、表单和选择列表的粗纹理。纸纹只用于任务纸页和卡片，并降低强度；黄色、蓝色、绿色胶带与标题高亮区分任务列。

深色保留清晰的深色对话工作区，任务页依次使用暗底板、横线纸页、稍暖且更亮的卡纸。纸边叠层、小折角和分色胶带提供纸张结构。第二轮实际截图复核发现粗纹理仍有皮革感，因此进一步降低纹理强度，不使用统一 soft-light。

| 语义区域 | 浅色 | 深色 |
| --- | --- | --- |
| 对话画布 | `#ffffff` | `#15171c` |
| 侧栏 | `#f7fbff` | `#1d2129` |
| 输入框、菜单与弹框 | `#ffffff` | `#252932` |
| 交互强调 | `#087f5b` | `#69e3ad` |
| 任务底板 | `#f1f9ff` | `#191e27` |
| 横线纸页 | `#fffef8` | `#272d36` |
| 任务卡纸 | `#ffffff` | `#45433f` |

新增材料 token 及旧版回退方式见 [宿主适配记录](host-adapter.md)。所有颜色仍由主题插件统一管理；任务插件只增加局部 CSS 装饰，无新的监听、观察器、绘制循环、在线字体或运行时依赖。固定来源与两张 PNG 没有变化，完整 MIT 许可继续保留。

## 验证范围

环境为 Windows x64、Node 24.18.1、DSH 0.2.2-rc.1 Web renderer、Edge 157.0.4341.60。浏览器脚本创建全新的临时 DSH home，使用合成离线会话，不读取日常任务或会话，不调用模型。

- 本轮开始时运行的任务快照回归 **96 项通过**；主题状态、生命周期与语义对比度测试 **11 项通过**。任务目录内后续独立业务编辑不属于这次主题验证结论。
- [完整浏览器报告](browser-verification-0.1.2.json)：主题独立安装、默认→纸面→默认、浅深与跟随系统、刷新/宿主重启、跨页同步、禁用/重新启用和卸载清理。
- 组合场景覆盖真实创建、搜索和删除任务，自定义列表、点击外部/Tab/Esc/窗口失焦关闭、弹框焦点、任务与消息草稿保留、Markdown/代码、菜单，以及 375/768/1024/1366 px 布局。
- 材质检查确认工具栏和底板无纹理、纸页和卡片保留纹理、三个胶带颜色不同、浅深模式卡片均比纸页和底板更亮。
- [仅安装任务插件](tasks-standalone-verification-0.1.2.json)：另一个新 home 从未安装主题，创建任务、宿主浅深模式与无纸面资源检查通过。最后一次折角与纹理微调仅在纸面作用域内；独立场景沿用本轮第一次检查，没有重复执行。
- [语义文字对比度](contrast-samples-0.1.2.json)：66 个样本，最低 **4.59:1**。这是名义 token 配色抽样，不是纹理像素测量或完整无障碍认证。
- 离线 Looseleaf 审查复核 60 个文件、完整 MIT 与两张 PNG，均匹配固定来源。
- 最终组合验收通过，未捕获浏览器异常和 console error；共保存 22 张截图（含两个独立任务场景）。交付主题包逐字节核对运行时与最终浏览器测试包相同，结果见交付目录 `package-verification.json`。

任务目录有独立进行中的 0.2.0 服务/存储/MCP 工作。本次不发布或覆盖这些业务改动。浏览器验收固定使用本轮首次打包的任务运行时快照，并在最后一轮仅替换其 `client.js`；测试 tarball 的 SHA-256 记录在报告中。本地任务仍保持原有目录链接，本次只修改展示 CSS。

## 实际截图

| 场景 | 浅色 | 深色 |
| --- | --- | --- |
| 任务看板 | [白纸与分色标记](screenshots/v0.1.2/07-tasks-paper-light.png) | [夜间卡纸与纸边](screenshots/v0.1.2/11-tasks-paper-dark.png) |
| 对话与代码 | [明亮工作区](screenshots/v0.1.2/14-paper-conversation-light.png) | [深色阅读](screenshots/v0.1.2/16-paper-conversation-dark.png) |
| 表单与列表 | [任务选择列表](screenshots/v0.1.2/09-tasks-paper-select.png) | [深色选择列表](screenshots/v0.1.2/12-tasks-paper-dark-select.png) |
| 未安装主题 | [DSH 默认任务页](screenshots/v0.1.2/19-tasks-only-light.png) | [DSH 默认任务页](screenshots/v0.1.2/20-tasks-only-dark.png) |

[375 px 任务浮层](screenshots/v0.1.2/10-tasks-paper-narrow.png) · [375 px 对话](screenshots/v0.1.2/17-paper-conversation-narrow.png) · [删除弹框](screenshots/v0.1.2/13-tasks-delete-dialog.png) · [全局设置](screenshots/v0.1.2/02-paper-settings.png)

## 安装与复现

交付主题包位于仓库 `artifacts/paper-theme-20261117-v0.1.2/`。安装后刷新当前 DSH 页面；若运行中的宿主仍缓存旧 Client，再重启 DSH。已有全局主题选择保留，新安装仍默认不启用。关闭或卸载说明见 [README](../README.md)。

```powershell
dsh plugin --profile web add ./dsh-plugin-paper-theme-0.1.2.tgz
npm test
node scripts/verify-palette.mjs
$env:DSH_CLI = '<DSH CLI bin.js 的绝对路径>'
$env:PLAYWRIGHT_MODULE = '<Playwright index.mjs 的绝对路径>'
$env:BROWSER_EXECUTABLE = '<浏览器可执行文件的绝对路径>'
$env:SCREENSHOT_OUTPUT = 'docs/screenshots/v0.1.2'
$env:VERIFICATION_REPORT = 'docs/browser-verification-0.1.2.json'
node scripts/verify-browser.mjs <theme.tgz> <tasks.tgz>
```

尚未验证其他 DSH 版本、其他浏览器、桌面外框或全部第三方插件的硬编码色值。本轮浏览器没有配置在线模型，因此没有执行真实模型推理；业务行为由现有回归与离线界面操作验证。颜色与纸质观感仍需使用者在实际显示器上判断。
