import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$store = store 

const initChatSdk = function(){
	var initSdk = require('./common/chat_sdk_connects.js')
	var realtime = initSdk()
	Vue.prototype.$realtime = realtime
	Vue.prototype.$clientObj = realtime.createIMClient('Jerry')
}

//无网络不初始化sdk
uni.getNetworkType({	
    success: function (res) {
        console.log(res.networkType)
		if(res.networkType!='none') {
			initChatSdk()
			store.dispatch('setNetState',true)
		}else {
			store.dispatch('setNetState',false)
		}
    }
})

var initNum = 0
//监听网络变化并初始化sdk
uni.onNetworkStatusChange(function (res) {
    console.log(res.isConnected);
	// store.dispatch('setNetState',res.isConnected)
	if(res.isConnected) {
		initNum = initNum + 1
		if(initNum > 2) {return }
		initChatSdk()
	}
})
// 
App.mpType = 'app'
store.dispatch('getWHeight')

const app = new Vue({
	store,
	...App
})
app.$mount()
