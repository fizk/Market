var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

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
    plugins: [
        new SWPrecacheWebpackPlugin(
            {
                cacheId: 'my-project-name',
                filename: 'my-service-worker.js',
                maximumFileSizeToCacheInBytes: 4194304,
                minify: false,
                runtimeCaching: [{
                    handler: 'cacheFirst',
                    urlPattern: /[.]mp3$/,
                }],
            }
        ),
    ]
};
