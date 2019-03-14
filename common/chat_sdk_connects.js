import store from '../store/index.js'
const AV = require('../static/js/leancloud-storage.js')
const { Realtime } = require('../static/js/leancloud-realtime.js')
const { TextMessage,Event } = require('../static/js/leancloud-realtime.js')

module.exports = function() {
	// 初始化存储 SDK
	AV.init({
		appId: 'grLUK9P7eq3Xk7ted2ugs7oq-gzGzoHsz',
		appKey: 'HhwnV8gATeGlljGC9Lb6EegG'
	});
	// 初始化即时通讯 SDK
	var realtime =  new Realtime({
		appId: 'grLUK9P7eq3Xk7ted2ugs7oq-gzGzoHsz',
		appKey: 'HhwnV8gATeGlljGC9Lb6EegG',
	})

	
	realtime.on(Event.DISCONNECT, function() {
		console.log('服务器连接已断开');
		store.dispatch('setNetState',false)
		uni.showLoading({
			title: '正在连接服务器...'
		});
	});
	realtime.on(Event.OFFLINE, function() {
		console.log('离线（网络连接已断开）');
	});
	realtime.on(Event.ONLINE, function() {
		console.log('已恢复在线');
	});
	realtime.on(Event.SCHEDULE, function(attempt, delay) {
		console.log(delay + 'ms 后进行第' + (attempt + 1) + '次重连');
	});
	realtime.on(Event.RETRY, function(attempt) {
		console.log('正在进行第' + (attempt + 1) + '次重连');
	});
	realtime.on(Event.RECONNECT, function() {
		console.log('与服务端连接恢复')
		store.dispatch('setNetState',true)
		uni.hideLoading()
	});
// 	
	return realtime
}
// export default realtime