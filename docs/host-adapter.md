# DSH 0.2.2-rc.1 适配记录

核实日期：2026-11-17。同时检查本仓库 `.refs/dsh-src` 源码快照与已安装的 `@deepseek-ai/dsh@0.2.2-rc.1` 发布文件。以下为实际存在的接口，并非假定 API。

| 扩展点 | 核实位置（DSH 源码） | 使用方式 |
| --- | --- | --- |
| `theme.register()` / `setTheme()` | `packages/client/ui-theme/src/client/index.ts` | 单个 theme 固定 colorScheme，且 setTheme 仅持久化内置 light/dark/system；预设需要继续跟随宿主亮暗模式 |
| `theme.overrideTokens(source, tokens)` | 同上；发布版 `lib/client.js` 与 `lib/types/client/index.d.ts` | 采用；每个 token 显式提供 light/dark；返回 disposer，删除仅自身叠加层并恢复被覆盖值 |
| `settings.section` | `packages/client/ui-settings/src/client/contract/slots.ts` | 注册独立全局主题页，生命周期由 `slots.inject()` 管理 |
| `configForms.get(entryId)` / `set()` / `subscribe()` | `packages/client/ui-settings/src/client/config-form.ts` | 复用 Host 验证、写入串行、revision 检查和共享设置镜像；无 localStorage 双写 |
| `Config` 的 `volatile()` | `index.js` | `appearance` 取 `default` / `ios` / `paper`；`taskAppearance` 取 `inherit` / `ios` / `paper`。默认值保持宿主外观和看板跟随，Host 保存到当前 profile |
| `tavlo-tasks.appearance` | 任务插件 `client.js` 的 `main` 插槽 | 任务插件声明可选子插槽，主题插件提供选择器；未安装任一插件都不阻止另一插件运行 |
| `settings.configure({auto:false}, fiber)` | 同上 | 避免重复生成通用配置表单，专用设置页负责编辑 |
| `ThemePresenter` | `packages/client/ui-layout/src/client/theme-presenter.ts` | 宿主管理 body inline token、dark 标记、color-scheme、字体和字号；插件不修改它们的所有权 |
| `ctx.effect()` / slot disposer | Cordis 与 slots | 所有注入资源绑定插件生命周期 |

`client.js` 的 `IOS_PALETTE` 和 `PAPER_PALETTE` 定义预设色板，`HOST_022_RC1` 集中映射宿主变量。两种外观通过 DSH 的 `--dsw-radius-*` 定制圆角；iOS 还定制 `--dsw-shadow-*`。纸面保留原配色，使用较小的卡片和面板圆角。不使用 CSS module 哈希选择器、DOM 观察器或逐元素监听。浅深配色由宿主选择，插件不改写亮暗偏好。

代码高亮沿用宿主 Shiki 渲染器；同一适配表映射 `ui-theme/src/styles/shiki.css` 中的 `--shiki-*` 变量，补齐前景、背景及注释/关键词/字符串等色值。发布版将该样式编译进 `ui-theme/lib/client.js`，没有独立的 `lib/styles/shiki.css`。语法 token 同样由官方叠加层注入与撤销，没有复制或替换 Markdown/代码块组件。

`--dsh-paper-*` 和 `--dsh-ios-*` 仅在对应预设被全局或看板使用时生效。全局标记为 `body[data-dsh-paper-theme="paper"]` 或 `body[data-dsh-paper-theme="ios"]`，仅全局切换使用宿主 token 层。显式看板预设使用优先级更高的 `data-dsh-task-appearance`，由 CSS 在 `.dsh-tasks-root` 内提供所选预设的变量，并通过 `light-dark()` 跟随宿主的 `color-scheme`，不触发全局 `theme/change`。未显式选择时看板跟随全局。共用工具栏与 iOS 看板样式在主题插件；任务插件使用圆角 token 绘制纸面看板，Looseleaf 纸纹及装饰继续随任务插件分发。

任务编辑抽屉的 Looseleaf token 仅在有效外观为纸面时声明于 `.dsh-tasks-editor-drawer`，供抽屉及其后代继承；不向全局 token 层、任务看板、对话或设置页注册这些变量。`taskAppearance: paper` 总是启用，`ios` 总是禁用，`inherit` 不写入任务标记，仅当全局是 `paper` 时启用。全局 `default` 同样不写入主题标记。变量直接使用纸面浅深色板与圆角，跟随宿主 `color-scheme`，因此全局为默认或 iOS 时单独选择任务纸面也可使用。消费端应提供原有 DSH 外观回退，以兼容非纸面外观与未安装主题插件的场景。

以下名称均以 `--dsh-looseleaf-` 为前缀：`control-fill` / `control-line` / `control-ink` / `muted` 用于控件底色、边框、文字及次要文字；`focus` / `hover` / `pressed` 用于交互状态；`primary-fill` / `primary-ink` 用于主要操作；`overlay-fill` / `overlay-shadow` 用于抽屉内浮层；`radius` / `radius-sm` 用于控件及较紧凑的元素。

0.1.1 新增 `surface` 与 `bubble`，将宿主面板、菜单、代码标题栏和消息气泡的中性色，与任务场景的暖色 `sheet` 分开。共享的是文字、强调色与交互规则，任务纸张底色不再扩散到整个对话工作区。

0.1.2 新增 `card`、`cardWash`、`sheetWash`、`edge`、`markerInfo`、`markerSuccess`、`tapeInfo`、`tapeSuccess`。`card` 专用于任务卡纸，深色比 `sheet` 和 `desk` 更亮；`*Wash` 是覆盖静态纹理的半透明纸色，分别控制浅深模式的材质强度，不影响文字。`edge` 表示纸张叠层，marker/tape 的颜色区分三个任务阶段。任务插件对这些新增变量提供旧 token 回退，更新顺序不构成硬依赖。全局仍只通过官方 token 层适配。

生命周期：读取宿主设置作为初始外观。选择时先用内存中的预览更新外观，再串行保存；每个字段只保留最新的未发送选择。不写入浏览器缓存，保存失败回退到宿主确认值。全局选择更新同一来源的 token 层，看板选择只更新标记。关闭或卸载时撤销标记与 token 层，清理插槽、样式、语言和 ConfigForm 订阅。共享 ConfigForm 由宿主所有，本插件只清理自己的订阅。迟到保存响应不会重新激活已卸载的主题。

第三方 token 层按宿主注册顺序合成；较晚注册的层可覆盖相同变量。本插件撤销时保留其他层。对不使用宿主语义变量、自行写死颜色的第三方 UI，无法保证全部覆盖。
