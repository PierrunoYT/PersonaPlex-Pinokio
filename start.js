module.exports = {
  daemon: true,
  run: [
    // Launch PersonaPlex server (uses HF_TOKEN from Settings)
    {
      method: "shell.run",
      params: {
        venv: "env",
        env: { HF_TOKEN: "{{env.HF_TOKEN}}" },
        path: "app",
        message: [
          "python -m moshi.server"
        ],
        on: [{
          // Monitor for server URL output (any host)
          "event": "/http:\\/\\/[^\\s\\/]+:\\d{2,5}(?=[^\\w]|$)/",
          "done": true
        }]
      }
    },
    // Set the local URL variable for the "Open Web UI" button
    // Extract port from matched URL and use 127.0.0.1 (0.0.0.0 doesn't work on Windows)
    {
      method: "local.set",
      params: {
        url: "http://127.0.0.1:{{input.event[0].split(':').pop()}}"
      }
    },
    {
      method: "notify",
      params: {
        html: "PersonaPlex is running! Click 'Open Web UI' to start conversing. Allow microphone access in your browser. Model download (14-17GB) will happen on first start if not cached."
      }
    }
  ]
}
