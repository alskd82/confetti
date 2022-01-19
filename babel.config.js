module.exports = {
	presets: [
		['@babel/preset-env', {
			targets: {
				chrome: '58',
				ie: '11',
			},
			useBuiltIns: 'usage', // 폴리필 사용 방식 지정
			corejs: { // 폴리필 버전 지정 => corejs 라는 폴리필 라이브러리 설치 후 
				version: 3,
			}
		}]
	]
};