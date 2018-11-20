<template>
	<div>
		<form id="inputForm">
			<!-- <input capture="video" @change="handleImgUpload" :id="id" type="file" /> -->
			<input type="file" accept="image/*" capture="camera" :id="id" name="file" @change="handleImgUpload" />
			
		</form>
		<img :src="src">
		<div class="picture" :style="'backgroundImage:url('+src+')'"></div>
	</div>
</template>
<script type="text/javascript">
import constant from '../../util/constant.js'
	export default{
		data(){
			return{
				id:'inputId',
				src:'',
			}
		},
		methods:{
			handleImgUpload(){
				var eleFile = document.getElementById(this.id);

				// 压缩图片需要的一些元素和对象
				var reader = new FileReader(),
				    img = new Image();

				// 选择的文件对象
				var file = null;
				file = event.target.files[0];
				// 选择的文件是图片
				if(file.type.indexOf("image") == 0) {
				    reader.readAsDataURL(file);
				}
				// 文件base64化，以便获知图片原始尺寸
				reader.onload = function(e) {
				    img.src = e.target.result;
				    console.log(img.src);
				    this.src = img.src;
				};

				// 缩放图片需要的canvas
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				// base64地址图片加载完毕后
				var sel = this;
				img.onload = function() {
					console.log("****************");
					console.log(file.name);
				    // 图片原始尺寸
				    var originWidth = this.width;
				    var originHeight = this.height;
				    console.log(originWidth,"!!!!!!!!!!!!!!!!!!",originHeight);
				    // 最大尺寸限制
				    var maxWidth = 400,
				        maxHeight = 400;
				    // 目标尺寸
				    var targetWidth = originWidth,
				        targetHeight = originHeight;
				    // 图片尺寸超过400x400的限制
				    if(originWidth > maxWidth || originHeight > maxHeight) {
				        if(originWidth / originHeight > maxWidth / maxHeight) {
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
				        //在这里实现上传操作
				        console.log(blob);
				        console.log(blob.name);
				        console.log(blob.filename);
				        var form = new FormData();
                    	form.append('file', blob,file.name);
				        sel.post("/common/upload",
					        form
					    ).then(res => {
					    	var faceImgUrl = constant.baseImgUrl + res.data.data.imgUrl;
					    	if(res.data.code == '100000'){
					    		//var faceImgUrl = constant.baseImgUrl + res.data.data.imgUrl;
					            //this.faceImg = false;
					              sel.post('/account/h5_ocrVerify', {
					                imageUrl: res.data.data.imgUrl, //身份证图片地址	
					                side: 'front', //front表示正面，back表示背面	
					                autoRotate: '' //值为true时，自动旋转图片。默认false
					              }).then(res => {
					              	console.log('成功啦啦啦啦啦');
					              	console.log(res.data);
					              });
					    	}
					    	/*console.log('返回成功啦！');
					    	console.log(res.data);*/
					    })
				    }, file.type || 'image/png');
				    /*console.log(33333333333333,file.type);
				    //var dataURL = canvas.toDataURL('image/png');
				    var dataURL = canvas.toDataURL(file.type);
				    //console.log(dataURL);
			        var blob = sel.dataURLtoBlob(dataURL);
			        console.log(blob);
			        var form = new FormData();
                    	form.append('file', blob);
                    	form.append('filename', file.name);
                    sel.post("/common/upload",
				        form
				    ).then(res => {
				    	console.log('返回成功啦！');
				    	console.log(res.data);
				    });*/
				};

			},//handleImgUpload方法结束
			dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
	            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	            while(n--){
	              u8arr[n] = bstr.charCodeAt(n);
	            }
	          return new Blob([u8arr], {type:mime});
	        },//DataURL转Blob结束
		},//methods方法结束
	}
</script>
<style type="text/css">
	.picture{
		width: 300px;
		height: 300px;
	}
</style>