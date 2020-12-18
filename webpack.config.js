module.exports = {
  mode: "development",
  entry: {
    "main": ["./main.ts"]
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },

      { enforce: "pre", test: /\.tsx?$/, loader: "source-map-loader" }
    ]
  },

  plugins: [
  ],

  target: "electron-renderer"
};