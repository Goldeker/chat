<template>
	<view class="bg-color" :style="{height:$store.state.wHeight}">
		<switch-list text="消息提醒" ></switch-list>
		<switch-list mTop="10px" text="声音提醒"></switch-list>
		<switch-list text="震动提醒" ></switch-list>
		<switch-list text="消息免打扰" :checkedStatus="false"></switch-list>

		<view class="exit-login">退出登陆</view>
	</view>
</template>
 
<script>
	import switchList from '@/components/uni-switch-list'
	export default {
		data() {
			return {
				
			};
		},
		components:{
			switchList 
		}
	}
</script>

<style lang="scss" scoped>
	.exit-login {
		font-size: $uni-font-size-lg;
		text-align: center;
		padding: 23upx 0;
		background-color: #fff;
		margin-top: 10px;
	}
</style>
