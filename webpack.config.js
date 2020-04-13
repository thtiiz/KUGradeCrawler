const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/assets', to: 'assets' },
      { from: './src/popup.html', to: 'popup.html' },
      { from: './src/manifest.json', to: 'manifest.json' },
      { from: './src/popup.css', to: 'popup.css' },
    ]),
  ],
  mode: 'production',
}
