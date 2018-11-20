<!-- 合同协议 -->
<template>
	<div class="agreement">
		<p class="agreement-pt">请您认真阅读以下协议内容：</p>
		<ul>
			<li v-for="item in items">
				<a :href="item.templateUrl">{{item.contName}}</a>
			</li>
		</ul>
		<!-- <ul>
			<li>
				<a :href="zixun">《借款咨询服务协议》</a>
			</li>
			<li>
				<a :href="xieyi">《借款协议》</a>
			</li>
			<li>
				<a :href="weituo">《委托划扣授权书》</a>
			</li>
			<li>
				<a :href="huankuan">《还款事项提醒函》</a>
			</li>
			<li>
				<a :href="danbao">《委托担保书》</a>
			</li>
		</ul> -->
		<p class="agreement-pb" @click="agreeSign">同意签订</p>
	</div>
</template>
<script>
import appConstant from '../../util/constant'
	export default{
		data(){
			return{
				/*zixun:appConstant.protocol + 'borrowAdvisoryProtocol.html',
				xieyi:appConstant.protocol + 'borrowProtocol.html',
				weituo:appConstant.protocol + 'entrustDrawAuthor.html',
				huankuan:appConstant.protocol + 'paymentReminderLetter.html',
				danbao:appConstant.protocol + 'entrustGuaranteePower.html',*/
				items:'',
				agreeRow:'',
				list:{"code":"100000","data":[{
					templateUrl:'http://prenyph.nuoyuan.com.cn/protocol.html',
					contName:'协议协议'
				}],"status":true}
			}
		},
		mounted(){
			this.agreeRow = JSON.parse(localStorage.getItem('agreeRow'));
			console.log(this.agreeRow);
			this.contTemplates();
		},
		methods:{
			agreeSign(){
				console.log(this.agreeRow.id);
				//this.$router.push("securityCode");
				this.$router.replace({name:"securityCode",params:{id:this.agreeRow.id}});
			},
			contTemplates(){
				this.post('/cont/contTemplates',{
					proCode:this.agreeRow.proCode,//Y产品编码		
					applySubNo:this.agreeRow.applySubNo//Y进件编号
				}).then(res =>{
					if(res.data.code == '100000'){
						this.items = res.data.data;
						//console.log(this.items);
					};
				})
			},
		},
	}
</script>
<style type="text/css" scoped>
	.agreement{
		width: 100%;
		height: 100%;
		background: #f6f6f6;
	}
	.agreement-pt{
		width: 100%;
		height: .88rem;
		font-size:.30rem;
		color:#333333;
		line-height: .88rem;
		padding-left: .5rem;
		text-align: left;
	}
	.agreement-pb{
		width: 100%;
		height: .99rem;
		background-image:linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
		font-size:.34rem;
		color:#ffffff;
		text-align:center;
		line-height: .99rem;
		position: fixed;
		bottom: 0;
	}
	.agreement ul{
		width: 100%;
	}
	.agreement ul li{
		width: 100%;
		height: .88rem;
		background: #fff;
		line-height: .88rem;
		font-size:.28rem;
		color:#2da8e1;
		margin-bottom: .1rem;
	}
	.agreement ul li a{
		font-size:.28rem;
		color:#2da8e1;
	}
</style>