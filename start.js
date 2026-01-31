module.exports = {
  daemon: true,
  run: [
    // Prompt for Hugging Face token
    {
      method: "input",
      params: {
        title: "Hugging Face Token",
        form: [{
          title: "Hugging Face Token",
          key: "HF_TOKEN",
          description: "PersonaPlex requires a Hugging Face token to download the model.\n\n1. Create an account at huggingface.co\n2. Accept the license at huggingface.co/nvidia/personaplex-7b-v1\n3. Create a Read token in Settings → Access Tokens\n4. Paste your token below:",
          placeholder: "hf_..."
        }]
      }
    },
    // Launch PersonaPlex server
    {
      method: "shell.run",
      params: {
        venv: "env",
        env: { HF_TOKEN: "{{input.HF_TOKEN}}" },
        path: "app",
        message: [
          "python -m moshi.server"
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
