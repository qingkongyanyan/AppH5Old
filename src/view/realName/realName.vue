<!-- 实名-获取相机 -->
<template>
  <div class="realName" style="overflow:auto">
    <div class="contain" v-show="!videoShow">
      <!-- 身份证头像面 -->
      <form class="ocr-first" id="firstForm" v-show="faceImg">
        <input type="file" accept="image/*" capture="camera" id="faceUpload" name="file" @change="faceUpload($event,'firstForm')" />
        <label for="faceUpload" class="id-card">
          <span class="ocr-span">点击扫描身份证头像面</span>
        </label>
      </form>
      <!-- 身份证头像面-图片 -->
      <form class="ocr-first" id="firstFormImg" v-show="!faceImg">
        <input type="file" accept="image/*" capture="environment" id="faceUploadImg" name="file" @change="faceUpload($event,'firstFormImg')" />
        <label for="faceUploadImg" class="id-card-img">
          <span class="ocr-span">点击<i>重新扫描</i></span>
        </label>
        <img :src="faceImgUrl">
      </form>
      <!-- 身份证国徽面 -->
      <form class="ocr-second" id="secondForm" v-show="backImg">
        <input type="file" accept="image/*" capture="camera" id="badgeUpload" name="file" @change="faceUpload($event,'secondForm')" />
        <label for="badgeUpload" class="id-tcard">
          <span class="ocr-span">点击扫描身份证国徽面</span>
        </label>
      </form>
      <!-- 身份证国徽面-图片 -->
      <form class="ocr-second" id="secondFormImg" v-show="!backImg">
        <input type="file" accept="image/*" capture="environment" id="badgeUploadImg" name="file" @change="faceUpload($event,'secondFormImg')" />
        <label for="badgeUploadImg" class="id-tcard-img">
          <span class="ocr-span">点击<i>重新扫描</i></span>
        </label>
        <img :src="backImgUrl">
      </form>
      <!-- 核对身份信息 -->
      <div class="ocr-infor" v-show="showId">
        <p>请核对身份信息，如有误请修改！</p>
        <p class="ocr-p">
          <input type="text" id="inputName" v-model="name" placeholder="请输入姓名" @click='inputName' @focus="aa = true" @blur="aa = false">
          <span class="close" v-show='aa && name && name.length > 0' @click="name=''"></span>
        </p>
        <p class="ocr-p">
          <input type="text" id="inputCode" v-model="code" placeholder="请输入身份证号" @click='inputCode' @focus="bb = true" @blur="bb = false">
          <span class="close" v-show='bb && code && code.length > 0' @click="code=''"></span>
        </p>
      </div>
      <div class="hideDiv" v-show="!showId"></div>
      <!-- 下一步按钮 -->
      <!-- isOcrVerify是否ocr通过 0:是 1:否 ;isPassVerify是否实名  0:是  1:否 -->
      <div class="ocr-butt" v-show="isOcrVerify=='1' && isPassVerify=='1'">
        <p class="signBtnDis" v-if="name=='' || code=='' || faceImgUrl=='' || backImgUrl==''">下一步</p>
        <p class="signBtn" v-if="name!='' && code!='' && faceImgUrl!='' && backImgUrl!=''" @click="signUp()">下一步</p>
      </div>
      <!-- 假如 只是补录ocr , 直接完成回去 -->
      <div class="ocr-butt" v-show="isOcrVerify=='1' && isPassVerify=='0'">
        <p class="signBtnDis" v-show="name=='' || code=='' || faceImgUrl=='' || backImgUrl==''">提交</p>
        <p class="signBtn" v-show="name!='' && code!='' && faceImgUrl!='' && backImgUrl!=''" @click="submitOcr()">提交</p>
      </div>
    </div>
    <!-- 弹框-提示 -->
    <div class="tip" v-show="tipShow" @click="tipShow=false">
      <span>{{alentText}}</span>
    </div>
    <!-- 弹框-相机权限 -->
    <div class="tipCamShow" v-show="tipCamShow" @click="tipCamShow=false">
      <div>
        <span>您需要打开相机权限，才可以继续认证！</span>
        <p>去设置</p>
      </div>
    </div>
    <!-- 弹框-摄像头权限 -->
    <div class="tipVidShow" v-show="tipVidShow" @click="tipVidShow=false">
      <div>
        <span>肖像认证需要获取您的摄像头权限，请保证光线充足，勿背光！请将视频录制时长控制在3到5秒!
        </span>
        <form class="ocr-first" id="videoForm">
          <input type="file" accept="video/*" capture="user" id="videoUpload" name="file" @change="videoUpload" />
          <label for='videoUpload'>我知道了</label>
        </form>
      </div>
    </div>
    <!-- 上传视频太大时提示重新上传 -->
    <div class="failResult" v-show="videoShow">
      <div class="failResult-top">
        <img src="/static/images/ocr@2x.png">
      </div>
      <div class="failResult-bottom">
        <p>抱歉，录入文件大小超过5M，请将视频录制时长控制在3到5秒!</p>
        <!-- <p @click="resetREC"> -->
        <form class="ocr-first" id="videoForm">
          <input type="file" accept="video/*" capture="user" id="videoUpload" placeholder="重录" name="file" @change="videoUpload" />
          <label for='videoUpload'>重录</label>
        </form>
        <!-- </p> -->
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import constant from '../../util/constant.js'
import { EXIF } from './exif.js'
import { Indicator } from 'mint-ui';
export default {
  data() {
    return {
      name: "",
      code: '',
      aa: false,
      bb: false,
      tipShow: false,
      alentText: '',
      files: '',
      picValue: '',
      backImgUrl: '',
      faceImgUrl: '',
      backImg: true,
      faceImg: true,
      faceObj: {}, //正面返回的数据
      backObj: {}, //反面返回的数据
      showId: false, //核对身份信息
      tipCamShow: false, //相机
      tipVidShow: false, //摄像头
      viedoUrl: '',
      //faceObj:this.$route.params.faceObj,
      //backObj:this.$route.params.backObj,
      idFrontSource: '', //Y身份证正面来源
      idBackSource: '', //Y身份证反面来源
      status: '', //最终返回状态
      isOcrVerify: '', // 是否ocr通过 0:是 1:否 
      isPassVerify: '', // 是否实名  0:是  1:否
      showSubmit: false, // 提交按钮
      custId: '',
      videoShow: false, //上传视频太大时提示重新上传
      //jichuOrYewu:"",
      changeCode:"",//改变后的身份证号
    }
  },
  mounted() {
    this.custId = localStorage.getItem('custId');
    /*this.jichuOrYewu = localStorage.getItem('jichuOrYewu');
    if(this.jichuOrYewu == 'yewuyemian'){
      alert(this.jichuOrYewu);
          this.$router.push('businessList');
        };
        if(this.jichuOrYewu == 'jichurenzheng'){
          this.$router.push('basicAuthentication');
        };
        return*/
    this.getCertiInfo();
    this.custName = localStorage.getItem('custName');
    this.certCode = localStorage.getItem('certCode');
    console.log(this.custName)
    console.log(this.certCode)
  },
  methods: {
    // 补录ocr信息,这里 需要 拿到接口返参跟原有登录人 信息对比
    submitOcr: function() {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(this.code) === false) {
        var sel = this;
        this.alentText = '身份证格式不正确';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }else{
        if(this.code.substr(this.code.length-1,1) == 'x'){
          this.changeCode = this.code.replace(this.code.substr(this.code.length-1,1),"X");
        }else{
          this.changeCode = this.code;
        };
      };
      if (this.custName != this.name || this.certCode != this.changeCode) {
        var sel = this;
        this.alentText = '身份证信息与实名认证信息不一致,请重试!';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      };
      if (this.faceObj.idFrontSource == 'normal') {
          this.idFrontSource = '0';
        } else if (this.faceObj.idFrontSource == 'photocopy') {
          this.idFrontSource = '1';
        } else if (this.faceObj.idFrontSource == 'ps') {
          this.idFrontSource = '2';
        } else if (this.faceObj.idFrontSource == 'reversion') {
          this.idFrontSource = '3';
        } else if (this.faceObj.idFrontSource == 'other') {
          this.idFrontSource = '4';
        } else if (this.faceObj.idFrontSource == 'unknown') {
          this.idFrontSource = '5';
        };
        if (this.backObj.idBackSource == 'normal') {
          this.idBackSource = '0';
        } else if (this.backObj.idBackSource == 'photocopy') {
          this.idBackSource = '1';
        } else if (this.backObj.idBackSource == 'ps') {
          this.idBackSource = '2';
        } else if (this.backObj.idBackSource == 'reversion') {
          this.idBackSource = '3';
        } else if (this.backObj.idBackSource == 'other') {
          this.idBackSource = '4';
        } else if (this.backObj.idBackSource == 'unknown') {
          this.idBackSource = '5';
        };
      this.post('/common/updateOcrVerifyInfo', {
        custId:this.custId,//客户Id
        custName: this.name, //Y姓名  
        certCode: this.changeCode, //Y身份证号码 
        //returnImage: '', //N是否返回base64视频图片。默认值为false,不返回；值为true时，返回 
        ocrGender: this.faceObj.ocrGender, //Y性别  
        ocrNation: this.faceObj.ocrNation, //Y民族  
        ocrBirthday: this.faceObj.ocrBirthday, //Y生日  
        ocrAddress: this.faceObj.ocrAddress, //Y住址  
        ocrAuthority: this.backObj.ocrAuthority, //Y签证机关  
        ocrTimeLimit: this.backObj.ocrTimeLimit, //Y有效期 
        idFrontUrl: this.faceObj.idFrontUrl, //Y身份证正面 
        idBackUrl: this.backObj.idBackUrl, //Y身份证反面 
        idFrontSource: this.idFrontSource, //Y身份证正面来源 0:真实的身份证 1:复印件 2:后期处理的图像 3:其他屏幕翻拍 04:其他类型的非真实身份证 05:识别失败
        idBackSource: this.idBackSource, //Y身份证反面来源 0:真实的身份证 1:复印件 2:后期处理的图像 3:其他屏幕翻拍 4:其他类型的非真实身份证 5:识别失败
        //id: this.custId


      }).then(res => {
        if (res.data.code == '100000') {
          var sel = this;
          //失败
          sel.tipShow = true;
          sel.alentText = '实名信息已完善';
          setTimeout(function() {
            localStorage.setItem('custName', sel.name);
            localStorage.setItem('certCode', sel.code);
            sel.$router.back(-1);
            sel.tipShow = false;
          }, 3000);
          return;
        } else {
          var sel = this;
          //失败
          this.tipShow = true;
          this.alentText = '身份证信息与实名认证信息不一致，请重试！';
          setTimeout(function() { sel.tipShow = false; }, 3000);
          return;
        }
      })
    },
    // 获取认证信息
    getCertiInfo: function() {
      this.post('/account/getCertiInfo', { custId: this.custId })
        .then(res => {
          if (res.data.code == '100000') {
            this.isPassVerify = res.data.data.isPassVerify; //0是1否
            this.isOcrVerify = res.data.data.isOcrVerify; // 0:是 1:否
            console.log(this.isPassVerify, this.isOcrVerify)
          }
        })
    },
    initHomePage: function() {
      this.post('/account/initHomepage', { custId: this.custId })
        .then(res => {
          if (res.data.code === '100000') {
            // 客户 id
            localStorage.setItem('custId', res.data.data.custId);
            // 客户姓名
            localStorage.setItem('custName', res.data.data.custName);
            // 身份证号
            localStorage.setItem('certCode', res.data.data.certCode);
            // 手机号码
            localStorage.setItem('mobile', res.data.data.mobile);
            // 关于我们
            localStorage.setItem('aboutUsUrl', res.data.data.aboutUsUrl);
          }
        })
    },
    //安卓可以调相机。ios不能。下面是兼容ios js代码
    judgeIos(flag) {
      //解决上传图片时capture="camera"在安卓与IOS的兼容性问题（在IOS只能拍照，不能选相册）
      var ua = navigator.userAgent.toLowerCase(); //获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
      var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1); //判断是否是苹果手机，是则是true
      if (isIos) {
        //console.log(document.getElementById(flag));
        document.getElementById(flag).removeAttribute("capture");
      };
    },
    faceUpload(e, flag) {
      this.judgeIos(flag);
      console.log('*****');
      // 压缩图片需要的一些元素和对象
      var reader = new FileReader(),
        img = new Image();

      // 选择的文件对象
      var file = null;
      file = event.target.files[0];
      // 选择的文件是图片
      if (file.type.indexOf("image") == 0) {
        reader.readAsDataURL(file);
      };
      // 文件base64化，以便获知图片原始尺寸
      reader.onload = function(e) {
        img.src = e.target.result;
      };
      // 缩放图片需要的canvas
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      // base64地址图片加载完毕后
      var sel = this;
      img.onload = function() {
        console.log("****************");
        // 图片原始尺寸
        var originWidth = this.width;
        var originHeight = this.height;
        console.log(originWidth, "!!!!!!!!!!!!!!!!!!", originHeight);
        // 最大尺寸限制
        var maxWidth = 400,
          maxHeight = 400;
        // 目标尺寸
        var targetWidth = originWidth,
          targetHeight = originHeight;
        // 图片尺寸超过400x400的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        };
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        // canvas转为blob并上传
        canvas.toBlob(function(blob) {
          console.log(flag);
          //在这里实现上传操作
          var form = new FormData();
          form.append('file', blob, file.name);
          //开始加载提示框
          Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
          });
          sel.post("/common/upload",
            form
          ).then(res => {
            if (res.data.code == '100000') {
              switch (flag) {
                case 'firstForm':
                  sel.faceImgUrl = constant.baseImgUrl + res.data.data.imgUrl;
                  sel.post('/account/h5_ocrVerify', {
                    imageUrl: res.data.data.imgUrl, //身份证图片地址 
                    side: 'front', //front表示正面，back表示背面 
                    autoRotate: '' //值为true时，自动旋转图片。默认false
                  }).then(res => {
                    if (res.data.code == '100000') {
                      sel.faceObj = res.data.data;
                      sel.name = res.data.data.name;
                      sel.code = res.data.data.number;
                      sel.faceImg = false;
                      sel.showId = true;
                      //关闭加载提示框
                      Indicator.close();
                    } else {
                      sel.showId = false;
                      sel.tipShow = true;
                      sel.alentText = res.data.msg;
                      var selThis = sel;
                      //关闭加载提示框
                      Indicator.close();
                      setTimeout(function() { selThis.tipShow = false; }, 3000);
                      sel.faceImgUrl = '';
                      sel.faceImg = true;
                      return;
                    }
                  });
                  break;
                case 'firstFormImg':
                  sel.faceImgUrl = constant.baseImgUrl + res.data.data.imgUrl;
                  sel.post('/account/h5_ocrVerify', {
                    imageUrl: res.data.data.imgUrl, //身份证图片地址 
                    side: 'front', //front表示正面，back表示背面 
                    autoRotate: '' //值为true时，自动旋转图片。默认false
                  }).then(res => {
                    if (res.data.code == '100000') {
                      sel.faceObj = res.data.data;
                      //sel.params.first = sel.faceObj;
                      sel.name = res.data.data.name;
                      sel.code = res.data.data.number;
                      sel.faceImg = false;
                      sel.showId = true;
                      //关闭加载提示框
                      Indicator.close();
                    } else {
                      sel.showId = false;
                      sel.tipShow = true;
                      sel.alentText = res.data.msg;
                      var selThis = sel;
                      //关闭加载提示框
                      Indicator.close();
                      setTimeout(function() { selThis.tipShow = false; }, 3000);
                      sel.faceImgUrl = '';
                      sel.faceImg = true;
                      return;
                    }
                  });
                  break;
                case 'secondForm':
                  sel.backImgUrl = constant.baseImgUrl + res.data.data.imgUrl;
                  sel.post('/account/h5_ocrVerify', {
                    imageUrl: res.data.data.imgUrl, //身份证图片地址 
                    side: 'back', //back表示正面，back表示背面 
                    autoRotate: '' //值为true时，自动旋转图片。默认false
                  }).then(res => {
                    if (res.data.code == '100000') {
                      sel.backObj = res.data.data;
                      sel.backImg = false;
                      //关闭加载提示框
                      Indicator.close();
                      //sel.params.first = sel.faceObj;
                    } else {
                      sel.tipShow = true;
                      sel.alentText = res.data.msg;
                      var selThis = sel;
                      //关闭加载提示框
                      Indicator.close();
                      setTimeout(function() { selThis.tipShow = false; }, 3000);
                      sel.backImgUrl = '';
                      sel.backImg = true;
                      return;
                    }
                  });
                  break;
                case 'secondFormImg':
                  sel.backImgUrl = constant.baseImgUrl + res.data.data.imgUrl;
                  sel.post('/account/h5_ocrVerify', {
                    imageUrl: res.data.data.imgUrl, //身份证图片地址 
                    side: 'front', //front表示正面，back表示背面 
                    autoRotate: '' //值为true时，自动旋转图片。默认false
                  }).then(res => {
                    if (res.data.code == '100000') {
                      sel.backObj = res.data.data;
                      sel.backImg = false;
                      //关闭加载提示框
                      Indicator.close();
                      //sel.params.first = sel.faceObj;
                    } else {
                      sel.tipShow = true;
                      sel.alentText = res.data.msg;
                      var selThis = sel;
                      //关闭加载提示框
                      Indicator.close();
                      setTimeout(function() { selThis.tipShow = false; }, 3000);
                      sel.backImgUrl = '';
                      sel.backImg = true;
                      return;
                    }
                  });
                  break;
              };
            } else {
              sel.tipShow = true;
              sel.alentText = res.data.msg;
              var selThis = sel;
              setTimeout(function() { selThis.tipShow = false; }, 3000);
              //关闭加载提示框
              Indicator.close();
              return;
            }
          })
        });
      };
    },
    signUp() {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(this.code) === false) {
        var sel = this;
        this.alentText = '身份证格式不正确';
        this.tipShow = true;
        setTimeout(function() { sel.tipShow = false; }, 3000);
        return;
      }else{
        if(this.code.substr(this.code.length-1,1) == 'x'){
          this.changeCode = this.code.replace(this.code.substr(this.code.length-1,1),"X");
        }else{
          this.changeCode = this.code;
        };
      };
      this.tipVidShow = true;
    },
    //调用摄像头
    videoUpload(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      var viedeoDa = new FormData(document.getElementById('videoForm'));
      if (this.picValue.size == 5242880 || this.picValue.size > 5242880) {
        //this.$router.push('/failResult');
        this.videoShow = true;
      } else {
        //alert('视频了');
        //return;
        this.postVideo(viedeoDa);
      };
      console.log(this.picValue);
      console.log(viedeoDa);
    },
    postVideo(param) {
      //开始加载提示框
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      });
      //这里写接口
      this.post("/common/upload",
        param
      ).then(res => {
        if (res.data.code == '100000') {
          this.viedoUrl = res.data.data.imgUrl; //"group1/M00/00/20/oYYBAFtIOpiAF-QVAAx3zyWxnbg631.mp4"
          if (this.faceObj.idFrontSource == 'normal') {
            this.idFrontSource = '0';
          } else if (this.faceObj.idFrontSource == 'photocopy') {
            this.idFrontSource = '1';
          } else if (this.faceObj.idFrontSource == 'ps') {
            this.idFrontSource = '2';
          } else if (this.faceObj.idFrontSource == 'reversion') {
            this.idFrontSource = '3';
          } else if (this.faceObj.idFrontSource == 'other') {
            this.idFrontSource = '4';
          } else if (this.faceObj.idFrontSource == 'unknown') {
            this.idFrontSource = '5';
          };
          if (this.backObj.idBackSource == 'normal') {
            this.idBackSource = '0';
          } else if (this.backObj.idBackSource == 'photocopy') {
            this.idBackSource = '1';
          } else if (this.backObj.idBackSource == 'ps') {
            this.idBackSource = '2';
          } else if (this.backObj.idBackSource == 'reversion') {
            this.idBackSource = '3';
          } else if (this.backObj.idBackSource == 'other') {
            this.idBackSource = '4';
          } else if (this.backObj.idBackSource == 'unknown') {
            this.idBackSource = '5';
          };
          this.post('/account/verifyWithIdnum', {
            custId:this.custId,//客户Id
            videoUrl: this.viedoUrl, //Y视频地址  
            custName: this.name, //Y姓名  
            certCode: this.changeCode, //Y身份证号码 
            returnImage: '', //N是否返回base64视频图片。默认值为false,不返回；值为true时，返回 
            ocrGender: this.faceObj.ocrGender, //Y性别  
            ocrNation: this.faceObj.ocrNation, //Y民族  
            ocrBirthday: this.faceObj.ocrBirthday, //Y生日  
            ocrAddress: this.faceObj.ocrAddress, //Y住址  
            ocrAuthority: this.backObj.ocrAuthority, //Y签证机关  
            ocrTimeLimit: this.backObj.ocrTimeLimit, //Y有效期 
            idFrontUrl: this.faceObj.idFrontUrl, //Y身份证正面 
            idBackUrl: this.backObj.idBackUrl, //Y身份证反面 
            idFrontSource: this.idFrontSource, //Y身份证正面来源 0:真实的身份证 1:复印件 2:后期处理的图像 3:其他屏幕翻拍 04:其他类型的非真实身份证 05:识别失败
            idBackSource: this.idBackSource, //Y身份证反面来源 0:真实的身份证 1:复印件 2:后期处理的图像 3:其他屏幕翻拍 4:其他类型的非真实身份证 5:识别失败
            id: this.custId
          }).then(res => {
            console.log('成功啦！')
            //关闭加载提示框
            Indicator.close();
            if (res.data.code == '100000') {
              this.status = res.data.status;
              var publicObj = JSON.parse(localStorage.getItem('publicObj'))

              if (publicObj) { // 存在就赋值
                publicObj.realState = true;
              } else { // 否则 初始化
                var publicObj = {
                  'realState': true
                }
              }
              // 客户姓名
              localStorage.setItem('custName', this.faceObj.name);
              // 身份证号
              localStorage.setItem('certCode', this.faceObj.number);
            
              localStorage.setItem('publicObj', JSON.stringify(publicObj));
              this.$router.push({ name: 'getVideoResult', params: { status: this.status, imgUrl: this.faceImgUrl } })
            } else if (res.data.code != '100000') {
              this.status = res.data.status;
              this.$router.push({ name: 'getVideoResult', params: { status: this.status, imgUrl: '', msg: res.data.msg } })
            };
          });
          console.log("成功");
          // 实名认证成功

          // 先取值


        } else {
          /*this.tipShow = true;
                this.alentText = res.data.msg; 
                var sel=this;
                  setTimeout(function () {sel.tipShow=false;}, 3000);
                  return; */
        }
      })
    },
    resetREC() {
      this.videoUpload();
    },
    //防止键盘把当前输入框给挡住
    inputName(){
      /*setTimeout(function(){
        document.getElementById("inputName").scrollintoview();
        alert('scrollIntoViewIfNeeded');// 参数可以是true， false, 空参数
      }, 300)*/
    },
    inputCode(){
      /*setTimeout(function(){
        document.getElementById("inputName").scrollintoview(); // 参数可以是true， false, 空参数
        alert('scrollIntoViewIfNeeded22');
      }, 300);*/
    },

  },
}

