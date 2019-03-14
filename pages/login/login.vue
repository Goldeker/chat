<template>
	<view class="login-wrap">
		<h2>账号登陆</h2>
		<view class="inp-item">
			<text>账号</text>
			<input type="text" placeholder="请输入您的账号" />
		</view>
		<view class="inp-item">
			<text>密码</text>
			<input type="password" placeholder="请输入您的密码" />
		</view>
		<button class="login-btn" type="primary">登陆</button>
		<ts-tip></ts-tip>
	</view>
</template>

<script>
	import tsTip from '@/components/ts-tip'
	export default {
		data() {
			return {
				
			}
		},
		components:{
			tsTip 
		}
	}
</script>

<style lang="scss" scoped>
	.login-wrap {
		padding: 130upx 20upx  0 20upx;
		h2 {
			font-weight: normal;
			color: #333;
			margin-bottom: 65upx;
		}
		.inp-item {
			display: flex;	
			padding: 30upx 0;
			border-bottom:1px solid #eee;
			margin-top: 20upx;
			input {
				padding-left: 30upx;
			}
		}
		.login-btn {
			margin-top: 200upx;
		}
	}


</style>
