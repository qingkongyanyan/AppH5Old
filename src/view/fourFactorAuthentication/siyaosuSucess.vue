<!-- 签约成功 -->
<template>
	<div class="siyaosuSucess">
		<img src="/static/images/signSuccess@2x.png">
		<p>恭喜您，银行卡信息认证成功！</p>
		<p class="backBtn" >
			<router-link v-show="list" to="businessList">返回</router-link>
			<router-link v-show="!list" to="basicAuthentication">返回</router-link>
		</p>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				list:true,
			}
		},
		mounted(){
			var fromOrBack = localStorage.getItem('fromOrBack');
			if(fromOrBack == 'yewuyemian'){
				this.list = true;
			};
			if(fromOrBack == 'jichurenzheng'){
				this.list = false;
			};
		},
		methods:{
			
		},
	}
</script>
<style type="text/css" scoped>
	.siyaosuSucess{
		width: 100%;
		height: 100%;
		background: #f6f6f6;
	}
	.siyaosuSucess img{
		width: 4rem;
		height: 4rem;
		margin:.88rem 0 .33rem 0;
	}
	.siyaosuSucess p{
		font-size:.34rem;
		color:#666666;
		text-align:center;
	}
	/* 返回按钮 */
	.siyaosuSucess p.backBtn{
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
	.siyaosuSucess p.backBtn a{
	    font-size: 0.34rem;
	    text-decoration: none;
	    color: #fff;
	}
</style>