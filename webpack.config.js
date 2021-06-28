const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
  entry: {
    modeler: './app/modeler.js',
    viewer : './app/viewer.js' ,
    home : './app/home.js',
    modelList : './app/modelList.js',
    simulation : './app/simulation.js'
  },

  output: {
    //__dirname + 
    //path: '/dist',\
    path: path.join(__dirname, "dist"),
       filename: '[name].app.js'
  },
  module: {
    rules: [
       { test: /\.bpmn$/, use: 'raw-loader' },
       { test: /\.ejs$/, loader: "ejs-render-loader" }

    ]
  },
  plugins: [
    new CopyWebpackPlugin([      
      { from: 'assets/**', to: 'vendor/bpmn-js', context: 'node_modules/bpmn-js/dist/' },
      { from: 'assets/**', to: 'vendor/diagram-js-minimap', context: 'node_modules/diagram-js-minimap/' },
      { from: 'assets/**', to: 'vendor/bpmn-js-properties-panel', context: 'node_modules/bpmn-js-properties-panel/dist' },
      // { from: 'assets/**', to: 'vendor/bpmn-js-token-simulation', context: 'node_modules/bpmn-js-token-simulation/assets/' },
      { from: 'node_modules/bpmn-js-token-simulation/assets/**', to: 'vendor/bpmn-js-token-simulation/assets' },
      { from: '**/*.{html,css}', context: 'app/' }      
    ])
  ],
  mode: 'development',
  devtool: 'source-map',

  devServer: {
    port: 3000,
    open: true
    //proxy: {
    //  "/api": "http://localhost:8080"
    //}
  }

};
