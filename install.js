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
      method: "input",
      params: {
        title: "Installation abgeschlossen",
        form: [{
          title: "HF_TOKEN in Settings setzen",
          key: "ack",
          description: "Bitte oeffne die Settings und trage dort deinen Hugging Face Read-Token unter HF_TOKEN ein (nicht hier). Dann oeffnet sich das Token-Fenster beim Start nicht jedes Mal.\n\nEinfach OK klicken und danach Start. Das Modell (14-17GB) wird beim ersten Start heruntergeladen.",
          placeholder: "OK"
        }]
      }
    }
  ]
}
