# DSH 0.2.2-rc.1 适配记录

核实日期：2026-11-17。同时检查本仓库 `.refs/dsh-src` 源码快照与已安装的 `@deepseek-ai/dsh@0.2.2-rc.1` 发布文件。以下为实际存在的接口，并非假定 API。

| 扩展点 | 核实位置（DSH 源码） | 使用方式 |
| --- | --- | --- |
| `theme.register()` / `setTheme()` | `packages/client/ui-theme/src/client/index.ts` | 存在，但单个 theme 固定 colorScheme，且 setTheme 仅持久化内置 light/dark/system。不适合独立保留宿主模式的纸面选择 |
| `theme.overrideTokens(source, tokens)` | 同上；发布版 `lib/client.js` 与 `lib/types/client/index.d.ts` | 采用；每个 token 显式提供 light/dark；返回 disposer，删除仅自身叠加层并恢复被覆盖值 |
| `settings.section` | `packages/client/ui-settings/src/client/contract/slots.ts` | 注册独立全局主题页，生命周期由 `slots.inject()` 管理 |
| `configForms.get(entryId)` / `set()` / `subscribe()` | `packages/client/ui-settings/src/client/config-form.ts` | 复用 Host 验证、写入串行、revision 检查和共享设置镜像；无 localStorage 双写 |
| `Config` 的 `volatile()` | `packages/client/ui-theme/src/index.ts` | `tavlo-paper-theme.appearance` 取 default/paper，默认 default；Host 保存到 profile 用户配置 |
| `settings.configure({auto:false}, fiber)` | 同上 | 避免重复生成通用配置表单，专用设置页负责编辑 |
| `ThemePresenter` | `packages/client/ui-layout/src/client/theme-presenter.ts` | 宿主管理 body inline token、dark 标记、color-scheme、字体和字号；插件不修改它们的所有权 |
| `ctx.effect()` / slot disposer | Cordis 与 slots | 所有注入资源绑定插件生命周期 |

`client.js` 的 `PALETTE` 集中定义语义色板；`HOST_022_RC1` 集中列出宿主变量映射。全局适配没有 CSS module 哈希选择器、文本匹配、DOM 观察器、绘制循环或逐元素监听。浅深配色由宿主 token 层自动选择，插件不订阅或改写亮暗偏好。

代码高亮沿用宿主 Shiki 渲染器；同一适配表映射 `ui-theme/src/styles/shiki.css` 中的 `--shiki-*` 变量，补齐前景、背景及注释/关键词/字符串等色值。发布版将该样式编译进 `ui-theme/lib/client.js`，没有独立的 `lib/styles/shiki.css`。语法 token 同样由官方叠加层注入与撤销，没有复制或替换 Markdown/代码块组件。

公开给可选插件的变量前缀为 `--dsh-paper-*`，包括 canvas/paper/sheet/sidebar/desk、ink/muted/subtle、line/border、accent/accentSoft/onAccent、highlight/tape/rule，以及状态与代码区色板。变量只在纸面层启用期间存在。联动标记为 `body[data-dsh-paper-theme="paper"]`。其他插件应把自己的装饰规则限定到此标记下，并在缺少标记时使用宿主变量。

0.1.1 新增 `surface` 与 `bubble`，将宿主面板、菜单、代码标题栏和消息气泡的中性色，与任务场景的暖色 `sheet` 分开。共享的是文字、强调色与交互规则，任务纸张底色不再扩散到整个对话工作区。

0.1.2 新增 `card`、`cardWash`、`sheetWash`、`edge`、`markerInfo`、`markerSuccess`、`tapeInfo`、`tapeSuccess`。`card` 专用于任务卡纸，深色比 `sheet` 和 `desk` 更亮；`*Wash` 是覆盖静态纹理的半透明纸色，分别控制浅深模式的材质强度，不影响文字。`edge` 表示纸张叠层，marker/tape 的颜色区分三个任务阶段。任务插件对这些新增变量提供旧 token 回退，更新顺序不构成硬依赖。全局仍只通过官方 token 层适配。

生命周期：读取确认的 Host 设置 → 注册一层 token → 设置标记。关闭或卸载时移除标记并调用 token disposer，清理 ConfigForm 订阅；设置样式节点和语言注册另由 effect 清理。共享 ConfigForm 由宿主所有，本插件只清理自己的订阅，不销毁共享对象。迟到保存响应不能重新激活已卸载的主题。

第三方 token 层按宿主注册顺序合成；较晚注册的层可覆盖相同变量。本插件撤销时保留其他层。对不使用宿主语义变量、自行写死颜色的第三方 UI，无法保证全部覆盖。
