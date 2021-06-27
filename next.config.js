const withPlugins = require('next-compose-plugins'),
    withImages = require('next-images')

const nextConfig = {
    env: {
        customKey: 'my-value',
    },
    webpack: function (config) {
        config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    name: '[name].[ext]',
                },
            },
        })
        return config
    },
}

module.exports = withPlugins([[withImages]], nextConfig)
