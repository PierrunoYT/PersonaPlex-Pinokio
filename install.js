module.exports = {
  run: [
    // Clone PersonaPlex repository from GitHub
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/NVIDIA/personaplex.git app"
      }
    },
    // Install moshi package (main PersonaPlex package) FIRST
    // This may install a CPU-only torch version
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "uv pip install moshi/."
      }
    },
    // Install PyTorch with CUDA support AFTER requirements
    // This ensures the correct CUDA-enabled torch version is installed
    // and overwrites any CPU-only version that moshi may have installed
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          xformers: false,
          flashattn: false,
          triton: true
        }
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