</script>
<style scoped>
.realName {
  width: 100%;
  height: 100%;
  overflow: auto !important;
  /*height: 30rem;
   min-height: 30rem; */
}

.contain {
  /*height: 18rem;*/
  height: auto; 
  min-height: 100%;
}

#firstFormImg,
#firstForm,
#secondForm,
#secondFormImg {
  position: relative;
  width: 5.35rem;
  height: 3.66rem;
  margin: auto;
  margin-top: .4rem;
}

form input {
  display: none;
}

.ocr-first .id-card {
  display: block;
  width: 100%;
  height: 100%;
  margin: auto;
  background: url(/static/images/OCR_idCardFront_empty@2x.png) no-repeat;
  background-size: 100% 100%;
}

.ocr-first .id-card-img {
  display: block;
  width: 5.35rem;
  height: 3.66rem;
  margin: auto;
  background: url(/static/images/OCR_mask_idCard@2x.png) no-repeat;
  background-size: 100% 100%;
  z-index: 10000;
  position: absolute;
  left: 0;
  top: 0;
  /* margin-top: .4rem;
    position: relative; */
}

#firstFormImg img,
#secondFormImg img {
  position: absolute;
  left: .3rem;
  top: .3rem;
  display: block;
  width: 4.75rem;
  height: 3.06rem;
}

