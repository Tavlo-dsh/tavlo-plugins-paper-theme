/** DSH 0.2.2-rc.1 browser plugin. Host React, official settings and token layers. */
window.__ModuleLoader__.load({
  id: 'dsh-plugin-paper-theme',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const ID = 'dsh-plugin-paper-theme'
    const NS = 'tavlo-paper-theme'
    const ATTRIBUTE = 'data-dsh-paper-theme'

    // Public palette: shared with optional consumers through inherited variables.
    // No font, color-scheme, animation, or layout dimensions are overridden.
    const PALETTE = {
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
    const TOKENS = Object.fromEntries([
      ...Object.entries(PALETTE).map(([name, [light, dark]]) => [`--dsh-paper-${name}`, { light, dark }]),
      ...Object.entries(HOST_022_RC1).map(([name, palette]) => [name, {
        light: `var(--dsh-paper-${palette})`, dark: `var(--dsh-paper-${palette})`,
      }]),
    ])

    const EN = {
      title: 'Global theme', intro: 'A quieter workspace, from conversations to task cards.',
      choice: 'Appearance style', default: 'DSH default', paper: 'Paper theme',
      defaultNote: 'Use the original DSH palette.', paperNote: 'White paper, fresh green accents and layered night stationery.',
      follow: 'Light and dark mode, fonts and text sizes follow DSH General settings.',
      saved: 'Saved for this DSH profile. All connected pages follow this choice.',
      saving: 'Saving…', loading: 'Loading theme preference…',
      unavailable: 'Theme settings are unavailable or read-only.',
      failed: 'Could not confirm the saved preference. The last confirmed theme is shown. Please retry.',
      unsupported: 'This host does not provide the required theme interface. Supported: DSH 0.2.2-rc.1.',
    }
    const ZH = {
      title: '全局主题', intro: '从对话到任务卡片，使用协调的纸面外观。',
      choice: '外观风格', default: 'DSH 默认', paper: '纸面主题',
      defaultNote: '使用 DSH 原有配色。', paperNote: '明亮白纸、清新绿意，深色保留纸页与卡片层次。',
      follow: '亮暗模式、字体和字号继续跟随 DSH「通用」设置。',
      saved: '已保存到当前 DSH profile，连接此宿主的页面同步生效。',
      saving: '正在保存…', loading: '正在加载主题偏好…',
      unavailable: '主题设置暂不可用，或当前连接只允许读取。',
      failed: '未能确认偏好已保存，当前显示最后确认的主题。请重试。',
      unsupported: '当前宿主缺少所需主题接口。支持版本：DSH 0.2.2-rc.1。',
    }

    const SETTINGS_CSS = `
.dsh-paper-settings { max-width: 720px; margin: 0 auto; color: var(--dsw-alias-label-primary); font: inherit; }
.dsh-paper-settings h2 { margin: 0 0 10px; font-size: 22px; }
.dsh-paper-settings p { color: var(--dsw-alias-label-secondary); line-height: 1.7; }
.dsh-paper-settings fieldset { border: 0; margin: 28px 0 16px; padding: 0; min-width: 0; }
.dsh-paper-settings legend { font-weight: 600; padding: 0 0 12px; }
.dsh-paper-choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.dsh-paper-choice { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 8px 10px; align-content: start; padding: 18px; border: 1px solid var(--dsw-alias-border-l3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); cursor: pointer; }
.dsh-paper-choice:has(:checked) { border-color: var(--dsw-alias-state-business-primary); background: var(--dsw-alias-state-business-tertiary); }
.dsh-paper-choice input { margin: 4px 0 0; accent-color: var(--dsw-alias-state-business-primary); }
.dsh-paper-choice input:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 4px; }
.dsh-paper-choice small { grid-column: 2; color: var(--dsw-alias-label-secondary); line-height: 1.6; }
.dsh-paper-choice:has(:disabled) { cursor: default; opacity: .65; }
.dsh-paper-settings [role="alert"] { color: var(--dsw-alias-state-error-primary); }
@media (max-width: 560px) { .dsh-paper-choices { grid-template-columns: 1fr; } }
@media (forced-colors: active) { .dsh-paper-choice:has(:checked) { border: 2px solid Highlight; } }
`

    /** Adopt only acknowledged Host values; no local cache or second preference owner. */
    function createController(form, theme, doc) {
      const supported = typeof theme.overrideTokens === 'function'
      const listeners = new Set()
      let disposed = false, pending = false, error = false, releaseLayer
      let previousMarker
      let state
      function removePaper() {
        if (!releaseLayer) return
        const release = releaseLayer
        releaseLayer = undefined
        if (doc.body.getAttribute(ATTRIBUTE) === 'paper') {
          if (previousMarker === null) doc.body.removeAttribute(ATTRIBUTE)
          else doc.body.setAttribute(ATTRIBUTE, previousMarker)
        }
        release()
      }
      function sync() {
        if (disposed) return
        const snapshot = form.getSnapshot()
        const appearance = snapshot.value?.appearance === 'paper' ? 'paper' : 'default'
        const active = supported && snapshot.status === 'ready' && appearance === 'paper'
        if (active && !releaseLayer) {
          previousMarker = doc.body.getAttribute(ATTRIBUTE)
          releaseLayer = theme.overrideTokens(ID, TOKENS)
          doc.body.setAttribute(ATTRIBUTE, 'paper')
        } else if (!active) removePaper()
        state = { appearance, status: snapshot.status, writable: snapshot.writable, pending, error, supported }
        for (const listener of listeners) listener()
      }
      const unsubscribe = form.subscribe(sync)
      sync()
      return {
        getSnapshot: () => state,
        subscribe(listener) { if (disposed) return () => {}; listeners.add(listener); return () => listeners.delete(listener) },
        async select(value) {
          if (disposed || pending || !supported || !state.writable || state.status !== 'ready'
            || !['default', 'paper'].includes(value) || value === state.appearance) return
          pending = true; error = false; sync()
          try { if (!await form.set('appearance', value)) error = true }
          catch { error = true /* ConfigForm retains the last acknowledged value on transport failure. */ }
          finally { pending = false; sync() }
        },
        dispose() {
          if (disposed) return
          disposed = true
          unsubscribe()
          listeners.clear()
          removePaper()
        },
      }
    }

    function Settings({ t, usePreference, select }) {
      const state = usePreference(value => value)
      const disabled = !state.supported || state.status !== 'ready' || !state.writable
      const message = !state.supported ? 'unsupported' : state.error ? 'failed'
        : state.pending ? 'saving' : state.status === 'loading' ? 'loading'
        : state.status !== 'ready' || !state.writable ? 'unavailable' : 'saved'
      return h('section', { className: 'dsh-paper-settings', 'aria-busy': state.pending },
        h('h2', null, t('title')), h('p', null, t('intro')),
        h('fieldset', { disabled }, h('legend', null, t('choice')),
          h('div', { className: 'dsh-paper-choices' }, ['default', 'paper'].map(value =>
            h('label', { className: 'dsh-paper-choice', key: value },
              h('input', { type: 'radio', name: 'dsh-paper-appearance', value, checked: state.appearance === value, 'aria-disabled': state.pending || undefined,
                onChange: () => { void select(value) } }),
              h('strong', null, t(value)), h('small', null, t(value + 'Note')))))),
        h('p', null, t('follow')),
        h('p', { role: state.error || !state.supported ? 'alert' : 'status', 'aria-live': 'polite' }, t(message)))
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
        }, 'paper-theme: preference and token layer')
        ctx.effect(() => {
          const style = document.createElement('style')
          style.dataset.dshPaperSettings = ''
          style.textContent = SETTINGS_CSS
          document.head.appendChild(style)
          return () => style.remove()
        }, 'paper-theme: scoped settings styles')
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section', id: NS, order: 12, label: () => t('title'),
          inject: () => ({ t, hooks: { preference: controller }, select: controller.select }),
        }, Settings))
      },
    }
  },
})
