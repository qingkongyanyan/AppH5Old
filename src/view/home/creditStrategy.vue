<template>
	<div class="home-creditStrategy">
		<div class="icon-class">
            <img class="" src="/static/images/home_openauth@2x.png" alt="授权攻略">
        </div>
        <p class="title">授信需要授权以下权限</p>
        <p>
            <div class="sub">
                <ul class="sub-ul">
                    <li></li>
                    <!-- <li>通讯录</li> -->
                    <li>地理位置</li>
                    <li>实名认证</li>
                    <li>四要素</li>
                    <li>运营商</li>
                    <li>设备画像</li>
                    <li>征信报告</li>
                    <li></li>
                </ul>
            </div>
        </p>
        <p class="foot">以上认证信息，可前往【业务】进行认证</p>
	</div>
</template>
<script>
//import Tabbar from '../tabbar'
	export default{
		data(){
			return{
				msg:123,
				location:''
			}
		},
	}
</script>
<style scoped>
	ul{
        text-align: center;
    }
    ul>li {
        font-family: PingFangSC-Regular;
        font-size: .28rem;
        color: #333333;
        line-height: 30px;
        height: 30px;
        text-align: left;
    }

    .icon-class {
        text-align: center;
        margin-top: 20px;
    }
    .icon-class img{
        width: 100px;
        height: 100px;
    }

    .title {
        font-family: PingFangSC-Regular;
        font-size: .3rem;
        color: #333333;
    }

    .foot {
        font-family: PingFangSC-Regular;
        font-size: .26rem;
        color: #666666;
    }
    .sub{
        margin: 0 auto;
    }
    .sub-ul{
        margin: 0 auto;
        width: 85px;
    }
    p{
        text-align: center;
    }
</style>