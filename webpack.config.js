const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    modeler: './app/modeler.js',
    viewer : './app/viewer.js'
    //viewer : ['./app/viewer.js']
  },
  output: {
    //__dirname + 
    path: '/dist',
    filename: '[name].app.js'
  },
  module: {
    rules: [
      {
        test: /\.bpmn$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'assets/**', to: 'vendor/bpmn-js', context: 'node_modules/bpmn-js/dist/' },
      { from: 'assets/**', to: 'vendor/diagram-js-minimap', context: 'node_modules/diagram-js-minimap/' },
      { from: 'assets/**', to: 'vendor/bpmn-js-properties-panel', context: 'node_modules/bpmn-js-properties-panel/dist' },
      { from: '**/*.{html,css}', context: 'app/' }
    ])
    
    /*
    new HtmlWebpackPlugin({
            title : 'modeler',
            hash : true,
            filename : 'modeler.ejs',
            chunks : ['modeler'], // entry에서 해당 리스트를 제외한 나머지
            template: './views/modeler.ejs'
        }),
    new HtmlWebpackPlugin({
            title : 'viewer',
            hash : true,
            filename : 'viewer.ejs',
            chunks : ['viewer'], // entry에서 해당 리스트만 포함
            template: './views/viewer.ejs'
        })
    */



  ],
  mode: 'development',
  devtool: 'source-map'
};
