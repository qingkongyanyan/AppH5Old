<template>
	<div class="newAgreement">
		<!-- 合同协议 -->
		<div class="agreement" v-if="agreeShow">
			<p class="agreement-pt">请您认真阅读以下协议内容：</p>
			<ul>
				<li v-for="item in items">
					<a :href="item.templateUrl">{{item.contName}}</a>
				</li>
			</ul>
			<p class="agreement-pb" @click="agreeSign">同意签订</p>
		</div>
		<!-- 填写验证码 -->
		<div class="securityCode" v-if="codeShow">
			<div>
				<p class="securityCode-pt">您已同意签订以上协议内容，如需签订，请输入验证码</p>
		      	<div class="securityCode-div" :class="{activec:cc && code && code.length > 0}">
			        <input 
			          type="text" 
			          placeholder="短信验证码"
			          v-model="code" 
			          @focus="cc = true"        
			          @blur="cc = false"
			        >           
			        <span class="close" v-show='cc && code && code.length > 0' @click="code=''"></span>
			        <!-- <span class="getCode" v-show="show" @click="getCode">
			          获取验证码
			        </span>
			        <span class="getCode" v-show="!show">
			          {{count}}秒后重新获取
			        </span> -->
			        <span class="getCode" v-show="show" @click="getCode">
	              		获取验证码
			        </span>
			        <span class="getCode" v-show="daoShow">
			          {{count}}秒
			        </span>
			        <span class="getCode" v-show="reShow" @click="getCode">
			          重新获取
			        </span>
			      </div>
				<p class="securityCode-pb" @click="agreeCodeSign" v-show="code != ''">签订</p>
				<p class="securityCode-pbs" v-show="code == ''">签订</p>
			</div>
		</div>
		<!-- 签约成功 -->
		<div class="signSuccessful" v-if="signShow">
			<img src="/static/images/signSuccess@2x.png" v-show='sucess'>
			<p v-show='sucess'>恭喜您协议签订成功！</p>
			<img src="/static/images/signSuccess@2x.png" v-show='!sucess'>
			<p v-show='!sucess'>恭喜您协议签订成功！</p>
			<p class="backBtn" >
				<a @click="goList">返回</a>
				<!-- <router-link to="/signAContractList">返回</router-link> -->
			</p>
		</div>
		<!-- 验证码弹窗 -->
	    <div class="tip" v-show="showCover" @click="showCover=false">
	      <!-- <p> -->
	      <span>{{tip}}</span>
	      <!-- </p> -->
	</div>
	</div>
