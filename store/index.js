import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		screenInfo:{w:0,h:0},
		showPanel:false,
		is_audio:false,
		msgSendFail:false,
		msgSendFailIndex:0,
		netState:true,
		serverNetwork:true,
	},
	mutations: {
		setWHeight(state){
			uni.getSystemInfo({
				success: function (res) {  
					console.log(res.windowHeight);
					state.screenInfo.h = res.windowHeight 
					state.screenInfo.w = res.windowWidth 
				}
			})
		},
		m_showPanel(state,res) {
			state.showPanel = res
		},
		m_is_audio(state,res) {
			state.is_audio = res
		},
		m_msgSendFail(state,res) {
			state.msgSendFail = res
		},
		m_msgSendFailIndex(state,res) {
			state.msgSendFailIndex = res
		},
		m_netState(state,res) {
			state.netState = res
		},
		m_serverNetwork(state,res) {
			state.serverNetwork = res
		}
		
	},
	actions: {
		getWHeight({commit}){
			commit('setWHeight')
		},
		setShowPanel({commit},data) {
			commit('m_showPanel',data)
		},
		setIsAudio({commit},data) {
			commit('m_is_audio',data)
		},
		setMsgSendFail({commit},data) {
			commit('m_msgSendFail',data)
		},
		setMsgSendFailIndex({commit},data) {
			commit('m_msgSendFailIndex',data)
		},
		setNetState({commit},data) {
			commit('m_netState',data)
		},
		setServerNetwork({commit},data) {
			commit('m_serverNetwork',data)
		}
		
	}
})

export default store
