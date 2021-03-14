<template>
  <div class="home" id="home" name="home">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="(item,index) in carousel" :key="index">
          <img style="height:460px;cursor: pointer" :src="item" @click="test(index)"/>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 轮播图END -->
    <div class="main-box">
      <div class="main">
        <!-- 衬衫展示区域 -->
        <div class="box">
          <div class="box-hd">
            <div class="title">衬衫</div>
          </div>
          <div class="box-bd">

            <div class="list">
              <MyList :list="shirtList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 衬衫展示区域END -->

        <!-- 外套展示区域 -->
        <div class="box">
          <div class="box-hd">
            <div class="title">外套</div>
            <div class="more" >
              <MyMenu :val="4" @fromChild="getChildMsg">
                <span slot="1">风衣</span>
                <span slot="2">棉衣</span>
                <span slot="3">羽绒服</span>
                <span slot="4">皮衣</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="list">
              <MyList :list="coatList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 外套商品展示区域END -->

        <!-- 裤子商品展示区域 -->
        <div class="box">
          <div class="box-hd">
            <div class="title">裤子</div>
            <div class="more" id="more">
              <MyMenu :val="2" @fromChild="getChildMsg2">
                <span slot="1">牛仔裤</span>
                <span slot="2">卫裤</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="list">
              <MyList :list="trousersList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
        <!-- 裤子展示区域END -->
      </div>
    </div>
  </div>
</template>
<script>
  import { listByCategory } from '@/api/goods'
export default {
  data() {
    return {
      carousel: [
        require('@/assets/imgs/carousel/1.jpg'),
        require('@/assets/imgs/carousel/2.jpg'),
        require('@/assets/imgs/carousel/3.jpg'),
        require('@/assets/imgs/carousel/4.jpg'),

      ], // 轮播图数据
      shirtList:[],//衬衫列表
      jeansList:[],//牛仔裤列表
      windbreakerList:[],//风衣列表
      cottonList:[],//棉衣列表
      downJacketsList:[],//羽绒服
      leatherList:[],//皮衣
      sweatpantsList:[],//卫裤
      coatList:[],//外套分类
      trousersList:[],//裤子分类
      coatActive: 1, // 外套当前选中的商品分类
      trousersActive: 1 // 裤子当前选中的商品分类
    };
  },
  watch: {
    // 当前选中的商品分类，响应不同的商品数据
    coatActive: function(val) {
      if (val === 1) {
        this.coatList = this.windbreakerList;
        return;
      }
      if (val === 2) {
        this.coatList = this.cottonList;
        return;
      }
      if (val === 3) {
        this.coatList = this.downJacketsList;
        return;
      }
      if (val === 4) {
        this.coatList = this.leatherList;
        return;
      }
    },
    trousersActive: function(val) {
      if (val === 1) {
        // 1为热门商品
        this.trousersList = this.jeansList;
        return;
      }
      if (val === 2) {
        // 2为保护套商品
        this.trousersList = this.sweatpantsList;
        return;
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      //获取数据
      listByCategory({current:1,size:10}).then(res =>{
        if(res.data.code === 200){
          console.log('获取全部数据',res)
          let dataList = res.data.data;
          this.shirtList = dataList[0].list;
          this.jeansList = dataList[1].list;
          this.trousersList = dataList[1].list;
          this.windbreakerList = dataList[2].list;
          this.coatList = dataList[2].list;
          this.cottonList = dataList[3].list;
          this.downJacketsList = dataList[4].list;
          this.leatherList = dataList[5].list;
          this.sweatpantsList = dataList[6].list;

        }
        console.log('this.shirtList',this.shirtList)
      })
    },

    getChildMsg(val) {
      this.coatActive = val;
    },
    getChildMsg2(val) {
      this.trousersActive = val;
    },
    test(index){
      console.log('99999',index)
    }
  }
};
</script>
<style>
  .main-box {
    background-color: #f5f5f5;
    padding-bottom: 20px;
  }

  .main {
    margin: 0 auto;
    max-width: 1225px;
  }

  /* 轮播图CSS */
  .block {
    margin: 0 auto;
    max-width: 1225px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  /* 轮播图CSS END */

  .box-hd {
    height: 58px;
    margin: 20px 0 0 0;
  }

  .box-hd .title {
    float: left;
    font-size: 22px;
    font-weight: 200;
    line-height: 58px;
    color: #333;
  }

  .box-hd .more {
    float: right;
  }

  .box-hd .more a {
    font-size: 16px;
    line-height: 58px;
    color: #424242;
  }

  .box-hd .more a:hover {
    color: #ff6700;
  }

  .box-bd {
    height: 650px;
  }

  .box-bd .promo-list {
    float: left;
    height: 650px;
    width: 234px;
  }

  .box-bd .promo-list li {
    z-index: 1;
    width: 234px;
    height: 300px;
    margin-bottom: 14.5px;
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
  }

  .box-bd .promo-list li:hover {
    z-index: 2;
    -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
    -webkit-transform: translate3d(0, -2px, 0);
    transform: translate3d(0, -2px, 0);
  }

  .box-bd .promo-list li img {
    width: 234px;
    height: 300px;
  }

  .box-bd .promo-list img {
    width: 234px;
  }

  .box-bd .list {
    float: left;
    height: 650px;
    width: 1300px;
  }
</style>
