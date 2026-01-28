module.exports = {
  run: [
    // Clone PersonaPlex repository from GitHub
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/NVIDIA/personaplex.git app"
      }
    },
    // Install PyTorch with CUDA support FIRST (before moshi installs CPU version)
    // Uses torch.js script for platform-specific installation
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          xformers: false,
          flashattn: false,
          triton: true
        }
      }
    },
    // Install moshi package (main PersonaPlex package)
    // Using uv pip with --no-deps for torch to prevent overwriting CUDA version
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "uv pip install moshi/. --no-deps && uv pip install moshi/."
      }
    },
    {
      method: "notify",
      params: {
        html: "Installation complete! Before starting, you need to:<br>1. Create a Hugging Face account<br>2. Accept the PersonaPlex model license at <a href='https://huggingface.co/nvidia/personaplex-7b-v1' target='_blank'>huggingface.co/nvidia/personaplex-7b-v1</a><br>3. Create an access token at Hugging Face<br>4. Set HF_TOKEN environment variable<br><br>Note: Install libopus-dev if you encounter audio issues.<br>The model will download on first start."
      }
    }
  ]
}
