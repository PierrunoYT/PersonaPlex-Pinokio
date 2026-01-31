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
    // Prompt for Hugging Face token
    {
      method: "input",
      params: {
        title: "Hugging Face Token Required",
        form: [{
          title: "Hugging Face Token",
          key: "HF_TOKEN",
          description: "PersonaPlex requires a Hugging Face token to download the model.\n\n1. Create an account at [huggingface.co](https://huggingface.co)\n2. Accept the license at [nvidia/personaplex-7b-v1](https://huggingface.co/nvidia/personaplex-7b-v1)\n3. Create a Read token in [Settings → Access Tokens](https://huggingface.co/settings/tokens)\n4. Paste your token below:",
          placeholder: "hf_..."
        }]
      }
    },
    // Write token to ENVIRONMENT file
    {
      method: "fs.write",
      params: {
        path: "ENVIRONMENT",
        text: "HF_TOKEN={{input.HF_TOKEN}}"
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
