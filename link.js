module.exports = {
  run: [
    {
      method: "fs.link",
      params: {
        venv: "app/env"
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
