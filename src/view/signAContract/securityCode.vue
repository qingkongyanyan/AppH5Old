<!-- 填写验证码 -->
<template>
	<div class="securityCode">
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
		    <p class="showTip" v-show="showTip">验证码已发送至{{newMobile}}</p>
			<p class="securityCode-pb" @click="agreeSign" v-show="code != ''">签订</p>
			<p class="securityCode-pbs" v-show="code == ''">签订</p>
		</div>
		<!-- 弹窗 -->
	    <div class="tip" v-show="showCover" @click="showCover=false">
	      <!-- <p> -->
	      <span>{{tip}}</span>
	      <!-- </p> -->
	    </div>
	</div>
</template>
<script>
import { Indicator } from 'mint-ui';
	export default{
		data(){
			return{
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
			    id:this.$route.params.id,
			    zongInfo:'',//查询四要素最新认证成功记录 返回数据
			    agreeRow:'',//列表数据
			    orderNo:'',//订单号
			    signFlag:'',//是否签约标识
			    newMobile:'',
			    showTip:false,
			    signNo:'',//签约号
			}
		},
		mounted() {
			this.mobile = localStorage.getItem('mobile');
			this.certCode = localStorage.getItem('certCode');
			//this.bankCardNo = JSON.parse(localStorage.getItem('loginInformation')).sysCust.bankCardNo;
			this.bankCardNo = localStorage.getItem('bankCardNo');
			this.agreeRow = JSON.parse(localStorage.getItem('agreeRow'));
			console.log(this.mobile);
			console.log(this.$route.params.id);
		    this.show = true;
		    this.reShow = false;
		    this.daoShow = false;
		    this.getBankVerifyNew();
		},
		methods:{
			getBankVerifyNew(){
				this.post('/account/getBankVerifyNew',{
					cardNo:this.bankCardNo,//银行卡号	
					idNum:this.certCode//身份证号	
				}).then(res=>{
					if(res.data.code == '100000'){
						this.zongInfo = res.data.data;
						this.newMobile = this.zongInfo.mobile.replace(this.zongInfo.mobile.slice(3,7),'****');
						console.log(this.zongInfo);
					}
				})
			},
			agreeSign(){
				//开始加载提示框
	            Indicator.open({
	              text: '加载中...',
	              spinnerType: 'fading-circle'
	            });
				this.post('/contPay/paySign',{
					checkCode:this.code,//短信验证码	
					orderNo:this.orderNo,//订单号	
					/*checkCode:'123456',//短信验证码	
					orderNo:this.orderNo//订单号*/
					signFlag:this.signFlag,//是否签约标识 0-否 1-是
        			mobile:this.zongInfo.mobile//手机号
				}).then(res =>{
					if(res.data.code == '100000'){
						if(res.data.data){
							this.signNo= res.data.data.signNo;
						}else{
							this.signNo = '';
						};
						this.post('/cont/contDraft',{
							auditId:this.id,//Y终审ID	
							certCode:this.zongInfo.certCode,//Y证件号码	
							bankCardNo:this.zongInfo.bankCardNo,//Y银行卡号	
							mobile:this.zongInfo.mobile,//Y手机号
							smsVerificationCode:this.code,//短信验证码	
							signNo:this.signNo,//签约协议号
						}).then(res=>{
							//关闭加载提示框
                      		Indicator.close();
							if(res.data.code == '100000'){
								this.$router.push({name:"signSuccessful",params:{status:true}});
							}else{
								this.tip = res.data.msg;
								if(res.data.msg == '短信验证码校验失败'){
									this.tip = '短信验证码错误，请重新输入';
								}
								var sel = this;
					            this.showCover = true;
					            setTimeout(function() { sel.showCover = false; }, 3000);
					            return;
							}
						})
						
					}else{
						//关闭加载提示框
                      	Indicator.close();
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
			   this.post('/contPay/prePaySign', {
		        accountName:this.zongInfo.custName,//客户姓名	
				certCode:this.zongInfo.certCode,//证件号码	
				accountCode:this.zongInfo.bankCardNo,//银行卡号	
				custNo:this.agreeRow.custNo,//客户编号	
				phone:this.zongInfo.mobile,//手机号码
				/*accountName:'李梅梅',//客户姓名	
				certCode:'110101198012014017',//证件号码	
				accountCode:this.zongInfo.bankCardNo,//银行卡号	
				custNo:this.agreeRow.custNo,//客户编号	
				phone:'13120482188',//手机号码*/
		      }).then(res => {
		        if (res.data.status == true && res.data.code == 100000) {
		        	this.showTip = true;
		          //成功
		          this.orderNo = res.data.data.orderNo;//订单号
		          this.signFlag = res.data.data.signFlag;//是否签约标识
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
		},
	}
</script>
<style type="text/css" scoped>
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
	.showTip{
		font-size: .28rem;
		color: #999999;
		width: 100%;
		text-align: center;
	}
</style>