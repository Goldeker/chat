<template>
	<view class="uni-column" :style="{height:h_out+'px'}">

		<view class="content" id="content" :style="{height:contentViewHeight+'px',top:contentTop+'px'}" @click.stop="bindClick"
		 @touchstart="setStartY($event)" @touchend="bindTouchend">
			<scroll-view id="scrollview" scroll-y="true" :style="{height:contentViewHeight+'px'}" :scroll-with-animation="isAnimates"
			 :scroll-top="scrollTop" :scroll-into-view="scrollInto" @scroll="bindScroll($event)" @scrolltoupper="bindscrolltoupper"
			 @scrolltolower="bindscrolltolower">
				<view class="loading" v-show="is_loading"></view>
				<view style="border: 1px solid red;" @touchmove="pullDow($event)">
					<page-foot :name="name"></page-foot>
					<message-show v-for="(message,index) in messages" :key="index" :message="message" :id="index" @showOpration="showOpration"
					 @preivewImg="preivewImgs" @setDelid="setDelMsgId" @bindResetSend="resetSend"></message-show>
					<view id="bottom"></view>
					<view class="op-menu" :style="{'top':menuViewTop,'left':menuViewLeft}" v-show="opMenuWindow">
						<view class="menu-copy" v-show="is_text_copy" @click.stop="copy_content">复制</view>
						<view class="menu-copy" v-show="!is_text_copy" @click.stop="saveImg">保存</view>
						<view class="menu-copy" @click.stop="delMsg">删除</view>
						<view class="menu-copy" @click.stop="messages=[];opMenuWindow=false">清空</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="foot" :style="{'bottom': bottom+'px'}">
			<chat-input @send-message="getInputMessage" @focus="inputGetFocus" @blur="resetBlur" @openEmoji="runEmojiWin"
			 @chooseImgPaths="sendImage" @msgAudio="sendAudio" @scrollBottom="scrollToBottom"></chat-input>
		</view>
		<view class="img-preview" v-show="imgShow" @click="hideImg">
			<image :style="{width:preImgWidth}" :src="preImgSrc" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import {
		ename_cn,
		ename_en
	} from '../../common/emojiConfig.js'
	import chatInput from '../../components/im-chat/chatinput.vue'
	import messageShow from '../../components/im-chat/messageshow.vue'
	const AV = require('static/js/leancloud-storage.js');
	const {
		TextMessage,
		Event
	} = require('../../static/js/leancloud-realtime.js')
	import {
		check_online
	} from '../../common/api.js'
	import {
	    mapState
	} from 'vuex'
	import {dateDiffer,dateFormat} from '../../common/util.js'
	
	export default {
		data() {
			return {
				style: {
					footViewHeight: 90,
					mitemHeight: 0,
				},
				contentViewHeight: 0,
				scrollTop: 0,
				scrollInto: '',
				messages: [{
					user: 'home',
					type: 'text',
					content: '你好',
					rawdata: '你好',
					imgWidth: 0,
					readState: '已读',
					id: 0,
					mid: 0,
					isSuccess: true,
					date: '2019313950',
					dateFlag:true,
					timestamp:0
				}],
				startY: 0,
				scrollTopSize: 0,
				scrollTopStatu: false,
				scrollBottomStatu: false,
				isAnimates: true,
				is_loading: false, //加载了历史记录图标
				msgLength: 0,
				menuViewTop: 0,
				menuViewLeft: "-100px",
				menuViewWShow: 0,
				menuViewHeight: 0,
				menuViewWidth: 0,
				scrollHeight: 0,
				is_text_copy: false,
				copyContent: "", //原始消息数据
				opMenuWindow: true,
				delMsgId: "",
				footHeight: 0,
				pageH: 0,
				panelSta: false,
				saveImgPath: "",
				imgShow: false,
				preImgWidth: 0,
				preImgSrc: "",
				is_fadein: true,
				bottom: 0,
				name: 'hello',
				loginFlag: true,
				h_out: 0,
				msgCursor: 0
			}
		},
		computed: mapState(['netState']),
		components: {
			chatInput,
			messageShow
		},
		onLoad: function() {
			this.resetScrollHeight()
			var sycinfo = uni.getSystemInfoSync()
			this.h_out = sycinfo.windowHeight - 5
			console.log(sycinfo.windowHeight)
		},
		onReady() {
			var query = uni.createSelectorQuery()
			var that = this;
			var sycinfo = uni.getSystemInfoSync()
			this.pageH = sycinfo.windowHeight
			that.contentViewHeight = that.pageH - 40
			//获取操作弹出框高度
			query.select('.op-menu').boundingClientRect(function(rect) {
				that.menuViewHeight = parseInt(rect.height)
				that.menuViewWShow = sycinfo.screenWidth - parseInt(rect.width)
				that.menuViewWidth = parseInt(rect.width)
			}).exec()
			query.select('.foot').boundingClientRect(function(rect) {
				that.footHeight = rect.height
			}).exec()

			this.getHistoryRecords()

		},
		onUnload() {
			this.loginFlag = false
			console.log('页面关闭')
		},
		methods: {
			sendMsgOnline(contentObj) {
				var _this = this
				this.$realtime.createIMClient('Jerry ').then(function(tom) {
					return tom.createConversation({
						members: ['Tom'],
						name: 'Jerry & Tom',
						unique: true
					});
				}).then(function(conversation) {
					//送达
					conversation.on(Event.LAST_DELIVERED_AT_UPDATE, function() {
						console.log(conversation);
					})
					//已读
					conversation.on(Event.LAST_READ_AT_UPDATE, function() {
						setTimeout(function() {
							console.log(conversation.lastMessage.id)
							for (var index in _this.messages) {
								if (conversation.lastMessage.id == _this.messages[index].id) {
									_this.messages[index].readState = '已读'
								}
							}
						}, 100)
					})
					// 发送消息
					return conversation.send(new TextMessage(JSON.stringify(contentObj)), {
						receipt: true
					})
				}).then(function(message) {
					console.log('发送成功')
					var res = JSON.parse(message.text)
					console.log(message)
					for (var i in _this.messages) {
						if (res.mid == _this.messages[i].mid) {
							_this.messages[i].readState = '送达'
							_this.messages[i].id = message.id
							_this.messages[i].date = dateFormat(message._timestamp,':') 
							_this.messages[i].isSuccess = true
							_this.messages[i].timestamp = message._timestamp
							if(res.type=='voice') {
								_this.messages[i].content.path = res.content
							}
							break  
						}
					} 
					var msgIndex = _this.$store.state.msgSendFailIndex
					console.log(_this.messages[msgIndex-1].timestamp)
					if(dateDiffer(_this.messages[msgIndex].timestamp,_this.messages[msgIndex-1].timestamp)) {
						_this.messages[msgIndex].dateFlag = true
					}
					console.log(_this.messages)
				}).catch(console.error)
			},
			showOnlineMsg(message) {
				var msgObj = JSON.parse(message.text) //消息内容
				console.log(msgObj)
				if (msgObj.type == "text") {
					this.messages.push({
						user: 'home',
						type: 'text',
						content: msgObj.content,
						rawdata: msgObj.content,
						imgWidth: 0,
						readState: '已读',
						id: message.id,
						isSuccess: true
					})
				} else if (msgObj.type == 'image') {
					this.messages.push({
						user: 'home',
						type: 'image',
						content: msgObj.content,
						rawdata: msgObj.content,
						imgWidth: msgObj.imgWidth,
						readState: '已读',
						id: message.id,
						isSuccess: true
					})
				}else if(msgObj.type=='voice') {
					
				}
				this.scrollToBottom()
			},
			markRead(id) { //设置已读
				for (var i in this.messages) {
					if (this.messages[i].id == id) {
						this.messages[i].readState = '已读'
					}
				}
			},
			getHistoryRecords() { //获取聊天记录
				var _this = this
				this.$realtime.createIMClient('Jerry').then(function(jerry) {
					//获取聊天记录
// 					jerry.getQuery().containsMembers(['Tom']).find().then(function(conversation) {
// 						console.log(conversation)
// 						conversation[1].queryMessages({
// 							limit: 10,
// 						}).then(function(msgs) {
// 							for (var i in msgs) {
// 								_this.showOnlineMsg(msgs[i])
// 							}
// 						}).catch(console.error.bind(console))
// 					}).catch(console.error.bind(console))
 
					//监听新消息
					jerry.on(Event.MESSAGE, function(message, conversation) {
						console.log(message)
						console.log(_this.loginFlag) 
						//当前页面标记已读
						if (_this.loginFlag) {
							_this.showOnlineMsg(message)
							conversation.read().catch(console.error.bind(console))
							markRead(conversation.id)
						}
					})
					
					

				}).catch(console.error)
			},
			createPush(data) {
				plus.push.createMessage(data, {
					"payload": "name"
				}, {})
			},






			bindscrolltolower() {
				this.scrollBottomStatu = true
			},
			bindscrolltoupper() {
				this.scrollTopStatu = true
			},
			bindScroll(e) {
				this.scrollTopSize = e.detail.scrollTop
				this.scrollBottomStatu = false
				this.scrollTopStatu = false
				// console.log(e)
				this.scrollHeight = e.detail.scrollHeight
			},
			setStartY(eve) {
				this.startY = eve.clientY
			},
			bindTouchend() {
				this.is_loading = false
			},
			pullDow(e) {
				if (this.scrollTopStatu || this.scrollTopSize < 8) {
					if (e.clientY - this.startY > 10) {
						this.is_loading = true
						this.msgLength = this.messages.length
					}
				}

			},
			showOpration(e) { //显示操作窗口(长按事件)
				var detail = e.currentTarget.dataset
				detail.type == 'text' ? this.is_text_copy = true : this.is_text_copy = false,
					this.delMsgId = detail.mid
				this.copyContent = detail.rawdata
				this.saveImgPath = detail.file
				console.log(e)
				var top = parseInt(e.pageY) + this.scrollTopSize
				var left = parseInt(e.pageX)
				if (top > (this.scrollHeight - this.menuViewHeight)) {
					top = top - this.menuViewHeight
				}
				if (left > this.menuViewWShow) {
					left = left - this.menuViewWidth
				}
				this.menuViewTop = top + 'px'
				this.menuViewLeft = left + 'px'
				this.opMenuWindow = true
			},
			copy_content() {
				var that = this
				uni.setClipboardData({
					data: this.copyContent,
					success: function() {
						uni.showToast({
							title: '已复制',
							duration: 1000,
							icon: 'none'
						})
					},
					complete: function() {
						that.opMenuWindow = false
					}
				})
			},
			delMsg() {	//删除本地消息记录
				this.messages.splice(this.delMsgId, 1)
				this.opMenuWindow = false
			},
			//删除发送失败消息
			setDelMsgId(id){
				this.delMsgId = id
				this.delMsg()
			},
			resetSend(id){	//重发消息
				console.log(this.messages[id])
				this.sendMsgOnline(this.messages[id])
			},
			bindClick() { //隐藏操作
				this.opMenuWindow = false
				this.resetScrollHeight()
				this.$store.dispatch('setShowPanel', false)
			},
			runEmojiWin() { //设置scroll高度
				if (this.$store.state.showPanel) {
					this.contentViewHeight = this.pageH - 180
					this.scrollToBottom()
				} else {
					this.contentViewHeight = this.pageH - 46
				}

			},
			resetScrollHeight() { //恢复滚动窗口高度
				this.contentViewHeight = this.pageH - this.footHeight
			},
			sendImage(res) { //发送图片
				var _this = this

				console.log(res.length)
				for (var i = 0; i < res.length; i++) { //多图发送
					(function(index) {
						console.log(res[index])
						//获取图片宽度
						uni.getImageInfo({
							src: res[index],
							success: function(image) {
								console.log(image.width);
								var imgw = image.width
								if (imgw > 400) {
									imgw = 400
								}
								console.log(imgw)
								var mid = Math.floor(Math.random() * 10000 * 1000)
								//发送本地消息 
								_this.addMessage(res[index], '', 'image', mid, _this.netState , imgw)
								uni.uploadFile({ //上传图片到服务器返回图片地址
									url: 'http://192.168.1.117/tp/public/index.php/index/chat/uploadFile',
									filePath: res[index],
									name: 'file',
									success: (uploadFileRes) => {
										var data = JSON.parse(uploadFileRes.data)
										if(data.code == 200) {
											//发送网络消息
											_this.sendMsgOnline({
												content: data.saveurl,
												type: "image",
												imgWidth: imgw,
												mid: mid
											})
										}
										_this.scrollToBottom()
									},
									fail: function(e) {
										console.log('上传失败')
										for (var i in _this.messages) {
											if (res[index] == _this.messages[i].content) {
												_this.messages[i].isSuccess = false
											}
										}
									}

								})

							},
							fail(e) {
								console.log('获取信息失败')
							}
						})
						// 						
						// 						    uploadPro.onProgressUpdate((res) => {
						// 								console.log('上传进度' + res.progress);
						// 								console.log('已经上传的数据长度' + res.totalBytesSent);
						// 								console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
						// 
						// 								// 测试条件，取消上传任务。
						// 								if (res.progress > 50) {
						// 									uploadTask.abort();
						// 								}
						// 							});

					})(i)
					_this.scrollToBottom()
				}

			},
			sendAudio(res) { //发送语音
				console.log(res)
				var _this = this
				var info = {
					path: res.tempFilePath,
					time: res.duration
				}
				var mid = Math.floor(Math.random() * 10000 * 1000)
				_this.addMessage(info, '', 'voice', mid, _this.netState , 0)
				console.log(this.messages)
				 //上传到服务器返回地址
				uni.uploadFile({
					url: 'http://192.168.1.117/tp/public/index.php/index/chat/uploadFile',
					filePath: res.tempFilePath,
					name: 'file',
					success: (uploadFileRes) => {
						console.log(JSON.stringify(uploadFileRes))
						var data = JSON.parse(uploadFileRes.data)
						//发送网络消息
						_this.sendMsgOnline({
							content: data.saveurl,
							type: "voice",
							mid: mid,
							time:res.duration
						})
						_this.scrollToBottom()
					},
					fail: function(e) {
						console.log('上传失败')
						console.log(JSON.stringify(e))
						for (var i in _this.messages) {
							if (res.tempFilePath == _this.messages[i].content.path) {
								_this.messages[i].isSuccess = false
								break 
							}
						}
					}
				
				})
				
			},
			saveImg() {
				var _this = this
				uni.saveFile({
					tempFilePath: _this.saveImgPath,
					success: function(res) {
						console.log(JSON.stringify(res))
						uni.showToast({
							title: '保存成功',
							duration: 800,
							icon: 'none'
						})
					},
					fail() {
						uni.showToast({
							title: '保存失败',
							duration: 800,
							icon: 'none'
						})
					},
					complete() {
						_this.opMenuWindow = false
					}
				})
			},

			test() {
				console.log(this.messages.length)
			},
			msgRegReplace(msgContent) { //替换表情
				var msgRegResult = ""
				var emojiNum = msgContent.match(/\[[\u4e00-\u9fa5]+\]/g)
				if (emojiNum == null) {
					return msgContent
				}
				for (var i = 0; i < emojiNum.length; i++) {
					for (var j = 0; i < ename_en.length; i++) {
						if (emojiNum[j] == ename_cn[i]) {
							msgRegResult = msgContent.replace(/\[[\u4e00-\u9fa5]+\]/g, "<img class='msg-img' src='static/emoji/" +
								ename_en[i] + ".png'/>")
						}
					}
				}
				return msgRegResult
			},

			getInputMessage: function(message) { //发送文字

				var msgContent = message.content
				var mid = Math.floor(Math.random() * 10000 * 1000)
				this.sendMsgOnline({
					content: msgContent,
					type: "text",
					mid: mid
				})
				var newMsg = this.msgRegReplace(msgContent)
				console.log(this.netState)
				this.addMessage(newMsg, msgContent, 'text', mid, this.netState ,0)
				this.scrollToBottom()
				
			},
			/**
			 *  @param
			 * 	content  消息内容
			 * 	rawdata 表情没替换前的数据
			 * 	type 消息类型
			 * 	mid	消息id
			 * 	is_success 是否发送成功
			 * 	imgw 图片宽度
			 */
			addMessage: function(content, rawdata, type, mid,is_success, imgw,dFlag) {
				this.$store.state.msgSendFailIndex = this.messages.length //保存消息最后一条下标
				this.messages.push({
					user: 'customer',
					type: type,
					content: content,
					rawdata: rawdata,
					imgWidth: imgw,
					readState: '',
					id: 0,
					mid: mid,
					isSuccess: is_success,
					date: '',
					dateFlag:dFlag,
					timestamp:0
				}) 

			},
			scrollToBottom: function() { //scroll滚动到底部
				var that = this;
				var query = uni.createSelectorQuery();
				query.selectAll('.m-item').boundingClientRect();
				query.select('#scrollview').boundingClientRect();

				setTimeout(function() {
					that.scrollInto = 'message' + (that.messages.length - 1)
				}, 300)
				console.log(this.scrollInto)
				// 				query.exec(function(res) {
				// 					that.style.mitemHeight = 0;
				// 					res[0].forEach(function(rect) {
				// 						// console.info(rect.height);
				// 						that.style.mitemHeight = that.style.mitemHeight + rect.height + 30;
				// 					});
				// 
				// 					if (that.style.mitemHeight > that.contentViewHeight) {
				// 						that.scrollTop = that.style.mitemHeight - that.contentViewHeight;
				// 					}
				// 				});
			},
			preivewImgs(e) {
				this.is_fadein = true
				var info = e.currentTarget.dataset
				this.imgShow = true
				this.preImgWidth = info.width
				this.preImgSrc = info.file
				console.log(e)
			},
			hideImg() {
				this.is_fadein = false
				this.imgShow = false
			}
			// 			inputGetFocus() {
			// 				var that = this
			// 				var callback = plus.bridge.callbackId(function(e) {
			// 					var str = e.split(',')
			// 					that.name = e
			// 					if(strp[1]=='hide') {
			// 						 that.bottom = 0
			// 					}else {
			// 						setTimeout(function() {
			// 							that.bottom = e
			// 						}, 200)
			// 					}
			// 				}, function(err) {
			// 					 that.bottom = 0
			// 				})
			// 				plus.bridge.exec('plugintest', 'PluginTestFunction', [callback, 'show'])
			// 			},
			// 		
			// 			resetBlur() {
			// 				var that = this
			// 				
			// 				var callback = plus.bridge.callbackId(function(e) {
			// 					
			// 					that.name = '123'
			// 				}, function(err) {})
			// 				plus.bridge.exec('plugintest', 'sendMsg', [callback])
			// 			}

		}
	}
