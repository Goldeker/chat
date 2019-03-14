<template>
	<view class="uni-list" :style="{marginTop:mTop}" >	
		<view class="list-left">
			<text>{{tabName}}</text>
		</view>
		<view class="list-right"> 
			<text>{{rightText}}</text>
			<slot></slot>
			<image class="right-arrow" src="/static/images/right_arrow.png" ></image>
		</view>
	</view>
</template> 

<script>
	export default {
		props: {
			rightText: {
				type: String,
				default: ""
			},
			tabName: {
				type: String,
				default: ""
			},
			mTop :{
				type: String,
				default: ""
			}
		},
		data() {
			return {
				 
			}
		},
		methods:{
			emitClick(e){
				console.log(e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-list { 
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333;
		font-size: 33upx;
		border-bottom: 1px solid #eee;
		padding: 18upx 20upx;
		background-color: #fff;
		.list-right {
			display: flex;
			align-items: center;
			text {
				padding-right: 15upx;
			}
			.right-arrow {
				width: 50upx;
				height: 50upx;
			}
		}
	}
</style>
