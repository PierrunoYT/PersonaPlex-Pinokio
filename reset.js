module.exports = {
  run: [
    {
      method: "fs.rm",
      params: {
        path: "app"
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
