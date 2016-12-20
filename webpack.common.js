/* eslint-disable */
const webpack = require("webpack");
const path = require("path");

const paths = {
	main: path.join(__dirname, "src/main.js"),
	lib: path.resolve("./src/lib"),
}

module.exports = {
	entry: {
		main: [paths.main],
	},
	externals: {
		"./src/lib/": "particle",
		"./src/lib/vector": "vector",
		"./src/lib/utils": "utils",
		"./src/lib/vectors": "vectors",
	},
	output: {
		path: __dirname,
		filename: "main.js",
		library: "particle",
		libraryTarget: "umd"
	},
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
	resolve: {
		extensions: ['.js'],
		root: [
			path.lib
		]
	},
	module: {
		loaders: [
			{
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      loader: 'babel',
	      query: {
	        presets: ['es2015']
	      },
	    },
		],
	},
	target: "web",
};
