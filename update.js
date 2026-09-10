module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: "git pull --ff-only",
        on: [{ event: "/fatal:|error:/i", break: true }]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git pull --ff-only",
        on: [{ event: "/fatal:|error:/i", break: true }]
      }
    },
    {
      when: "{{exists('app/env/.personaplex-installed')}}",
      method: "fs.rm",
      params: { path: "app/env/.personaplex-installed" }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "shell.run",
      params: { message: "conda install -y -c conda-forge opus portaudio" }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install --upgrade moshi/."
        ],
        on: [{ event: "/error:|Failed to build|No solution found/i", break: true }]
      }
    },
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
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python ../verify_install.py"
      }
    },
    {
      when: "{{exists('app/env/.personaplex-installed')}}",
      method: "notify",
      params: {
        html: "Update complete! The launcher, PersonaPlex checkout, and Python dependencies have been refreshed."
      }
    }
  ]
}
