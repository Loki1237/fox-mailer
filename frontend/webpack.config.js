const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.tsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx']
    },
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
            },
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ],
                include: /\.m\.((c|sa|sc)ss)/
            },
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                exclude: /\.m\.((c|sa|sc)ss)/
            },
            {
                test: /\.(png|woff|woff2)$/,
                use: 'file-loader'
            }
		]
    },
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	]
};
