module.exports = {
  run: [
    {
      method: "fs.link",
      params: {
        venv: "env",
        path: "app"
      }
    },
    {
      method: "notify",
      params: {
        html: "Deduplication complete! Redundant library files have been linked to save disk space."
      }
    }
  ]
}
