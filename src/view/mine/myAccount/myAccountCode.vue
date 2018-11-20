<!-- 填写验证码 -->
<template>
	<div class="myAccountCode">
		<div>
			<div class="myAccountCode-pt">
				<p>我们已发送了验证码到您的手机：</p>
				<p>{{mobile}}</p>
			</div>
	      	<div class="myAccountCode-div" :class="{activec:cc && code && code.length > 0}">
	      		<label>短信验证码</label>
		        <input 
		          type="text" 
		          placeholder="请输入验证码"
		          v-model="code" 
		          @focus="cc = true"        
		          @blur="regNumber"
		          maxlength="6"
		        >           
		        <span class="close" v-show='cc && code && code.length > 0' @click="code=''"></span>
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
			<p class="myAccountCode-pb" @click="goNext" v-show="code != ''">下一步</p>
			<p class="myAccountCode-pbs" v-show="code == ''">下一步</p>
		</div>
		<!-- 弹窗 -->
	    <div class="tip" v-show="showCover" @click="showCover=false">
	      <span>{{tip}}</span>
	    </div>
	</div>
</template>
<script>
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
			    mobile:this.$route.query.mobile,
			    certCode:'',//证件号码
			    bankCardNo:'',//银行卡号
			    custId:'',//客户ID
			}
		},
		mounted() {
			console.log(this.mobile);
			this.custId = JSON.parse(localStorage.getItem('loginInformation')).sysCust.custId;
		    this.show = true;
		    this.reShow = false;
		    this.daoShow = false;
		    this.getCode();
		},
		methods:{
			goNext(){
				this.post('/account/custMobileUpdate',{
					uid:this.custId,//客户id	
					mobile:this.mobile,//手机号	
					msgCheckCode:this.code,//短信验证码
				}).then(res =>{
					if(res.data.code == '100000'){
						//this.$router.push({path:"myAccountChange",query:{mobile:this.mobile}});
						this.tip = '恭喜您，手机号变更成功，请重新登录！';
						var sel = this;
			            this.showCover = true;
			            setTimeout(function() { sel.showCover = false; sel.$router.push('/');}, 3000);
			            return;
					}else{
						this.tip = res.data.msg;
						if(res.data.msg == '短信验证码校验失败'){
							this.tip = '短信验证码错误，请重新输入';
						};
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
		        msgCheckType: '4', //短信验证码类型  忘记密码验证码:2
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
			regNumber(e){
				this.cc = false;
				//console.log(e.target.value);
				if(isNaN(e.target.value)){
					this.code = '';
;					console.log('输入正确的验证码');
				}else{
					e.target.value = e.target.value;
					console.log('正确');
				}
			},
		},
		/*watch:{
			code(newVal,oldVal){
				console.log('4444'+newVal);
				console.log('5555'+oldVal);
				if(isNaN(newVal)){
					this.code = '';
					return;
				}else{
					this.code = this.code;
				}
			},
		},*/
		/*computed:{
	        code:{
	            get:function(){
	                return this.oldNum;
	            },
	            set:function(newValue){
	                this.oldNum=newValue.replace(/[^\d]/g,'');
	            }
	        },
	    },*/
	}
</script>
<style type="text/css" scoped>
	.myAccountCode{
		width: 100%;
		height: 100%;
		background: #fff;
	}
	.myAccountCode-pt{
		width: 66%;
		text-align: center;
		margin: 0.76rem 0 .55rem 17%;
	}
	.myAccountCode-pt p{
		font-size: .28rem;
		color: #999;
	}
	.myAccountCode-pb{
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
	.myAccountCode-pbs{
		width: 92%;
		height: .8rem;
		background: url(/static/images/OCR_submit_disable@2x.png) no-repeat;
		font-size:.34rem;
		color:#ffffff;
		text-align:center;
		line-height: .8rem;
		margin-top: .5rem;
		margin-left: 4%;
		/* border-radius: .1rem; */
		background-size: contain;
	}
	.myAccountCode-div{
		width: 90%;
		height: .63rem;
		margin: .32rem 0 .5rem 5%;
		position: relative;
		border-bottom: 1px solid #c2c2c2;
	}
	.myAccountCode-div label{
		font-size: .28rem;
		color: #333;
		width: 1.8rem;
		display: inline-block;
		height: .4rem;
		line-height: .4rem;
		float: left;
		text-align: left;
	}
	.myAccountCode-div input{
		font-size: .28rem;
		color: #333;
		width: calc(100% - 3.6rem );
		height: .4rem;
		line-height: .4rem;
		float: left;
	}
	.myAccountCode-div .close{
	    position: absolute;
	    right: 2.6rem;
	    top: 0.12rem;
	    display: inline-block;
	    width: 0.24rem;
	    height: 0.24rem;
	    background: url(/static/images/close.png) no-repeat;
	    background-size: 0.24rem 0.24rem;
	  }
	.myAccountCode-div .getCode{
		width: 1.8rem;
		height: .5rem;
		line-height: .5rem;
		background:#c8a986;
		border-radius:.10rem;
		font-size:.22rem;
		color:#ffffff;
		float: right;
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
</style>