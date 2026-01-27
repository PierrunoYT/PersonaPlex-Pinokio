module.exports = {
  daemon: true,
  run: [
    // Launch PersonaPlex server
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        env: {
          // HF_TOKEN must be set by user before starting
          // On Windows: setx HF_TOKEN your_token_here
        },
        message: [
          "python server.py"
        ],
        on: [{
          // Monitor for server URL output (localhost)
          "event": "/http:\\/\\/(?:localhost|127\\.0\\.0\\.1):\\d{2,5}/",
          "done": true
        }]
      }
    },
    // Set the local URL variable for the "Open Web UI" button
    {
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
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

