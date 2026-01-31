module.exports = {
  run: [
    // Clone PersonaPlex repository from GitHub
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/NVIDIA/personaplex.git app"
        ]
      }
    },
    // Install moshi package (main PersonaPlex package) and its requirements
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install moshi/."
        ]
      }
    },
    // Install PyTorch with CUDA support and Triton AFTER requirements
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          triton: true
        }
      }
    },
    {
      method: "notify",
      params: {
        html: "Installation complete! Click <b>Start</b> to launch PersonaPlex.<br><br>The model (14-17GB) will download on first start."
      }
    }
  ]
}
