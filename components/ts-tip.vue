<template>
	<view class="ts-tip" :style="{bottom:bottom}" >
		技术支持@AI人工智能服务中心
	</view>
</template>

<script>
	export default {
		props:{
			bottom :{
				type: String, 
				default: "8px"
			},
		}
	}
</script>

<style>
	.ts-tip {
		position: absolute;
		width: 100%;
		font-size: 20upx;
		color: #999999;
		text-align: center;
	}
</style>
