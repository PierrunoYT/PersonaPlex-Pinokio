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
