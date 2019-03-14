<template>
	<view class="switch-wrap" :style="{marginTop:mTop}" :date-item="item">
		<view class="switch-text">
			{{text}}
		</view>
		<view class="switch-btn">
			<switch  @change="switchChange" :checked="checkedStatus" />
		</view>
	</view>
</template>

<script>
	export default {
		props:{ 
			text :{
				type: String, 
				default: ""
			},
			checkedStatus :{
				type: Boolean, 
				default: true
			},
			mTop :{
				type: String, 
				default: ""
			},
			item:0
		},
		data() {
			return {
				
			}
		},
		methods:{
			switchChange() {
				console.log(66666)
			}
		}
	}
</script>

<style lang="scss">
	.switch-wrap {
		display: flex;
		justify-content: space-between;
		font-size: $uni-font-size-lg;
		align-items: center;
		border-bottom: 1px solid #eee;
		padding: 20upx ;
		background-color: #fff;
	}
</style>
