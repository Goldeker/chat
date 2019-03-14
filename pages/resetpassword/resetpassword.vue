<template>
	<view class="bg-color form-page" :style="{height:wHeight}">
		<view class="rest-tip">重置密码需要用新密码登陆</view>
		<view class="form-wrap"> 
			<view class="form-item">
				<text>旧密码</text>
				<input type="text" placeholder="请输入旧密码" placeholder-style="font-size:16px"/>
			</view>
			<view class="form-item"> 
				<text>新密码</text> 
				<input type="password" placeholder="请输入新密码" placeholder-style="font-size:16px" />
			</view>
			<view class="form-item"> 
				<text>确认密码</text>
				<input  type="password" placeholder="请再次输入新密码" placeholder-style="font-size:16px"/>
			</view>
		</view>
		<view class="pass-tip">密码字符至少8个字符，而且同时包含数字和字母。<text class="forget-pass" @click="forgetPass">忘记旧密码?</text></view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			...mapState(['wHeight'])
		},
		methods:{
			forgetPass(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-page {
		color: #333;
		font-size: 16px;
		.rest-tip {
			padding: 25upx 20upx;
		}
	}
	.form-wrap {
		background-color: #fff;
		.form-item {
			display: flex;
			padding: 20upx ;
			text {
				width: 30%; 
			}
		}
	}
	.pass-tip {
		padding: 30upx 0 0 20upx;
	}
	.forget-pass {
		color: $uni-text-color-blue;
	}

</style>
