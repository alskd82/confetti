const path = require('path');
const webpack = require('webpack');
const childProcess = require('child_process'); // 터미널 명령어 실행 가능
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const webpackMode = process.env.NODE_ENV || 'development';

module.exports = {
	mode: webpackMode,
	entry: {
        // common: ['./src/a.js', './src/b.js'], // 여러개 합치기
		main: './src/script.js',         // 빌드 후 파일명: 빌드 타켓 경로
	},
	output: {
		path: path.resolve('./dist'), // 빌드 완료 위치 //
		filename: 'js/[name].js?[chunkhash]'
	},
	/* es5로 빌드 해야 할 경우 주석 제거
	    단, 이거 설정하면 webpack-dev-server 3번대 버전에서 live reloading 동작 안함 */
	// target: ['web', 'es5'], // 익스 11 대응 시에 주석을 풀어 줌
	devServer: {
		static: './',    // dev-server 구동시킬 html 파일 경로
        hot: true,          // 라이브 서버에 html 변경까지 감지
	},
	optimization: {
		minimizer: webpackMode === 'production' ? [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		] : [],
        /*
            - splitChunks :: Bundle 사이즈를 줄이는 작업 -
            initial: 기본 Chunk Spliting.
            async: 비동기로 호출하는 요소 중 중복되는 부분을 Spliting.
            all: 모든 코드의 중복되는 요소들을 확인하여 Spliting.
        */
		splitChunks: {
			chunks: 'all' // vendor js 따로 분리되어 번들링 됨.
		}
	},
	/*externals: {
		// 빌드 과정에서 제외하고 그대로 사용할 패키지 지정
		// 예시 - foo라는 이름의 모듈이라면 아래처럼 입력
        foo: "foo"
	}, */
	module: {
        // js 안에 import 로 불러오는 파일들을 처리하는 옵션들 //
		rules: [
			// {
			// 	test: /\.(css|scss|sass)$/,
			// 	use: [
			// 		webpackMode === 'production' ? MiniCssExtractPlugin.loader : 
			// 		'style-loader','css-loader','sass-loader'
			// 	]
			// },
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'url-loader',
				options: {
					// publicPath: './dist/',// 경로 앞에 추가되는 문자열
					outputPath: 'assets', // 기본 output path 이후 경로
					name: '[name].[ext]?[chunkhash]',
					limit: 10000,         // 10kb 이하 이미지들은 base 64 방식으로 html 에 직접 입력 
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/, // 노드모듈안에 있는 js 는 제외
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				use: ['source-map-loader'],
			}
		]
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: `
				LICENSE.txt에 출력할 내용
				Build Date: ${new Date().toLocaleString()}
			`
			// Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
			// Anthor: ${childProcess.execSync('git config user.name')}
		}),
		// new webpack.DefinePlugin({ // js 에 변수 값을 넘겨주기 //
		// 	numVar: '1+1',                   // console.log(numVar) => 2
		// 	strVar: JSON.stringify('1+1'),    // console.log(strVar) => '1+1'
		// 	'api.domain': JSON.stringify('http://dev.api.domain.com'), // console.log(api,domain)
		// }),
		new HtmlWebpackPlugin({
			template: 'index.html',
			templateParameters: {
				env: webpackMode === 'development' ? '(개발용)' : '' // template html => <title>Document <%= env %> </title>
			},
			minify: webpackMode === 'production' ? {
				collapseWhitespace: true,
				removeComments: true,
			} : false
		}),
		new CleanWebpackPlugin(),
		// ...(webpackMode === 'production'
		// 	? [] //new MiniCssExtractPlugin({ filename: '[name].css?[chunkhash]' })
		// 	: []
		// ),
		// 빌드 될 js에 포함시키지 않고 그대로 가져와서 쓰는 파일은 아래처럼 설정하고, HTML에도 직접 넣어주세요
		// new CopyPlugin({
		// 	patterns: [
		// 		// { from: "./src/js/vendor/", to: "./js/vendor/[name][ext]" },
        //         // { from: "./src/assets/", to: "./assets/[name][ext]" },
        //         { from: "./src/css/", to: "./css/[name][ext]"}
		// 	],
		// })        
	]
};
