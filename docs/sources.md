# 来源与许可

本插件的色板、设置页、状态与生命周期实现为本地编写，按包根目录 [MIT LICENSE](../LICENSE) 分发，版权 `Copyright (c) 2026 Tavlo-dsh`。运行时没有复制上游组件、字体、图片、纹理或绘制引擎，没有增加运行时下载。文档 PNG 为本轮实际 DSH 浏览器截图，不是运行时素材。

宿主接口与 token 名称参照固定发布版 `@deepseek-ai/dsh-client-ui-theme@0.2.2-rc.1`、`@deepseek-ai/dsh-client-ui-settings@0.2.2-rc.1`、`@deepseek-ai/dsh-client-ui-layout@0.2.2-rc.1`；来源为 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)。仅调用公开接口、引用 CSS 变量名称，未复制宿主组件实现。实际使用文件与哈希记录见验证报告。

任务插件原有 Looseleaf 复制内容继续留在任务包中，本主题包不重复分发其运行时素材。固定来源为 [kevintngo/looseleaf@4bdb647940e2fefb3cebb394f3bad25c766a27d2](https://github.com/kevintngo/looseleaf/tree/4bdb647940e2fefb3cebb394f3bad25c766a27d2)，仅原有 PAPER_SLIP、PAPER_FIBRE 两张 PNG 与字符串种子哈希适配；没有新增运行时复制范围。任务包保留完整 `licenses/looseleaf-MIT.txt`、固定清单和来源映射；此次只改变样式作用域与颜色变量，不修改 PNG 字节或哈希算法。

文档中的任务截图显示了任务插件已有纹理。为完整保留随截图分发的来源通知，本主题包也附带 [Looseleaf 完整 MIT 许可](looseleaf-license.md)，与任务包通知逐字节相同，SHA-256 为 `5a7c48962dbd30f330cba18a0f39c28b1e7be566f8d7786f3db148b326b44b38`；没有增加运行时纹理复制范围。其余截图为宿主真实 UI 的验收证据，未提取宿主图标作为插件素材。

如以后向主题包运行时加入纹理、字体或上游组件，必须另行记录固定提交、复制范围、哈希与完整许可；本记录不将现有审查扩大为整个 Looseleaf 项目的复制授权审查。
