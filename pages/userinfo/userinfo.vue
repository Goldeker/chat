<template>
	<view class="userinfo-wrap bg-color" :style="{height:$store.state.wHeight}">
		<view class="head-wrap">
			<view class="head-img">
				<image src="../../static/images/123.jpg"></image>
			</view>
			<view class="head-info"> 
				<view class="head-name">
					无厘头时
				</view> 
				<view class="head-id">
					无厘头时
				</view>
			</view>
		</view>
		<list-item tabName="备注" rightText="陈总" mTop="10px"></list-item>
		<list-item tabName="电话号码" rightText="13851565465"></list-item>
		<list-item tabName="聊天记录"  mTop="10px"></list-item>
		<list-item tabName="描述"  mTop="10px"></list-item>
		
		<view class="send-msg-btn">发送消息</view>
		<view class="del-btn">删除</view>
	</view> 
</template>

<script>
	import listItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		data() {
			return { 
				
			}
		},
		onLoad(){
			console.log(this.$store.state.wHeight)
		},
		components:{
			 listItem 
		}
	}
</script>

<style lang="scss" scoped>
	.userinfo-wrap {
		background-color: #f5f5f5;
	}
	.head-wrap {
		display: flex;
		padding:  20upx;
		background-color: #fff;
		.head-img {
			width: 100upx;
			height: 100upx;
			image {
				width: 100%;
				height: 100%; 
			}
		}
		.head-info {
			padding: 8upx 20upx;
			.head-name {
				font-size: $uni-font-size-lg;
				color: #333;
			}
			.head-id {
				font-size: $uni-font-size-base;
				color: #999999;
			}
		}
	}
	.send-msg-btn,.del-btn {
		background-color: #fff;
		text-align: center;
		font-size: $uni-font-size-lg;
		padding: 22upx 0; 
	}
	.send-msg-btn {
		margin-top: 10px;
		color: $uni-text-color-blue;
	}
	.del-btn {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		color: #EE3B3B;
	}
</style>
