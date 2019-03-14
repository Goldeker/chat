<template>
	<view class="contact-wrap">
		<view class="search-wrap" >
			<view class="search-mask" v-if="is_inp_serach" >
				<image src="../../static/images/search.png" ></image> 
				<text>搜索</text>
			</view>  
			<view class="search-inp" >
				<input type="text" @focus="is_inp_serach=false" @blur="is_inp_serach=true"> 
			</view> 
		</view>
		<view class="contact-list">
			<view class="contact-item">
				<view class="contact-left">
					<image src="../../static/images/123.jpg"></image>
				</view>
				<view class="contact-right">
					<view class="contact-name">
						客服
					</view>
					<view class="contact-status">
						<text>[在线]</text>
					</view>
				</view>
			</view>
			
			<view class="contact-item">
				<view class="contact-left">
					<image src="../../static/images/123456.jpg"></image>
				</view>
				<view class="contact-right">
					<view class="contact-name">
						客服
					</view>
					<view class="contact-status">
						<text>[在线]</text>
					</view>
				</view>
			</view>

		</view>
	</view> 
</template>
 
<script>

	export default {
		data() {
			return {
				is_inp_serach:true 
			}
		},
		onLoad(){
			
		}
		
	}
</script>

<style lang="scss" scoped>
	@import "../../static/css/common";
	.contact-list {
		padding-top: 20upx ;
		.contact-item {
			display: flex;
			padding: 0upx 0 5upx 20upx;
			.contact-left {
				width: 100upx;
				height: 100upx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.contact-right {
				margin: 5upx 0 20upx 20upx;
				border-bottom: 1px solid #eee;
				width: 90%;
				.contact-name {
					font-size: 33upx;
					color: #333;
				}
				.contact-status {
					font-size: 28upx;
					color: #999999;
					padding: 8upx 0 25upx 0;
				}
			}
		}
	}
</style>