#firstFormImg i,
#secondFormImg i {
  font-style: normal;
  color: #2da8e1;
  font-size: .26rem;
}

.ocr-second .id-tcard {
  display: block;
  width: 5.35rem;
  height: 3.66rem;
  margin: auto;
  background: url(/static/images/OCR_idCardBack_empty@2x.png) no-repeat;
  background-size: 100% 100%;
}

.ocr-second .id-tcard-img {
  display: block;
  width: 5.35rem;
  height: 3.66rem;
  margin: auto;
  background: url(/static/images/OCR_mask_idCard@2x.png) no-repeat;
  background-size: 100% 100%;
  z-index: 10000;
  position: absolute;
  left: 0;
  top: 0;
  /* margin-top: .4rem;
    position: relative; */
}

.ocr-span {
  display: block;
  width: 2.96rem;
  height: .37rem;
  position: absolute;
  font-size: .26rem;
  color: #333333;
  top: -.09rem;
  left: 50%;
  margin-left: -1.48rem;
}

.ocr-infor {
  width: 5.35rem;
  margin: 0 auto;
  margin-top: .58rem;
}

.ocr-infor p {
  font-size: .26rem;
  color: #999999;
  text-align: left;
}

.ocr-infor .ocr-p {
  height: .75rem;
  width: 100%;
  color: #333333;
  position: relative;
  margin-top: .09rem;
}

