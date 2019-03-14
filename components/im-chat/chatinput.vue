<template>
	<view class="footer-wrap">
		<view class="footer" :style="{'height':f_height+'px'}">
			<view class="footer-left">
				<image src="../../static/icon_player.png" @click.stop="initReco" ></image>
			</view>
			
			<view class="footer-center" v-show="!is_audio" >
				<textarea  class="input-text"  v-model="inputValue" :style="{'height':t_height+'px'}" @linechange="bindLineChange($event)" @focus="textFocus" @blur="bindBlur"></textarea>
			</view>
			<view class="footer-center audio-wrap"  v-show="is_audio" @touchstart.stop="startReco($event)" @touchend="stopReco" @touchmove="cancelRec($event)" >
				<text >按住说话</text>
			</view> 
			
			<view class="footer-right" >
				<image src="../../static/icon_biaoqin.png" @click.stop="openEmoji" ></image>
				<image v-show="isText" src="../../static/icon_photos.png"  @click.stop="choiseImg"></image>
				<text  v-show="!isText" @tap="sendMessge">发送</text>
			</view>
		</view>
		<view class="panel" v-show="showPanel">
			<scroll-view class="panel-emoji" scroll-y="true">
				<view class="emoji-item"  v-for="(res,index) in emojis" :key="index" :style="{'width':emojiWidth+'px'}">
					<image :src="res.url" :data-name="res.name" @click.stop="selectEmoji($event)"
					 mode="widthFix" ></image>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {ename_cn,ename_en} from '../../common/emojiConfig.js'
	 import {
	    mapState
	} from 'vuex'
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	
	export default {
		name: "chat-input",
		computed: mapState(['showPanel']),
		data() {
			return {
				inputValue: '',
				isText:true,
				emojis:[{
					url:require('../../static/emoji/anguished.png'),
					name:'[表情]'
				}],
				f_height:40,
				t_height:20,
				panelHeight:0,
				is_audio:false,
				voicePath:"",
				voiceTime:1,
				recoState:null,
				emojiWidth:0,
				viewX:0,
				viewY:0
			}
		},
		onLoad(){
			for(var i =0;i<23;i++) {
				this.emojis.push({
					url:require('../../static/emoji/'+ename_en[i]+'.png'),
					name:ename_cn[i]
				})
			}
			var _this = this
			_this.emojiWidth = this.$store.state.screenInfo.w/10
			console.log(_this.emojiWidth)
			recorderManager.onStop(function (res) {
				console.log(res)
				clearInterval(_this.recoState)
				if(_this.voiceTime<2) {	//小于1秒返回
					return ;
				}
				_this.$emit('msgAudio', {
					tempFilePath:res.tempFilePath,
					duration:_this.voiceTime
				})
			})
			recorderManager.onStart(function (res) {
				_this.voiceTime = 1
				_this.recoState = setInterval(function(){
					_this.voiceTime = _this.voiceTime + 1
				},1000)
			})
			recorderManager.onError(function (res) {
				console.log('录音失败')
				clearInterval(_this.recoState)
				_this.voiceTime = 0
			})
			
		},
		watch:{
			inputValue(v){
				if(v.trim() =="") {
					this.isText = true
				}else {
					this.isText = false
				}
			}
		},
		methods: {  //<.+?>/g
			sendMessge: function () {
				var that = this;
				if (that.inputValue.trim() == '') {
					that.inputValue = '';
				} else { 
					this.$emit('send-message', {
						type: 'text',
						content: that.inputValue.replace(/<.+?>/g,'').replace(/[\n]/g,"<br/>")
					});
					that.inputValue = '';
				}
			},
			selectEmoji(e){
				console.log(e)
	
				this.inputValue = this.inputValue + e.currentTarget.dataset.name
			}, 
			bindLineChange(el) {
				var lineNum = el.detail.lineCount - 1
				if(el.detail.lineCount<5) {
					this.f_height = 40 + lineNum*20
					this.t_height = 20 + lineNum*20
				}
			}, 
			openEmoji(){
				if(this.$store.state.showPanel) {
					this.$store.dispatch('setShowPanel',false)
				}else {
					this.$store.dispatch('setShowPanel',true)
				}
				this.is_audio = false
				this.$emit('openEmoji')
			},
			choiseImg(){
				var _this = this
				uni.chooseImage({
					count: 5, 
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], 
					success: function (res) {
						console.log(JSON.stringify(res.tempFilePaths));
						_this.$emit('chooseImgPaths',res.tempFilePaths)
					}
				});
			},
			initReco(){
				this.is_audio ? this.is_audio = false : this.is_audio = true
				this.$store.dispatch('setShowPanel',false)
				this.$emit('openEmoji')
			},
			startReco(e){
				console.log('start ')
				this.viewX = e.clientX
				this.viewY = e.clientY
				recorderManager.start()
				uni.showToast({
					duration: 60000,
					image:'../../static/emoji/anguished.png',
				})
			},
			stopReco(){
				recorderManager.stop()
				uni.hideToast()
				this.$emit('scrollBottom')
			},
			textFocus() {	//输入文字收回表情面板
				this.$store.dispatch('setShowPanel',false)
				this.$emit('openEmoji')
				this.$emit('focus')
			},
			bindBlur(){
				this.$emit('blur')
			},
			cancelRec(e) {
				var x = e.clientX
				var y = e.clientY
				if(Math.abs(x-this.viewX)>10 || Math.abs(y-this.viewY)>15) {
					this.stopReco()
				}
			}
		}
	} 
</script>

<style>
	.footer {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 80upx;
		min-height: 80upx;
		border-top: solid 1px #bbb;
		overflow: hidden;
		padding: 5upx;
		background-color: #fafafa;
	}
	.footer-left {
		width: 90upx;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.footer-left image {
		width: 62upx;
		height: 62upx; 
	}
	.footer-right image  {
		width: 70upx;
		height: 70upx;
		margin-right: 6upx;
	}
	.footer-right {
		width: 180upx;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #1482D1;
	}
	.footer-right text {
		background-color: #70a4fa;
		color: #fff;
		font-size: 30upx;
		padding: 5upx 8upx;
	}
	.footer-center {
		flex: 1;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid red;
	}
	.footer-center .input-text {
		flex: 1;
		background: #fff;
		border: solid 1upx #ddd;
		padding: 10upx !important;
		font-family: verdana !important;
		overflow: hidden;
		border-radius: 15upx;
		width: 60%;
		font-size: 33upx;
		position: absolute;
		top: 18upx;
		left: 100upx;
		min-height: 20px;
	}
	.panel {
		width: 100%;
		background-color: #fff;
	}
	.emoji-item {
		display: inline-block;
		padding: 8upx 0;
		text-align: center;
	}
	.panel-emoji {
		height: 134px;
		border-top: 1px solid #eee;
		padding-top: 10upx;
	}
	.panel-emoji image{
		width: 60upx;
	}
	.audio-wrap {
		background-color: #eee;
	}
	.audio-wrap text {
		font-size: 33upx;
		color: #333;
	}
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	}
</style>
