<template>
	<view class="m-item" :id="'message'+id">
		<view class="m-left" >
			<image class="head_icon" :class="{'have-time-padding':message.dateFlag}"  src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/app/homeHL.png" v-if="message.user=='home'"></image>
		</view>
		<view class="m-content" @longpress="showOpra($event)" :data-type="message.type" :data-rawdata="message.rawdata"
		 :data-mid="id" :data-file="message.content">
			<view class="msg-time" v-if="message.dateFlag" >
				{{message.date}}
			</view>
			<view v-if="message.type=='text'" class="m-content-head " :class="{'m-content-head-right':message.user=='customer','m-content-head-left':message.user=='home'}">
				<view class="content-wrap" :class="'m-content-head-'+message.user">
					<!-- {{message.content}} <image class="msg-img " src="../../static/angry.png"></image> -->
					<text v-html="message.content"></text>
				</view>
			</view>
			<view v-if="message.type=='image'" class="m-content-img" :class="{'m-content-right':message.user=='customer'}" >
				<image :src="message.content" mode="widthFix" :style="{'width':message.imgWidth+'px'}" @click="preview($event)" :data-file="message.content" :data-pid="id" :data-width="message.imgWidth"></image>
			</view>

			<view v-if="message.type=='voice'" class="m-content-head " :class="{'m-content-head-right':message.user=='customer','m-content-head-left':message.user=='home'}"
			 :data-path="message.content.path" :data-aid="id" @click="player($event)">
				<view v-show="message.user=='home'" class="audio-wrap" :class="'m-content-head-'+message.user">
					<image class="audio-img" src="../../static/icon_left_voice.png"></image>
					<text >{{message.content.time}}''</text>
					<!-- <text v-show="currentView==id">{{currentTime}}''</text> -->
					<view class="audio-unread-left"></view>
				</view>
				<view v-show="message.user=='customer'" class="audio-wrap" :class="'m-content-head-'+message.user">
					<!-- <view class="audio-unread-right"></view> -->
					<text >{{message.content.time}}''</text>
					<!-- <text v-show="currentView==id">{{currentTime}}''</text> -->
					<image class="audio-img" src="../../static/icon_right_voice.png"></image>
				</view>
			</view>

			<view class="readText" :class="{'readText-right':message.user=='customer'}">
				{{message.readState}}
			</view> 
			
			<view v-if="!message.isSuccess" class="send_fail readText-right" :data-failId="id" @click="againSend($event)">
				<image src="../../static/send_fail.png" ></image>
			</view>
		</view> 
		<view class="m-right">
			<image class="head_icon" :class="{'have-time-padding':message.dateFlag}" src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/app/customerHL.png" v-if="message.user=='customer'"></image>
		</view>
	</view>
</template>

<script>
	 import {
	    mapState
	} from 'vuex'
	export default {
		props: ['message', 'id'],
		computed: mapState(['msgSendFail','msgSendFailIndex','netState']),
		data() {
			return {
				imageWidth: 0,
				currentTime:0,
				is_play:false,
				audioId:0,
				playState:null,
				innerAudioContext:null,
				preImgPath:""
			}
		},
		onLoad() {
			var _this = this
			this.innerAudioContext = uni.createInnerAudioContext()
			this.innerAudioContext.onPlay(() => {
				this.is_play = true
				console.log('开始播放');
			})
			this.innerAudioContext.onError((res) => {
				console.log(JSON.stringify(res))
				uni.showToast({
					title: res.errMsg,
					duration: 600,
					icon:'none'
				});
			})
			this.innerAudioContext.onStop(()=>{
				_this.is_play = false
				console.log('stop')
			})
			this.innerAudioContext.onEnded(()=>{
				_this.is_play = false
				console.log('播放结束')
			})
		},
		methods: {
			showOpra(e) {
				this.$emit('showOpration', e)
			},
			player(eve) {
				console.log(eve)
				var datas = eve.currentTarget.dataset
				console.log(datas)
				this.innerAudioContext.src = "https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3"
				this.innerAudioContext.play()
				if(this.is_play) {
					this.innerAudioContext.stop()
				}
			},
			preview(e){
				// this.preImgPath = e.currentTarget.dataset.file
// 				uni.previewImage({
// 					urls: [this.preImgPath]
// 				})
				this.$emit('preivewImg',e)
			},
			againSend(e) {
				console.log(e)
				var _this = this
				var id = e.currentTarget.dataset.failid
				uni.showActionSheet({
					itemList: ['重发', '删除'],
					success: function (res) {
						if(res.tapIndex == 1) {
							_this.$emit('setDelid',id)
						}else if(res.tapIndex == 0) {
							console.log(666)
							if(_this.netState) {
								_this.$emit('bindResetSend',id)
							}else {
								uni.showToast({
									title: '重发失败',
									duration: 800,
									icon:'none'
								});
							}
						}
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				})
			}
		}
	}
</script>

<style>
	.content-wrap image {
		position: relative;
		width: 400upx;
		top: 10upx;
	}

	.audio-wrap {
		display: flex;
		align-items: center;
		width: 200upx;

	}

	.m-item {
		display: flex;
		flex-direction: row;
		padding-top: 40upx;
	}

	.m-left {
		display: flex;
		width: 120upx;
		justify-content: center;
		align-items: flex-start;
	}

	.m-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		word-break: break-all;
		/* border: 1px solid red; */
	}

	.m-right {
		display: flex;
		width: 120upx;
		justify-content: center;
		align-items: flex-start;
	}

	.head_icon {
		width: 80upx;
		height: 80upx;
	}

	.m-content-head {
		position: relative;
	}

	.m-content-head-right {
		display: flex;
		justify-content: flex-end;
	}

	.m-content-head-left { 
		display: flex;
		justify-content: flex-start;
	}

	.m-content-head-home {
		text-align: left;
		background: #1482d1;
		border: 1px #1482d1 solid;
		border-radius: 20upx;
		padding: 20upx;
		color: white;
	}

	.m-content-head-home:before {
		border: 15upx solid transparent;
		border-right: 15upx solid #1482d1;
		left: -26upx;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}

	.m-content-head-customer {
		border: 1upx white solid;
		background: white;
		border-radius: 20upx;
		padding: 20upx;
		justify-content: flex-end;
	}

	.m-content-head-customer:after {
		border: 15upx solid transparent;
		border-left: 15upx solid white;
		top: 20upx;
		right: -26upx;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}

	.readText {
		font-size: 25upx;
		color: #8F8F94;
	}

	.readText-right {
		text-align: right;
	}

	.msg-time {
		font-size: 28upx;
		text-align: center;
		color: #8F8F94;
		padding-bottom: 10px;
	}

	.have-time-padding {
		padding-top: 25px;
	}

	.m-content-img image {
		max-width: 400upx;
	}

	.m-content-right {
		text-align: right;
	}

	.msg-img,
	.audio-img {
		width: 50upx;
		height: 50upx;
	}

	.audio-unread-left,
	.audio-unread-right {
		width: 15upx;
		height: 15upx;
		background-color: red;
		position: relative;
		border-radius: 8upx;
	}

	.audio-unread-left {
		left: 130upx;
	}

	.audio-unread-right {
		right: 130upx;
	}
	.send_fail image {
		width: 40upx;
		height: 40upx;
		/* position: absolute; */
	}
</style>