</template>
<script>
//import appConstant from '../../util/constant'
export default{
	data(){
		return{
			agreeShow:true,//合同协议页面
			codeShow:false,//填写验证码页面
			signShow:false,//签约成功
			items:'',
			agreeRow:'',
			/*list:{"code":"100000","data":[{
				templateUrl:'http://prenyph.nuoyuan.com.cn/protocol.html',
				contName:'协议协议'
			}],"status":true},*/
			code:'',
			cc:false,
			count:'',
			timer:null,
			tip:'',
			showCover:false,
			show: true,
		    reShow: false,
		    daoShow: false,
		    mobile:'',
		    certCode:'',//证件号码
		    bankCardNo:'',//银行卡号
		    sucess:true,
		}
	},
	mounted(){
		this.agreeRow = JSON.parse(localStorage.getItem('agreeRow'));
		console.log(this.agreeRow);
		this.contTemplates();
		this.mobile = localStorage.getItem('mobile');
		this.certCode = localStorage.getItem('certCode');
		this.bankCardNo = JSON.parse(localStorage.getItem('loginInformation')).sysCust.bankCardNo;
		console.log(this.mobile);
		console.log(this.$route.params.id);
	    this.show = true;
	    this.reShow = false;
	    this.daoShow = false;
	},
	methods:{
		//同意签订按钮
		agreeSign(){
			this.agreeShow = false;
			this.codeShow = true;
			this.signShow = false;
			//console.log(this.agreeRow.id);
			//this.$router.push("securityCode");
			//this.$router.replace({name:"securityCode",params:{id:this.agreeRow.id}});
		},
		//合同协议页面接口
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
		//验证码页面接口
		agreeCodeSign(){
				this.post('/cont/contDraft',{
					auditId:this.agreeRow.id,//Y终审ID	
					certCode:this.certCode,//Y证件号码	
					bankCardNo:this.bankCardNo,//Y银行卡号	
					mobile:this.mobile,//Y手机号	
					smsVerificationCode:this.code//Y短信验证码
				}).then(res =>{
					if(res.data.code == '100000'){
						//this.$router.push({name:"signSuccessful",params:{status:true}});
						this.agreeShow = false;
						this.codeShow = false;
						this.signShow = true;
					}else{
						this.tip = res.data.msg;
						if(res.data.msg == '短信验证码校验失败'){
							this.tip = '短信验证码错误，请重新输入';
						}
						var sel = this;
			            this.showCover = true;
			            setTimeout(function() { sel.showCover = false; }, 3000);
			            return;
					};
				});
				
		},
		getCode(){
		   this.post('/account/getMsgCheckCode', {
	        mobile: this.mobile, //手机号 
	        msgCheckType: '3', //短信验证码类型  忘记密码验证码:2
	      }).then(res => {
	        if (res.data.status == true && res.data.code == 100000) {
	          //成功
	          const TIME_COUNT = 120;
	          if (!this.timer) {
	            this.count = TIME_COUNT;
	            this.show = false;
	            this.reShow = false;
	            this.daoShow = true;
	            this.timer = setInterval(() => {
	              if (this.count > 0 && this.count <= TIME_COUNT) {
	                this.count--;
	              } else {
	                this.show = false;
	                this.daoShow = false;
	                this.reShow = true;
	                clearInterval(this.timer);
	                this.timer = null;
	              }
	            }, 1000)
	          };
	        };
	        if (res.data.status == false && res.data.code != 100000) {
	          //失败
	          var sel = this;
	          this.tip = res.data.msg;
	          this.showCover = true;
	          setTimeout(function() { sel.showCover = false; }, 3000);
	          return;
	        };
	        if ((res.data.status == false && res.data.code == 101002) || (res.data.status == false && res.data.code == 101004)) {
	          //失败
	          this.imgcode = '';
	          var sel = this;
	          this.tip = res.data.msg;
	          this.showCover = true;
	          setTimeout(function() { sel.showCover = false; }, 3000);
	          return;
	        };
	      })
		},
		//签约成功页面接口
		goList(){
				//this.$router.push("/businessList");
				this.$router.push("/signAContractList");
			},
	},
}
</script>
<style type="text/css" scoped>
	.newAgreement{
		width: 100%;
		height: 100%;
	}
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

	.securityCode{
		width: 100%;
		height: 100%;
		background: #fff;
	}
	.securityCode-pt{
		width: 68%;
		height: .8rem;
		font-size:.28rem;
		color:#999999;
		padding-top: .76rem;
		/* line-height: .88rem; */
		padding-left: 16%;
		/* text-align: left; */
	}
	.securityCode-pb{
		width: 92%;
		height: .8rem;
		background-image:linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
		font-size:.34rem;
		color:#ffffff;
		text-align:center;
		line-height: .8rem;
		margin-top: .5rem;
		margin-left: 4%;
		border-radius: .1rem;
	}
	.securityCode-pbs{
		width: 92%;
		height: .8rem;
		background: url(/static/images/OCR_submit_disable@2x.png) no-repeat;
		font-size:.34rem;
		color:#ffffff;
		text-align:center;
		line-height: .8rem;
		margin-top: .5rem;
		margin-left: 4%;
		border-radius: .1rem;
	}
	.securityCode-div{
		width: 90%;
		height: .86rem;
		margin: .32rem 0 .5rem 5%;
		position: relative;
		border-bottom: 1px solid #c2c2c2;
	}
	.securityCode-div input{
		/* width: calc(100% - 1.8rem ); */
		width: 2.12rem;
		height: 100%;
		font-size:.28rem;
		color:#333333;
		border: none;
		outline: none;
		float: left;
	}
	.securityCode-div .close{
	    position: absolute;
	    right: 4.36rem;
	    top: 0.35rem;
	    margin-left: -2rem;
	    display: inline-block;
	    width: 0.24rem;
	    height: 0.24rem;
	    background: url(/static/images/close.png) no-repeat;
	    background-size: 0.24rem 0.24rem;
	  }
	.securityCode-div .getCode{
		width: 1.8rem;
		height: .5rem;
		line-height: .5rem;
		background:#c8a986;
		border-radius:.10rem;
		font-size:.22rem;
		color:#ffffff;
		float: right;
		margin-top: .18rem;
	}
	/* 弹框 */
	 .cover{
		width: 100%;
		height: 100%;
		background: rgba(51,51,51,.7);
		/* background:#333333; */
		position: fixed;
		left: 0;
		top: 0; 
	}
	.cover div{
		background:#ffffff;
		border-radius:.1rem;
		width:90%;
		height:5.27rem;
		position: absolute;
		left: 5%;
		top: 3.65rem;
	}
	.cover div h1{
		font-size:.4rem;
		color:#333333;
		text-align: center;
		padding: .91rem 0 .82rem 0;
	}
	 .cover div .cover-text{
		width: 88%;
		font-size:.34rem;
		color:#666666;
		text-align: center;
		padding-left: .42rem;
	} 
	.cover div .cover-butt{
		width: 88%;
		font-size:.34rem;
		color:#fff;
		text-align: center;
		background-image:linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
		border-radius:.10rem;
		height:.8rem;
		line-height: .8rem;
		margin:1.27rem 0 0 .42rem;
	}
	.cover img{
		width: .6rem;
		height: .6rem;
		position: absolute;
		left: 50%;
		margin-left: -.3rem;
		bottom: 3.31rem;
	}
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
	    color: 
</style>