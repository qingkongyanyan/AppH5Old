<!-- 意见反馈 -->
<template>
  <div class="feed-back">
    <ul class="feed-back-ul">
      <li class="feed-back-title">
        <span class="feed-back-title-icon"></span>
        <span class="font-size28 font-color-A18A6F">反馈功能</span>
        <span class="font-color-999999">(请选择您要反馈的功能)</span>
      </li>
    </ul>
    <div class="feed-back-ul feed-back-btns">
      <!--   <div v-for="item in types" class="feed-back-btns-item">
        <button :class="[isActive?'btnActive':'btnNormal']" @click="clickBtnItem(item)">
          {{item.title}}
        </button>
      </div> -->
      <div class="btns">
        <div class="btn-item" v-for="(item,title) in types" :key="title" :class="title===index-1?'btnActive':'btnNormal'" @click="clickBtn(item,title,index)">
          {{item.title}}
        </div>
      </div>
    </div>
    <ul class="feed-back-ul">
      <li class="feed-back-title">
        <span class="feed-back-title-icon"></span>
        <span class="font-size28 font-color-A18A6F">问题描述</span>
        <!-- <span class="font-color-999999">(请输入您自己的问题)</span> -->
      </li>
    </ul>
    <ul class="feed-back-textarea">
      <textarea name="" placeholder="请输入您自己的问题" v-model="description" maxlength="100"></textarea>
    </ul>
    <ul class="feed-back-ul">
      <li class="feed-back-title">
        <span class="feed-back-title-icon"></span>
        <span class="font-size28 font-color-A18A6F">上传图片</span>
        <span class="font-color-999999">(可以上传两张相关问题图片)</span>
        <span class="feed-back-del font-color-2DA8E1" v-show="imgUrl1 || imgUrl2" @click="showDel">{{delStr}}</span><!-- 删除 -->
        <!--  <span class="feed-back-del font-color-2DA8E1" v-show="(imgUrl1 || imgUrl2) && showDel" @click="showDel=!showDel">取消</span> -->
      </li>
    </ul>
    <!-- 添加图片 -->
    <ul class="add-img-normal" v-show="!addImg" @click="addImg=true">
      <span class="add-img-title font-color-2DA8E1 font-size34">添加图片</span>
    </ul>
    <div class="add-img-normal" v-show="addImg">
      <form class="add-img-form" id="uploadForm1">
        <input style="display:none" type="file" name="file" accept="image/*" id="fileUpload1" @change="fileUpload($event,'first')">
        <label class="add-img-item" for="fileUpload1" v-show="!imgUrl1">
        </label>
        <span class="del-icon" v-show="imgUrl1 && delStr=='取消'" @click="delImg('first')"></span>
        <img class="img-item" :src="imgUrl1" alt="" v-show="imgUrl1" @click="showBigFn(imgUrl1)">
        <div class="feed-back-img-shade" v-show="imgUrl1" @click="showBigFn(imgUrl1)">
          查看大图
        </div>
      </form>
      <form class="add-img-form" id="uploadForm2">
        <input style="display:none" type="file" name="file" accept="image/*" id="fileUpload2" @change="fileUpload($event,'second')">
        <label class="add-img-item" for="fileUpload2" v-show="!imgUrl2">
        </label>
        <span class="del-icon" v-show="imgUrl2 && showDel" @click="delImg('second')"></span>
        <img class="img-item" :src="imgUrl2" alt="" v-show="imgUrl2" @click="showBigFn(imgUrl2)">
        <div class="feed-back-img-shade" v-show="imgUrl2" @click="showBigFn(imgUrl2)">
          查看大图
        </div>
      </form>
    </div>
    <ul class="feed-back-submit" v-show="submitActive">
      <li @click="saveSuggestion" class="font-size34">提交</li>
    </ul>
    <ul class="feed-back-submit feed-back-submit-disable" v-show="!submitActive">
      <li class="font-size34">提交</li>
    </ul>
    <div class="big-img-div" v-show="showBig" @click="showBig = false;">
      <img :src="bigUrl" alt="">
    </div>
    <!-- 弹框 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <!-- <p> -->
      <span>{{alertText}}</span>
      <!-- </p> -->
    </div>
  </div>
</template>
<script>
import appConstant from '../../util/constant'

