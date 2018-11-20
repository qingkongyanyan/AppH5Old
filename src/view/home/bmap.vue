<template>
  <div>
    <!--地图容器-->
    <!-- <div id="allmap" class="allmap">定位获取{{location}}</div> -->
    <div class="location" v-show="showLocation">{{city}}</div>
    <div class="location" v-show="!showLocation">定位获取</div>
  </div>
</template>
<script>
import BMap from 'BMap'
export default {
  name: '',
  data() {
    return {
      city: '',
      province: '',
      district: '',
      street: '',
      streetNumber: '',
      showLocation: false,
      longitude: '', //经度
      latitude: '', //纬度
      custId: '', //客户id
      address: '', //
      cityCode: '', //城市编码
    }
  },
  mounted() {
    this.custId = localStorage.getItem('custId');
    console.log(this.custId);
    if (typeof BMap === "undefined") {
      let head = document.getElementsByTagName("head")[0];
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://api.map.baidu.com/getscript?v=2.0&ak=GkOmLjk7IHUorsnU3hnZIqfT0G3ecVkz";
      head.appendChild(script);
      script.onload = () => {
        this.test();
      };
    } else {
      this.test();
    }
  },
  methods: {
    test() {
      var geolocation = new BMap.Geolocation();
      console.log(geolocation);
      var sel = this;
      //alert("1111");
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          //var mk = new BMap.Marker(r.point);
          //用户拒绝地理位置授权
          if (r.accuracy == null) {
            //alert('accuracy null:'+r.accuracy);
            localStorage.setItem('location', false);
            return;
          } else {
            //alert('accuracy null:'+r.accuracy);
            sel.longitude = r.longitude;
            sel.latitude = r.latitude;
            sel.cityCode = r.address.city_code;
            sel.getAddress(r.point);
          };
        } else {
          alert('failed' + this.getStatus());
        }
      }, { enableHighAccuracy: true }); //enableHighAccuracy表示是否允许使用高精度  //timeout: 5000, maximumAge: 30 * 1000  最长有效期(30S)，在重复获取地理位置时，此参数指定多久再次获取位置 
    },
    //获取地址信息，设置地址label
    getAddress(point) {
      var sel = this;
      var gc = new BMap.Geocoder();
      gc.getLocation(point, function(rs) {
        console.log(rs);
        if (rs) {
          var addComp = rs.addressComponents;
          sel.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber; //获取地址
          sel.province = addComp.province;
          sel.city = addComp.city;
          sel.district = addComp.district;
          sel.street = addComp.street;
          sel.streetNumber = addComp.streetNumber;
          sel.showLocation = true;
          sel.post('/common/saveCustLocation', {
            custId: sel.custId, //Y 客户id  
            longitude: sel.longitude, //N 经度  
            latitude: sel.latitude, //N 纬度  
            address: sel.address, //N 地址名称  
            businessDistrict: '', //N 商圈名称  
            poiDesc: '', //N POI描述 
            countryCode: '', //N 国家编码  
            country: '中国', //N 国家  
            province: sel.province, //N 省份  
            cityCode: '', //N 城市编码  
            city: sel.city, //N 城市  
            district: sel.district, //N 区县  
            street: sel.street, //N 街道信息  
            streetNumber: sel.streetNumber, //N 街道号码  
            adCode: '', //N 行政区划代码  
            poiIndices: [{
              poiIndexResult: '', //N POI检索结果 此字段属于POI检索聚合对象
            }], //N POI检索 POI检索聚合对象

          }).then(res => {
            //地理位置保存成功
            if (res.data.status) {
              localStorage.setItem('location', true);
              return;
            }
          })

        } else {
          alert("失败$$$$$$$$$$$$");
        }

      });
    },
  },
}

</script>
<style scoped>
.allmap {
  height: .6rem;
  background: red;
}

.location {
  text-align: left;
  color: #fff;
  font-size: .28rem;
  position: absolute;
  left: .8rem;
  top: .2rem;
  float: left;
}

</style>
