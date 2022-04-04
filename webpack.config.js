const path = require("path")

const CopyPlugin = require("copy-webpack-plugin")
const createExpoWebpackConfigAsync = require("@expo/webpack-config")
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)
  // If you want to add a new alias to the config.
  // config.resolve.alias["moduleA"] = "moduleB"

  // Maybe you want to turn off compression in dev mode.
  if (config.mode === "development") {
    config.devServer.compress = false
  }

  config.plugins.push(
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "static/privacy.html") }],
    }),
  )

  // if (env.mode === "production") {
  //   config.plugins.push(
  //     new BundleAnalyzerPlugin({
  //       path: "web-report",
  //     }),
  //   )
  // }

  // Or prevent minimizing the bundle when you build.
  // if (config.mode === "production") {
  //   config.optimization.minimize = false
  // }

  // Finally return the new config for the CLI to use.
  return config
}
