module.exports = {
  daemon: true,
  env: [{
    title: "Hugging Face Token",
    description: "PersonaPlex requires a Hugging Face token to download the model.\n\n1. Create an account at huggingface.co\n2. Accept the license at huggingface.co/nvidia/personaplex-7b-v1\n3. Create a Read token in Settings → Access Tokens\n4. Paste your token below:",
    key: "HF_TOKEN"
  }],
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
          // Monitor for server URL output (localhost)
          "event": "/(http:\\/\\/[^\\s\\/]+:\\d{2,5}(?=[^\\w]|$))/",
          "done": true
        }]
      }
    },
    // Set the local URL variable for the "Open Web UI" button
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
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
