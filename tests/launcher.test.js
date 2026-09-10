const assert = require('node:assert/strict')
const test = require('node:test')

test('startup waits for the bound listener and captures its URL', () => {
  const start = require('../start')
  const shell = start.run.find(step => step.method === 'shell.run')
  const pattern = shell.params.on[0].event
  const regex = new RegExp(pattern.slice(1, pattern.lastIndexOf('/')))
  assert.equal(regex.test('Access the Web UI directly at http://192.168.1.5:8998'), false)
  assert.equal(regex.test('Downloading http://example.com/model'), false)
  assert.equal(regex.exec('======== Running on http://127.0.0.1:8123 ========')[1], 'http://127.0.0.1:8123')
  assert.equal(start.run.find(step => step.method === 'local.set').params.url, '{{input.event[1]}}')
  assert.equal(Object.hasOwn(shell.params.env, 'HF_TOKEN'), false)
  assert.equal(start.daemon, true)
})

const menu = (paths = [], running = [], local) => require('../pinokio').menu(null, {
  exists: path => paths.includes(path),
  running: script => running.includes(script),
  local: () => local
})

test('a partial installation offers recovery without exposing Start', async () => {
  const items = await menu(['app', 'app/env'])
  assert.deepEqual(items.map(item => item.href), ['install.js', 'reset.js'])
  assert.equal(items[0].default, true)
  assert.ok(items[1].confirm)
})

test('maintenance stays visible after its installation marker is removed', async () => {
  for (const script of ['install.js', 'update.js', 'reset.js', 'link.js']) {
    const items = await menu([], [script])
    assert.equal(items.length, 1)
    assert.equal(items[0].href, script)
    assert.equal(items[0].default, true)
  }
})

test('verified installations expose repair and switch to the running Web UI', async () => {
  const paths = ['app', 'app/env/.personaplex-installed']
  assert.equal((await menu(paths))[0].href, 'start.js')
  assert.ok((await menu(paths)).some(item => item.href === 'install.js'))
  assert.equal((await menu(paths, ['start.js']))[0].href, 'start.js')
  assert.equal((await menu(paths, ['start.js'], { url: 'http://127.0.0.1:8123' }))[0].href, 'http://127.0.0.1:8123')
})

test('torch templates handle absent optional arguments on both supported platforms', () => {
  const vm = require('node:vm')
  for (const platform of ['win32', 'linux']) {
    for (const args of [undefined, null, {}, { triton: true }, { flashattn: true }]) {
      const context = { platform, gpu: 'nvidia', args }
      const step = require('../torch').run.find(step => vm.runInNewContext(step.when.slice(2, -2), context))
      const commands = step.params.message.map(command => command.replace(/{{(.*?)}}/g,
        (_, expression) => vm.runInNewContext(expression, context)))
      assert.ok(commands[0].includes('"numpy>=1.26,<2.2"'))
      assert.equal(commands[0].includes('--no-deps'), false)
      if (args?.flashattn) assert.ok(commands.some(command => command.includes('flash_attn-')))
      if (platform === 'linux') assert.equal(commands.some(command => command === 'uv pip install triton'), false)
    }
  }
})
