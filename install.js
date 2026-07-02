module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    // Fail fast on unsupported systems before installing anything
    {
      when: "{{gpu !== 'nvidia' || (platform !== 'win32' && platform !== 'linux')}}",
      method: "notify",
      params: {
        html: "PersonaPlex requires an NVIDIA GPU on Windows or Linux. Installation aborted."
      },
      next: null
    },
    // Install Rust toolchain (required to build moshi's native deps, e.g. sentencepiece)
    {
      when: "{{!which('cargo')}}",
      method: "shell.run",
      params: {
        message: "conda install -y -c conda-forge rust"
      }
    },
    // Clone PersonaPlex repository from GitHub
    {
      when: "{{!exists('app')}}",
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
        ],
        on: [{
          // Stop with an error screen if the native build fails (e.g. sentencepiece),
          // instead of continuing to the torch install over a broken environment.
          event: "/Failed to build|No solution found/i",
          break: true
        }]
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
    }
  ]
}
