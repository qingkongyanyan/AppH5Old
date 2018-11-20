<!-- 手机号变更结果 -->
<template>
	<div class="myAccountChange">
		<div class="myAccountChange-top">
			<img src="/static/images/signSuccess@2x.png">
		</div>
		<div class="myAccountChange-center">
			<p>恭喜您手机号码变更成功！</p>
			<p>当前绑定的手机号码为：{{mobile}}</p>
		</div>
		<p class="button" @click="goLogin">确认并重新登录</p>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				mobile:this.$route.query.mobile,
			}
		},
		methods:{
			goLogin(){
				this.$router.push('/');
			}
		},
	}
</script>
<style scoped>
	.myAccountChange{
		width: 100%;
		height: 100%;
		background-image:linear-gradient(-180deg, #f8f9ff 3%, #f9f9f9 96%);
	}
	.myAccountChange-top{
		padding: .57rem 0 .43rem 0;
		text-align: center;
	}
	.myAccountChange-top img{
		width: 4rem;
		height: 4rem;
	}
	.myAccountChange-center{
		width: 100%;
	}
	.myAccountChange-center p{
		width: 100%;
		text-align: center;
	}
	.myAccountChange-center p:nth-of-type(1){
		font-size: .34rem;
		color: #666;
	}
	.myAccountChange-center p:nth-of-type(2){
		font-size: .3rem;
		color: #999;
		margin-top: .08rem;
	}
	.button{
		width: 92%;
		height: .8rem;
		margin: .4rem 0 0 4%;
		background-image:linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
		border-radius:.1rem;
		font-size:.34rem;
		line-height: .8rem;
		color: #fff; 
	}
</style>