</script>

<style>
	.uni-column {
		display: flex;
		flex-direction: column;
		border: 1px solid blue;
		width: 99%;
	}

	.content {
		display: flex;
		flex: 1;
		width: 100%;
		margin-bottom: 100upx;
		background-color: #f5f5f5;
	}

	.foot {
		position: absolute;
		width: 98%;
		/* height: 90upx; */
		/* min-height: 90upx; */
		left: 0upx;
		bottom: 0;
		/* overflow: hidden; */
	}

	.loading {
		text-align: center;
		background-color: #F5F5F5;
		background: url(../../static/icon_loading.png) no-repeat center;
		background-size: 25px 25px;
		height: 25px;
		width: 100%;
		position: absolute;
	}

	.msg-time {
		font-size: 28upx;
		text-align: center;
		color: #8F8F94;
	}

	.op-menu {
		width: 150upx;
		position: absolute;
		background-color: #fff;
		font-size: 33upx;
		color: #333;
		text-align: center;
		padding: 6upx 0;
	}

	.op-menu view {
		padding: 8upx 0;
	}

	.img-preview {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 1px solid red;
		background-color: #000;
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
		-webkit-animation-name: fadeIn;
		-webkit-animation-duration: 400ms;
		-webkit-animation-iteration-count: 1;
		-webkit-animation-delay: 0s;
	}

	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
