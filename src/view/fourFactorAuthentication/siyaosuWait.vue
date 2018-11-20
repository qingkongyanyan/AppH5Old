<!-- 四要素认证中 -->
<template>
	<div class="siyaosuWait">
		<img src="/static/images/signSuccess@2x.png">
		<p>四要素认证中，请耐心等待！</p>
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
	.siyaosuWait{
		width: 100%;
		height: 100%;
		background: #f6f6f6;
	}
	.siyaosuWait img{
		width: 4rem;
		height: 4rem;
		margin:.88rem 0 .33rem 0;
	}
	.siyaosuWait p{
		font-size:.34rem;
		color:#666666;
		text-align:center;
	}
	/* 返回按钮 */
	.siyaosuWait p.backBtn{
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
	.siyaosuWait p.backBtn a{
	    font-size: 0.34rem;
	    text-decoration: none;
	    color: #fff;
	}
</style>