 const requst = function(config){
	
	return new Promise(function(resove,reject){
		uni.request({
			url:config.url , 
			data: config.param,
			method:config.method,
			header: {
				"X-LC-Id": "grLUK9P7eq3Xk7ted2ugs7oq-gzGzoHsz",
				"X-LC-Key":"TD2Qt6MdOEi24Mchq31q8qS9,maste",
				'Content-Type': 'application/json',
				'X-LC-Sign':'037f6b65649622426c8884b884095024,1552010050,master'
			},
			success: (res) => {
				resove(res)
			},
			fail:(res) => {
				console.log('请求失败')
				console.log(JSON.stringify(res))
				reject(res)
			}
		});
	})
}
 
export default requst