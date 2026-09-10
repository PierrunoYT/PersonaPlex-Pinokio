module.exports = {
  daemon: true,
  env: [{
    title: "Hugging Face Token",
    description: "PersonaPlex requires a Hugging Face token to download the model.\n\n1. Create an account at huggingface.co\n2. Accept the license at huggingface.co/nvidia/personaplex-7b-v1\n3. Create a Read token in Settings → Access Tokens\n4. Paste your token below:",
    key: "HF_TOKEN",
    host: "huggingface.co"
  }],
  run: [
    // Launch PersonaPlex server (uses HF_TOKEN from Settings / shared key store)
    {
      method: "shell.run",
      params: {
        venv: "env",
        env: {
          // Avoid Windows Triton/Inductor launcher failures during Moshi warmup.
          NO_TORCH_COMPILE: "{{platform === 'win32' ? '1' : ''}}",
          TORCH_COMPILE_DISABLE: "{{platform === 'win32' ? '1' : ''}}"
        },
        path: "app",
        message: [
          "python ../launch.py --host 127.0.0.1 --port {{port}}"
        ],
        on: [{
          // Wait for aiohttp to bind; upstream logs an access URL before it is ready.
          "event": "/Running on (http:\\/\\/[0-9.:]+)/",
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
