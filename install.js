module.exports = {
  run: [
    // Clone PersonaPlex repository from GitHub
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/NVIDIA/personaplex.git app"
      }
    },
    // Install PyTorch with CUDA 12.x support for GPU acceleration
    // PersonaPlex requires NVIDIA GPU with 16-24GB VRAM minimum
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
    // Install PersonaPlex dependencies
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "pip install -r requirements.txt"
      }
    },
    // Install audio dependencies
    {
      method: "shell.run",
      params: {
        venv: "env",
        message: "pip install sounddevice pyaudio"
      }
    },
    {
      method: "notify",
      params: {
        html: "Installation complete! Before starting, you need to:<br>1. Create a Hugging Face account<br>2. Accept the license at huggingface.co/nvidia/personaplex-7b-v1<br>3. Create an access token<br>4. Set HF_TOKEN environment variable<br><br>The model (14-17GB) will download on first start."
      }
    }
  ]
}