export default {
  name: 'feedBack',
  data() {
    return {
      msg: 'feedBack',
      types: [{
          title: '投诉',
          value: '1'
        },
        {
          title: '建议',
          value: '2'
        },
        {
          title: '其他',
          value: '3'
        }
      ],
      index: '',
      isActive: false,
      addImg: false, // 添加图片
      picValue: '',
      imgUrl1: '',
      imgUrl2: '',
      showBig: false,
      bigUrl: '',
      showDel: false, // 显示图片删除按钮
      tipShow: '', // 弹窗
      alertText: '', // 提示语
      userId: '', // 用户id
      userName: '', // 用户姓名
      userMobile: '', // 用户手机号
      functionType: '', // 功能类型
      description: '', // 意见反馈内容
      imageAddr: [], // 图片URL
      tempUrl1: '',
      tempUrl2: '',
      // submitActive: false, // 提交按钮
      delStr: '删除',
    }
  },
  computed: {
    submitActive: function() {
      if (!this.functionType || !this.description) {
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.userId = localStorage.getItem('custId');
    var custName = localStorage.getItem('custName')
    custName!='undefined'?this.custName=custName:'';
    // localStorage.getItem('custName')?this.userName=localStorage.getItem('custName'):'';
    this.userMobile = localStorage.getItem('mobile');
  },
  methods: {

    // 期限选择
    clickBtn: function(item, title, index) {

      switch (item.value) {
        case '1':
          this.index = '1';
          this.functionType = '1';
          break;
        case '2':
          this.index = '2';
          this.functionType = '2';
          break;
        case '3':
          this.index = '3';
          this.functionType = '3';
          break;
      }
      console.log('this.month', this.month);

    },
    showDel:function(){
      if(this.delStr == '删除'){
        this.delStr = '取消';
        this.showDel = false;
      };
      if(this.delStr == '取消'){
        this.delStr = '删除';
      };
    },
    fileUpload: function(e, type) {
      let files = e.target.files;
      if (!files.length) return;
      this.picValue = files[0];
      console.log(files[0])
      if (type == 'first')
        var da = new FormData(document.getElementById('uploadForm1'))
      else if (type == 'second'){
        if(this.delStr == '取消'){
          return;
        }else{
          var da = new FormData(document.getElementById('uploadForm2'))
        }
      };

      // da.append(this.picValue)
      this.upload(da, type);
    },
    // 上传图片
    upload: function(param, type) {
      console.log(param)
      this.post('/common/upload', param).then(res => {
        console.log(res)
        if (res.data.code) {
          if (type == "first") {
            this.imgUrl1 = appConstant.baseImgUrl + res.data.data.imgUrl;
            this.tempUrl1 = res.data.data.imgUrl;
            console.log('first')
            console.log(this.imgUrl1)
          } else if (type == 'second') {
            this.imgUrl2 = appConstant.baseImgUrl + res.data.data.imgUrl;
            this.tempUrl2 = res.data.data.imgUrl;
            console.log('second')
            console.log(this.imgUrl2)
          }

        }
      })
    },
    showBigFn: function(url) {
      console.log(url)
      this.showBig = true;
      console.log(this.showBig)
      this.bigUrl = url;

    },
    // 点击删除某张图片
    delImg: function(url) {
      if (url == 'first') {
        this.imgUrl1 = '';
      } else if (url == 'second') {
        this.imgUrl2 = '';
      }
    },
    // 保存已经反馈
    saveSuggestion: function() {
      this.post('/suggestion/save', {
        userId: this.userId, // 用户id
        userName: this.userName, // 用户 姓名
        userMobile: this.userMobile, // 用户手机号
        functionType: this.functionType, // 功能类型
        description: this.description, // 意见反馈内容
        imageAddr: this.tempUrl1 + ',' + this.tempUrl2
      }).then(res => {
        console.log(res);
        if (res.data.code == "100000") {
          var sel = this;
          this.tipShow = true;
          this.alertText = '谢谢您给出的宝贵建议!';
          setTimeout(function() {
            sel.tipShow = false;
            sel.$router.replace('/mine');
          }, 3000);
        } else {
          var sel = this;
          //失败
          this.tipShow = true;
          this.alertText = res.data.msg;
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    }
  }
}

</script>
<style scoped>
.feed-back {
  width: 100%;
  height: 100%!important;
  background: #fbfbfb;
  position: relative;
}

.feed-back-ul {
  float: left;
  /*padding: 0 0.3rem;*/
  width: 100%;
  /*height: 100%;*/
  background: #fbfbfb;
}

.feed-back-title {
  /*width: 100%;*/
  height: 0.88rem;
  line-height: 0.88rem;
  border: 1px solid #f6f6f6;
  background: #fff;
  text-align: left;
  padding-left: 0.3rem;
  background: #fbfbfb;
  border: 1px solid #eeeeee;
}

.feed-back-title-icon {
  /*float: left;*/
  background: url(../../../static/images/loan_title_nor@2x.png ) no-repeat left;
  width: 0.25rem;
  height: 0.28rem;
  background-size: 100%;
  display: inline-block;
  vertical-align: middle;
  line-height: 0.88rem;
  margin-right: 0.05rem;
}

.feed-back-btns {
  background: #fff;
  padding: 0.3rem;
}

.btnNormal {
  width: 1.74rem;
  height: 0.46rem;
  border: 1px solid rgba(69, 115, 227, 0.50);
  background: #ffffff;
  /*width: 33%;*/
  float: left;
  margin: 0 0.25rem;
  line-height: 0.46rem;
  box-sizing: border-box;
  font-size: .28rem;
}

.btnActive {
  width: 1.74rem;
  height: 0.46rem;
  background: rgba(69, 115, 227, 0.50);
  /*border: 2px solid rgba(69, 115, 227, 0.50);*/
  float: left;
  margin: 0 0.25rem;
  line-height: 0.46rem;
  box-sizing: border-box;
}

.feed-back-btns-item {
  width: 33%;
  float: left;
}

















/*问题描述*/

.feed-back-textarea {
  background: #fff;
  margin: 0.3rem;
  float: left;
  width: calc( 100% - 0.6rem);
}

.feed-back-textarea textarea {
  width: calc( 100% - 0.6rem);
  height: 2.44rem;
  border: 1px solid #b3b3b3;
  border-radius: 0.1rem;
  padding: 0.3rem;
  font-size: .28rem;
}
















/* 添加图片 normal */

.add-img-normal {
  float: left;
  width: 100%;
  height: 3.34rem;
  background: #fff;
  /*margin: 0.3rem;*/
}


.add-img-form {
  width: 50%;
  height: 100%;
  float: left;
  position: relative;
}













/* 添加图片 文字 */

.add-img-title {
  background: url(../../../static/images/loan_add2_nor@2x.png ) no-repeat left center;
  background-size: 0.44rem;
  display: inline-block;
  vertical-align: middle;
  height: 3.34rem;
  line-height: 3.34rem;
  width: 2rem;
  text-align: right;
}
















/* 提交按钮 */

.feed-back-submit {
  border-top: 1px solid;
  border-bottom: 1px solid;
  width: 100%;
  height: 1rem;
  position: absolute;
  bottom: 0px;
  left: 0px;
  line-height: 1rem;
  /*background: #2DA8E1;*/
  background-image: linear-gradient(-216deg, #59d3f2 7%, #2da8e1 100%);
  color: #fff;
}

.feed-back-submit-disable {
  opacity: 0.7;
}
















/* 添加图片 item */

.add-img-item {
  width: 100%;
  height: 100%;
  float: left;
  background: url(../../../static/images/feedback_hasNotPic@2x.png ) no-repeat center;
  background-size: 2.53rem 2.92rem;
  border-radius: 0.08rem;
}

.img-item {
  margin: 0.3rem;
  overflow: hidden;
  width: 80%;
  height: 80%;
}











/* 显示大图 */

.big-img-div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  padding: 0.3rem;
  /*padding-top: 30%;*/
  overflow: auto;
}

.big-img-div img {
  /*width: 100%;
  height: auto;
  vertical-align: middle;*/
  max-width: 100%;
  margin: 10px 0;
}











/*删除按钮*/

.del-icon {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  width: 0.3rem;
  height: 0.3rem;
  top: 0.2rem;
  right: 0.2rem;
  background-image: url(../../../static/images/feedback_deletePic@2x.png );
  background-size: 0.3rem;
}










/*上传图片 - 点击删除*/

.feed-back-del {
  display: inline-block;
  float: right;
  text-align: right;
  padding-right: 0.3rem;
  font-size: .28rem;
}










/*上传图片 - 图片遮罩层*/

.feed-back-img-shade {
  position: absolute;
  background: rgba(51, 51, 51, 0.50);
  height: 0.5rem;
  width: 79%;
  right: 0.4rem;
  bottom: 0.4rem;
  color: #fff;
}

</style>
