<!-- 更换手机号 -->
<template>
	<div class='myAccount'>
		<div>
			<div class="myAccount-pt">
				<p>更换绑定的手机号</p>
				<p>之后可以用新手机号与当前密码登录</p>
			</div>
	      	<div class="myAccount-div" :class="{activec:cc && mobile && mobile.length > 0}">
	      		<label>新手机号</label>
		        <input 
		          type="text" 
		          placeholder="请输入新的手机号"
		          v-model="mobile" 
		          @focus="cc = true"        
		          @blur="cc = false"
		          maxlength="11" 
		        >           
		        <span class="close" v-show='cc && mobile && mobile.length > 0' @click="mobile=''"></span>
		      </div>
			<p class="myAccount-pb" @click="goNext" v-show="mobile != ''&& mobile.length=='11'">下一步</p>
			<p class="myAccount-pbs" v-show="mobile == ''|| mobile.length<'11'">下一步</p>
		</div>
		<!-- 弹窗 -->
	    <div class="tip" v-show="showCover" @click="showCover=false">
	      <span>{{tip}}</span>
	    </div>
	</div>
</template>
<script type="text/javascript">
	export default{
		data(){
			return{
				cc:false,
				mobile:'',
				showCover:false,
				tip:'',
			}
		},
		mounted(){

		},
		methods:{
			goNext(){
				if (!this.mobile) {
			        var sel = this;
			        this.tip = '手机号不能为空';
			        this.showCover = true;
			        setTimeout(function() { sel.showCover = false; }, 3000);
			        return;
			      } else if (this.mobile) {
			        if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4}\d{4}$/.test(this.mobile))) {
			          var sel = this;
			          this.tip = '手机号码格式错误，请重新录入';
			          this.showCover = true;
			          setTimeout(function() { sel.showCover = false; }, 3000);
			          return;
			        }else{
			        	this.$router.push({path:"/myAccountCode",query:{mobile:this.mobile}})
			        };
		      	};
			},
		},
	}
</script>
<style scoped>
	.myAccount{
		width: 100%;
		height: 100%;
		background: #fff;
	}
	.myAccount-pt{
		width: 66%;
		text-align: center;
		margin: 0.76rem 0 .55rem 17%;
	}
	.myAccount-pt p{
		font-size: .28rem;
		color: #999;
	}
	.myAccount-div{
		width: 90%;
		margin-left: 5%;
		margin-bottom: .5rem;
		height: .63rem;
		border-bottom: 1px solid #c2c2c2;
		position: relative;
	}
	.myAccount-div label{
		font-size: .28rem;
		color: #333;
		width: 1.4rem;
		display: inline-block;
		height: .4rem;
		line-height: .4rem;
		float: left;
	}
	.myAccount-div input{
		font-size: .28rem;
		color: #333;
		width: calc(100% - 1.4rem );
		height: .4rem;
		line-height: .4rem;
		float: right;
	}
	.myAccount-div .close{
	    position: absolute;
	    right: 0rem;
	    top: 0.08rem;
	    margin-left: -2rem;
	    display: inline-block;
	    width: 0.24rem;
	    height: 0.24rem;
	    background: url(/static/images/close.png) no-repeat;
	    background-size: 0.24rem 0.24rem;
	  }
	.myAccount-pb{
		width: 90%;
		height: .8rem;
		background-image:linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
		font-size:.34rem;
		color:#ffffff;
		text-align:center;
		line-height: .8rem;
		margin-left: 5%;
		border-radius: .1rem;
	}
	.myAccount-pbs{
		width: 90%;
		height: .8rem;
		background: url(/static/images/OCR_submit_disable@2x.png) no-repeat;
		font-size:.34rem;
		color:#ffffff;
		text-align:center;
		line-height: .8rem;
		margin-left: 5%;
		/* border-radius: .1rem; */
		background-size: contain;
	}
</style>