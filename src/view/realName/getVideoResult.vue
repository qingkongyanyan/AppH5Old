<!-- 实名-获取摄像头 -->
<template>
	<div class="getVideoResult">
		<div class="getVideoResult-top">
			<img v-if="imgUrl == ''" src="/static/images/ocr@2x.png">
			<img v-if="imgUrl != ''" :src="imgUrl">
		</div>
		<div class="getVideoResult-bottom">
			<p v-show="!statur">{{msg}}</p>
			<p v-show="!statur"></p>
			<p v-show="!statur" @click="resetOcr">重新认证</p>
			<p v-show="statur">身份认证成功</p>
			<p v-show="statur" @click="goList">返回</p>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		data(){
			return{
				statur:this.$route.params.status,
				imgUrl:this.$route.params.imgUrl!=''?this.$route.params.imgUrl:'',
				jichuOrYewu:'',
				msg:this.$route.params.msg,
			}
		},
		mounted(){
			console.log(this.$route.params.imgUrl);
			this.jichuOrYewu = localStorage.getItem('jichuOrYewu');
			console.log(this.jichuOrYewu);
		},
		methods:{
			resetOcr(){
				this.$router.push('realName');
			},
			goList(){
				if(this.jichuOrYewu == 'yewuyemian'){
					this.$router.push('businessList');
				};
				if(this.jichuOrYewu == 'jichurenzheng'){
					this.$router.push('basicAuthentication');
				};
				if(this.jichuOrYewu == 'mine'){
					this.$router.push('mine');
				};
				if(this.jichuOrYewu == 'jisumoshi'){
					this.$router.push('turboMode');
				};
				if(this.jichuOrYewu == 'gongxinmoshi'){
					this.$router.push('payrollModel');
				};
				if(this.jichuOrYewu == 'tongyemoshi'){
					this.$router.push('interbankModel');
				};
			},
		},
	}
</script>
<style scoped>
	.getVideoResult{
		width: 100%;
		height: 100%;
	}
	.getVideoResult-top{
		width: 5.36rem;
		height: 3.17rem;
		margin: .77rem 0 0 1.07rem;
	}
	.getVideoResult-top img{
		width: 100%;
		height: 100%;
	}
	.getVideoResult-bottom p:nth-of-type(1),.getVideoResult-bottom p:nth-of-type(4){
		font-size:.26rem;
		color:#2da8e1;
		margin: .62rem 0 .16rem;
	}
	.getVideoResult-bottom p:nth-of-type(2){
		font-size:.26rem;
		color:#333333;
	}
	.getVideoResult-bottom p:nth-of-type(3),.getVideoResult-bottom p:nth-of-type(5){
		width: 5.36rem;
		height: .8rem;
		background-image:linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
		margin: .31rem 0 0 1.07rem;
		font-size:.34rem;
		color:#ffffff;
		line-height: .8rem;
		text-align: center;
		border-radius: 10px;
	}
	.getVideoResult-bottom p:nth-of-type(5){
		margin-top: .68rem;
	}
</style>