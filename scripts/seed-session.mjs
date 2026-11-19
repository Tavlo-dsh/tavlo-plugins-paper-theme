/** Original, synthetic transcript for real DSH Markdown/code rendering; never calls a model. */
import assert from 'node:assert/strict'
import { mkdir, writeFile, appendFile } from 'node:fs/promises'
import { join, resolve, relative, basename } from 'node:path'

export async function seedSession(root) {
  assert(basename(root).startsWith('dsh-paper-theme-'), 'Only the harness-created temporary home is accepted')
  const id = 'paper-theme-visual-fixture'
  const cwd = root.replaceAll('\\', '/')
  const project = '--' + cwd.replace(/[\\/:]+/g, '-').replace(/^-+/, '') + '--'
  const directory = resolve(root, 'home/visual-sessions', project, id)
  assert(!relative(resolve(root), directory).startsWith('..'))
  const markdown = '## 一页清晰的工作记录\n\n把对话、任务和代码放进同一套温和的配色。**中文长文本**与 English Markdown 保持宿主字体，阅读时不叠加纸纹。\n\n- 先确认目标，再拆分任务\n- 保存上下文，留下一步行动\n- 使用 `theme.overrideTokens()` 统一语义颜色\n\n```javascript\nconst theme = {\n  appearance: "paper",\n  colorScheme: "follow DSH",\n};\n\nconsole.log("专注眼前的一件事", theme);\n```\n\n> 代码区域保持干净，纸张装饰留给任务卡片。\n\n这是一段隔离验收用的本地合成对话，未请求模型或访问用户数据。'
  const events = [
    { type: 'session', version: 4, id, createdAt: Date.now(), cwd, isSeeded: false, delegationDepth: 0 },
    { type: 'turn/start', data: { turn: 1 } },
    { type: 'step/start', data: { turn: 1, step: 1 } },
    { type: 'user/message', data: { role: 'user', id: 'paper-fixture-user', source: { kind: 'user' }, content: [{ type: 'text', text: '请整理本周计划，并给出一个主题配置示例。' }] }, surfaceOp: 'append' },
    { type: 'assistant/message', data: { turn: 1, step: 1, stream: [], message: { role: 'assistant', id: 'paper-fixture-assistant', source: { kind: 'model', provider: 'paper-verification-offline', model: 'offline' }, content: [{ type: 'text', text: markdown }] } }, surfaceOp: 'append' },
    { type: 'step/end', data: { turn: 1, step: 1 } },
    { type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } },
    { type: 'session/title', data: { title: '纸面主题 · 对话与代码验收', messageSeqs: [2], source: { kind: 'fallback' } } },
  ]
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'session.v4.jsonl'), events.map((event, i) => JSON.stringify(i === 0 ? event
    : { ...event, seq: i - 1, time: events[0].createdAt + i * 1000 })).join('\n') + '\n', { flag: 'wx' })
  await appendFile(join(root, 'offline.patch.yml'), "- id: session-persistence-jsonl\n  config:\n    root: !!js dshHomePath('visual-sessions')\n    compression: none\n")
  return id
}
