<!-- 签约成功 -->
<template>
	<div class="signSuccessful">
		<img src="/static/images/signSuccess@2x.png" v-show='sucess'>
		<p v-show='sucess'>恭喜您协议签订成功！</p>
		<img src="/static/images/signSuccess@2x.png" v-show='!sucess'>
		<p v-show='!sucess'>恭喜您协议签订成功！</p>
		<p class="backBtn" >
			<a @click="goList">返回</a>
			<!-- <router-link to="/signAContractList">返回</router-link> -->
		</p>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				sucess:true,
				//sucess:this.$route.params.status,
			}
		},
		methods:{
			goList(){
				this.$router.push("/businessList");
				//this.$router.push("/signAContractList");
			},
		},
	}
</script>
<style type="text/css" scoped>
	.signSuccessful{
		width: 100%;
		height: 100%;
		background: #f6f6f6;
	}
	.signSuccessful img{
		width: 4rem;
		height: 4rem;
		margin:.44rem 0 .33rem 0;
	}
	.signSuccessful p{
		font-size:.34rem;
		color:#666666;
		text-align:center;
	}
	/* 返回按钮 */
	.signSuccessful p.backBtn{
	    font-size: 0.34rem;
	    text-decoration: none;
	    width: 92%;
	    height: .8rem;
	    line-height: .8rem;
	    background-image:linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
	    border-radius:10px;
	    color: #fff;
	    margin-top: .62rem;
	    margin-left: 4%;
	}
	.signSuccessful p.backBtn a{
	    font-size: 0.34rem;
	    text-decoration: none;
	    color: #fff;
	}
</style>