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
        html: "Reset complete! The app checkout and virtual environment have been removed. Model caches outside the app folder are retained. Click 'Install' to reinstall PersonaPlex."
      }
    }
  ]
}
