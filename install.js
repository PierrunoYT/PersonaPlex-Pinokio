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
    // Prompt for Hugging Face token BEFORE installation
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
    // Install moshi package (main PersonaPlex package) and its requirements with HF_TOKEN
    {
      method: "shell.run",
      params: {
        venv: "env",
        env: { HF_TOKEN: "{{input.HF_TOKEN}}" },
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
    // Append token to ENVIRONMENT file
    {
      method: "fs.write",
      params: {
        path: "ENVIRONMENT",
        text: "\n##########################################################################\n#\n# HF_TOKEN\n# Hugging Face token for PersonaPlex model access\n#\n##########################################################################\nHF_TOKEN={{input.HF_TOKEN}}\n",
        mode: "a"
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
