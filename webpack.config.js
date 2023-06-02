const path = require('path');

module.exports = {
    entry: {
        main: './src/index.js',
        card: './src/card.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    },
    devtool: 'eval-source-map',
    watch: true,
};