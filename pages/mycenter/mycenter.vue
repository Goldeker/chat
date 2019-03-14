<template>
	<view class="op-list-wrap">
		<list-item tabName="头像"><image class="avatar" src="/static/images/123.jpg" @click="previewImg()"></image></list-item>
		<list-item tabName="客服" rightText="客服一号"></list-item>
		<list-item mTop="10px" tabName="重置密码"  ></list-item>
	</view> 
</template> 

<script>
	import listItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		data() {
			return {
				
			}; 
		},
		components:{
			 listItem 
		},
		methods:{
			show(){
				console.log(666)
			},
			previewImg(){
				uni.previewImage({
					urls: ["/static/images/123456.jpg"]
				});
			}
		}
	}
</script>

<style lang="scss">
	.avatar {
		width: 100upx;
		height: 100upx;
		margin-right: 20upx;
	}
	.op-list-wrap {
		background-color: #f5f5f5;
	}
	
</style>