.ocr-infor .ocr-p input {
  font-size: .28rem;
  height: .75rem;
  width: 100%;
  color: #333333;
  padding-left: .27rem;
  outline: none;
  border: none;
  border-bottom: 1px solid #eeeeee;
}

.ocr-infor .ocr-p .close {
  position: absolute;
  right: 0rem;
  top: 0.35rem;
  margin-left: -2rem;
  display: inline-block;
  width: 0.24rem;
  height: 0.24rem;
  background: url(/static/images/close.png) no-repeat;
  background-size: 0.24rem 0.24rem;
}






/* 按钮 */

.signBtn {
  font-size: 0.34rem;
  text-decoration: none;
  width: 92%;
  height: .8rem;
  line-height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: 10px;
  color: #fff;
  margin: 0 auto;
  margin-top: .3rem;
  margin-bottom: .6rem;
}
/* .ocr-butt{
  position: fixed;
  bottom: 0;
  width: 100%;
} */
.signBtnDis {
  font-size: 0.34rem;
  text-decoration: none;
  width: 92%;
  height: .8rem;
  line-height: .8rem;
  background: url(/static/images/OCR_submit_disable@2x.png) no-repeat;
  /* background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%); */
  background-size: 100% 100%;
  border-radius: 10px;
  color: #fff;
  margin: 0 auto;
  margin-top: .3rem;
  margin-bottom: .6rem;
}






