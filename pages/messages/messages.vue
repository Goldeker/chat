<template>
	<view>
		<view class="search-wrap">
			<view class="search-mask" v-if="is_inp_serach">
				<image src="../../static/images/search.png"></image>
				<text>搜索</text>
			</view>
			<view class="search-inp">
				<input type="text" @focus="is_inp_serach=false" @blur="is_inp_serach=true">
			</view>
		</view>
		<view class="message-list">

			<view class="message-item" @click="open_chat_win" v-for="(item,index) in conversationList" :key="index">
				<view class="msg-item-left">
					<image src="../../static/images/123.jpg"></image>
				</view>
				<view class="msg-item-right">
					<view class="msg-info">
						<view class="msg-name">
							{{item.name}}
						</view>
						<view class="msg-time">
							{{item.time!=0?item.time:''}}
						</view>
					</view>
					<view class="msg-content-wrap">
						<text class="msg-content"><text v-if="false" class="msg-unread">[未读]</text>{{item.lastMessage}}</text>
						<text class="msg-badge" v-if="item.unread!=0">{{item.unread < 99 ?item.unread:99}}</text>
					</view>
				</view>
			</view>

			<view class="message-item" @click="open">
				<view class="msg-item-left">
					<image src="../../static/images/123456.jpg"></image>
				</view>
				<view class="msg-item-right">
					<view class="msg-info">
						<view class="msg-name">
							匿名用户
						</view>
						<view class="msg-time">
							2019/2/20
						</view>
					</view>
					<view class="msg-content-wrap">
						<text class="msg-content"><text v-if="false" class="msg-unread">[未读]</text>来来来来来来来来来来了来来来来来来来来来来了</text>
						<text class="msg-badge">99</text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	const {
		TextMessage,
		Event
	} = require('../../static/js/leancloud-realtime.js')
	import {
		dateFormat
	} from 'common/util.js'
	import {
	    mapState
	} from 'vuex'
	export default {
		data() {
			return {
				is_inp_serach: true,
				conversationList: []
			}
		},
		// computed: {...mapState(['realtime'])},
		onReady() {
			var _this = this
			uni.setTabBarBadge({
				index: 0,
				text: '99999'
			})
			this.$realtime.createIMClient('Jerry').then(function(jerry) {
				
				//查询最近会话
				jerry.getQuery().containsMembers(['Tom']).find().then(function(conversations) {
					setTimeout(function() {
						for (var index in conversations) {
							var res = conversations[index]
							console.log(conversations[index])
							_this.conversationList.push({
								name: res.creator,
								lastMessage: res.lastMessage != undefined ? (JSON.parse(res.lastMessage.content._lctext)).content : '',
								unread: parseInt(res.unreadMessagesCount),
								time: res.lastMessage != undefined ? dateFormat(res.lastMessage._timestamp, "/") : 0
							})
						}
						console.log(_this.conversationList)
					}, 200)

				}).catch(console.error.bind(console))
				
				//监听未读消息变化
				jerry.on(Event.UNREAD_MESSAGES_COUNT_UPDATE, function(conversations) {
					for(var i in _this.conversationList) {
						var conver = _this.conversationList[i]
						for(var j in conversations) {
							if(conver.name==conversations[j].creator) {
								_this.conversationList[i].unread = conversations[j].unreadMessagesCount
							}
						}
					}
				})
				
				//监听消息
// 				jerry.on(Event.MESSAGE, function(message, conversation) {
// 					console.log(message)
// 					setTimeout(function(){
// 						for(var i in _this.conversationList) {
// 							if(_this.conversationList[i].name==message.from) {
// 								if(JSON.parse(message.content._lctext).type=='image') {
// 									_this.conversationList[i].lastMessage = "[图片]"
// 								}else {
// 									_this.conversationList[i].lastMessage = JSON.parse(message.content._lctext).content
// 								}
// 								_this.conversationList[i].time = dateFormat(message._timestamp, "/")
// 								console.log(message.id)
// 							}
// 						}
// 					},100)
// 				})
				
			}).catch(console.error)


		},

		methods: {
			open_chat_win() {
				uni.navigateTo({
					url: '../chatting/chatting'
				})
				
				this.$realtime.createIMClient('Jerry').then(function(jerry) {
					jerry.getQuery().containsMembers(['Tom']).find().then(function(conversations) {
						conversations[0].read().then(function(conversation) {
						  console.log('对话已标记为已读');
						}).catch(console.error.bind(console));
					}).catch(console.error.bind(console))
				}).catch(console.error)
				
			},
			open(){
				console.log(this.$realtime)
				console.log(this.$clientObj)
				var _this = this
				this.$realtime.createIMClient('Jerry')
				// this.$realtime.retry()
				console.log(66666)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../static/css/common";
	$fontColor:#999999;
	$nameColor:#333;

	.message-list {
		.message-item {
			display: flex;
			padding: 20upx 0 5upx 20upx;

			.msg-item-left {
				width: 100upx;
				height: 100upx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.msg-item-right {
				font-size: 33upx;
				width: 90%;
				margin-left: 20upx;
				border-bottom: 1px solid #eee;

				.msg-info {
					display: flex;
					justify-content: space-between;
					padding-top: 2upx;

					.msg-time {
						color: $fontColor;
						font-size: 25upx;
						padding-right: 15upx;
						padding-top: 8upx;
					}

					.msg-name {
						color: $nameColor;
					}
				}

				.msg-content-wrap {
					display: flex;
					padding: 6upx 0 30upx 0;

					.msg-content {
						font-size: 30upx;
						color: $fontColor;
						width: 550upx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;

						.msg-unread {
							color: #70a4fa;
						}
					}

					.msg-badge {
						font-size: 25upx;
						color: #fff;
						background-color: #fe0000;
						height: 30upx;
						line-height: 30upx;
						padding: 0 5upx;
						border-radius: 15upx;
						text-align: center;
						position: relative;
						right: -15upx;
						top: 5upx;
					}
				}
			}
		}
	}
</style>
