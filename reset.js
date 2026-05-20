module.exports = {
  run: [
    {
      method: "fs.rm",
      params: {
        path: "app"
      }
    },
    {
      method: "fs.rm",
      params: {
        path: "app/env"
      }
    },
    {
      method: "notify",
      params: {
        html: "Reset complete! All files have been removed. Click 'Install' to reinstall PersonaPlex."
      }
    }
  ]
}
