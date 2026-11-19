/** DSH 0.2.2-rc.1 browser plugin. Host React, official settings and token layers. */
window.__ModuleLoader__.load({
  id: '@tavlo-dsh/dsh-plugin-paper-theme',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const ID = 'dsh-plugin-paper-theme'
    const NS = 'tavlo-paper-theme'
    const ATTRIBUTE = 'data-dsh-paper-theme'
    const TASK_ATTRIBUTE = 'data-dsh-task-appearance'
    const TASK_SLOT = 'tavlo-tasks.appearance'
    const APPEARANCES = ['default', 'ios', 'paper']
    const TASK_APPEARANCES = ['inherit', 'ios', 'paper']

    // Public palette: shared with optional consumers through inherited variables.
    // No font, color-scheme, animation, or layout dimensions are overridden.
    const PAPER_PALETTE = {
      canvas: ['#ffffff', '#15171c'],
      paper: ['#ffffff', '#252932'],
      sheet: ['#fffef8', '#272d36'],
      surface: ['#f5faff', '#292f3a'],
      sidebar: ['#f7fbff', '#1d2129'],
      desk: ['#f1f9ff', '#191e27'],
      ink: ['#182331', '#f1f4f9'],
      muted: ['#526176', '#bdc8d8'],
      subtle: ['#58687d', '#abb9cb'],
      line: ['#b4c5d6', '#5d6b7e'],
      border: ['#e1eaf2', '#363e4c'],
      accent: ['#087f5b', '#69e3ad'],
      accentHover: ['#006b4b', '#96f0c8'],
      onAccent: ['#ffffff', '#102b20'],
      accentSoft: ['#e5faef', '#203e33'],
      bubble: ['#ecf7ff', '#273544'],
      highlight: ['#ffed92', '#675527'],
      tape: ['#ffe68dbf', '#f8d875b3'],
      rule: ['#8aaac528', '#acc4db24'],
      // Stationery materials are independent of host dialog/composer surfaces.
      card: ['#ffffff', '#45433f'],
      cardWash: ['#ffffffc9', '#45433fc9'],
      sheetWash: ['#fffef8d9', '#272d36ed'],
      edge: ['#edf2f6', '#827d71'],
      markerInfo: ['#c9eeff', '#264e68'],
      markerSuccess: ['#bbf4d7', '#25573f'],
      tapeInfo: ['#afe4ffb8', '#91cfeeaa'],
      tapeSuccess: ['#a6eac8b8', '#87d4b0aa'],
      code: ['#f5faff', '#101318'],
      hover: ['#1673b009', '#c6ddff10'],
      active: ['#1673b012', '#c6ddff1c'],
      shadow: ['#2a52781a', '#00000055'],
      mask: ['#17283c30', '#080d1680'],
      danger: ['#ba3548', '#ffabb6'],
      dangerSoft: ['#fff0f2', '#4b2935'],
      warning: ['#865a05', '#f5d382'],
      warningSoft: ['#fff8da', '#473b21'],
      success: ['#127345', '#8de6b3'],
      successSoft: ['#e8fbef', '#203e30'],
      info: ['#176da0', '#9fd9ff'],
      infoSoft: ['#ebf7ff', '#223c50'],
      syntaxFunction: ['#8451b4', '#d9b4ff'],
    }
    const IOS_PALETTE = {
      canvas: ['#ffffff', '#171719'],
      paper: ['#ffffff', '#252527'],
      surface: ['#f6f9fd', '#303033'],
      sidebar: ['#f6faff', '#1e1e20'],
      ink: ['#182438', '#f5f5f7'],
      muted: ['#465772', '#bdbdc7'],
      subtle: ['#52647d', '#a9a9b5'],
      line: ['#cbd9eb', '#606068'],
      border: ['#e0ebf6', '#3d3d43'],
      accent: ['#0065d7', '#80baff'],
      accentHover: ['#0056ba', '#a1ccff'],
      onAccent: ['#ffffff', '#10243b'],
      accentSoft: ['#edf5ff', '#273b56'],
      bubble: ['#e9f3ff', '#27364b'],
      highlight: ['#d9ebff', '#344b6b'],
      code: ['#f5f8fc', '#202023'],
      hover: ['#0065d709', '#ffffff0d'],
      active: ['#0065d714', '#80baff24'],
      shadow: ['#16376912', '#00000040'],
      mask: ['#213c6024', '#08080a85'],
      danger: ['#b32135', '#ffabb5'],
      dangerSoft: ['#fcebef', '#502d35'],
      warning: ['#805104', '#ffda90'],
      warningSoft: ['#fff1d9', '#463921'],
      success: ['#1a6844', '#90e4b0'],
      successSoft: ['#e7f5ed', '#263f33'],
      info: ['#005baf', '#a0cdff'],
      infoSoft: ['#e8f2ff', '#273b56'],
      syntaxFunction: ['#7343a5', '#d9baff'],
    }
    const PAPER_SHAPE = {
      '--dsw-radius-xs': '6px',
      '--dsw-radius-sm': '10px',
      '--dsw-radius-md': '14px',
      '--dsw-radius-lg': '16px',
      '--dsw-radius-xl': '20px',
      '--dsw-radius-panel': '24px',
    }
    const IOS_SHAPE = {
      '--dsw-radius-xs': '6px',
      '--dsw-radius-sm': '10px',
      '--dsw-radius-md': '14px',
      '--dsw-radius-lg': '20px',
      '--dsw-radius-xl': '24px',
      '--dsw-radius-panel': '30px',
      '--dsw-shadow-lv1': '0 1px 2px var(--dsh-ios-shadow)',
      '--dsw-shadow-lv1-blur': '0 3px 12px var(--dsh-ios-shadow)',
      '--dsw-shadow-lv2': '0 5px 18px var(--dsh-ios-shadow)',
      '--dsw-shadow-lv3': '0 14px 40px var(--dsh-ios-shadow)',
    }

    // Versioned host adapter. All host token names live here; no hashed class selectors.
    const HOST_022_RC1 = {
      '--dsw-alias-bg-base': 'canvas',
      '--dsw-alias-bg-layer-1': 'paper',
      '--dsw-alias-bg-layer-2': 'surface',
      '--dsw-alias-bg-layer-3': 'sidebar',
      '--dsw-alias-bg-overlay': 'paper',
      '--dsw-alias-bg-mask-1': 'mask',
      '--dsw-alias-bg-module-platform': 'surface',
      '--dsw-alias-bg-multi-select': 'surface',
      '--dsw-alias-border-l1': 'border',
      '--dsw-alias-border-l2': 'border',
      '--dsw-alias-border-l2-darkmode-thin': 'border',
      '--dsw-alias-border-l3': 'line',
      '--dsw-alias-border-l4': 'line',
      '--dsw-alias-label-primary': 'ink',
      '--dsw-alias-label-primary-bluish': 'ink',
      '--dsw-alias-label-primary-dimmed': 'ink',
      '--dsw-alias-label-secondary': 'muted',
      '--dsw-alias-label-tertiary': 'subtle',
      '--dsw-alias-label-caption': 'subtle',
      '--dsw-alias-label-primary-foreground': 'onAccent',
      '--dsw-alias-brand-primary': 'accent',
      '--dsw-alias-brand-primary-new-colorprimary-new-color': 'accent',
      '--dsw-alias-brand-text': 'accent',
      '--dsw-alias-link': 'accent',
      '--dsw-alias-label-deep-diving': 'accent',
      '--dsw-alias-label-deep-diving-shimmer': 'accentHover',
      '--dsw-alias-button-primary-fill': 'accent',
      '--dsw-alias-button-primary-hover': 'accentHover',
      '--dsw-alias-button-primary-dimmed': 'border',
      '--dsw-alias-button-contrast-fill': 'accent',
      '--dsw-alias-button-info-fill': 'accent',
      '--dsw-alias-button-info-hover': 'accentHover',
      '--dsw-alias-button-elevated-fill': 'surface',
      '--dsw-alias-button-floating-fill': 'paper',
      '--dsw-alias-button-floating-hover': 'surface',
      '--dsw-alias-button-ghost-active-fill': 'accentSoft',
      '--dsw-alias-button-ghost-active-hover': 'surface',
      '--dsw-alias-button-ghost-active-border': 'line',
      '--dsw-alias-interactive-bg-hover': 'hover',
      '--dsw-alias-interactive-bg-hover-solid': 'surface',
      '--dsw-alias-interactive-bg-hover-accent': 'active',
      '--dsw-alias-interactive-bg-active': 'active',
      '--dsw-alias-markdown-code-block': 'code',
      '--dsw-alias-markdown-code-block-banner': 'surface',
      '--dsw-alias-markdown-inline-code': 'code',
      '--dsw-alias-markdown-code-segment-selected': 'paper',
      '--dsw-alias-markdown-code-segment-unselected': 'code',
      '--dsw-alias-markdown-citation': 'surface',
      '--dsw-alias-state-business-primary': 'accent',
      '--dsw-alias-state-business-tertiary': 'accentSoft',
      '--dsw-alias-state-success-primary': 'success',
      '--dsw-alias-state-success-tertiary': 'successSoft',
      '--dsw-alias-state-warn-primary': 'warning',
      '--dsw-alias-state-warn-label': 'warning',
      '--dsw-alias-state-warn-tertiary': 'warningSoft',
      '--dsw-alias-state-error-primary': 'danger',
      '--dsw-alias-menu-icon': 'muted',
      '--dsw-alias-menu-group-header-fill': 'surface',
      '--dsw-specific-menu': 'paper',
      '--dsw-menu-surface-fill': 'paper',
      '--dsw-specific-selector': 'surface',
      '--dsw-specific-sidebar-fill': 'sidebar',
      '--dsw-specific-sidebar-nav-item-active': 'accentSoft',
      '--dsw-specific-sidebar-nav-item-active-accent': 'accentSoft',
      '--dsw-specific-input-major': 'paper',
      '--dsw-specific-bubble': 'bubble',
      '--dsw-specific-bubble-highlight': 'highlight',
      '--dsw-specific-tip': 'surface',
      '--dsw-focus-ring-color': 'accent',
      '--shiki-foreground': 'ink',
      '--shiki-background': 'code',
      '--shiki-token-constant': 'info',
      '--shiki-token-string': 'accent',
      '--shiki-token-comment': 'muted',
      '--shiki-token-keyword': 'danger',
      '--shiki-token-parameter': 'warning',
      '--shiki-token-function': 'syntaxFunction',
      '--shiki-token-string-expression': 'accent',
      '--shiki-token-punctuation': 'ink',
      '--shiki-token-link': 'info',
    }
    const PALETTES = { ios: IOS_PALETTE, paper: PAPER_PALETTE }
    const color = (appearance, name) => `var(--dsh-${appearance}-${name})`
    const paletteTokens = Object.fromEntries(Object.entries(PALETTES).map(([appearance, palette]) => [appearance,
      Object.fromEntries(Object.entries(palette).map(([name, [light, dark]]) => [`--dsh-${appearance}-${name}`, { light, dark }]))]))
    const hostVariables = Object.fromEntries(Object.keys(PALETTES).map(appearance => [appearance, {
      ...Object.fromEntries(Object.entries(HOST_022_RC1).map(([name, palette]) => [name, color(appearance, palette)])),
      ...(appearance === 'ios' ? IOS_SHAPE : PAPER_SHAPE),
    }]))
    const fixedModes = variables => Object.fromEntries(Object.entries(variables).map(([name, value]) => [name, { light: value, dark: value }]))
    const globalTokens = Object.fromEntries(Object.keys(PALETTES).map(appearance => [appearance, {
      ...paletteTokens[appearance], ...fixedModes(hostVariables[appearance]),
    }]))
    const cssVariables = variables => Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`).join('\n')
    const modeColor = ([light, dark]) => `light-dark(${light}, ${dark})`
    const taskVariables = appearance => cssVariables({
      ...Object.fromEntries(Object.entries(PALETTES[appearance]).map(([name, modes]) => [`--dsh-${appearance}-${name}`, modeColor(modes)])),
      ...hostVariables[appearance],
    })

    const EN = {
      title: 'Global theme', intro: 'Choose an appearance for your DSH workspace.',
      choice: 'Appearance style', default: 'DSH default', ios: 'iOS rounded', paper: 'Paper theme',
      defaultNote: 'Keep the original DSH look.', iosNote: 'Bright white, soft blue accents and clean, rounded surfaces.',
      paperNote: 'Rounded sheets, paper textures and tape on the task board.',
      taskChoice: 'Task card appearance', taskChoiceShort: 'Appearance', inherit: 'Follow DSH theme',
      taskFailed: 'Could not save the task card appearance. Please try again.',
      follow: 'Light and dark mode, fonts and text sizes follow DSH General settings.',
      saved: 'Saved for this DSH profile. All connected pages follow this choice.',
      saving: 'Saving…', loading: 'Loading theme preference…',
      unavailable: 'Theme settings are unavailable or read-only.',
      failed: 'Could not confirm the saved preference. The last confirmed theme is shown. Please retry.',
      unsupported: 'This host does not provide the required theme interface. Supported: DSH 0.2.2-rc.1.',
    }
    const ZH = {
      title: '全局主题', intro: '为 DSH 工作区选择一套外观。',
      choice: '外观风格', default: 'DSH 默认', ios: 'iOS 圆角', paper: '纸面主题',
      defaultNote: '保留 DSH 原有外观。', iosNote: '清透白底、浅蓝点缀与简洁圆角。',
      paperNote: '圆角横线纸，保留纸纹与胶带。',
      taskChoice: '任务卡片外观', taskChoiceShort: '外观', inherit: '跟随全局',
      taskFailed: '未能保存任务卡片外观，请重试。',
      follow: '亮暗模式、字体和字号继续跟随 DSH「通用」设置。',
      saved: '已保存到当前 DSH profile，连接此宿主的页面同步生效。',
      saving: '正在保存…', loading: '正在加载主题偏好…',
      unavailable: '主题设置暂不可用，或当前连接只允许读取。',
      failed: '未能确认偏好已保存，当前显示最后确认的主题。请重试。',
      unsupported: '当前宿主缺少所需主题接口。支持版本：DSH 0.2.2-rc.1。',
    }

    const SETTINGS_CSS = `
.dsh-paper-settings { max-width: 720px; margin: 0 auto; color: var(--dsw-alias-label-primary); font: inherit; }
.dsh-paper-settings h2 { margin: 0 0 6px; font-size: 25px; font-weight: 650; letter-spacing: -.025em; }
.dsh-paper-settings p { margin: 0 0 8px; color: var(--dsw-alias-label-secondary); line-height: 1.6; }
.dsh-paper-settings fieldset { border: 0; margin: 24px 0 18px; padding: 0; min-width: 0; }
.dsh-paper-settings legend { font-weight: 600; padding: 0 0 12px; }
.dsh-paper-choices { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr)); gap: 12px; }
.dsh-paper-choice { display: grid; gap: 8px; align-content: start; min-width: 0; padding: 10px; border: 1px solid var(--dsw-alias-border-l3); border-radius: 18px; background: var(--dsw-alias-bg-layer-1); cursor: pointer; }
.dsh-paper-choice:hover { background: var(--dsw-alias-bg-layer-2); }
.dsh-paper-choice:has(:checked) { border-color: var(--dsw-alias-state-business-primary); background: var(--dsw-alias-state-business-tertiary); }
.dsh-paper-choice-title { display: flex; align-items: center; gap: 7px; padding: 0 3px; }
.dsh-paper-choice input { margin: 0; accent-color: var(--dsw-alias-state-business-primary); }
.dsh-paper-choice input:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 3px; }
.dsh-paper-choice small { padding: 0 3px 2px; color: var(--dsw-alias-label-secondary); line-height: 1.5; }
.dsh-paper-choice:has(:disabled) { cursor: default; }
.dsh-paper-preview { --preview-desk: light-dark(#f0f2f7, #24242a); --preview-rail: light-dark(#e0e4ed, #34343f); --preview-card: light-dark(#fff, #44444d); --preview-ink: light-dark(#6e7f9a, #b4c4df); --preview-radius: 7px; display: grid; grid-template-columns: 24% 1fr; gap: 6px; height: 64px; padding: 6px; box-sizing: border-box; border-radius: 12px; background: var(--preview-desk); }
.dsh-paper-choice[data-theme-choice="ios"] .dsh-paper-preview { --preview-desk: ${modeColor(IOS_PALETTE.surface)}; --preview-rail: ${modeColor(IOS_PALETTE.bubble)}; --preview-card: ${modeColor(IOS_PALETTE.paper)}; --preview-ink: ${modeColor(IOS_PALETTE.accent)}; --preview-radius: 12px; }
.dsh-paper-choice[data-theme-choice="paper"] .dsh-paper-preview { --preview-desk: ${modeColor(PAPER_PALETTE.desk)}; --preview-rail: ${modeColor(PAPER_PALETTE.sheet)}; --preview-card: ${modeColor(PAPER_PALETTE.card)}; --preview-ink: ${modeColor(PAPER_PALETTE.accent)}; --preview-radius: 9px; }
.dsh-paper-preview-rail { border-radius: var(--preview-radius); background: var(--preview-rail); }
.dsh-paper-preview-card { position: relative; display: grid; align-content: center; gap: 6px; padding: 7px; border-radius: var(--preview-radius); background: var(--preview-card); box-shadow: 0 1px 4px rgb(0 0 0 / 12%); }
.dsh-paper-preview-card span { width: 72%; height: 3px; border-radius: 99px; background: var(--preview-ink); opacity: .22; }
.dsh-paper-preview-card span:first-child { width: 43%; opacity: .75; }
.dsh-paper-choice[data-theme-choice="paper"] .dsh-paper-preview-card { background: repeating-linear-gradient(transparent 0 8px, ${modeColor(PAPER_PALETTE.rule)} 8px 9px), var(--preview-card); }
.dsh-paper-choice[data-theme-choice="paper"] .dsh-paper-preview-card::before { content: ''; position: absolute; top: -4px; left: 35%; width: 30%; height: 8px; transform: rotate(-5deg); background: ${modeColor(PAPER_PALETTE.tape)}; }
.dsh-paper-settings [role="alert"] { color: var(--dsw-alias-state-error-primary); }
@media (forced-colors: active) { .dsh-paper-choice:has(:checked) { border: 2px solid Highlight; } }
`

    const TASK_CSS = `
body[data-dsh-task-appearance="paper"] .dsh-tasks-root {
${taskVariables('paper')}
}
body[data-dsh-task-appearance="ios"] .dsh-tasks-root {
${taskVariables('ios')}
}
/* Looseleaf task editor contract; use the palette directly for task-only Paper. */
:is(body[data-dsh-task-appearance="paper"], body[data-dsh-paper-theme="paper"]:not([data-dsh-task-appearance="ios"])) .dsh-tasks-editor-drawer {
  --dsh-looseleaf-control-fill: ${modeColor(PAPER_PALETTE.surface)};
  --dsh-looseleaf-control-line: ${modeColor(PAPER_PALETTE.line)};
  --dsh-looseleaf-control-ink: ${modeColor(PAPER_PALETTE.ink)};
  --dsh-looseleaf-muted: ${modeColor(PAPER_PALETTE.muted)};
  --dsh-looseleaf-focus: ${modeColor(PAPER_PALETTE.accent)};
  --dsh-looseleaf-hover: ${modeColor(PAPER_PALETTE.hover)};
  --dsh-looseleaf-pressed: ${modeColor(PAPER_PALETTE.active)};
  --dsh-looseleaf-primary-fill: ${modeColor(PAPER_PALETTE.accent)};
  --dsh-looseleaf-primary-ink: ${modeColor(PAPER_PALETTE.onAccent)};
  --dsh-looseleaf-overlay-fill: ${modeColor(PAPER_PALETTE.paper)};
  --dsh-looseleaf-overlay-shadow: 0 6px 22px ${modeColor(PAPER_PALETTE.shadow)};
  --dsh-looseleaf-radius: ${PAPER_SHAPE['--dsw-radius-sm']};
  --dsh-looseleaf-radius-sm: ${PAPER_SHAPE['--dsw-radius-xs']};
}
:is(body[data-dsh-task-appearance="ios"], body[data-dsh-task-appearance="paper"], body:is([data-dsh-paper-theme="ios"], [data-dsh-paper-theme="paper"]):not([data-dsh-task-appearance])) .dsh-tasks-root:not(.dsh-tasks-drawer-layer) {
  min-width: 0;
  isolation: isolate;
  container: dsh-tasks / inline-size;
  & .dsh-tasks-toolbar {
    --dsh-tasks-control-size: 36px;
    position: relative; z-index: 5; margin: 0; padding: 14px var(--dsh-tasks-board-gutter, 16px) 0; gap: 6px;
    flex-wrap: nowrap; border: 0; background: transparent; box-shadow: none;
    & .dsh-tasks-heading { flex: none; margin-inline-end: 12px; }
    & .dsh-tasks-title { font-size: 22px; font-weight: 700; letter-spacing: -.025em; white-space: nowrap; }
    & :is(.dsh-tasks-logo, .dsh-tasks-divider, .dsh-tasks-appearance-full) { display: none; }
    & .dsh-tasks-search-wrap { flex: 1 1 224px; min-width: 0; max-width: 272px; }
    & .dsh-tasks-search-wrap > .dsh-tasks-icon { top: 50%; transform: translateY(-50%); }
    & :is(.dsh-tasks-search, .dsh-tasks-filter > summary, .dsh-tasks-appearance select, .dsh-tasks-column-control, .dsh-tasks-icon-button, .dsh-tasks-primary) {
      box-sizing: border-box; height: auto; min-height: var(--dsh-tasks-control-size); border-radius: var(--dsw-radius-sm);
    }
    & .dsh-tasks-search { width: 100%; border-color: transparent; background: var(--dsh-tasks-toolbar-search, var(--dsw-alias-bg-layer-2)); }
    & .dsh-tasks-search:focus { border-color: var(--dsw-alias-state-business-primary); }
    & .dsh-tasks-filter > summary { justify-content: center; padding: 0 10px; white-space: nowrap; }
    & :is(.dsh-tasks-filter > summary, .dsh-tasks-appearance select, .dsh-tasks-column-control, .dsh-tasks-label-control) { border: 1px solid transparent; color: var(--dsw-alias-label-secondary); background: transparent; box-shadow: none; }
    & .dsh-tasks-label-control { display: inline-flex; align-items: center; gap: 5px; min-height: var(--dsh-tasks-control-size); padding-inline: 8px; white-space: nowrap; }
    & .dsh-tasks-label-control:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
    & :is(.dsh-tasks-filter > summary:hover, .dsh-tasks-filter[open] > summary, .dsh-tasks-appearance select:hover:not(:disabled), .dsh-tasks-column-control:hover) {
      color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2);
    }
    & .dsh-tasks-filter .dsh-tasks-menu { top: calc(100% + 6px); }
    & .dsh-tasks-spacer { min-width: 8px; }
    & .dsh-tasks-appearance { min-width: 0; max-width: 16em; font-size: inherit; }
    & .dsh-tasks-appearance label { min-width: 0; gap: 2px; white-space: nowrap; }
    & .dsh-tasks-appearance-compact { display: inline; }
    & .dsh-tasks-appearance select { min-width: 0; padding: 0 6px; text-overflow: ellipsis; }
    & .dsh-tasks-appearance [role="alert"] { overflow-wrap: anywhere; }
    & .dsh-tasks-column-control { flex: none; white-space: nowrap; }
    & .dsh-tasks-icon-button { flex: none; width: var(--dsh-tasks-control-size); }
    & .dsh-tasks-primary { flex: none; gap: 6px; padding-inline: 13px; white-space: nowrap; }
  }
  & .dsh-tasks-paper-note { display: none; }
  @container dsh-tasks (max-width: 800px) {
    & .dsh-tasks-toolbar .dsh-tasks-column-control { display: inline-flex; align-items: center; justify-content: center; width: var(--dsh-tasks-control-size); padding: 0; }
    & .dsh-tasks-toolbar .dsh-tasks-column-control > .dsh-tasks-icon { display: inline-flex; }
    & .dsh-tasks-toolbar .dsh-tasks-column-control-label { display: none; }
  }
  @container dsh-tasks (700px < width <= 800px) {
    & .dsh-tasks-toolbar .dsh-tasks-appearance-compact { display: none; }
  }
  @container dsh-tasks (max-width: 700px) {
    & .dsh-tasks-toolbar {
      display: grid; gap: 8px;
      grid-template-columns: minmax(0, auto) minmax(0, 1fr) auto auto auto;
      grid-template-areas: "title search search search filter" "appearance labels columns refresh create";
      & .dsh-tasks-heading { grid-area: title; margin: 0; }
      & .dsh-tasks-title { font-size: 20px; overflow: hidden; text-overflow: ellipsis; }
      & .dsh-tasks-search-wrap { grid-area: search; max-width: none; }
      & .dsh-tasks-filter { grid-area: filter; justify-self: stretch; }
      & .dsh-tasks-filter .dsh-tasks-menu:not([popover]) { left: auto !important; right: 0 !important; }
      & .dsh-tasks-label-control { grid-area: labels; justify-self: end; width: var(--dsh-tasks-control-size); padding: 0; justify-content: center; }
      & .dsh-tasks-label-control > span:last-child { display: none; }
      & .dsh-tasks-spacer { display: none; }
      & .dsh-tasks-appearance { grid-area: appearance; justify-self: start; }
      & .dsh-tasks-column-control { grid-area: columns; }
      & .dsh-tasks-icon-button { grid-area: refresh; }
      & .dsh-tasks-primary { grid-area: create; }
    }
  }
  @media (max-width: 620px) {
    & .dsh-tasks-toolbar { padding-inline: var(--dsh-tasks-board-gutter, 8px); }
  }
  @media (pointer: coarse) {
    & .dsh-tasks-toolbar { --dsh-tasks-control-size: 44px; }
  }
}
:is(body[data-dsh-task-appearance="ios"], body[data-dsh-paper-theme="ios"]:not([data-dsh-task-appearance="paper"])) .dsh-tasks-root {
  min-width: 0;
  isolation: isolate;
  & .dsh-tasks-logo { width: 32px; height: 32px; border: 0; border-radius: var(--dsw-radius-sm); background: var(--dsw-alias-state-business-tertiary); color: var(--dsw-alias-state-business-primary); }
  & .dsh-tasks-board { gap: 16px; padding: 16px; }
  & .dsh-tasks-col { border-radius: var(--dsw-radius-xl); background: var(--dsw-alias-bg-layer-2); max-width: none; }
  & .dsh-tasks-colhead { padding: 13px 14px; }
  & .dsh-tasks-colname { font-size: 14px; }
  & .dsh-tasks-count { height: 20px; font-family: inherit; font-variant-numeric: tabular-nums; }
  & .dsh-tasks-col[data-stage="doing"] .dsh-tasks-count { color: var(--dsh-ios-info); background: var(--dsh-ios-infoSoft); }
  & .dsh-tasks-col[data-stage="done"] .dsh-tasks-count { color: var(--dsh-ios-success); background: var(--dsh-ios-successSoft); }
  & .dsh-tasks-collist { padding: 0 10px 8px; }
  & .dsh-tasks-card { padding: 12px 14px; margin-bottom: 10px; border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-bg-layer-1); box-shadow: var(--dsw-shadow-lv1); }
  & .dsh-tasks-card:hover { border-color: var(--dsw-alias-border-l3); }
  & .dsh-tasks-card-title { font-size: 14px; font-weight: 650; line-height: 24px; }
  & .dsh-tasks-card-brief { margin-top: 5px; line-height: 1.55; }
  & :is(.dsh-tasks-card-meta, .dsh-tasks-card-state) { font-family: inherit; }
  & .dsh-tasks-card-state { flex-wrap: wrap; margin: 8px 0 6px; }
  & .dsh-tasks-status-label { display: inline-flex; align-items: center; gap: 5px; padding: 2px 7px; border-radius: 999px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); }
  & [data-task-status="running"] .dsh-tasks-status-label { color: var(--dsh-ios-info); background: var(--dsh-ios-infoSoft); }
  & :is([data-task-status="approval"], [data-task-status="question"]) .dsh-tasks-status-label { color: var(--dsh-ios-warning); background: var(--dsh-ios-warningSoft); }
  & [data-task-status="error"] .dsh-tasks-status-label { color: var(--dsh-ios-danger); background: var(--dsh-ios-dangerSoft); }
  & .dsh-tasks-dot { width: 6px; height: 6px; border: 0; background: currentColor; }
  & .dsh-tasks-card-buttons { flex-wrap: wrap; }
  & :is(.dsh-tasks-primary, .dsh-tasks-secondary, .dsh-tasks-retry, .dsh-tasks-add) { border-radius: 999px; min-height: 32px; }
  & .dsh-tasks-primary { color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-primary-fill); font-weight: 600; }
  & .dsh-tasks-primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); opacity: 1; }
  & :is(.dsh-tasks-secondary, .dsh-tasks-retry):hover:not(:disabled) { background: var(--dsw-alias-state-business-tertiary); }
  & .dsh-tasks-danger.dsh-tasks-primary { color: var(--dsh-ios-danger); background: var(--dsh-ios-dangerSoft); }
  & .dsh-tasks-icon-button { border-radius: 999px; width: 32px; height: 32px; }
  & .dsh-tasks-card-actions > summary { opacity: 1; width: 24px; height: 24px; }
  & :is(.dsh-tasks-menu, .dsh-tasks-select-list) { border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-1); box-shadow: var(--dsw-shadow-lv2); }
  & :is(.dsh-tasks-menu button, .dsh-tasks-select-option) { border-radius: var(--dsw-radius-sm); }
  & .dsh-tasks-dialog { border-radius: var(--dsw-radius-xl); background: var(--dsw-alias-bg-layer-1); box-shadow: var(--dsw-shadow-lv3); }
  & .dsh-tasks-dialog.dsh-tasks-drawer { border-radius: var(--dsw-radius-xl) 0 0 var(--dsw-radius-xl); }
  & .dsh-tasks-dialog::backdrop { background: var(--dsw-alias-bg-mask-1); }
  & :is(.dsh-tasks-fields input, .dsh-tasks-fields textarea, .dsh-tasks-select-trigger) { border-radius: var(--dsw-radius-sm); background: var(--dsw-alias-bg-layer-2); }
  @media (max-width: 620px) {
    & .dsh-tasks-board { padding: 12px 8px; gap: 12px; }
  }
  @media (max-width: 600px) { & .dsh-tasks-dialog.dsh-tasks-drawer { border-radius: 0; } }
  @media (pointer: coarse) {
    & :is(.dsh-tasks-primary, .dsh-tasks-secondary, .dsh-tasks-retry, .dsh-tasks-add, .dsh-tasks-icon-button) { min-height: 44px; }
    & .dsh-tasks-icon-button { min-width: 44px; }
  }
}
.dsh-tasks-appearance { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; }
.dsh-tasks-appearance label { display: inline-flex; align-items: center; gap: 6px; color: var(--dsw-alias-label-secondary); }
.dsh-tasks-appearance-compact { display: none; }
.dsh-tasks-appearance select { width: auto; max-width: 100%; min-height: 32px; padding: 3px 6px; border: 1px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-sm, 8px); color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-1); font: inherit; cursor: pointer; }
.dsh-tasks-appearance select:disabled { cursor: default; }
@supports (appearance: base-select) {
  .dsh-tasks-appearance select, .dsh-tasks-appearance select::picker(select) { appearance: base-select; }
  .dsh-tasks-appearance select { align-items: center; gap: 7px; }
  .dsh-tasks-appearance select::picker-icon { color: var(--dsw-alias-label-secondary); }
  .dsh-tasks-appearance select::picker(select) { min-width: max(152px,anchor-size(width)); max-width: calc(100vw - 16px); margin-block: 4px; padding: 5px; border: 1px solid var(--dsh-tasks-line, var(--dsw-alias-border-l3)); border-radius: 10px; background: var(--dsh-tasks-paper, var(--dsw-alias-bg-layer-1)); color: var(--dsw-alias-label-primary); box-shadow: 0 6px 22px var(--dsh-tasks-shadow, #0002); }
  .dsh-tasks-appearance option { display: flex; align-items: center; gap: 12px; min-height: 34px; padding: 4px 9px; border-radius: 6px; font: inherit; cursor: pointer; }
  .dsh-tasks-appearance option:is(:checked,:focus-visible,:hover) { color: var(--dsh-tasks-ink, var(--dsw-alias-label-primary)); background: var(--dsw-alias-bg-layer-2); }
  .dsh-tasks-appearance option::checkmark { order: 1; margin-inline-start: auto; color: var(--dsh-tasks-focus, var(--dsw-alias-state-business-primary)); }
}
.dsh-tasks-appearance [role="alert"] { color: var(--dsw-alias-state-error-primary); }
@media (max-width: 620px) {
  .dsh-tasks-toolbar .dsh-tasks-appearance { grid-area: 3 / 1 / 4 / -1; justify-self: start; }
}
@media (pointer: coarse) { .dsh-tasks-appearance select { min-height: 44px; } }
`

    function createController(form, theme, doc) {
      const supported = typeof theme.overrideTokens === 'function'
      const listeners = new Set()
      const markers = new Map()
      const selections = new Map(), errors = new Set()
      let disposed = false, saving = false, releaseLayer, activeAppearance
      let state
      function syncMarker(name, value) {
        const marker = markers.get(name)
        if (value) {
          if (marker?.value === value) return
          markers.set(name, { value, previous: marker ? marker.previous : doc.body.getAttribute(name) })
          doc.body.setAttribute(name, value)
        } else if (marker) {
          markers.delete(name)
          if (doc.body.getAttribute(name) !== marker.value) return
          if (marker.previous === null) doc.body.removeAttribute(name)
          else doc.body.setAttribute(name, marker.previous)
        }
      }
      function syncStyle(appearance, taskAppearance) {
        syncMarker(ATTRIBUTE, appearance !== 'default' && appearance)
        syncMarker(TASK_ATTRIBUTE, taskAppearance !== 'inherit' && taskAppearance)
        if (appearance === activeAppearance) return
        activeAppearance = appearance
        if (globalTokens[appearance]) {
          releaseLayer = theme.overrideTokens(ID, globalTokens[appearance])
        } else {
          releaseLayer?.()
          releaseLayer = undefined
        }
      }
      function sync() {
        if (disposed) return
        const snapshot = form.getSnapshot()
        const active = supported && snapshot.status === 'ready'
        const appearance = selections.get('appearance')?.value ?? snapshot.value?.appearance
        const taskAppearance = selections.get('taskAppearance')?.value ?? snapshot.value?.taskAppearance
        const next = {
          appearance: APPEARANCES.includes(appearance) ? appearance : 'default',
          taskAppearance: TASK_APPEARANCES.includes(taskAppearance) ? taskAppearance : 'inherit',
          status: snapshot.status, writable: snapshot.writable, supported,
          savingAppearance: selections.has('appearance'), savingTaskAppearance: selections.has('taskAppearance'),
          appearanceFailed: errors.has('appearance'), taskAppearanceFailed: errors.has('taskAppearance'),
        }
        syncStyle(active ? next.appearance : 'default', active ? next.taskAppearance : 'inherit')
        if (state && Object.keys(next).every(key => state[key] === next[key])) return
        state = next
        for (const listener of listeners) listener()
      }
      async function saveSelections() {
        if (saving) return
        saving = true
        try {
          while (!disposed && selections.size) {
            const [[field, selection]] = selections
            let accepted
            try { accepted = await form.set(field, selection.value) }
            catch { accepted = false }
            if (disposed) return
            if (selections.get(field) !== selection) continue
            selections.delete(field)
            if (!accepted) errors.add(field)
            sync()
          }
        } finally { saving = false }
      }
      const unsubscribe = form.subscribe(sync)
      sync()
      return {
        getSnapshot: () => state,
        subscribe(listener) { if (disposed) return () => {}; listeners.add(listener); return () => listeners.delete(listener) },
        async select(value, field = 'appearance') {
          const choices = field === 'appearance' ? APPEARANCES : field === 'taskAppearance' ? TASK_APPEARANCES : []
          if (disposed || !supported || !state.writable || state.status !== 'ready'
            || !choices.includes(value) || value === state[field]) return
          selections.set(field, { value })
          errors.delete(field)
          sync()
          await saveSelections()
        },
        dispose() {
          if (disposed) return
          disposed = true
          unsubscribe()
          listeners.clear()
          selections.clear()
          errors.clear()
          syncStyle('default', 'inherit')
        },
      }
    }

    function Settings({ t, usePreference, select }) {
      const state = usePreference(value => value)
      const disabled = !state.supported || state.status !== 'ready' || !state.writable
      const failed = state.appearanceFailed
      const message = !state.supported ? 'unsupported' : failed ? 'failed'
        : state.savingAppearance ? 'saving' : state.status === 'loading' ? 'loading'
        : state.status !== 'ready' || !state.writable ? 'unavailable' : 'saved'
      return h('section', { className: 'dsh-paper-settings', 'aria-busy': state.savingAppearance },
        h('h2', null, t('title')), h('p', null, t('intro')),
        h('fieldset', { disabled }, h('legend', null, t('choice')),
          h('div', { className: 'dsh-paper-choices' }, APPEARANCES.map(value =>
            h('label', { className: 'dsh-paper-choice', 'data-theme-choice': value, key: value },
              h('span', { className: 'dsh-paper-preview', 'aria-hidden': true },
                h('span', { className: 'dsh-paper-preview-rail' }),
                h('span', { className: 'dsh-paper-preview-card' }, h('span'), h('span'), h('span'))),
              h('span', { className: 'dsh-paper-choice-title' },
                h('input', { type: 'radio', name: 'dsh-paper-appearance', value, checked: state.appearance === value,
                  onChange: () => { void select(value) } }),
                h('strong', null, t(value))),
              h('small', null, t(value + 'Note')))))),
        h('p', null, t('follow')),
        h('p', { role: failed || !state.supported ? 'alert' : 'status', 'aria-live': 'polite' }, t(message)))
    }

    function TaskAppearance({ t, usePreference, select }) {
      const state = usePreference(value => value)
      return h('span', { className: 'dsh-tasks-appearance', 'aria-busy': state.savingTaskAppearance },
        h('label', null, h('span', { className: 'dsh-tasks-appearance-full' }, t('taskChoice')),
          h('span', { className: 'dsh-tasks-appearance-compact', 'aria-hidden': true }, t('taskChoiceShort')),
          h('select', {
            'aria-label': t('taskChoice'), title: t('taskChoice'),
            value: state.taskAppearance, disabled: !state.supported || state.status !== 'ready' || !state.writable,
            onChange: event => { void select(event.currentTarget.value, 'taskAppearance') },
          }, TASK_APPEARANCES.map(value => h('option', { key: value, value }, t(value))))),
        state.taskAppearanceFailed ? h('span', { role: 'alert' }, t('taskFailed')) : null)
    }

    return {
      inject: ['slots', 'locale', 'configForms', 'theme'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'en', EN), 'paper-theme: English')
        ctx.effect(() => ctx.locale.register(NS, 'zh', ZH), 'paper-theme: Chinese')
        const t = ctx.locale.bind(NS)
        let controller
        ctx.effect(() => {
          controller = createController(ctx.configForms.get(NS), ctx.theme, document)
          return () => controller.dispose()
        }, 'paper-theme: appearance preferences and token layer')
        ctx.effect(() => {
          const style = document.createElement('style')
          style.dataset.dshPaperSettings = ''
          style.textContent = SETTINGS_CSS + TASK_CSS
          document.head.appendChild(style)
          return () => style.remove()
        }, 'paper-theme: scoped appearance styles')
        const injectPreference = () => ({ t, hooks: { preference: controller }, select: controller.select })
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section', id: NS, order: 12, label: () => t('title'),
          inject: injectPreference,
        }, Settings))
        ctx.slots.inject(TASK_SLOT, () => ctx.slots.register({ name: TASK_SLOT, inject: injectPreference }, TaskAppearance))
      },
    }
  },
})
