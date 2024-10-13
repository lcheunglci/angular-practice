const Dotenv = require("dotenv-webpack");

module.exports = {
  plugins: [
    new Dotenv(),
  ],
  resolve: {
    fallback: { "timers": require.resolve('timers-browserify') }
  },
};