/* 弹框 */

.tip {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 84%;
  z-index: 10000;
}

.tip span {
  color: #fff;
  font-size: .32rem;
  opacity: 0.8;
  background: #000000;
  border-radius: 20px;
  padding: .81rem .56rem;
  margin-top: 3.74rem;
  display: inline-block;
  z-index: 99999;
}






/* 核对信息占位 */

.hideDiv {
  width: 100%;
  height: 2.59rem;
  /* display: none; */
}






/* 相机权限弹框 */

.tipCamShow,
.tipVidShow {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, .7);
}

.tipVidShow {
  z-index: 100000;
}

.tipCamShow div,
.tipVidShow div {
  position: absolute;
  width: 92%;
  height: 5.27rem;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
  border-radius: .1rem;
}

.tipCamShow div span {
  display: inline-block;
  width: 96%;
  height: .48rem;
  line-height: .48rem;
  font-size: .34rem;
  color: #666666;
  margin: 2.19rem 0 1.39rem 2%;
}

.tipVidShow div label {
  display: inline-block;
}

.tipCamShow div p,
.tipVidShow div label {
  width: 92%;
  height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  border-radius: .1rem;
  font-size: .34rem;
  color: #ffffff;
  text-align: center;
  margin-left: 4%;
  line-height: .8rem;
}

.tipVidShow div span {
  display: inline-block;
  width: 96%;
  height: 2.08rem;
  line-height: 2;
  font-size: .34rem;
  color: #666666;
  margin: 1.09rem 0 .89rem 2%;
  text-align: left;
}

.failResult {
  width: 100%;
  height: 100%;
  background: #fff;
}

.failResult-top {
  width: 5.36rem;
  height: 3.17rem;
  margin: .77rem 0 0 1.07rem;
}

.failResult-top img {
  width: 100%;
  height: 100%;
}

.failResult-bottom p:nth-of-type(1) {
  font-size: .26rem;
  color: #2da8e1;
  margin: .62rem 0 .16rem;
  width: 5.36rem;
  line-height: 2;
  margin-left: 1.07rem;
}

.failResult-bottom #videoForm {
  width: 5.36rem;
  height: .8rem;
  background-image: linear-gradient(216deg, #59d3f2 7%, #2da8e1 100%);
  margin: .31rem 0 0 1.07rem;
  font-size: .34rem;
  color: #ffffff;
  line-height: .8rem;
  text-align: center;
  border-radius: 10px;
}

.failResult-bottom #videoForm label {
  font-size: .34rem;
  color: #fff;
}

</style>
