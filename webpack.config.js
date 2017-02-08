module.exports = {
    entry: './src/application/main.js',
    output: {
        filename: 'bundle.js',
        path: './public/scripts'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-2']
                }
            }
        ]
    },
};
